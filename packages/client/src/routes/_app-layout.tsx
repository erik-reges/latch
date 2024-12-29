import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AppHeader } from "@/components/sidebar/app-header";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/_app-layout")({
  component: AppLayout,
  loader: async ({}) => {
    const { data } = await getSession();
    if (!data) {
      throw redirect({
        to: "/signin",
        search: { email: undefined },
      });
    }
    return { session: data.session, user: data.user };
  },
});
function AppLayout() {
  const { user, session } = Route.useLoaderData();

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full overflow-hidden">
        <AppSidebar user={user} session={session} />
        <SidebarInset className="">
          <AppHeader email={user.email} token={session.token} />
          <Separator className="mb-4" />
          <div className="flex-1 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
