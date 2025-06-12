import {
    Inject,
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { MODULE_OPTIONS_TOKEN } from "./jwt.guard.module-defination";
import { JWTGuardModuleOptions } from "./jwt.guard.module.options";

import * as jwts from "jsonwebtoken";

@Injectable()
export class JwtRevokeTokenService implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(MODULE_OPTIONS_TOKEN)
        private readonly options: JWTGuardModuleOptions,
    ) {}

    private redis?: RedisClientType;
    private readonly tokens: Set<string> = new Set();

    private get redisEnabled(): boolean {
        return this.redis?.isReady ?? false;
    }

    async onModuleInit() {
        if (!this.options.redisUrl || this.options.redisUrl.trim() === "") {
            logger.warn(
                "Redis URL is not provided. JWT revoke token service will use memory storage.",
            );
            return;
        }

        this.redis = createClient({
            url: this.options.redisUrl,
        }).on("error", err => {
            logger.error("Redis connection error", err);
        }) as unknown as RedisClientType;
        await this.redis.connect();
    }

    async onModuleDestroy() {
        this.tokens.clear();
        await this.redis?.close();
        this.redis = undefined;
    }

    async isRevoked(token: string): Promise<boolean> {
        if (this.tokens.has(token)) {
            return true;
        }
        if (!this.redisEnabled) {
            return false;
        }
        const exists = await this.redis!.exists(this.getTokenKey(token));
        if (exists > 0) {
            this.tokens.add(token);
        }
        return exists > 0;
    }

    async revoke(token: string): Promise<void> {
        const parsed = jwts.decode(token, { complete: true, json: true }); // Validate the token format

        if (!parsed || !parsed.header || !parsed.header.alg) {
            console.log("Invalid token format", parsed);
            throw new Error("Invalid token format");
        }
        // get expires from the token
        const expires = (parsed.payload as jwts.JwtPayload).exp;
        if (!expires || typeof expires !== "number") {
            throw new Error("Token does not have an expiration time");
        }
        const ttl = expires - Math.floor(Date.now() / 1000); // Calculate TTL in seconds
        // Check if the token is expired
        if (ttl <= 0) {
            return;
        }
        // Store the token in cache to revoke it
        this.tokens.add(token);
        if (!this.redisEnabled) {
            return;
        }
        const key = this.getTokenKey(token);
        await this.redis!.set(key, token, {
            EX: ttl, // Set expiration time in seconds
        });
    }

    private getTokenKey(token: string): string {
        return `jwt-revoke-tokens:${token}`;
    }
}

const logger = new Logger(JwtRevokeTokenService.name);
