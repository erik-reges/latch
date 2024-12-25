import {
  AudioWaveform,
  Calendar,
  Command,
  GalleryVerticalEnd,
  Home,
  Search,
  Settings,
  Train,
  Car,
  Truck,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { AppSwitcher } from "./app-switcher";
import { NavUser } from "./nav-user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { type Session, type User } from "@/lib/auth";

const vehicleItems = [
  {
    title: "Trains",
    url: "/vehicles/trains",
    icon: Train,
  },
];

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
  const [isOpen, setIsOpen] = useState(true);

  const vehicleSubMenu = useMemo(
    () => (
      <SidebarMenuSub>
        {vehicleItems.map((item) => (
          <SidebarMenuSubItem className="mx-0" key={item.title}>
            <Link
              href={item.url}
              className="flex items-center gap-2 w-full px-2 py-2
              text-sm transition-colors duration-200
              hover:bg-accent hover:text-accent-foreground
              rounded-md"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    ),
    [],
  );

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

  const chevronAnimation = useMemo(
    () => ({
      rotate: isOpen ? 90 : 0,
    }),
    [isOpen],
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

              <Collapsible open={isOpen} onOpenChange={setIsOpen} className="">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Train />
                      <span>Vehicles</span>
                      <motion.div
                        className="ml-auto"
                        animate={chevronAnimation}
                        transition={{ duration: 0.1, ease: "easeInOut" }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.0 }}
                    >
                      {vehicleSubMenu}
                    </motion.div>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

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
