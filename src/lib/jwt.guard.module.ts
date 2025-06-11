import { Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "./jwt.authguard";
import { ConfigurableModuleClass } from "./jwt.guard.module-defination";
import { JwtGuardService, jwtSecret } from "./jwt.guard.service";
import { JwtRevokeTokenService } from "./jwt.revoke.token.service";
import { JwtStrategy } from "./jwt.strategy";

/**
 * Module for JWT Guard
 * This module provides JWT authentication guard and strategy.
 * It can be registered synchronously or asynchronously.
 * It also supports global registration and auto-registration as an application guard.
 * It depends on the CacheService for token revocation checks.
 * So you should register the @leadinvr/cache module before using this module.
 * @module JwtGuardModule
 */
@Global()
@Module({
    imports: [
        JwtModule.register({
            secretOrKeyProvider: () => jwtSecret,
        }),
    ],
    providers: [
        JwtAuthGuard,
        JwtStrategy,
        JwtGuardService,
        JwtRevokeTokenService,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
    ],
    exports: [JwtAuthGuard, JwtGuardService],
})
export class JwtGuardModule extends ConfigurableModuleClass {}
