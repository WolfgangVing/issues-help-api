import { JwtService } from "@nestjs/jwt";
import { Role } from "src/shared/roles.enum";

export type UserCredentialsToken = {
    sub: string,
    email: string,
    name: string,
    phone: string,
    role: Role
}
export async function generateToken(
    jwtService: JwtService,
    userCredentials: UserCredentialsToken,
    jwtSecret: string
) {
    console.log(`Creating a bearer token`)
    
    return await jwtService.signAsync(userCredentials, {
        secret: jwtSecret
    });
}