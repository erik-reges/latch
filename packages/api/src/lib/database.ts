import { createDB } from "@latch/db";

export const database = createDB(process.env.DATABASE_URL!);
