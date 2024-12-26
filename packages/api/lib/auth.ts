import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  user,
  session,
  verification,
  account,
} from "@latch/db/drizzle/auth-schema";
import type { Context } from "elysia";
import { db } from "./db";
import { config } from "./config";
export const bAuth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseUrl: `${config.apiBaseUrl}/api/auth`,
  schema: {
    user,
    session,
    verification,
    account,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  advanced: {
    cookiePrefix: "better-auth",
    crossSubDomainCookies: {
      enabled: !config.isDev,
      domain: ".fly.dev",
    },
    useSecureCookies: !config.isDev,
    cookies: {
      session_token: {
        attributes: {
          // Important: Use "none" for cross-domain in production
          sameSite: config.isDev ? "lax" : "none",
          secure: !config.isDev, // Must be true when sameSite is "none"
          path: "/",
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          domain: config.isDev ? undefined : ".fly.dev", // Note the leading dot
        },
      },
      session_data: {
        attributes: {
          sameSite: config.isDev ? "lax" : "none",
          secure: !config.isDev,
          path: "/",
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
          domain: config.isDev ? undefined : ".fly.dev",
        },
      },
      dont_remember: {
        attributes: {
          sameSite: config.isDev ? "lax" : "none",
          secure: !config.isDev,
          path: "/",
          httpOnly: true,
          domain: config.isDev ? undefined : ".fly.dev",
        },
      },
    },
  },
  logger: {
    disabled: false,
    level: "debug",
    log(level, message, ...args) {
      const timestamp = new Date().toISOString();
      const prefix = `[BetterAuth] ${timestamp} ${level.toUpperCase()}:`;
      if (level === "error") {
        console.error(prefix, message, ...args);
      } else {
        console.log(prefix, message, ...args);
      }
    },
  },
  trustedOrigins: config.isDev
    ? ["http://localhost:8080", "http://localhost:3000"]
    : [
        "https://latch-falling-pond-1256.fly.dev",
        "https://latch-cold-cloud-2771.fly.dev",
      ],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];

  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    const requestCookies = context.request.headers.get("cookie");
    const origin = context.request.headers.get("origin");
    console.log("Auth request details:", {
      method: context.request.method,
      url: context.request.url,
      origin,
      cookies: requestCookies,
      sessionToken: requestCookies?.match(
        /better-auth\.session_token=([^;]+)/,
      )?.[1],
    });

    const response = bAuth.handler(context.request);

    response.then((res) => {
      const cookies = res.headers
        .get("set-cookie")
        ?.split(",")
        .map((c) => c.trim());
      console.log("Auth response details:", {
        status: res.status,
        cookies,
        location: res.headers.get("location"),
        origin,
      });
    });

    return response;
  }

  context.error(405);
};
