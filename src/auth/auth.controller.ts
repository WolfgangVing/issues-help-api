import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/sign-in.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger();

    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    async signIn(@Body() signInDto: SignInDTO) {
        return await this.authService.signIn(signInDto)
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
