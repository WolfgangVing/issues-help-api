import { IsIn, IsInstance, IsObject, IsString, Length } from "class-validator";
import { UserDto } from "./user.dto";
import { Urgency } from "src/shared/issue-types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateIssueDto {
    @ApiProperty()
    @IsString()
    @Length(5, 30)
    topic: string;

    @ApiProperty()
    @IsString()
    @Length(10, 300)
    description: string;

    @ApiProperty({enum: Urgency, default: Urgency.Baixo, isArray: false})
    @IsString()
    @IsIn(["baixo", "medio", "alto"])
    urgency: Urgency = Urgency.Baixo;
}
