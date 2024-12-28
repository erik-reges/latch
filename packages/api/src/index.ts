import { cors } from "@elysiajs/cors";
import { betterAuthView } from "../lib/auth";
import Elysia, { t, type Context } from "elysia";
import { vehiclesRouter } from "./routes/vehicles";
import { logger } from "@bogeychan/elysia-logger";
import { userRouter } from "./routes/user";
import { config } from "../lib/config";
import { bAuth } from "../lib/auth";
import { staticPlugin } from "@elysiajs/static";

export const api = new Elysia({ prefix: "/api" })

  .use(
    cors({
      origin: config.isDev
        ? ["http://localhost:8080", "http://localhost:3000"]
        : ["https://latch-web-1337.fly.dev", "https://latch-api-1337.fly.dev"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cookie",
        "X-Forwarded-Proto",
      ],
      exposeHeaders: ["Set-Cookie"],
      maxAge: 86400,
      preflight: true,
    }),
  )
  .get("/health", async ({ server }) => `healthy server.url: ${server?.url}`)

  .get("/ctx", async ({}) => {
    const ctx = await bAuth.$context;

    const safeCtx = {
      // Core Authentication State

      // Basic Configuration
      appName: ctx.appName,
      baseURL: ctx.options.baseURL,
      basePath: ctx.options.basePath,

      trustedOrigins: ctx.trustedOrigins,

      // Auth Options
      options: {
        // secret: ctx.options.secret,
        advanced: ctx.options.advanced,
        cookies: ctx.options.advanced?.cookies,
      },

      // Auth Cookies Configuration
      authCookies: {
        dontRememberToken: ctx.authCookies.dontRememberToken,
        sessionToken: ctx.authCookies.sessionToken,
        sessionData: ctx.authCookies.sessionData,
      },

      // Session Configuration
      sessionConfig: {
        updateAge: ctx.sessionConfig.updateAge,
        expiresIn: ctx.sessionConfig.expiresIn,
        freshAge: ctx.sessionConfig.freshAge,
      },
    };

    // Add debug information about the environment
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

  .all("/auth/*", betterAuthView)
  .use(logger())
  .get("/", () => `Hello from ${config.env}`)

  .use(vehiclesRouter)
  .use(userRouter);

api.listen(config.port);
console.log(`🍣 api is ready: ${config.apiBaseUrl}/api`);

export type App = typeof api;
