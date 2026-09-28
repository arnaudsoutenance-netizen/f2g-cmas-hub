"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AppRail } from "./app-rail";
import { EnvRibbon } from "./env-ribbon";
import { TopBar } from "./top-bar";

const COLLAPSE_KEY = "cmas-hub-rail-collapsed";

function readCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  // The shell only mounts behind SessionGate, i.e. client-side, so reading storage here is safe.
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleCollapsed = () =>
    setCollapsed((prev) => {
      try {
        window.localStorage.setItem(COLLAPSE_KEY, prev ? "0" : "1");
      } catch {
        // Storage unavailable (private mode): the preference just does not persist.
      }
      return !prev;
    });

  return (
    <div className="flex min-h-dvh bg-canvas">
      <div className="sticky top-0 z-[var(--z-rail)] hidden h-dvh lg:block">
        <AppRail collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-60 border-0 bg-rail p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppRail onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenMenu={() => setMenuOpen(true)} />
        <EnvRibbon />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
