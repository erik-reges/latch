import { cors } from "@elysiajs/cors";
import { betterAuthView } from "../lib/auth";
import Elysia, { t, type Context } from "elysia";
import { Logestic } from "logestic";
import { vehiclesRouter } from "./routes/vehicles";
import { logger } from "@bogeychan/elysia-logger";
import { userRouter } from "./routes/user";
import { userMiddleware } from "../lib/middleware";
import { dbPlugin } from "../lib/db";
import { config } from "../lib/config";

export const api = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: config.isDev
        ? ["http://localhost:8080"]
        : ["https://latch-falling-pond-1256.fly.dev"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cookie",
        "X-Requested-With",
      ],
      exposeHeaders: ["Set-Cookie"],
      maxAge: 86400,
      preflight: true,
    }),
  )

  .all("/auth/*", betterAuthView)
  .use(logger())

  .use(vehiclesRouter)
  .use(userRouter);

export type App = typeof api;

api.listen(config.port);
console.log(`🍣 Server running at ${config.apiBaseUrl}/api`);
