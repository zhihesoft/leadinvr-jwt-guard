export class JWTGuardModuleOptions {
    /**
     * JWT Secret
     */
    jwtSecret: string = "";

    /**
     * Token checker
     */
    check?: (token: string) => Promise<boolean>;

    /**
     * Transform the payload to user object
     */
    transform?: (payload: unknown) => Promise<unknown>;
}
