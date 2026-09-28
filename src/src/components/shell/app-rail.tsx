"use client";

import { m } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { F2GWordmark } from "@/components/brand/f2g-mark";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { activeHref, NAV_SECTIONS } from "./nav-items";

const ENV_LABEL = process.env.NEXT_PUBLIC_ENV === "production" ? "PROD" : "FORMATION";

interface AppRailProps {
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
  className?: string;
}

export function AppRail({ collapsed = false, onToggleCollapsed, onNavigate, className }: AppRailProps) {
  const pathname = usePathname();
  const current = activeHref(pathname);

  return (
    <nav
      aria-label="Navigation principale"
      data-collapsed={collapsed}
      className={cn(
        "flex h-full flex-col border-r border-black/20 bg-rail text-rail-ink transition-[width] duration-200 ease-[var(--ease-standard)]",
        collapsed ? "w-16" : "w-60",
        className,
      )}
    >
      <div className={cn("flex h-14 items-center", collapsed ? "justify-center" : "px-4")}>
        <Link href="/" onClick={onNavigate} className="rounded-[var(--radius-sm)]" aria-label="CMAS Hub, tableau de bord">
          <F2GWordmark collapsed={collapsed} />
        </Link>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="mb-1.5 px-5 text-[11px] font-semibold tracking-[0.08em] text-rail-ink-2 uppercase">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.href === current;
                const link = (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative mx-2 flex h-9 items-center gap-3 rounded-[var(--radius-md)] px-3 text-[14px] transition-colors duration-150",
                      collapsed && "justify-center px-0",
                      active ? "bg-rail-item-active text-rail-ink" : "text-rail-ink-2 hover:bg-white/5 hover:text-rail-ink",
                    )}
                  >
                    {active && (
                      <m.span
                        layoutId="rail-active-bar"
                        transition={spring.layout}
                        className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-brand-orange"
                      />
                    )}
                    <item.icon aria-hidden className="size-[18px] shrink-0 stroke-[1.75]" />
                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.shortcut && (
                      <kbd className="font-mono text-[11px] text-rail-ink-2">{item.shortcut}</kbd>
                    )}
                  </Link>
                );
                return (
                  <li key={item.href}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger render={link} />
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className={cn("border-t border-white/10 py-3", collapsed ? "px-2" : "px-4")}>
        {!collapsed && (
          <p className="mb-2 text-[11px] leading-4 text-rail-ink-2">
            Env : <span className="font-mono font-medium text-rail-ink">{ENV_LABEL}</span>
            <span className="block">F2G Laboratory</span>
          </p>
        )}
        {onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Déplier la navigation" : "Replier la navigation"}
            className="flex h-8 w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] text-[12px] text-rail-ink-2 hover:bg-white/5 hover:text-rail-ink"
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            {!collapsed && "Replier"}
          </button>
        )}
      </div>
    </nav>
  );
}
