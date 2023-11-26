import { Status, Urgency } from "src/shared/issue-types";
import { User } from "src/shared/user-types";

export class Issue {
    id: string;
    topic: string;
    description: string;
    status: Status;
    operator: User| null;
    client: User;
    urgency: Urgency;
}