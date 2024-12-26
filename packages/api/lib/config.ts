export const config = {
  isDev: process.env.NODE_ENV !== "production",
  port: process.env.PORT || 3000,
  get apiBaseUrl() {
    return this.isDev
      ? `http://localhost:${this.port}`
      : "https://latch-cold-cloud-2771.fly.dev";
  },
  get appBaseUrl() {
    return this.isDev
      ? "http://localhost:8080"
      : "https://latch-falling-pond-1256.fly.dev";
  },
};
