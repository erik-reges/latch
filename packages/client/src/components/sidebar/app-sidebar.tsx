import {
  AudioWaveform,
  Command,
  FileSearch,
  GalleryVerticalEnd,
  Settings,
  TrainFront,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { AppSwitcher } from "./app-switcher";
import { NavUser } from "./nav-user";
import { useMemo } from "react";
import { sessionStore } from "@/lib/store";

const items = [
  { title: "Vehicles", url: "/vehicles", icon: TrainFront },
  {
    title: "Settings",
    url: "/account",
    icon: Settings,
  },
  {
    title: "404",
    url: "/404",
    icon: FileSearch,
  },
];

export function AppSidebar() {
  const { session, user } = sessionStore();

  if (!session || !user) {
    throw Error("no auth");
  }

  const menuItems = useMemo(
    () =>
      items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link preload="viewport" href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )),
    [],
  );

  return (
    <Sidebar>
      <AppSwitcher />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{menuItems}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
