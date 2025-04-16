import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_GUARD_MODULE_OPTIONS } from "./jwt.guard.contants";
import { JWTGuardModuleOptions } from "./jwt.guard.module.options";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(JWT_GUARD_MODULE_OPTIONS) private readonly options: JWTGuardModuleOptions) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: options.jwtSecret,
        });
    }

    async validate(req: Request, payload: unknown): Promise<unknown> {
        const token = this.getToken(req);
        if (!token) {
            throw new UnauthorizedException("Token is missing");
        }
        if (this.options.check) {
            const pass = await this.options.check(token);
            if (pass) {
                throw new UnauthorizedException("Token is revoked");
            }
        }
        if (this.options.transform) {
            payload = await this.options.transform(payload);
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
