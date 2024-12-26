export const config = {
  isDev: process.env.NODE_ENV !== "production",
  port: process.env.PORT || 3000,
  apiBaseUrl:
    process.env.NODE_ENV !== "production"
      ? `http://localhost:${process.env.PORT || 3000}`
      : "https://latch-cold-cloud-2771.fly.dev",
  appBaseUrl:
    process.env.NODE_ENV !== "production"
      ? "http://localhost:8080"
      : "https://latch-falling-pond-1256.fly.dev",
  cookieDomain: process.env.NODE_ENV === "production" ? ".fly.dev" : undefined,
} as const;
