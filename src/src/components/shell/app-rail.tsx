"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCells } from "@/hooks/use-network";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { activeHref, NAV_SECTIONS } from "./nav-items";
import { cellState } from "@/lib/cmas/cell-state";

const ENV_LABEL = process.env.NEXT_PUBLIC_ENV === "production" ? "Production" : "Training";

interface AppRailProps {
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
}

/** Berry-style network card at the bottom of the sidebar. Stale data is never shown as healthy. */
function NetworkCard() {
  const { data: cells, isError } = useCells();
  const total = cells?.length ?? 0;
  const active = cells?.filter((c) => cellState(c.status) === "online").length ?? 0;
  const pct = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <Link
      href="/cells"
      className="relative block overflow-hidden rounded-[12px] bg-navy-tint p-4 transition-colors hover:bg-navy-tint/80"
    >
      <span aria-hidden className="absolute -top-8 -right-8 size-20 rounded-full bg-brand-orange/25" />
      <p className="relative text-[14px] font-semibold text-primary">Broadcast Network</p>
      <p className="relative mt-0.5 text-[12px] text-ink-2">
        {isError || !cells ? "Connection unknown" : `${active}/${total} active cells`}
      </p>
      <div className="relative mt-3 flex items-center justify-between text-[12px] font-medium text-ink-2">
        <span>Availability</span>
        <span className="tabular-nums">{isError || !cells ? "—" : `${pct} %`}</span>
      </div>
      <div className="relative mt-1.5 h-1.5 overflow-hidden rounded-full bg-shell">
        <span
          className={cn("block h-full rounded-full", isError ? "bg-ink-3" : "bg-primary")}
          style={{ width: `${isError ? 0 : pct}%` }}
        />
      </div>
    </Link>
  );
}

export function AppRail({ collapsed = false, onNavigate, className }: AppRailProps) {
  const pathname = usePathname();
  const current = activeHref(pathname);

  return (
    <nav
      aria-label="Main navigation"
      data-collapsed={collapsed}
      className={cn(
        "flex h-full flex-col bg-shell text-ink transition-[width] duration-200 ease-[var(--ease-standard)]",
        collapsed ? "w-[76px]" : "w-[260px]",
        className,
      )}
    >
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {NAV_SECTIONS.map((section, i) => (
          <div key={section.title} className={cn("py-3", i > 0 && "border-t border-hairline")}>
            {!collapsed && <p className="mb-2 px-2 text-[14px] font-semibold text-ink">{section.title}</p>}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = item.href === current;
                const link = (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex h-11 items-center gap-3.5 rounded-[12px] px-4 text-[14px] transition-colors duration-150",
                      collapsed && "justify-center px-0",
                      active ? "font-medium text-primary" : "text-ink-2 hover:bg-navy-tint/60 hover:text-primary",
                    )}
                  >
                    {active && (
                      <m.span layoutId="rail-active" transition={spring.layout} className="absolute inset-0 rounded-[12px] bg-navy-tint" />
                    )}
                    <item.icon aria-hidden className="relative size-5 shrink-0 stroke-[1.75]" />
                    {!collapsed && <span className="relative flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.shortcut && (
                      <kbd className="relative font-mono text-[11px] text-ink-3">{item.shortcut}</kbd>
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

      {!collapsed && (
        <div className="space-y-3 px-4 pb-5">
          <NetworkCard />
          <p className="text-center">
            <span className="inline-block rounded-full bg-surface-sunken px-3 py-1 font-mono text-[11px] text-ink-2">
              {ENV_LABEL} · F2G Laboratory
            </span>
          </p>
        </div>
      )}
    </nav>
  );
}
