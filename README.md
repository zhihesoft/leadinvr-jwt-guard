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

### Register

```js
JwtGuardModule.registerAsync({
    imports: [ConfigModule, RiskCacheModule],
    inject: [ConfigService, RiskCacheService],
    useFactory: (configs: ConfigService, cache: RiskCacheService) => {
        const secret = configs.get<string>("JWT_SECRET");
        Failed.onFalsy(secret, () => "JWT_SECRET cannot be null or undefined");
        return {
            jwtSecret: secret,
            check: async token => {
                if (await cache.isTokenRevoked(token)) {
                    return false;
                }
                return true;
            },
        };
    },
}),
```

