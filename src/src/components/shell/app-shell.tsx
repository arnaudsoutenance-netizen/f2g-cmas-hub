"use client";

import { useState } from "react";
import { F2GMark } from "@/components/brand/f2g-mark";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AppRail } from "./app-rail";
// EnvRibbon removed - not needed in production
import { TopBar } from "./top-bar";

const COLLAPSE_KEY = "cmas-hub-rail-collapsed-v2";

function readCollapsed(): boolean {
  if (typeof window === "undefined") return true; // Default collapsed on SSR
  try {
    const stored = window.localStorage.getItem(COLLAPSE_KEY);
    // If no preference saved, default to collapsed (true)
    if (stored === null) return true;
    return stored === "1";
  } catch {
    return true; // Default collapsed if storage unavailable
  }
}

/** Berry layout: white shell (header + sidebar) around a rounded grey content well. */
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
    <div className="min-h-dvh bg-shell">
      <TopBar onToggleMenu={toggleCollapsed} onOpenMobileMenu={() => setMenuOpen(true)} />

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[280px] border-0 bg-shell p-0" showCloseButton={false}>
          <SheetTitle className="flex items-center gap-2.5 px-6 pt-6 pb-2">
            <F2GMark />
            <span className="font-display text-[20px] font-bold text-ink">CMAS Hub</span>
          </SheetTitle>
          <AppRail onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex">
        <aside className="sticky top-[88px] hidden h-[calc(100dvh-88px)] shrink-0 lg:block">
          <AppRail collapsed={collapsed} />
        </aside>
        <div className="min-w-0 flex-1 px-0 lg:pr-5">
          <div className="min-h-[calc(100dvh-88px)] overflow-hidden bg-well lg:rounded-t-[12px]">
            <main className="mx-auto w-full max-w-[1600px] p-4 lg:p-5">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
