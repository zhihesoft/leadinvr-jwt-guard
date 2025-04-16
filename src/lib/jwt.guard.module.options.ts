export class JWTGuardModuleOptions {
    /**
     * JWT Secret
     */
    jwtSecret: string = "";

    /**
     * Token checker
     */
    check?: (token: string) => Promise<boolean>;
}
