"use client";
import React, { useContext } from 'react';
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Database, Headphones, LayoutDashboard, WalletCards, User, Gem } from 'lucide-react';
import { UserDetailContext } from "@/context/UserDetailContext";
import { Button } from '@/components/ui/button';

const MenuOption = [
    { title: "Dashboard", url: '/dashboard', icon: LayoutDashboard },
    { title: "AI Agents", url: '#', icon: Headphones },
    { title: "Data", url: '#', icon: Database },
    { title: "Pricing", url: '#', icon: WalletCards },
    { title: "Profile", url: '#', icon: User },
];

function AppSidebar() {
  const { open } = useSidebar();
  const { userDetail, setUserDetail } = useContext(UserDetailContext); // Ensure this matches context name

  return (
    
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex p-4 gap-2 items-center">
          <Image src={'/Logo.png'} alt="Logo" width={40} height={40} priority className="brightness-0" />
          {open && <h1 className="font-bold text-xl transition-all">Agentify</h1>}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {MenuOption.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size="lg" tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex gap-2 items-center p-2 rounded-md bg-secondary/50">
                    <Gem className="text-primary h-5 w-5 shrink-0" />
                    {open && (
                        <div className="flex flex-col">
                            <p className="text-xs text-muted-foreground">Credits</p>
                            <p className="text-sm font-bold">{userDetail?.token ?? 0}</p>
                        </div>
                    )}
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
        {open && (
          <Button variant="default" className="w-full mt-4 shadow-md bg-black hover:bg-black/90 text-white">
            Upgrade Plan
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;