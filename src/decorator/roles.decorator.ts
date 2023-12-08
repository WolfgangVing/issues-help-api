import { SetMetadata } from "@nestjs/common";
import { Role } from "src/shared/roles.enum";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => {
    console.log(`Setting roles:${roles} in metadata of the controller:`)
    return SetMetadata(ROLES_KEY, roles)
};