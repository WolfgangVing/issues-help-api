import { IUser } from "src/shared/interfaces/IUser";
import { Role } from "src/shared/roles.enum";

export class UserDto implements Omit<IUser, "password"> {
    id: string
    name: string;
    phone: string;
    email: string;
    role: Role;
}