import { createFileRoute } from "@tanstack/react-router";
import { SidebarProto } from "@/components/sidebar/proto/sidebar-proto";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-dropdown-menu";

export const Route = createFileRoute("/proto")({
  component: RouteComponent,
});

function RouteComponent() {
  const { api } = Route.useRouteContext();
  const res = api.vehicles.post({
    status: "active",
    maxSpeed: 1234,
    yearManufactured: 2025,
    lastMaintenanceDate: "2024-11-20",
    nextMaintenanceDate: "2024-12-31",
    name: "1234",
    manufacturer: "1234",
    model: "1234",
    length: "1234",
    maxWeight: "1234",
  });

  return (
    <div className="min-h-screen">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "350px",
          } as React.CSSProperties
        }
      >
        <SidebarProto />
        <SidebarInset>
          <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Inbox</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <div
                key={index}
                className="aspect-video h-12 w-full rounded-lg bg-muted/50"
              />
            ))}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
