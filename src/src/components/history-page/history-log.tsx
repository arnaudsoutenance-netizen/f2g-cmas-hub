"use client";

import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { RadioTower } from "lucide-react";
import Link from "next/link";
import { AlertStatusPill, STATUS_STYLES } from "@/components/alerts/alert-status-pill";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Alert } from "@/types/domain";
import { historyTime, type DayGroup } from "./history-utils";

function LogRow({ alert }: { alert: Alert }) {
  const at = new Date(historyTime(alert));
  const cells = alert.cells.length;
  return (
    <li>
      <Link
        href={`/alerts/${alert.id}`}
        className="relative -mx-2 grid grid-cols-[44px_10px_minmax(0,1fr)] gap-x-3 rounded-[10px] px-2 py-3 transition-colors hover:bg-surface-hover focus-visible:outline-offset-[-2px] motion-reduce:transition-none sm:grid-cols-[52px_10px_minmax(0,1fr)] sm:gap-x-4"
      >
        <time
          dateTime={at.toISOString()}
          title={format(at, "PPpp", { locale: enUS })}
          className="tnum pt-0.5 text-right font-mono text-[12px] text-ink-2 sm:text-[13px]"
        >
          {format(at, "HH:mm")}
        </time>
        <span aria-hidden className={cn("relative z-10 mt-1.5 size-2.5 rounded-full", STATUS_STYLES[alert.status].dot)} />
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge messageId={alert.message_id} size="sm" />
            <AlertStatusPill status={alert.status} size="sm" />
          </div>
          <p className="line-clamp-2 text-[14px] leading-snug text-ink-2">{alert.content}</p>
          {cells > 0 ? (
            <p className="flex items-center gap-1 text-[12px] text-ink-3">
              <RadioTower aria-hidden className="size-3" />
              {cells} cell{cells === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}

/** Day-grouped vertical timeline; the rail runs down each day's rows. */
export function HistoryLog({ groups }: { groups: readonly DayGroup[] }) {
  return (
    <div className="divide-y divide-hairline">
      {groups.map((group) => {
        const id = `history-day-${group.key}`;
        return (
          <section key={group.key} aria-labelledby={id} className="px-4 py-3 sm:px-5">
            <h3 id={id} className="flex items-baseline justify-between gap-3 py-1.5">
              <time dateTime={group.key} className="font-display text-[15px] font-semibold text-ink">
                {group.label}
              </time>
              <span className="text-[12px] font-normal text-ink-3">
                {group.alerts.length} alert{group.alerts.length === 1 ? "" : "s"}
              </span>
            </h3>
            <div className="relative">
              {/* Rail under the dots: 44px time column + 12px gap + half the 10px dot (sm: 52px + 16px). */}
              <span aria-hidden className="absolute top-5 bottom-5 left-[60px] w-px bg-hairline-strong sm:left-[72px]" />
              <ol>
                {group.alerts.map((alert) => (
                  <LogRow key={alert.id} alert={alert} />
                ))}
              </ol>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function HistoryLogSkeleton() {
  return (
    <div className="space-y-5 p-5" aria-hidden>
      <Skeleton className="h-5 w-28" />
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-4 w-11" />
          <Skeleton className="mt-0.5 size-2.5 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
