import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AppHeader } from "@/components/sidebar/app-header";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_app")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen relative w-full">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <Separator className="mb-4" />
          <div className="flex flex-1 flex-col p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
