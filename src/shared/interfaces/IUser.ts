import { Roles } from "../roles.enum"

export interface IUser  {
    name: string

    phone: string

    password: string

    email: string

    role: Roles
}