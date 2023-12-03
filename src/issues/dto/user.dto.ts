import { IsEnum, IsString, IsUUID, Length } from "class-validator";
import { Roles } from "src/shared/roles.enum";

export class UserDto {
    @IsString()
    _id: string;

    @IsString()
    @Length(3, 15)
    name: string;
}