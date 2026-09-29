"use client";

import { Ban, CircleCheck, CircleX, Gauge, type LucideIcon } from "lucide-react";
import { CountUp } from "@/components/shared/count-up";
import { GlowCard } from "@/components/shared/glow-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { successRate, type FinishedStatus } from "./history-utils";

interface Stat {
  label: string;
  value: number | null;
  suffix?: string;
  detail: string;
  icon: LucideIcon;
  /** Static class strings only (Tailwind v4 scans source text). */
  chip: string;
}

function statsFor(totals: Record<FinishedStatus, number>): Stat[] {
  const rate = successRate(totals.SENT, totals.FAILED);
  const attempted = totals.SENT + totals.FAILED;
  return [
    {
      label: "Sent",
      value: totals.SENT,
      detail: "Delivered to the cell broadcast centre",
      icon: CircleCheck,
      chip: "bg-st-sent-tint text-st-sent-fg",
    },
    {
      label: "Failed",
      value: totals.FAILED,
      detail: totals.FAILED > 0 ? "Broadcast attempts that did not go out" : "No failed broadcast",
      icon: CircleX,
      chip: "bg-st-failed-tint text-st-failed-fg",
    },
    {
      label: "Cancelled",
      value: totals.CANCELLED,
      detail: "Withdrawn before broadcast",
      icon: Ban,
      chip: "bg-surface-sunken text-ink-2",
    },
    {
      label: "Success rate",
      value: rate === null ? null : Math.round(rate * 10) / 10,
      suffix: "%",
      detail: attempted === 0 ? "No broadcast attempted yet" : `Sent out of ${attempted} attempted`,
      icon: Gauge,
      chip: "bg-surface-sunken text-ink-2",
    },
  ];
}

/** Log-wide counters (server totals), independent of the filters below. */
export function HistoryStats({ totals }: { totals: Record<FinishedStatus, number> }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-4">
      {statsFor(totals).map((stat, i) => (
        <li key={stat.label}>
          <GlowCard delay={0.05 + i * 0.05} restGlow={false} className="h-full rounded-[16px] border-hairline shadow-e1">
            <div className="flex h-full flex-col gap-3 p-4 sm:gap-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase sm:text-[12px]">{stat.label}</p>
                <span aria-hidden className={cn("grid size-8 shrink-0 place-items-center rounded-full sm:size-9", stat.chip)}>
                  <stat.icon className="size-4" />
                </span>
              </div>
              <p className="tnum font-display text-[32px] leading-none font-bold text-ink sm:text-[40px]">
                {stat.value === null ? (
                  <>
                    <span aria-hidden>—</span>
                    <span className="sr-only">Not available</span>
                  </>
                ) : (
                  <>
                    <CountUp value={stat.value} />
                    {stat.suffix ? <span className="ml-0.5 text-[20px] text-ink-3 sm:text-[24px]">{stat.suffix}</span> : null}
                  </>
                )}
              </p>
              <p className="mt-auto text-[12px] leading-snug text-ink-3 sm:text-[13px]">{stat.detail}</p>
            </div>
          </GlowCard>
        </li>
      ))}
    </ul>
  );
}

export function HistoryStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-4" aria-hidden>
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-[134px] rounded-[16px] sm:h-[166px]" />
      ))}
    </div>
  );
}
