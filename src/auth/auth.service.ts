import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInDTO } from './dto/sign-in.dto';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) { }
    async signIn({ email, password }: SignInDTO) {
        const user = await this.userService.findOne(email);

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            this.logger.log(`Password: ${password} incorrect, please verify it.`);
            throw new UnauthorizedException();
        }

        const payload = {
            sub: user._id.toString(),
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role
        };

        return {
            access_token: await this.generateToken(payload)
        };
    }

    async generateToken(userCredentials: {sub: string,email: string, name: string, phone: string, role: string }) {
        return await this.jwtService.signAsync(userCredentials);
    }
}
