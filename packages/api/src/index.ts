import { cors } from "@elysiajs/cors";
import { betterAuthView } from "../lib/auth";
import Elysia, { t, type Context } from "elysia";
import { vehiclesRouter } from "./routes/vehicles";
import { logger } from "@bogeychan/elysia-logger";
import { userRouter } from "./routes/user";
import { config } from "../lib/config";

// const forceHttps = new Elysia().onRequest(({ request }) => {
//   const proto = request.headers.get("x-forwarded-proto");
//   if (proto === "http") {
//     const url = new URL(request.url);
//     url.protocol = "https:";
//     return Response.redirect(url.toString(), 301);
//   }
// });

export const api = new Elysia({ prefix: "/api", precompile: true })
  // .use(forceHttps)
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
  .get("/health", ({ server }) => `healthy ${server?.url}`)

  .all("/auth/*", betterAuthView)
  .use(logger())
  .get("/", () => `Hello from ${config.env}`)

  .use(vehiclesRouter)
  .use(userRouter);

api.listen(config.port);
console.log(`🍣 api is ready: ${config.apiBaseUrl}/api`);

export type App = typeof api;
