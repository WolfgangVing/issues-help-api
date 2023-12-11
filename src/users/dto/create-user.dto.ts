import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsPhoneNumber, IsString, Length, MinLength } from "class-validator";
import { IUser } from "src/shared/interfaces/IUser";
import { Role } from "src/shared/roles.enum";

export class CreateUserDto implements IUser {
    @ApiProperty()
    @IsString()
    @Length(4, 15)
    name: string

    @ApiProperty()

    @IsPhoneNumber("BR")
    phone: string

    @ApiProperty()

    @IsString()
    @MinLength(8, {
        message: "Password is too short"
    })
    password: string

    @ApiProperty()
    @IsEmail({}, {
        message: "Email is invalid"
    })
    email: string

    @ApiProperty()
    @IsEnum(Role)
    role: Role = Role.Client
}