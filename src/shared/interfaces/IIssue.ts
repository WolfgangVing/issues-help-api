import { Status, Urgency } from "../issue-types";
import { User } from "../user-types";


export interface IssueCreateData {
    topic: string;
    description: string;
    urgency: Urgency;
    client: User;
}

export type CreateIssueData = {
    issueID: string;
    topic: string;
    description: string;
    status: Status;
    client: User;
    urgency: Urgency;
    createAt: Date;
}