"use client";

import { CalendarClock, CircleX, FilePen, Send, TriangleAlert, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { CountUp } from "@/components/shared/count-up";
import { GlowCard } from "@/components/shared/glow-card";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types/domain";

interface Tile {
  label: string;
  value: number;
  detail: string;
  href: string;
  icon: LucideIcon;
  /** Static class strings only (Tailwind v4 scans source text). */
  chip: string;
  alarm?: boolean;
}

function tilesFor(stats: DashboardStats): Tile[] {
  return [
    {
      label: "Sent today",
      value: stats.today.sent,
      detail: stats.today.sent === 0 ? "Nothing broadcast yet today" : "Broadcast since midnight",
      href: "/history",
      icon: Send,
      chip: "bg-st-sent-tint text-st-sent-fg",
    },
    {
      label: "Scheduled",
      value: stats.alerts.scheduled,
      detail: stats.today.scheduled > 0 ? `${stats.today.scheduled} due today` : "Nothing queued",
      href: "/alerts?status=SCHEDULED",
      icon: CalendarClock,
      chip: "bg-st-scheduled-tint text-st-scheduled-fg",
    },
    {
      label: "Drafts",
      value: stats.alerts.draft,
      detail: stats.alerts.draft > 0 ? "Waiting for review" : "No pending draft",
      href: "/alerts?status=DRAFT",
      icon: FilePen,
      chip: "bg-st-draft-tint text-st-draft-fg",
    },
    {
      label: "Failed",
      value: stats.alerts.failed,
      detail: stats.alerts.failed > 0 ? "Needs attention" : "All clear",
      href: "/alerts?status=FAILED",
      icon: CircleX,
      chip: "bg-st-failed-tint text-st-failed-fg",
      alarm: stats.alerts.failed > 0,
    },
  ];
}

/** Four operational counters; each tile links to the filtered list it summarises. */
export function KpiTiles({ stats }: { stats: DashboardStats }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-4">
      {tilesFor(stats).map((tile, i) => (
        <li key={tile.label}>
          <GlowCard delay={0.1 + i * 0.05} restGlow={false}
            className={cn("h-full rounded-[16px] border-hairline shadow-e1", tile.alarm && "border-st-failed bg-st-failed-tint")}
          >
            <Link
              href={tile.href}
              className="group/tile flex h-full flex-col gap-3 rounded-[16px] p-4 sm:gap-4 sm:p-5 focus-visible:outline-offset-[-2px]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase sm:text-[12px]">
                  {tile.alarm ? <TriangleAlert aria-hidden className="size-3.5 text-st-failed-fg" /> : null}
                  {tile.label}
                </span>
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-full sm:size-9", tile.chip)}>
                  <tile.icon aria-hidden className="size-4" />
                </span>
              </div>
              <span
                className={cn(
                  "tnum font-display text-[32px] leading-none font-bold sm:text-[40px]",
                  tile.alarm ? "text-st-failed-fg" : "text-ink",
                )}
              >
                {/* An alarm must never read 0 while counting up. */}
                {tile.alarm ? tile.value : <CountUp value={tile.value} />}
              </span>
              <span className="mt-auto text-[12px] leading-snug text-ink-3 sm:text-[13px] transition-colors group-hover/tile:text-ink-2">
                {tile.detail} <span aria-hidden>→</span>
              </span>
            </Link>
          </GlowCard>
        </li>
      ))}
    </ul>
  );
}
