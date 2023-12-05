import { Client } from "src/issues/entities/issue.schema";
import { Status, Urgency } from "../issue-types";



export interface IssueCreateData {
    topic: string;
    description: string;
    urgency: Urgency;
    client: Client;
}