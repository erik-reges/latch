import { treaty } from "@elysiajs/eden";
import type { App } from "../src";

export function treatyClient(url?: string) {
  console.log(url);
  return treaty<App>(url ?? "http://localhost:3000", {
    fetcher: (url, init) => {
      return fetch(url, {
        ...init,
        credentials: "include",
      });
    },
  }).api;
}
