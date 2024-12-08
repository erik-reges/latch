import { treatyClient } from "../../../api/lib/eden";
export const api = treatyClient();
export type API = typeof api;
