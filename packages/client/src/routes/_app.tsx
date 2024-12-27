import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AppHeader } from "@/components/sidebar/app-header";
import { Separator } from "@/components/ui/separator";
import { signOut, useSession } from "@/lib/auth";

import { getSession } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
  beforeLoad: async ({}) => {
    const { data } = await getSession();
    if (!data) {
      throw redirect({
        to: "/signin",
        search: { email: undefined },
      });
    }
  },

  loader: async ({}) => {
    const { data } = await getSession();
    return { session: data?.session, user: data?.user };
  },
});
function AppLayout() {
  // const {
  //   data: sessionData,
  //   isPending, //loading state
  //   error, //error object
  // } = useSession();
  const navigate = useNavigate();
  const { user, session } = Route.useLoaderData();
  console.log(session);

  // if (!sessionData) return;
  // const user = sessionData?.user;
  // const sesh = sessionData?.session;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen relative w-full">
        <Button
          variant={"default"}
          onClick={() => {
            signOut({
              fetchOptions: {
                onSuccess: () => {
                  navigate({
                    to: "/signin",
                    search: {
                      email: user?.email ?? undefined,
                    },
                  });
                },
              },
            });
          }}
        >
          Logout
        </Button>
        {/* <AppSidebar user={user} session={sesh} /> */}
        <SidebarInset>
          {/* <AppHeader email={user.email} token={sesh.token} /> */}

          <Separator className="mb-4" />
          <div className="flex flex-1 flex-col p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
