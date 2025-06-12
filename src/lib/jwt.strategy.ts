import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { MODULE_OPTIONS_TOKEN } from "./jwt.guard.module-defination";
import { JWTGuardModuleOptions } from "./jwt.guard.module.options";
import { JwtGuardService } from "./jwt.guard.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(MODULE_OPTIONS_TOKEN) options: JWTGuardModuleOptions,
        private readonly jwtGuards: JwtGuardService,
    ) {
        super({
            jwtFromRequest: JwtGuardService.extractTokenFromRequest,
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: options.secret,
        });
    }

    async validate(req: Request, payload: unknown): Promise<unknown> {
        const token = JwtGuardService.extractTokenFromRequest(req);
        if (!token) {
            throw new UnauthorizedException("Token is missing");
        }

        const isRevoked = await this.jwtGuards.isRevokedToken(token);
        if (isRevoked) {
            throw new UnauthorizedException("Token is revoked");
        }
        return payload;
    }
}
