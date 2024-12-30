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

export function AppHeader({ email, token }: { email: string; token: string }) {
  const matches = useMatches();

  const getRouteLabel = (routeId: string) => {
    const cleanPath = routeId
      .replace(/^\/|^_app-layout\//, "")
      .replace(/^__root__$/, "")
      .replace(/^\/_app-layout$/, "")
      .replace(/^_app-layout\//, "");

    const routeLabels: Record<string, string> = {
      "": "Home",
      vehicles: "Vehicles",
      account: "Account settings",
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
    const breadcrumbs = matches
      .filter((match) => {
        return match.routeId !== "__root__" && match.pathname !== "/";
      })
      .map((match) => ({
        label: getRouteLabel(match.routeId),
        path: match.pathname,
        isLast: false,
      }));

    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].isLast = true;
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4 text-xs">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block text-xs">
              <BreadcrumbLink href="/">Reges</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block text-xs">
              <BreadcrumbLink href="/">Traind</BreadcrumbLink>
            </BreadcrumbItem>

            {/* dynamic ones */}
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                <BreadcrumbSeparator className="hidden md:block" />
                <div className="text-xs">
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.path}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              </React.Fragment>
            ))}

            {/* root === home */}
            {breadcrumbs.length === 0 && (
              <>
                <BreadcrumbSeparator className="hidden md:block text-xs" />
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
