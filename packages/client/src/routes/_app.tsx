import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AppHeader } from "@/components/sidebar/app-header";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";

import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
  component: LayoutComponent,
  loader: async () => {
    const { isAuthenticated, setAuth } = useAuth.getState();
    console.log("Route loader - isAuthenticated:", isAuthenticated);

    if (!isAuthenticated) {
      const result = await getSession();
      console.log("Route loader - session check result:", result);

      if (result.data?.user && result.data?.session) {
        console.log("Route loader - setting auth with:", result.data);
        setAuth(result.data.user, result.data.session);
        return result.data;
      } else {
        console.log("Route loader - no session, redirecting to signin");
        throw redirect({
          to: "/signin",
          search: { email: undefined },
        });
      }
    }

    return {
      user: useAuth.getState().user,
      session: useAuth.getState().session,
      isAuthenticated: useAuth.getState().isAuthenticated,
    };
  },
});

function LayoutComponent() {
  const { user, session } = Route.useLoaderData();
  if (!user || !session) {
    throw Error("no auth2");
  }
  return (
    <SidebarProvider>
      <div className="flex min-h-screen relative w-full">
        <AppSidebar user={user} session={session} />
        <SidebarInset>
          <AppHeader email={user.email} token={session.token} />
          <Separator className="mb-4" />
          <div className="flex flex-1 flex-col p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
