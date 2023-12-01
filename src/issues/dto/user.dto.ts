import { IsString, IsUUID, Length } from "class-validator";

export class UserDto {
    @IsString()
    _id: string;

    @IsString()
    @Length(3, 15)
    name: string;
}