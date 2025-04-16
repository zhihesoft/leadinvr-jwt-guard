import { JWTGuardModuleOptions } from "./jwt.guard.module.options";

export class JWTGuardModuleAsyncOptions {
    imports?: any[];
    inject?: any[];
    useFactory?: (...args: any[]) => Promise<JWTGuardModuleOptions> | JWTGuardModuleOptions;
}
