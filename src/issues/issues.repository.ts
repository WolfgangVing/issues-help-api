import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";
import { IORedisKey } from "src/redis.module";
import { IssueCreateData } from "../shared/interfaces/IIssue";
import { Issue } from "./entities/issue.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Connection, Model } from "mongoose";
import { Status } from "src/shared/issue-types";
import { FilterIssues } from "src/shared/types/filterIssues";
import { UpdateIssueData, UpdateIssueDto } from "./dto/update-issue.dto";
import { GetSetRedis, IssueDoc } from "src/utils/GetSetRedis";


@Injectable()
export class IssuesRepository {
    //to use time-to-live from configuration
    private readonly singleIssueTTL: string;
    private readonly listOfIssueTTL: string;
    private readonly logger = new Logger(IssuesRepository.name);

    constructor(
        configService: ConfigService,
        @Inject(IORedisKey) private readonly redisClient: Redis,
        @InjectModel(Issue.name) private readonly issueModel: Model<Issue>,
    ) {
        this.singleIssueTTL = configService.get("SINGLE_ISSUE_DURATION")
        this.listOfIssueTTL = configService.get("ISSUES_DURATION")
    }

    async createIssue({
        topic,
        description,
        urgency,
        client
    }: IssueCreateData) {
        let redisKey: string;
        const initialIssue = {
            topic,
            client,
            description,
            urgency,
            operator: null,
            status: Status.pendente
        } as Issue;

        //Creates the models
        const issueModel = new this.issueModel(initialIssue);
        redisKey = `issues:${issueModel._id.toString()}`


        this.logger.log(`Adding new issue ${JSON.stringify(issueModel)} in MongoDB`)
        try {
            const result = await issueModel.save();
        } catch (e) {
            this.logger.error(`Failed to add issue ${JSON.stringify(issueModel)} to MongoDB\n${e}`)
            throw new InternalServerErrorException();
        }


        this.logger.log(
            `Creating new issue: ${JSON.stringify(issueModel, null, 2)} with singleIssueTTL ${this.singleIssueTTL} in Redis`
        )

        try {
            //Adding issue do Redis Database
            await this.redisClient.multi([
                ["send_command", "JSON.SET", redisKey, "$", JSON.stringify(issueModel)],
            ]).exec()
            this.redisClient.expire(redisKey, this.singleIssueTTL)
            return issueModel;
        } catch (e) {
            this.logger.error(
                `Failed to add issue ${JSON.stringify(initialIssue)} to redis\n${e}`
            )
            throw new InternalServerErrorException();
        }
    }

    async getIssueByID(issueID: string): Promise<Issue> {
        this.logger.log(`Attempting to get issue with id: ${issueID}`)

        const redisKey = `issues:${issueID}`;
        this.logger.verbose(redisKey)
        try {
            //Looking for the data at the Redis First
            
            const queriedCache = await GetSetRedis(this.redisClient, "GET", redisKey);

            if (queriedCache[0][1] === null) {
                this.logger.log(`Couldn't find issue: ${issueID} in cache, trying to look at mongodb`)
                const issueFromMongo = await this.issueModel.findById(issueID)

                this.logger.log(`Adding issue to cache: ${issueFromMongo}`)

                await GetSetRedis(this.redisClient, "SET", redisKey, JSON.stringify(issueFromMongo))
                this.redisClient.expire(redisKey, this.singleIssueTTL)

                return issueFromMongo.toJSON()
            }

            //Parse the string from redis client to JSON.
            const issueFromCache = JSON.parse(queriedCache[0][1] as string)
            return issueFromCache;

        } catch (e) {
            this.logger.error(`Failed to get issue ${issueID}`)
            throw e
        }
    }

    async getIssues(filter: FilterIssues): Promise<Issue[]> {
        
        if (
            Object.getOwnPropertyNames(filter).includes("status") &&
            filter.status === Status.pendente &&
            Object.entries(filter).length === 1
        ) {
            this.logger.log("Verying if list of issues with Status pendente aren't cached")
            const redisKey = "issues:pendente"
            const redisResult = await GetSetRedis(this.redisClient, "GET", "issues:pendente")

            if (redisResult[0][1] === null) {
                this.logger.log("There isn't list of pendente issues, prociding to query in mongodb")
                const mongoResult = await this.issueModel.find({ status: filter.status })
                const jsonResult = JSON.stringify(mongoResult);

                this.logger.log("Adding query result from MongoDB to Redis cache")
                
                await GetSetRedis(this.redisClient, "SET", redisKey, jsonResult)
                this.redisClient.expire(redisKey, this.listOfIssueTTL)

                return mongoResult;
            } else {
                return JSON.parse(redisResult[0][1] as string)
            }
        }

        const queryIssues = this.issueModel.find({})
        //Add queries to list of queris by chaining it
        Object.entries(filter).forEach(([key, value]) => {
            this.logger.log(`${key}: ${value}`)
            if (value !== null) {
                if (key === "topic") {
                    queryIssues.find({ [key]: new RegExp(value, "i") });
                    return;
                }
                queryIssues.find({ [key]: value })
            }
        })

        this.logger.log(`Querying the database for list of issues`)
        const result = await queryIssues;

        return result;
    }

    async updateIssue(fields: UpdateIssueData) {
        const redisKey = `issues:${fields._id}`

        this.logger.log(`Trying to updating issue: ${fields._id}`)
        try {
            this.logger.log(`Saving it Mongo`)
            await this.issueModel.updateOne(
                { _id: fields._id },
                fields,
                { new: true }
            );
            const doc = await this.issueModel.findById(fields._id);

            this.logger.log("Successfuly saved in mongo. Now starting to save changes to cache")
            await GetSetRedis(this.redisClient, "SET", redisKey, JSON.stringify(doc));

            await this.redisClient.expire(redisKey, this.singleIssueTTL)

            if (doc.status === Status.pendente) {
                let foundIssue: boolean = false;
                
                this.logger.log(`Modifying issue in list of pendentes`)
            
                const redisResult = await GetSetRedis(this.redisClient, "GET", "issues:pendente");
                let redisJSON: IssueDoc[] = JSON.parse(redisResult[0][1] as string);
                
                redisJSON = redisJSON.map((issue) => {
                    if (issue._id !== fields._id) {
                        return issue;
                    } else {
                        return doc as IssueDoc;
                    }
                });
                const result = await GetSetRedis(this.redisClient, "SET", "issues:pendente", JSON.stringify(redisJSON));
                this.logger.log(`Changes in cache: ${result[0][1]}`);
            }
            return doc;

        } catch (error) {
            
            this.logger.log(`An error was thrown during update of issue: ${JSON.stringify(fields)}\n${error}`);

            throw error;
        }
    }
}