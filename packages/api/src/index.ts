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
      origin: [config.appBaseUrl],
      credentials: true,
    }),
  )

  .all("/auth/*", betterAuthView)
  .use(logger())
  .use(dbPlugin)

  .use(vehiclesRouter)
  .use(userMiddleware)
  .get("/user", ({ user }) => user)
  .get("/user", ({ db }) => db.select());

export type App = typeof api;

api.listen(config.port);
console.log(`🍣 Server running at ${config.apiBaseUrl}/api`);
