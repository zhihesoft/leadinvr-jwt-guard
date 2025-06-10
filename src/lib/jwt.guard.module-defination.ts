import { ConfigurableModuleBuilder } from "@nestjs/common";
import { JWTGuardModuleOptions } from "./jwt.guard.module.options";

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<JWTGuardModuleOptions>()
    .setClassMethodName("forRoot")
    .build();
