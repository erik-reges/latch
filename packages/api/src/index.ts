import { cors } from "@elysiajs/cors";
import { betterAuthView } from "../lib/auth";
import Elysia, { t, type Context } from "elysia";
import { vehiclesRouter } from "./routes/vehicles";
import { logger } from "@bogeychan/elysia-logger";
import { config } from "../lib/config";
import { bAuth } from "../lib/auth";
import { Auth } from "../lib/middleware";

export const api = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: config.isDev
        ? ["http://localhost:8080", "http://localhost:3000"]
        : ["https://latch-web-1337.fly.dev", "https://latch-api-1337.fly.dev"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["*"],
      exposeHeaders: ["Set-Cookie", "Cookie"],
      maxAge: 86400,
      preflight: true,
    }),
  )
  .use(Auth)
  .use(logger())

  .get("/health", async ({ server }) => `healthy server.url: ${server?.url}`)

  .get("/ctx", async ({}) => {
    const ctx = await bAuth.$context;
    const safeCtx = {
      appName: ctx.appName,
      baseURL: ctx.options.baseURL,
      basePath: ctx.options.basePath,

      trustedOrigins: ctx.trustedOrigins,

      options: {
        advanced: ctx.options.advanced,
        cookies: ctx.options.advanced?.cookies,
      },

      authCookies: {
        dontRememberToken: ctx.authCookies.dontRememberToken,
        sessionToken: ctx.authCookies.sessionToken,
        sessionData: ctx.authCookies.sessionData,
      },

      sessionConfig: {
        updateAge: ctx.sessionConfig.updateAge,
        expiresIn: ctx.sessionConfig.expiresIn,
        freshAge: ctx.sessionConfig.freshAge,
      },
    };

    const debugInfo = {
      environment: process.env.ENV,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
    };

    return {
      ...safeCtx,
      debug: debugInfo,
    };
  })
  .get("/", () => `Hello from ${config.env}`)

  .use(vehiclesRouter);

api.listen(config.port);

console.log(`🍣 api is ready: ${config.apiBaseUrl}/api`);

export type App = typeof api;
