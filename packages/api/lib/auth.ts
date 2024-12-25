import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@latch/db";
import {
  user,
  session,
  verification,
  account,
} from "@latch/db/drizzle/auth-schema";

import type { Context } from "elysia";

export const bAuth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseUrl: process.env.BETTER_AUTH_URL!,
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
  trustedOrigins: [
    "https://latch-falling-pond-1256.fly.dev",
    "https://latch-falling-pond-1256.fly.dev/signin",
    "http://localhost:8080",
    "http://localhost:3000",
  ],
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
