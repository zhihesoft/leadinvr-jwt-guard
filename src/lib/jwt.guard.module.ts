import { Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt.authguard";
import { ConfigurableModuleClass } from "./jwt.guard.module-defination";
import { JwtGuardService } from "./jwt.guard.service";
import { JwtRevokeTokenService } from "./jwt.revoke.token.service";
import { JwtStrategy } from "./jwt.strategy";

/**
 * Module for JWT Guard
 * This module provides JWT authentication guard and strategy.
 * It can be registered synchronously or asynchronously.
 * @module JwtGuardModule
 */
@Global()
@Module({
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
