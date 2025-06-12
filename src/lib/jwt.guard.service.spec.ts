import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtGuardModule } from "./jwt.guard.module";
import { JwtGuardService } from "./jwt.guard.service";
import { JWTTestController } from "./jwt.test.controller";

import request from "supertest";

describe("JWT Guard Service spec", () => {
    let app: INestApplication;
    let moduleRef: TestingModule;
    let svc: JwtGuardService;
    // let redisUrl = "redis://127.0.0.1:6379"; // Adjust this URL as needed for your Redis instance
    let redisUrl = "";

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [
                JwtGuardModule.register({
                    secret: "test-secret",
                    redisUrl,
                }),
            ],
            controllers: [JWTTestController],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
        svc = moduleRef.get(JwtGuardService);
    });

    afterAll(() => {
        app.close();
    });

    it("should be defined", () => {
        expect(svc).toBeDefined();
    });

    it("sign token should succ", async () => {
        const payload = { userId: 1 };
        const expiresIn = "1h";
        const token = await svc.signToken(payload, expiresIn);
        expect(token).toBeDefined();
        expect(typeof token).toBe("string");
    });

    it("should return false for isRevokedToken with non-revoked token", async () => {
        const token = "non-revoked-token";
        const isRevoked = await svc.isRevokedToken(token);
        expect(isRevoked).toBe(false);
    });

    it("should return true for isRevokedToken with revoked token", async () => {
        const token = await svc.signToken({ userId: 1 }, "1h");
        await svc.revokeToken(token);
        const isRevoked = await svc.isRevokedToken(token);
        expect(isRevoked).toBe(true);
    });

    it("public method should return 200", async () => {
        let resp = await request(app.getHttpServer()).get("/jwt/public");
        expect(resp.status).toBe(200);
    });

    it("private method should return 401", async () => {
        await request(app.getHttpServer()).get("/jwt/private").expect(401);
    });

    it("private method should return 200 with token", async () => {
        const token = await svc.signToken({ userId: 2 }, "1h");
        await request(app.getHttpServer())
            .get("/jwt/private")
            .auth(token, { type: "bearer" })
            .expect(200);
    });

    it("private method should return 401 if token expired", async () => {
        const token = await svc.signToken({ userId: 3 }, "1s");
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for token to expire
        await request(app.getHttpServer())
            .get("/jwt/private")
            .auth(token, { type: "bearer" })
            .expect(401);
    });

    it("private method should return 401 with revoked token", async () => {
        const token = await svc.signToken({ userId: 4 }, "1h");
        await svc.revokeToken(token);
        await request(app.getHttpServer())
            .get("/jwt/private")
            .auth(token, { type: "bearer" })
            .expect(401);
    });
});
