export class JWTGuardModuleSyncOptions {
    /**
     * Register JWT Guard globally
     */
    isGlobal?: boolean;

    /**
     * Automatically register the JWT Guard as an application guard
     * { provide: APP_GUARD, useClass: JwtAuthGuard }
     */
    autoRegister?: boolean;

    /**
     * Secret key for JWT signing
     */
    secret?: string;
}
