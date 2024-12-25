import { userMiddleware } from "@latch/api/lib/middleware";
import Elysia from "elysia";

export const userRouter = new Elysia({
  prefix: "/user",
})
  .use(userMiddleware)
  .get("/info", ({ user }) => user);
