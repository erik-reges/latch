import { cors } from "@elysiajs/cors";
import Elysia from "elysia";
import { vehiclesRouter } from "./routes/vehicles";
import { config } from "./lib/config";
import { BETTER_AUTH_ACCEPT_METHODS, betterAuth } from "./lib/better-auth";
import { userRouter } from "./routes/user";

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
        "Origin",
        "Accept",
      ],
      exposeHeaders: ["Set-Cookie", "Cookie"],
      maxAge: 86400,
      preflight: true,
    }),
  )
  .all("/auth/*", async ({ request, error }) =>
    !BETTER_AUTH_ACCEPT_METHODS.includes(request.method)
      ? error(405)
      : betterAuth.handler(request),
  )

  .get("/health", () => `healthy server`)
  .use(vehiclesRouter)
  .use(userRouter);

api.listen(config.port);

console.log(`🍣 api is ready: ${config.apiBaseUrl}/api`);

export type App = typeof api;
