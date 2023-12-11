import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, Length, MinLength } from 'class-validator';


export class UpdateUserDto {
    @ApiProperty({
        required: false
    })
    @IsString()
    @Length(4, 15)
    name: string

    @ApiProperty({
        required: false
    })
    @IsPhoneNumber("BR")
    phone: string

    @ApiProperty({
        required: false
    })
    @IsString()
    @MinLength(8, {
        message: "Password is too short"
    })
    password: string
}
