import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MODULE_OPTIONS_TOKEN } from "./jwt.guard.module-defination";
import { JWTGuardModuleOptions } from "./jwt.guard.module.options";
import { JwtRevokeTokenService } from "./jwt.revoke.token.service";

export var jwtSecret: string = "";

@Injectable()
export class JwtGuardService {
    constructor(
        @Inject(MODULE_OPTIONS_TOKEN) options: JWTGuardModuleOptions,
        private readonly revokes: JwtRevokeTokenService,
        private readonly jwts: JwtService,
    ) {
        jwtSecret = options.secret || "";
    }

    private readonly revokeTokenCachePrefix = "jwt-revoke-tokens";

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
        return this.jwts.signAsync(payload, { expiresIn });
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
