import { cors } from "@elysiajs/cors";
import { auth, betterAuthView } from "../lib/auth";
import Elysia, { t, type Context } from "elysia";
import { Logestic } from "logestic";
import { vehiclesRouter } from "./routes/vehicles";

export const port = 3000;
export const hostname = "localhost";
export const baseUrl = `${hostname}:${port}`;
export const isDev = process.env.NODE_ENV !== "production";

export const api = new Elysia({ prefix: "/api" })

  .use(
    cors({
      origin: ["http://localhost:8080", "http://localhost:8080/*"],
    }),
  )
  .all("/auth/*", betterAuthView)
  .use(Logestic.preset("fancy"))

  .use(vehiclesRouter)

  .get("/hello", () => ({ message: "hello" }))
  .listen(3000);

export type App = typeof api;

console.log(`🍣 Server running at http${isDev ? "" : "s"}://${baseUrl}/api`);
