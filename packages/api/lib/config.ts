export const config = {
  env: process.env.ENV || "development",
  isDev: process.env.ENV === "development",
  port: process.env.PORT || 3000,
  redisUrl: process.env.REDIS_URL!,
  redisToken: process.env.REDIS_TOKEN!,
  apiBaseUrl:
    process.env.ENV === "production"
      ? "https://latch-api-1337.fly.dev"
      : "http://localhost:3000",
} as const;
