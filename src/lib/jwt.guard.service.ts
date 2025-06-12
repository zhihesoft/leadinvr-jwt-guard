import { Inject, Injectable } from "@nestjs/common";
import { MODULE_OPTIONS_TOKEN } from "./jwt.guard.module-defination";
import { JWTGuardModuleOptions } from "./jwt.guard.module.options";
import { JwtRevokeTokenService } from "./jwt.revoke.token.service";

import * as jwts from "jsonwebtoken";

@Injectable()
export class JwtGuardService {
    constructor(
        @Inject(MODULE_OPTIONS_TOKEN)
        private readonly options: JWTGuardModuleOptions,
        private readonly revokes: JwtRevokeTokenService,
    ) {}

    /**
     * Extract token from request
     * This method extracts the JWT token from the request headers.
     * @param req
     * @returns
     */
    static extractTokenFromRequest(req: any) {
        const authheader = req.headers["authorization"];
        if (!authheader) {
            return undefined;
        }
        const token = authheader.split(" ")[1];
        return token;
    }

    /**
     * Sign a JWT token
     * This method signs a JWT token with the provided payload and expiration time.
     * @param payload the payload object to sign.
     * @param expiresIn expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d"
     * @returns
     */
    async signToken(
        payload: object,
        expiresIn: string = "30m",
    ): Promise<string> {
        return jwts.sign(payload, this.options.secret, {
            expiresIn,
            algorithm: "HS256",
            issuer: this.options.issuer ?? "jwt-guard",
            audience: this.options.audience ?? "jwt-guard",
        });
    }

    /**
     * Decode a JWT token
     * This method decodes a JWT token without verifying its signature.
     * @param token
     * @returns
     */
    async decodeToken(token: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            jwts.verify(
                token,
                this.options.secret,
                { algorithms: ["HS256"] },
                (err, decoded) => {
                    resolve(decoded);
                },
            );
        });
    }

    /**
     * Check if the token is revoked
     * This method checks if the token is revoked by looking it up in the cache.
     * @param token
     * @returns
     */
    isRevokedToken(token: string): Promise<boolean> {
        return this.revokes.isRevoked(token);
    }

    /**
     * Mark a token as revoked
     * This method revokes a token by storing it in the cache with its expiration time.
     * @param token
     * @returns
     */
    async revokeToken(token: string): Promise<void> {
        await this.revokes.revoke(token); // Call the revoke method of JwtRevokeTokenService
    }
}
