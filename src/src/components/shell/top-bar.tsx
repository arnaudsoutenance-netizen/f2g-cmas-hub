"use client";

import { Bell, LogOut, Menu, Monitor, Moon, Search, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { F2GMark } from "@/components/brand/f2g-mark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAlerts } from "@/hooks/use-alerts";
import { useSignOut } from "@/hooks/use-session";
import { useSessionStore } from "@/lib/stores/session-store";
import { cn } from "@/lib/utils";
import { NetworkStatus } from "./network-status";

const ROLE_LABELS = { ADMIN: "Administrateur", OPERATOR: "Opérateur", VIEWER: "Lecture seule" } as const;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Tinted square icon button, the Berry header idiom. */
const tintButton = "grid size-[34px] place-items-center rounded-[8px] transition-colors duration-150";

function ActiveAlertsBell() {
  const { data } = useAlerts({ status: "SENDING", limit: 5 });
  const count = data?.pagination.total ?? 0;
  return (
    <Link
      href="/alerts?status=SENDING"
      aria-label={count > 0 ? `${count} alert(s) currently broadcasting` : "No active alerts"}
      className={cn(tintButton, "relative bg-orange-tint text-orange-fg hover:bg-orange-deep hover:text-white")}
    >
      <Bell aria-hidden className="size-[18px]" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 grid min-w-4 place-items-center rounded-full bg-st-failed px-1 text-[10px] leading-4 font-semibold text-white tabular-nums">
          {count}
        </span>
      )}
    </Link>
  );
}

export function TopBar({ onToggleMenu, onOpenMobileMenu }: { onToggleMenu: () => void; onOpenMobileMenu: () => void }) {
  const router = useRouter();
  const user = useSessionStore((s) => s.user);
  const signOut = useSignOut();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] flex h-[88px] items-center gap-4 bg-shell px-4 lg:px-6">
      <div className="flex w-auto items-center gap-6 lg:w-[228px]">
        <Link href="/" className="hidden items-center gap-2.5 lg:flex" aria-label="CMAS Hub, dashboard">
          <F2GMark />
          <span className="font-display text-[20px] leading-none font-bold text-ink">CMAS Hub</span>
        </Link>
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label="Replier ou déplier la navigation"
          className={cn(tintButton, "hidden bg-navy-tint text-primary hover:bg-primary hover:text-primary-foreground lg:grid")}
        >
          <Menu aria-hidden className="size-[18px]" />
        </button>
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Ouvrir la navigation"
          className={cn(tintButton, "bg-navy-tint text-primary lg:hidden")}
        >
          <Menu aria-hidden className="size-[18px]" />
        </button>
      </div>

      <label className="relative hidden w-[434px] max-w-full md:block">
        <span className="sr-only">Search</span>
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-3" />
        <input
          type="search"
          placeholder="Search alerts, cells, templates..."
          className="h-12 w-full rounded-[8px] border border-hairline-strong bg-shell pr-4 pl-11 text-[14px] text-ink placeholder:text-ink-3 focus-visible:border-primary focus-visible:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              router.push(`/alerts?q=${encodeURIComponent(e.currentTarget.value.trim())}`);
            }
          }}
        />
      </label>

      <div className="flex-1" />

      <div className="hidden xl:block">
        <NetworkStatus />
      </div>

      <ActiveAlertsBell />

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Menu du compte"
          className="flex h-12 items-center gap-2 rounded-[27px] bg-navy-tint py-1 pr-3 pl-1.5 transition-colors hover:bg-primary [&:hover_svg]:text-primary-foreground"
        >
          <span className="grid size-[34px] place-items-center rounded-full bg-primary text-[12px] font-semibold text-primary-foreground">
            {user ? initials(user.name) : "··"}
          </span>
          <Settings aria-hidden className="size-5 text-primary" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 rounded-[12px] p-2">
          {user && (
            <DropdownMenuGroup>
              <DropdownMenuLabel className="py-2">
                <span className="block truncate text-[14px] font-semibold text-ink">Bonjour, {user.name}</span>
                <span className="block truncate text-[12px] font-normal text-ink-3">{user.email}</span>
                <span className="mt-1 inline-block rounded-full bg-navy-tint px-2 py-0.5 text-[11px] font-medium text-primary">
                  {ROLE_LABELS[user.role]}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">Thème</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={(value: string) => setTheme(value)}>
              <DropdownMenuRadioItem value="system">
                <Monitor className="size-4" /> Système
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="light">
                <Sun className="size-4" /> Clair
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon className="size-4" /> Sombre
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/settings" />}>
            <Settings className="size-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              signOut();
              router.replace("/login");
            }}
          >
            <LogOut className="size-4" /> Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
