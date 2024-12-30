import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import type { API } from "@/main";
import type { sessionStore } from "@/lib/store";

export const Route = createRootRouteWithContext<{
  api: API;
  qc: QueryClient;
  sessionStore: typeof sessionStore;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      {import.meta.env.VITE_ENV === "development" && (
        <>
          <ReactQueryDevtools />
        </>
      )}
    </>
  );
}
