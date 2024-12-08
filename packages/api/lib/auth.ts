import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@latch/db";
import type { Context } from "elysia";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseUrl: process.env.BETTER_AUTH_URL!,

  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:8080"],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});

export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    context.error(405);
  }
};
