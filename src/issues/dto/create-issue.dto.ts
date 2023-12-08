import { IsIn, IsInstance, IsObject, IsString, Length } from "class-validator";
import { UserDto } from "./user.dto";
import { Urgency } from "src/shared/issue-types";

export class CreateIssueDto {
    @IsObject()
    client: UserDto

    @IsString()
    @Length(5, 20)
    topic: string;

    @IsString()
    @Length(10, 300)
    description: string;

    @IsString()
    @IsIn(["baixo", "medio", "alto"])
    urgency: Urgency;
}
