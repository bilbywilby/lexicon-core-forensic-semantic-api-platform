import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
};
export function AppLayout({ children, container = true }: AppLayoutProps): JSX.Element {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background selection:bg-primary/10">
        <AppSidebar />
        <SidebarInset className="relative flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border/40 bg-background/80 px-4 backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-9 w-9 glass border-border/50" />
              <div className="h-4 w-[1px] bg-border/60 mx-1 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                <span className="text-primary/70">Sys</span>
                <span className="text-border/40">/</span>
                <span>Node-Alpha</span>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full glass border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </div>
              <ThemeToggle className="static top-auto right-auto h-9 w-9 glass" />
            </div>
          </header>
          <main className={cn("w-full", container ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" : "")}>
            <div className="py-8 md:py-12 lg:py-16">
              {children}
            </div>
          </main>
          <footer className="mt-auto border-t border-border/20 py-6 text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium opacity-50">
            Lexicon Core v2.0.0 Forensic Semantic Runtime
          </footer>
          <Toaster richColors closeButton position="top-right" />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}