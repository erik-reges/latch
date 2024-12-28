import { Elysia } from "elysia";
import type { Session, User } from "better-auth";
import { redis } from "../plugins/redis";
import { betterAuth } from "../lib/better-auth";

type Sesh = {
  session: Session;
  user: User;
} | null;
export const authenticate = new Elysia({
  name: "authenticate",
})
  .use(redis())
  .derive({ as: "scoped" }, async ({ request, error, redis }) => {
    const sesh: Sesh = await betterAuth.api.getSession({
      headers: request.headers,
    });

    if (!sesh) {
      return error(401, "Unauthorized");
    }

    return { session: sesh.session, user: sesh.user };
  });
