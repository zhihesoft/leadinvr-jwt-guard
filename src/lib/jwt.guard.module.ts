import { CacheService } from "@leadinvr/cache";
import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "./jwt.authguard";
import { JwtGuardService, jwtSecret } from "./jwt.guard.service";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigurableModuleClass } from "./jwt.guard.module-defination";

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
        CacheService,
        JwtModule.register({
            secretOrKeyProvider: () => jwtSecret,
        }),
    ],
    providers: [
        JwtAuthGuard,
        JwtStrategy,
        JwtGuardService,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
    ],
    exports: [JwtAuthGuard, JwtGuardService],
})
export class JwtGuardModule extends ConfigurableModuleClass {}
