import { Prop, Schema, SchemaFactory, } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Status, Urgency } from "src/shared/issue-types";
import { Role } from "src/shared/roles.enum";
import { User } from "src/users/entities/user.schema";

export class Client {
    _id: string;
    name: string;
    role: Role
}
@Schema({
    timestamps: true
})
export class Issue {
    @Prop({
        required: true
    })
    topic: string;

    @Prop({
        required: true
    })
    description: string;

    @Prop({
        type: String, enum: Status
    })
    status: Status;
    
    @Prop({
        required: false,
        type: mongoose.Schema.Types.ObjectId, ref: "Operator"
    })
    operator: User | mongoose.Schema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId, ref: "Client"
    })
    client: Client;

    @Prop({
        type: String, enum: Urgency
    })
    urgency: Urgency;
}

export const IssueSchema = SchemaFactory.createForClass(Issue)