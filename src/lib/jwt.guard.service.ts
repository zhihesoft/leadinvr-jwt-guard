import { CacheService } from "@leadinvr/cache";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtGuardService {
    constructor(
        private readonly cache: CacheService,
        private readonly jwts: JwtService,
    ) {}

    private readonly revokeTokenCachePrefix = "jwt-revoke-tokens";

    async signToken(payload: object, expiresIn: string = "30m"): Promise<string> {
        return this.jwts.signAsync(payload, { expiresIn });
    }

    /**
     * Check if the token is revoked
     * This method checks if the token is revoked by looking it up in the cache.
     * @param token
     * @returns
     */
    async isRevokedToken(token: string): Promise<boolean> {
        const key = this.getTokenKey(token);
        return this.cache.has(key);
    }

    /**
     * Mark a token as revoked
     * This method revokes a token by storing it in the cache with its expiration time.
     * @param token
     * @returns
     */
    async revokeToken(token: string): Promise<void> {
        const parsed = this.jwts.decode(token, { json: true, complete: true }); // Decode the token to validate it
        if (!parsed || !parsed.header || !parsed.header.alg) {
            throw new Error("Invalid token format");
        }
        // get expires from the token
        const expires = parsed.payload.exp;
        if (!expires || typeof expires !== "number") {
            throw new Error("Token does not have an expiration time");
        }
        const ttl = expires - Math.floor(Date.now() / 1000); // Calculate TTL in seconds
        // Check if the token is expired
        if (ttl <= 0) {
            return;
        }
        // Store the token in cache to revoke it

        const key = this.getTokenKey(token);
        await this.cache.set(key, true, ttl); // Store for 7 days
    }

    private getTokenKey(token: string): string {
        return `${this.revokeTokenCachePrefix}:${token}`;
    }
}
