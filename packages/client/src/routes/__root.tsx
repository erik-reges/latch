import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import type { API } from "../lib/api";
import { ModeToggle } from "@/components/dark-mode/mode-toggle";

export const Route = createRootRouteWithContext<{
  api: API;
  qc: QueryClient;
}>()({
  component: RootComponent,
});
function RootComponent() {
  return (
    <>
      <div className="p-1 flex gap-6 text-lg  w-full absolute top-0">
        <Link href="/">
          <span className="pl-2  text-stone-300 font-bold">latch </span>
        </Link>

        <Link href="/signin">sign in</Link>
        <Link href="/signup">sign up</Link>

        <div className="absolute top-0 right-0">
          <ModeToggle />
        </div>
      </div>
      <hr />

      <Outlet />

      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
