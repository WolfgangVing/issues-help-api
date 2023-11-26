import { IsIn, IsInstance, IsObject, IsString, IsUUID, Length } from "class-validator";
import { UserDto } from "./user.dto";
import { Urgency } from "src/shared/issue-types";
import { User } from "src/shared/user-types";

export class CreateIssueDto {
    @IsInstance(UserDto)
    client: UserDto

    @IsString()
    @Length(5, 20)
    topic: string;

    @IsString()
    @Length(10, 300)
    description: string;

    @IsString()
    @IsIn(["Baixo", "Medio", "Alto"])
    urgency: Urgency;
}
