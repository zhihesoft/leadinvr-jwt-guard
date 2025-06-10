import { JWTGuardModuleOptions } from "./jwt.guard.module.options";

export class JWTGuardModuleAsyncOptions {
    /**
     * Register JWT Guard Module globally
     */
    isGlobale?: boolean;

    /**
     * Automatically register the JWT Guard as an application guard
     * { provide: APP_GUARD, useClass: JwtAuthGuard }
     */
    autoRegister?: boolean;

    /**
     * Imports for the module
     */
    imports?: any[];

    /**
     * Injects dependencies for the factory function
     */
    inject?: any[];

    /**
     * Factory function to create the module options
     */
    useFactory?: (...args: any[]) => Promise<JWTGuardModuleOptions> | JWTGuardModuleOptions;
}
