import { ApiProperty } from "@nestjs/swagger";
import { IUser } from "src/shared/interfaces/IUser";
import { Role } from "src/shared/roles.enum";

export class UserDto implements Omit<IUser, "password"> {
    @ApiProperty()
    id: string

    @ApiProperty()
    name: string;
    
    @ApiProperty()
    phone: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    role: Role;
}