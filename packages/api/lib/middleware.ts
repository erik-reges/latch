import { Elysia } from "elysia";
import { bAuth } from "./auth";
import type { Session, User } from "better-auth";

const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];

export const Auth = new Elysia({ name: "Auth" }).all(
  "/auth/*",
  ({ request, error }) => {
    if (!BETTER_AUTH_ACCEPT_METHODS.includes(request.method)) return error(405);

    const requestCookies = request.headers.get("cookie");
    const origin = request.headers.get("origin");
    const protocol = new URL(request.url).protocol;
    const host = request.headers.get("host");

    console.log("Auth request details:", {
      method: request.method,
      url: request.url,
      protocol,
      origin,
      host,
      cookies: requestCookies,
      headers: request.headers.toJSON(),
      sessionToken: requestCookies?.match(
        /(?:__Secure-)?better-auth\.session_token=([^;]+)/,
      )?.[1],
    });

    const response = bAuth.handler(request);

    response.then((res) => {
      const setCookie = res.headers.get("set-cookie");
      console.log("Auth response details:", {
        status: res.status,
        cookies: setCookie?.split(",").map((c) => c.trim()),
        headers: res.headers.toJSON(),
        origin,
        host,
      });
    });

    return response;
  },
);

export const auth = new Elysia().derive(
  { as: "global" },
  async ({ request, error }) => {
    const auth = await bAuth.api.getSession({
      headers: request.headers,
    });

    if (!auth) {
      return error(401, "Unauthorized");
    }

    return { auth };
  },
);
