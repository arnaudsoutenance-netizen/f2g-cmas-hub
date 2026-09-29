"use client";

import { CalendarClock, Check, CircleX, FilePen, Inbox, Send, TriangleAlert, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { CountUp } from "@/components/shared/count-up";
import { GlowCard } from "@/components/shared/glow-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AlertStatus, DashboardStats } from "@/types/domain";

interface Counter {
  status: AlertStatus | undefined;
  label: string;
  value: number;
  icon: LucideIcon;
  /** Static class strings only (Tailwind v4 scans source text). */
  chip: string;
  alarm?: boolean;
}

function countersFor(stats: DashboardStats["alerts"]): Counter[] {
  return [
    { status: undefined, label: "All", value: stats.total, icon: Inbox, chip: "bg-surface-sunken text-ink-2" },
    { status: "DRAFT", label: "Drafts", value: stats.draft, icon: FilePen, chip: "bg-st-draft-tint text-st-draft-fg" },
    { status: "SCHEDULED", label: "Scheduled", value: stats.scheduled, icon: CalendarClock, chip: "bg-st-scheduled-tint text-st-scheduled-fg" },
    { status: "SENT", label: "Sent", value: stats.sent, icon: Send, chip: "bg-st-sent-tint text-st-sent-fg" },
    {
      status: "FAILED",
      label: "Failed",
      value: stats.failed,
      icon: CircleX,
      chip: "bg-st-failed-tint text-st-failed-fg",
      alarm: stats.failed > 0,
    },
  ];
}

/**
 * Status counters that double as filters. Each tile is a link to the filtered
 * list, so the filter survives reloads and can be shared.
 */
export function StatusCounters({
  stats,
  pending,
  active,
  hrefFor,
}: {
  stats: DashboardStats["alerts"] | undefined;
  pending: boolean;
  active: AlertStatus | undefined;
  hrefFor: (status: AlertStatus | undefined) => string;
}) {
  if (pending) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5" aria-busy>
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className={cn("h-[104px] rounded-[16px]", i === 0 && "col-span-2 sm:col-span-1")} />
        ))}
      </div>
    );
  }
  if (!stats) return null;

  return (
    <nav aria-label="Filter by status">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {countersFor(stats).map((c, i) => {
          const selected = c.status === active;
          return (
            <li key={c.label} className={cn(i === 0 && "col-span-2 sm:col-span-1")}>
              <GlowCard
                delay={0.05 + i * 0.04}
                restGlow={false}
                className={cn(
                  "h-full rounded-[16px] border-hairline shadow-e1",
                  c.alarm && !selected && "border-st-failed bg-st-failed-tint",
                  selected && "border-primary ring-1 ring-primary",
                )}
              >
                <Link
                  href={hrefFor(c.status)}
                  scroll={false}
                  aria-current={selected ? "true" : undefined}
                  className="group/tile flex h-full flex-col gap-3 rounded-[16px] p-4 focus-visible:outline-offset-[-2px]"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase sm:text-[12px]">
                      {c.alarm ? <TriangleAlert aria-hidden className="size-3.5 text-st-failed-fg" /> : null}
                      {c.label}
                    </span>
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", selected ? "bg-primary text-primary-foreground" : c.chip)}>
                      {selected ? <Check aria-hidden className="size-4" /> : <c.icon aria-hidden className="size-4" />}
                    </span>
                  </span>
                  <span className="flex items-baseline justify-between gap-2">
                    <span
                      className={cn(
                        "tnum font-display text-[28px] leading-none font-bold sm:text-[32px]",
                        c.alarm ? "text-st-failed-fg" : "text-ink",
                      )}
                    >
                      {/* An alarm must never read 0 while counting up. */}
                      {c.alarm ? c.value : <CountUp value={c.value} />}
                    </span>
                    <span className={cn("text-[12px] text-ink-3 transition-colors group-hover/tile:text-ink-2", selected && "font-medium text-ink-2")}>
                      {selected ? "Showing" : "Show"}
                      <span className="sr-only"> {c.label.toLowerCase()} alerts</span>
                    </span>
                  </span>
                </Link>
              </GlowCard>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
