import React from "react";
import { Activity, Database, ShieldCheck, Search, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const navItems = [
    { name: "Command Dashboard", path: "/", icon: Activity },
    { name: "Memory Bank", path: "/memories", icon: Database },
    { name: "Checkpoint Registry", path: "/checkpoints", icon: ShieldCheck },
    { name: "Query Playground", path: "/query", icon: Search },
  ];
  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">LEXICON CORE</span>
            <span className="text-[10px] uppercase text-muted-foreground tracking-widest">Forensic Semantic API</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-2xs font-semibold text-muted-foreground uppercase tracking-wider">
            Operations
          </SidebarGroupLabel>
          <SidebarMenu className="px-2">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.path}
                  className="transition-all duration-200"
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-[10px] font-medium text-muted-foreground uppercase">System Node</p>
          <p className="font-mono text-xs text-foreground mt-1">EDGE-CORE-ALPHA-01</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}