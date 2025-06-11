import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
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
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: options.secret,
        });
    }

    async validate(req: Request, payload: unknown): Promise<unknown> {
        const token = this.getToken(req);
        if (!token) {
            throw new UnauthorizedException("Token is missing");
        }

        const isRevoked = await this.jwtGuards.isRevokedToken(token);
        if (isRevoked) {
            throw new UnauthorizedException("Token is revoked");
        }
        return payload;
    }

    private getToken(req: Request): string | undefined {
        const authheader = req.headers["authorization"];
        if (!authheader) {
            return undefined;
        }
        const token = authheader.split(" ")[1];
        return token;
    }
}
