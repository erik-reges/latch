// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   dialect: "postgresql",
//   schema: "./drizzle/auth-schema.ts",
//   out: "./drizzle",
//   dbCredentials: {
//     url: "postgres://postgres:7inaamcqxTxz8m0@latch-pg.flycast:5432",
//     ssl: true,
//   },
// });
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/auth-schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "postgres://postgres:7inaamcqxTxz8m0@localhost:5432",
  },
});
