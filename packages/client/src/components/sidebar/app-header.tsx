import { Separator } from "@/components/ui/separator";
import React from "react";
import { ModeToggle } from "@/components/dark-mode/mode-toggle";
import { Logout } from "./logout";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMatches } from "@tanstack/react-router";

export function AppHeader() {
  const matches = useMatches();
  const getRouteLabel = (routeId: string) => {
    // Extract the last segment of the route ID
    const segment = routeId.split("/").pop() || "";

    const routeLabels: Record<string, string> = {
      __root__: "Home",
      vehicles: "Vehicles",
      settings: "Settings",
      "": "Home", // Handle empty segment
    };

    return routeLabels[segment] || formatPathSegment(segment);
  };

  const formatPathSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getBreadcrumbs = () => {
    const pathSegments = matches
      // Filter out the root route and layout routes
      .filter((match) => {
        const routeId = match.routeId;
        return (
          routeId !== "__root__" &&
          !routeId.includes("/_app") && // Update to match exact layout route
          routeId !== "/_app"
        );
      })
      .map((match) => ({
        label: getRouteLabel(match.routeId),
        path: match.pathname,
        isLast: false,
      }));

    if (pathSegments.length > 0) {
      pathSegments[pathSegments.length - 1].isLast = true;
    }

    return pathSegments;
  };
  const breadcrumbs = getBreadcrumbs();

  // console.log(breadcrumbs);

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.length === 0 ? (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Latch</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Latch</BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}

            {breadcrumbs.length > 0 && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    {index > 0 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                    <BreadcrumbItem>
                      {crumb.isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.path}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto flex items-center gap-4 pr-4">
        <ModeToggle />
        <Separator orientation="vertical" className=" h-4" />

        <Logout />
      </div>
    </header>
  );
}
