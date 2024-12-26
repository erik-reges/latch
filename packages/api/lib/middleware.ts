import { Elysia } from "elysia";
import { bAuth } from "./auth";
import type { Session, User } from "better-auth/types";
import { LRUCache } from "lru-cache";

const sessionCache = new LRUCache({
  max: 1000, // Maximum number of items
  ttl: 1000 * 60 * 5, // Time to live: 5 minutes
});

class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "Unauthorized";
  }
}
export interface UserContext extends Record<string, unknown> {
  user: User;
  session: Session;
}
export const userMiddleware = new Elysia()
  .error({
    UnauthorizedError,
  })
  .derive({ as: "scoped" }, async ({ request, set }): Promise<UserContext> => {
    const cookies = request.headers.get("cookie")?.split(";") ?? [];

    const cookieNames =
      process.env.NODE_ENV === "production"
        ? ["__Secure-better-auth.session_token=", "better-auth.session_token="]
        : ["better-auth.session_token="];

    const token = cookies
      .find((c) => cookieNames.some((name) => c.trim().startsWith(name)))
      ?.split("=")?.[1];

    const cached = sessionCache.get(token ?? "");
    if (cached) {
      return cached as UserContext;
    }

    const session = await bAuth.api.getSession({
      headers: request.headers,
    });

    if (!session || !token) {
      set.status = 401;
      throw new UnauthorizedError("No token");
    }

    const context = {
      user: session.user,
      session: session.session,
    };

    sessionCache.set(token!, context);

    return context;
  });
