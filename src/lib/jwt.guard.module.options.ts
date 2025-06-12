export class JWTGuardModuleOptions {
    /**
     * Redis URL for storing revoked tokens
     * This URL is used to connect to a Redis instance where revoked tokens are stored.
     * If not provided, the service will use in-memory storage.
     * Example: "redis://localhost:6379" or "redis://username:password@localhost:6379"
     * @default ""
     */
    redisUrl: string = "";
    /**
     * JWT Secret
     */
    secret: string = "";

    /**
     * Jwt Issuer
     */
    issuer?: string;

    /**
     * Jwt Audience
     */
    audience?: string;
}
