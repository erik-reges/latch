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
//       };
//     },
//   },
// };

export const bAuth = betterAuth({
  // secret: process.env.BETTER_AUTH_SECRET!,
  // baseUrl: `${config.apiBaseUrl}/api/auth`,
  schema: {
    user,
    session,
    verification,
    account,
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  // session: {
  //   freshAge: 24 * 60 * 60, // 24 hours in seconds
  //   expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 24 * 60 * 60, // 24 hours in seconds
  //   },
  //   updateAge: 24 * 60 * 60, // 24 hours in seconds
  //   storeSessionInDatabase: true,
  //   modelName: "session",
  // },
  // advanced: {
  //   cookiePrefix: config.isDev ? "" : "__Secure-",
  //   crossSubDomainCookies: {
  //     enabled: !config.isDev,
  //     domain: "fly.dev",
  //   },
  //   useSecureCookies: !config.isDev,
  //   fetchPlugins: [credentialsPlugin],

  //   cookies: {
  //     session_token: {
  //       attributes: {
  //         sameSite: config.isDev ? "lax" : "none",
  //         secure: !config.isDev,
  //         path: "/",
  //         httpOnly: true,
  //         domain: config.isDev ? undefined : "fly.dev",
  //         maxAge: 60 * 60 * 24 * 7,
  //       },
  //       name: config.isDev
  //         ? "better-auth.session_token"
  //         : "__Secure-better-auth.session_token", // Update this
  //     },
  //   },
  // },
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
    : ["https://latch-web-1337.fly.dev", "https://latch-api-1337.fly.dev"],
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
