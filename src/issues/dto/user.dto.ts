import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class UserDto {

    @ApiProperty()
    @IsString()
    _id: string;

    @ApiProperty()
    @IsString()
    @Length(3, 15)
    name: string;
}