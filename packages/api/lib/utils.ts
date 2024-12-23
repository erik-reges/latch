import { vehicles } from "@latch/db/drizzle/auth-schema";
import { createSchemaFactory } from "drizzle-typebox";
import { t } from "elysia";

const factory = createSchemaFactory({ typeboxInstance: t });

const schema = factory.createInsertSchema(vehicles);
