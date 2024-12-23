import { permissions, schema } from "./zero-schema";

export const zeroCacheConfig = {
  schema,
  permissions,
  upstreamDB: process.env.ZERO_DB_URL_1,
  cvrDB: process.env.ZERO_DB_URL_2, // You may want a separate DB for this
  changeDB: process.env.ZERO_DB_URL_3, // And this
  replicaFile: "./data/zero-replica.db",
};
