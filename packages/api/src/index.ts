import { cors } from "@elysiajs/cors";
import Elysia from "elysia";
import { vehiclesRouter } from "./routes/vehicles";
import { logger } from "@bogeychan/elysia-logger";
import { config } from "./lib/config";
import { betterAuth } from "./lib/better-auth";
const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];

export const api = new Elysia({ prefix: "/api" })
  .get("/health", () => `healthy server`)
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
        "Origin",
        "Accept",
      ],
      exposeHeaders: ["Set-Cookie", "Cookie"],
      maxAge: 86400,
      preflight: true,
    }),
  )
  .all("/auth/*", async ({ request, error }) => {
    if (!BETTER_AUTH_ACCEPT_METHODS.includes(request.method)) return error(405);

    return betterAuth.handler(request);
  })

  .use(logger())
  .use(vehiclesRouter);

api.listen(config.port);

console.log(`🍣 api is ready: ${config.apiBaseUrl}/api`);

export type App = typeof api;
