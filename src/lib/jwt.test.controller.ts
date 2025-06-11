import { Controller, Get } from "@nestjs/common";
import { Public } from "./public.decorator";

@Controller("jwt")
export class JWTTestController {
    @Public()
    @Get("public")
    publicEndpoint(): unknown {
        return { message: "This is a public endpoint" };
    }

    @Get("private")
    privateEndpoint(): unknown {
        return { message: "This is a private endpoint" };
    }
}
