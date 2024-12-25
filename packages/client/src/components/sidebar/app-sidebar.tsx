import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Home,
  Settings,
  Train,
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
  {
    title: "Settings",
    url: "/account",
    icon: Settings,
  },
];

const apps = [
  {
    name: "Traind",
    logo: GalleryVerticalEnd,
    plan: "Railway operations",
  },
  {
    name: "EAM",
    logo: AudioWaveform,
    plan: "Enterprise asset management",
  },
  {
    name: "Commando",
    logo: Command,
    plan: "Some other stuff",
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
      <AppSwitcher teams={apps} />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={"/"}>
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={"/vehicles"}>
                    <Home />
                    <span>Vehicles</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {menuItems}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} token={session.token} />
      </SidebarFooter>
    </Sidebar>
  );
}
