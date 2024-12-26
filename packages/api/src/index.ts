import { cors } from "@elysiajs/cors";
import { betterAuthView } from "../lib/auth";
import Elysia, { t, type Context } from "elysia";
import { Logestic } from "logestic";
import { vehiclesRouter } from "./routes/vehicles";
import { logger } from "@bogeychan/elysia-logger";
import { userRouter } from "./routes/user";
import { userMiddleware } from "../lib/middleware";

export const port = 3000;
export const hostname = "localhost";
export const baseUrl = `${hostname}:${port}`;
export const isDev = process.env.NODE_ENV !== "production";
export const api = new Elysia({ prefix: "/api" })

  .use(
    cors({
      origin: [`${process.env.APP_URL!}`],
    }),
  )

  .all("/auth/*", betterAuthView)
  .use(logger())

  .use(vehiclesRouter)
  .use(userMiddleware)
  .get("/user", ({ user }) => user)
  .listen(3000);

export type App = typeof api;

console.log(`🍣 Server running at http${isDev ? "" : "s"}://${baseUrl}/api`);
