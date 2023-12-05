import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Redis } from "ioredis";
import { IssuesRepository } from "src/issues/issues.repository";
import { IORedisKey } from "src/redis.module";
import { User } from "./entities/user.schema";
import { Model } from "mongoose";
import { Roles } from "src/shared/roles.enum";
import { GetSetRedis } from "src/utils/GetSetRedis";
import { IUser } from "src/shared/interfaces/IUser";


@Injectable()
export class UsersRepository {
    private readonly UserAuthTTL: string;
    private readonly logger = new Logger(IssuesRepository.name);

    constructor(
        configServer: ConfigService,
        @Inject(IORedisKey)
        private readonly redisClient: Redis,
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {
        this.UserAuthTTL = configServer.get("USER_AUTH_TTL")
    }

    async createUser(userData: User) {
        let redisKey: string;

        //Create User model
        const model = new this.userModel(userData);
        redisKey = `users:${model._id.toString()}`

        this.logger.log(`Adding an new user id:${model._id}`)
        try {
            await model.save();
        } catch (err) {
            this.logger.error(`Failed to add user ${JSON.stringify(model)} in mongoDB: ${err}`)
            throw new InternalServerErrorException();
        }

        this.logger.log(`Adding User credentials to cache with TTL:${this.UserAuthTTL}`)
        try {
            //Adding user to redis database
            await GetSetRedis(this.redisClient, "SET", redisKey, JSON.stringify(model))
            await this.redisClient.expire(redisKey, this.UserAuthTTL);
        } catch (err) {
            this.logger.log(`An error was thrown when adding user to redis database`)
        }

        return model;
    }

    async findById(id: string) {
        try {
            this.logger.log(`Querying user of id: ${id}`)
            const result = await this.userModel.findById(id)

            return result;

        } catch(err) {
            this.logger.log(`An error was ocurred in database, ${err}`)

            throw new InternalServerErrorException()
        }
    }

    async findAll() {
        try {
            const result = await this.userModel.find()

            return result
        } catch(err) {
            this.logger.log(`An error was ocurred in database, ${err}`)

            throw new InternalServerErrorException()
        }
    }

    async updateOne(id: string, fields: Partial<IUser>) {
        try {
            const model = await this.userModel.findByIdAndUpdate(id, fields, {
                new: true
            })

            return model
            
        } catch (err) {
            this.logger.error(`An error was thrown during update issue ${id}, erro: `, err)
        }

    }
}