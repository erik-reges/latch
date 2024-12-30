import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
// const env = import.meta.env.VITE_ENV;
// const prod = env === "production";

export default defineConfig({
  plugins: [TanStackRouterVite({}), react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // kanske måste vara rätt i prod?
  server: {
    proxy: {
      "/api": {
        // target: "https://latch-api-1337.fly.dev",
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 8080,
    host: true,
  },
});
