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
import { useMatches, useLocation } from "@tanstack/react-router";

export function AppHeader({ email, token }: { email: string; token: string }) {
  const matches = useMatches();
  const location = useLocation();

  const getRouteLabel = (routeId: string) => {
    // Remove leading slashes and _app prefix
    const cleanPath = routeId
      .replace(/^\/|^_app\//, "") // Remove leading slash and _app/
      .replace(/^__root__$/, "") // Remove root route identifier
      .replace(/^\/_app$/, "") // Remove layout route identifier
      .replace(/^_app\//, ""); // Remove any remaining _app/ prefix

    const routeLabels: Record<string, string> = {
      "": "Home",
      vehicles: "Vehicles",
      account: "Account Settings",
    };

    return routeLabels[cleanPath] || formatPathSegment(cleanPath);
  };

  const formatPathSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getBreadcrumbs = () => {
    // Filter and transform matches into breadcrumbs
    const breadcrumbs = matches
      .filter((match) => {
        // Keep only relevant routes (exclude root and layout-only routes)
        return match.routeId !== "__root__" && match.pathname !== "/";
      })
      .map((match) => ({
        label: getRouteLabel(match.routeId),
        path: match.pathname,
        isLast: false,
      }));

    // Mark the last item
    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].isLast = true;
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {/* Always show Latch as first item */}
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">Latch</BreadcrumbLink>
            </BreadcrumbItem>

            {/* Show separators and additional breadcrumbs */}
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                <BreadcrumbSeparator className="hidden md:block" />
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

            {/* If we're at root and no other breadcrumbs, show Home */}
            {breadcrumbs.length === 0 && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto flex items-center gap-4 pr-4">
        <ModeToggle />
        <Separator orientation="vertical" className=" h-4" />
        <Logout email={email} token={token} />
      </div>
    </header>
  );
}
