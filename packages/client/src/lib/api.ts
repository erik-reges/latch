import { treatyClient } from "@latch/api/lib/eden";
const api = treatyClient(import.meta.env.VITE_API_URL);
export type API = typeof api;
