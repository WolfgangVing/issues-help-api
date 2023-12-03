import { IsEmail, IsEnum, IsPhoneNumber, IsString, Length, MinLength } from "class-validator";
import { IUser } from "src/shared/interfaces/IUser";
import { Roles } from "src/shared/roles.enum";

export class CreateUserDto implements IUser {
    @IsString()
    @Length(4, 15)
    name: string

    @IsPhoneNumber("BR")
    phone: string

    @IsString()
    @MinLength(8, {
        message: "Password is too short"
    })
    password: string

    @IsEmail({}, {
        message: "Email is invalid"
    })
    email: string

    @IsEnum(Roles)
    role: Roles = Roles.Client
}