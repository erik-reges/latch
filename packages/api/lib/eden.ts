import { treaty } from "@elysiajs/eden";
import type { App } from "../src";

export function treatyClient() {
  return treaty<App>("http://localhost:3000", {
    fetcher: (url, init) => {
      return fetch(url, {
        ...init,
        credentials: "include",
      });
    },
  }).api;
}
