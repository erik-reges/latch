import { createDB } from "@latch/db";
import { Elysia } from "elysia";
export const db = createDB(process.env.DATABASE_URL!);

export const dbPlugin = new Elysia().derive(
  { as: "scoped" },
  async ({}): Promise<{ db: typeof db }> => {
    return { db };
  },
);
