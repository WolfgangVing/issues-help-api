import { IUser } from "src/shared/interfaces/IUser";
import { Roles } from "src/shared/roles.enum";

export class UserDto implements Omit<IUser, "password"> {
    id: string
    name: string;
    phone: string;
    email: string;
    role: Roles;
}