import { DynamicModule, Module, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./lib/jwt.authguard";
import { JWT_GUARD_MODULE_OPTIONS } from "./lib/jwt.guard.contants";
import { JWTGuardModuleAsyncOptions } from "./lib/jwt.guard.module.async.options";
import { JWTGuardModuleSyncOptions } from "./lib/jwt.guard.module.sync.options";
import { JwtStrategy } from "./lib/jwt.strategy";

@Module({
    providers: [JwtAuthGuard, JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
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
            { provide: JWT_GUARD_MODULE_OPTIONS, useValue: options },
        ];
        if (options.autoRegister) {
            providers.push({ provide: APP_GUARD, useClass: JwtAuthGuard });
        }

        return {
            global: options.isGlobale || true,
            module: JwtGuardModule,
            providers,
            exports: [JwtAuthGuard],
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
                provide: JWT_GUARD_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            });
        }

        providers.push(JwtStrategy, JwtAuthGuard);

        if (options.autoRegister) {
            providers.push({ provide: APP_GUARD, useClass: JwtAuthGuard });
        }

        return {
            global: options.isGlobale || true,
            module: JwtGuardModule,
            imports: options.imports || [],
            providers,
            exports: [JwtAuthGuard],
        };
    }
}
