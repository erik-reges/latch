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
import { createId } from "@paralleldrive/cuid2";
// import type { BetterFetchPlugin } from "@better-fetch/fetch";

// const credentialsPlugin: BetterFetchPlugin = {
//   name: "credentials-plugin",
//   id: "credentials-plugin",
//   hooks: {
//     onRequest: async (context) => {
//       const headers = new Headers(context.headers);
//       // Force HTTPS in production
//       if (config.env === "production") {
//         headers.set("X-Forwarded-Proto", "https");
//       }

//       // Log the current protocol
//       console.log("Request protocol:", {
//         url: context.url,
//         originalProto: headers.get("x-forwarded-proto"),
//         forcedProto: "https",
//       });

//       return {
//         ...context,
//         credentials: "include",
//         mode: "cors",
//         headers,
//       };k
//     },
//   },
// };
//
const MyDomains: Record<string, string> = {
  development: "localhost",
  production: ".fly.dev",
};

export const bAuth = betterAuth({
  appName: "latch-auth",
  secret: process.env.BETTER_AUTH_SECRET! + "123123",
  basePath: "/api/auth",
  trustedOrigins: [`${process.env.FRONTEND_URL}`],
  schema: {
    user,
    session,
    verification,
    account,
  },
  advanced: {
    generateId: () => createId(),

    defaultCookieAttributes: {
      sameSite: config.env === "production" ? "None" : "Lax",
      secure: config.env === "production",
      httpOnly: config.env === "production",
      domain: MyDomains[config.env],
    },

    useSecureCookies: !config.isDev,
    crossSubDomainCookies: {
      enabled: config.env === "production",
      domain: MyDomains[config.env],
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
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
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});

export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];

  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    const requestCookies = context.request.headers.get("cookie");
    const origin = context.request.headers.get("origin");
    const protocol = new URL(context.request.url).protocol;
    const host = context.request.headers.get("host");

    console.log("Auth request details:", {
      method: context.request.method,
      url: context.request.url,
      protocol,
      origin,
      host,
      cookies: requestCookies,
      headers: context.request.headers.toJSON(),
      sessionToken: requestCookies?.match(
        /(?:__Secure-)?better-auth\.session_token=([^;]+)/,
      )?.[1],
      isDev: config.isDev,
      cookieDomain: config.isDev ? undefined : ".fly.dev",
    });

    const response = bAuth.handler(context.request);

    response.then((res) => {
      const setCookie = res.headers.get("set-cookie");
      console.log("Auth response details:", {
        status: res.status,
        cookies: setCookie?.split(",").map((c) => c.trim()),
        parsedCookie: setCookie ? parseCookie(setCookie) : null,
        headers: res.headers.toJSON(),
        location: res.headers.get("location"),
        origin,
        host,
      });
    });

    return response;
  }

  context.error(405);
};

// Helper function to parse cookie details
function parseCookie(setCookie: string) {
  const parts = setCookie.split(";").map((p) => p.trim());
  return {
    raw: setCookie,
    parts,
    domain: parts
      .find((p) => p.toLowerCase().startsWith("domain="))
      ?.split("=")[1],
    secure: parts.some((p) => p.toLowerCase() === "secure"),
    sameSite: parts
      .find((p) => p.toLowerCase().startsWith("samesite="))
      ?.split("=")[1],
  };
}
