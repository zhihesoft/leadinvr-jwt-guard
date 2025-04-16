import { JWTGuardModuleOptions } from "./jwt.guard.module.options";

export class JWTGuardModuleAsyncOptions {
    isGlobale?: boolean;
    autoRegister?: boolean;
    imports?: any[];
    inject?: any[];
    useFactory?: (...args: any[]) => Promise<JWTGuardModuleOptions> | JWTGuardModuleOptions;
}
