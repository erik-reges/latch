import {
  Outlet,
  createRootRouteWithContext,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import type { API } from "../lib/api";

export const Route = createRootRouteWithContext<{
  api: API;
  qc: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  const params = useParams({ from: "__root__" }); // i.e { projectId: "123" }
  const router = useRouter();

  return (
    <>
      <main className="flex-1">
        <Outlet />
      </main>
      {/* <TanStackRouterDevtools position="top-left" /> */}
    </>
  );
}
