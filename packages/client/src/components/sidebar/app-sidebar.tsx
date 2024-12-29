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
import { type Session, type User } from "@/lib/auth";

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

interface AppSidebarProps {
  user: User;
  session: Session;
}

export function AppSidebar({ user, session }: AppSidebarProps) {
  const menuItems = useMemo(
    () =>
      items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link href={item.url}>
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
        <NavUser user={user} token={session.token} />
      </SidebarFooter>
    </Sidebar>
  );
}
