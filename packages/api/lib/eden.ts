import { treaty } from "@elysiajs/eden";
import type { App } from "../src";

export function treatyClient(url: string) {
  return treaty<App>(url, {
    fetcher: (url, init) => {
      return fetch(url, {
        ...init,
        credentials: "include",
      });
    },
  }).api;
}
