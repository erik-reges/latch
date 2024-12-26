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
    // Keep the default cookie prefix to match what's already working
    cookiePrefix: "better-auth",

    // Enable cross-subdomain cookies in production
    crossSubDomainCookies: {
      enabled: !config.isDev,
      domain: "fly.dev",
    },

    // Force secure cookies in production
    useSecureCookies: !config.isDev,

    // Keep the default session_token name
    cookies: {
      session_token: {
        attributes: {
          sameSite: config.isDev ? "lax" : "strict",
          path: "/",
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
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
    ? ["http://localhost:8080"]
    : ["https://latch-falling-pond-1256.fly.dev"],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});

export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    // Add more debug logging
    const requestCookies = context.request.headers.get("cookie");
    console.log("Auth request details:", {
      method: context.request.method,
      url: context.request.url,
      cookies: requestCookies,
      sessionToken: requestCookies?.match(
        /better-auth\.session_token=([^;]+)/,
      )?.[1],
    });

    const response = bAuth.handler(context.request);

    response.then((res) => {
      console.log("Auth response details:", {
        status: res.status,
        cookies: res.headers
          .get("set-cookie")
          ?.split(",")
          .map((c) => c.trim()),
        location: res.headers.get("location"),
      });
    });

    return response;
  }
  context.error(405);
};
