import { DynamicModule, Module, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./lib/jwt.authguard";
import { JWT_GUARD_MODULE_OPTIONS } from "./lib/jwt.guard.contants";
import { JWTGuardModuleAsyncOptions } from "./lib/jwt.guard.module.async.options";
import { JWTGuardModuleOptions } from "./lib/jwt.guard.module.options";
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
    static register(options: JWTGuardModuleOptions): DynamicModule {
        return {
            module: JwtGuardModule,
            providers: [
                JwtAuthGuard,
                JwtStrategy,
                { provide: JWT_GUARD_MODULE_OPTIONS, useValue: options },
                { provide: APP_GUARD, useClass: JwtAuthGuard },
            ],
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

        providers.push({ provide: APP_GUARD, useClass: JwtAuthGuard });

        return {
            module: JwtGuardModule,
            imports: options.imports || [],
            providers,
            exports: [JwtAuthGuard],
        };
    }
}
