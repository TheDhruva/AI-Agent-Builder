"use client";
import React, { useContext, useEffect, useState } from 'react'; // Added hooks
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
import { 
  Database, 
  Headphones, 
  LayoutDashboard, 
  WalletCards, 
  User, 
  Gem, 
  Loader2 
} from 'lucide-react';
import { UserDetailContext } from "@/context/UserDetailContext";
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useConvex, useQuery } from 'convex/react'; // Added Convex
import { api } from '@/convex/_generated/api';

const MENU_OPTIONS = [
    { title: "Dashboard", url: '/dashboard', icon: LayoutDashboard },
    { title: "AI Agents", url: '/dashboard/my-agents', icon: Headphones },
    { title: "Data", url: '/dashboard/data', icon: Database },
    { title: "Pricing", url: '/dashboard/pricing', icon: WalletCards },
    { title: "Profile", url: '/dashboard/profile', icon: User },
];

function AppSidebar() {
  const { open } = useSidebar();
  const path = usePathname();
  const convex = useConvex();
  
  // Context retrieval
  const context = useContext(UserDetailContext);
  const userDetail = context?.userDetail;

  // Determine if user is on a paid plan
  const isPaidUser = userDetail?.subscription === true;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex p-4 gap-2 items-center">
          <Image 
            src={'/Logo.png'} 
            alt="Logo" 
            width={40} 
            height={40} 
            priority 
            className="brightness-0 shrink-0" 
          />
          {open && (
            <h1 className="font-bold text-xl whitespace-nowrap overflow-hidden">
              Agentify
            </h1>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {MENU_OPTIONS.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  size="lg" 
                  tooltip={item.title}
                  isActive={path === item.url}
                >
                  <Link href={item.url}>
                    <item.icon className={path === item.url ? 'text-primary' : ''} />
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
                <div className="flex gap-2 items-center p-2 rounded-md bg-slate-100 border border-slate-200">
                    <Gem className="text-blue-600 h-5 w-5 shrink-0" />
                    {open && (
                        <div className="flex flex-col whitespace-nowrap overflow-hidden">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                              Credits Remaining
                            </p>
                            <p className="text-sm font-bold text-slate-900">
                              {userDetail?.token ?? 0}
                            </p>
                        </div>
                    )}
                </div>
            </SidebarMenuItem>
        </SidebarMenu>

        {open && (
          <div className="mt-4">
            {!isPaidUser ? (
              <Link href="/dashboard/pricing" className="w-full">
                <Button variant="default" className="w-full shadow-md bg-black hover:bg-slate-800 text-white transition-all">
                  Upgrade Plan
                </Button>
              </Link>
            ) : (
              <div className="p-2 border border-emerald-200 bg-emerald-50 rounded-md">
                <h2 className="text-[11px] font-bold text-emerald-700 text-center uppercase">
                  Unlimited Pro Plan
                </h2>
              </div>
            )}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;