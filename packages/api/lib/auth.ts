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
    autoSignIn: false,
  },
  logger: {
    disabled: false,
    level: "info",
    log(level, message, ...args) {
      const timestamp = new Date().toISOString();
      const prefix = `[BetterAuth] ${timestamp} ${level.toUpperCase()}:`;

      if (args.length > 0) {
        console.log(prefix, message, ...args);
      } else {
        console.log(prefix, message);
      }
    },
  },
  trustedOrigins: [config.appBaseUrl],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});

export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return bAuth.handler(context.request);
  } else {
    context.error(405);
  }
};
