import { Status, Urgency } from "../issue-types";

export class FilterIssues {
    
    status: Status | null
    
    topic: String | null
    
    createdAt: {
        initialDate: Date;
        lastDate: Date;
    } | null
    
    updatedAt: {
        initialDate: Date;
        lastDate: Date
    } | null

    urgency: Urgency

}