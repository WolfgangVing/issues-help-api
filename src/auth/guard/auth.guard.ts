import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "src/decorator/public.decorator";
import { ROLES_KEY } from "src/decorator/roles.decorator";
import { Role } from "src/shared/roles.enum";


@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger();
    constructor(
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private reflactor: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflactor.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const requiredRoles = this.reflactor.getAllAndOverride<string>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])


        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get<string>("JWT_SECRET")
                },
            );
            
            // We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;

            //checking if route has role-based access control
            const claimRole = payload['role']
            const hasRole = requiredRoles.includes(claimRole)

            if (requiredRoles.length > 0 && !hasRole) {
                this.logger.error(`User permission: ${claimRole} not enough, required permissions: ${requiredRoles}`)
                return false;
            }
            
        } catch {
            throw new UnauthorizedException()
        }

        return true;
    }

    private extractTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        
        return type === "Bearer" ? token : undefined;
    }
}