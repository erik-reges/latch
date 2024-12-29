import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import type { API } from "@/main";

export const Route = createRootRouteWithContext<{
  api: API;
  qc: QueryClient;
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
