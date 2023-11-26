import { PartialType } from "@nestjs/mapped-types";
import { Redis } from "ioredis";
import mongoose from "mongoose";
import { Issue } from "src/issues/entities/issue.schema";

export class IssueDoc extends PartialType(Issue) {
    _id: string | mongoose.Schema.Types.ObjectId
}


export async function GetSetRedis(
    redisClient: Redis,
    method: "GET" | "SET",
    key: string,
    doc?: IssueDoc | IssueDoc[] | string,
    path: string = "$"
): Promise<[error: Error, result: unknown][]> {
    if (method === "SET") {
        return await redisClient.multi([
            ["send_command", "JSON.SET", key, path, doc]
        ]).exec()
    } else {
        return await redisClient.multi([
            ["send_command", "JSON.GET", key]
        ]).exec()
    }
}