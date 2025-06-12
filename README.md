# leadinvr-jwt-guard

JWT Guard for NestJS framework

<p align="center">
  <a href="https://www.npmjs.com/package/@leadinvr/jwt-guard">
    <img src="https://img.shields.io/npm/v/@leadinvr/jwt-guard.svg?style=for-the-badge" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/@leadinvr/jwt-guard">
    <img src="https://img.shields.io/npm/dt/@leadinvr/jwt-guard.svg?style=for-the-badge" alt="npm total downloads" />
  </a>
  <a href="https://www.npmjs.com/package/@leadinvr/jwt-guard">
    <img src="https://img.shields.io/npm/dm/@leadinvr/jwt-guard.svg?style=for-the-badge" alt="npm monthly downloads" />
  </a>
  <a href="https://www.npmjs.com/package/@leadinvr/jwt-guard">
    <img src="https://img.shields.io/npm/l/@leadinvr/jwt-guard.svg?style=for-the-badge" alt="npm license" />
  </a>
</p>

# Features

-   Implement JWT guard in NestJS

# Install

```bash
npm i @leadinvr/jwt-guard
```

# Quick Start

### Register Option

```ts
// Module Options
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
```

### Register

```ts
JwtGuardModule.register({
    redisUrl: "",
    secret: "test-secret",
    issuer: "test",
    audience: "test",
});

JwtGuardModule.registerAsync({
    useFactory: () => ({
        redisUrl: "",
        secret: "test-secret",
        issuer: "test",
        audience: "test",
    }),
});
```

### If autoRegister is false, you need to add provider manually


# Trouble Shooting

-   JWT Guard Module should register before other guard providers, otherwise the payload may not inject correctly
