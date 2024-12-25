import { treatyClient } from "@latch/api/lib/eden";
console.log(import.meta.env.VITE_API_URL);
const api = treatyClient(import.meta.env.VITE_API_URL);
export type API = typeof api;
