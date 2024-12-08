import { cors } from "@elysiajs/cors";
import { auth, betterAuthView } from "../lib/auth";
import Elysia, { type Context } from "elysia";
import { Logestic } from "logestic";

export const port = 3000;
export const hostname = "localhost";
export const baseUrl = `${hostname}:${port}`;
export const isDev = process.env.NODE_ENV !== "production";

export const api = new Elysia({ prefix: "/api", precompile: true })
  .use(
    cors({
      origin: ["http://localhost:8080", "http://localhost:8080/*"],
    }),
  )
  .all("/auth/*", betterAuthView)
  .use(Logestic.preset("fancy"))

  .get("/hello", () => ({ message: "hello" }))

  .onError((err) => {
    console.log(err);
    console.log(err.error);
  })
  .listen(3000);

export type App = typeof api;

console.log(`🍣 Server running at http${isDev ? "" : "s"}://${baseUrl}/api`);
