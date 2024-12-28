import { createDB } from "@latch/db";
import { Elysia } from "elysia";
export const db = createDB(process.env.DATABASE_URL!);

export const dbPlugin = new Elysia({
  name: "db",
})
  .decorate("db", db)
  .as("scoped");
