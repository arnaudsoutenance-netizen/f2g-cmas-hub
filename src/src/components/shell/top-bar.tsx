"use client";

import { ChevronDown, LogOut, Menu, Monitor, Moon, Sun } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
import { useSignOut } from "@/hooks/use-session";
import { useSessionStore } from "@/lib/stores/session-store";
import { NetworkStatus } from "./network-status";
import { pageTitle } from "./nav-items";

const ROLE_LABELS = { ADMIN: "Administrateur", OPERATOR: "Opérateur", VIEWER: "Lecture seule" } as const;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSessionStore((s) => s.user);
  const signOut = useSignOut();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] flex h-14 items-center gap-3 border-b border-hairline bg-canvas/85 px-4 backdrop-blur-md lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Ouvrir la navigation"
        className="-ml-1 grid size-9 place-items-center rounded-[var(--radius-sm)] text-ink-2 hover:bg-surface-hover lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink">
        <span className="hidden font-normal text-ink-3 sm:inline">CMAS Hub › </span>
        {pageTitle(pathname)}
      </p>

      <div className="hidden sm:block">
        <NetworkStatus />
      </div>
      <div className="sm:hidden">
        <NetworkStatus compact />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex h-9 items-center gap-2 rounded-[var(--radius-sm)] pr-1.5 pl-1 text-ink hover:bg-surface-hover"
          aria-label="Menu du compte"
        >
          <span className="grid size-7 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {user ? initials(user.name) : "··"}
          </span>
          <ChevronDown aria-hidden className="hidden size-4 text-ink-3 sm:block" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          {user && (
            <DropdownMenuGroup>
              <DropdownMenuLabel className="py-2">
                <span className="block truncate text-[13px] font-semibold text-ink">{user.name}</span>
                <span className="block truncate text-xs font-normal text-ink-3">{user.email}</span>
                <span className="mt-1 block text-[11px] font-semibold tracking-[0.08em] text-ink-2 uppercase">
                  {ROLE_LABELS[user.role]}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">
              Thème
            </DropdownMenuLabel>
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
