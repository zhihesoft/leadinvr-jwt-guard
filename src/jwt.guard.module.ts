import { CacheService } from "@leadinvr/cache";
import { DynamicModule, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "./lib/jwt.authguard";
import { JWTGuardModuleAsyncOptions } from "./lib/jwt.guard.module.async.options";
import { JWTGuardModuleOptions } from "./lib/jwt.guard.module.options";
import { JWTGuardModuleSyncOptions } from "./lib/jwt.guard.module.sync.options";
import { JwtGuardService } from "./lib/jwt.guard.service";
import { JwtStrategy } from "./lib/jwt.strategy";

/**
 * Module for JWT Guard
 * This module provides JWT authentication guard and strategy.
 * It can be registered synchronously or asynchronously.
 * It also supports global registration and auto-registration as an application guard.
 * It depends on the CacheService for token revocation checks.
 * So you should register the @leadinvr/cache module before using this module.
 * @module JwtGuardModule
 */
export class JwtGuardModule {
    /**
     * Sync register
     * @param options
     * @returns
     */
    static register(options: JWTGuardModuleSyncOptions): DynamicModule {
        const providers: Provider[] = [
            JwtAuthGuard,
            JwtStrategy,
            JwtService,
            JwtGuardService,
            { provide: JWTGuardModuleOptions, useValue: options },
        ];
        if (options.autoRegister) {
            providers.push({ provide: APP_GUARD, useClass: JwtAuthGuard });
        }

        return {
            module: JwtGuardModule,
            global: options.isGlobal || true,
            providers,
            imports: [CacheService, JwtModule.register({ secret: options.secret })],
            exports: [JwtAuthGuard, JwtGuardService],
        };
    }

    /**
     * Async register
     * @param options
     * @returns
     */
    static registerAsync(options: JWTGuardModuleAsyncOptions): DynamicModule {
        const providers: Provider[] = [];

        if (options.useFactory) {
            providers.push({
                provide: JWTGuardModuleOptions,
                useFactory: options.useFactory,
                inject: options.inject || [],
            });
        }

        providers.push(JwtStrategy, JwtAuthGuard, JwtGuardService);

        if (options.autoRegister) {
            providers.push({ provide: APP_GUARD, useClass: JwtAuthGuard });
        }

        return {
            module: JwtGuardModule,
            global: options.isGlobale || true,
            imports: [
                JwtModule.registerAsync({
                    useFactory: (opt: JWTGuardModuleOptions) => {
                        return {
                            secret: opt.secret,
                        };
                    },
                }),
                CacheService,
                ...(options.imports || []),
            ],
            providers,
            exports: [JwtAuthGuard, JwtGuardService],
        };
    }
}
