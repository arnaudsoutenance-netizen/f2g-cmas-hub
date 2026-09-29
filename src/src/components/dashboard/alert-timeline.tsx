"use client";

import { format, isToday, isYesterday } from "date-fns";
import { enUS } from "date-fns/locale";
import { m } from "framer-motion";
import { ArrowRight, BellRing } from "lucide-react";
import Link from "next/link";
import { AlertStatusPill } from "@/components/alerts/alert-status-pill";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { LinkButton } from "@/components/shared/link-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts } from "@/hooks/use-alerts";
import { classifyMessageId } from "@/lib/cmas/alert-classes";
import { SEVERITY_STYLES } from "@/lib/cmas/severity-styles";
import { dur, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Alert } from "@/types/domain";

function dayLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d", { locale: enUS });
}

function eventDate(alert: Alert): Date {
  return new Date(alert.sent_at ?? alert.scheduled_at ?? alert.created_at);
}

function groupByDay(alerts: Alert[]): Array<{ day: string; items: Alert[] }> {
  const groups: Array<{ day: string; items: Alert[] }> = [];
  for (const alert of alerts) {
    const day = dayLabel(eventDate(alert));
    const last = groups.at(-1);
    if (last?.day === day) last.items.push(alert);
    else groups.push({ day, items: [alert] });
  }
  return groups;
}

/** A vertical time rail: severity leads, because the timeline is about what happened. */
export function AlertTimeline({ limit = 8 }: { limit?: number }) {
  const { data, isPending, isError, error, refetch } = useAlerts({ limit, sort_by: "created_at", sort_order: "desc" });

  if (isError) return <ErrorState title="Unable to load alerts" error={error} onRetry={() => void refetch()} />;

  if (isPending) {
    return (
      <div className="space-y-5" aria-busy="true">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-3 w-10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (data.data.length === 0) {
    return (
      <EmptyState
        icon={BellRing}
        title="No alerts broadcast"
        description="Created and sent alerts will appear here, from newest to oldest."
        action={
          <LinkButton size="md" href="/alerts/new">
            Create alert
          </LinkButton>
        }
      />
    );
  }

  let index = 0;
  return (
    <div className="space-y-4">
      {groupByDay(data.data).map((group) => (
        <div key={group.day}>
          <p className="mb-2 pl-[4.5rem] text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">{group.day}</p>
          <ol className="relative">
            <span aria-hidden className="absolute top-2 bottom-2 left-[3.4rem] w-px bg-hairline-strong" />
            {group.items.map((alert) => {
              const tone = classifyMessageId(alert.message_id)?.tone ?? "test";
              const order = index++;
              return (
                <m.li
                  key={alert.id}
                  initial={order < 8 ? { opacity: 0, y: 4 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: dur.base, ease: ease.standard, delay: order * 0.024 }}
                  className="relative flex gap-4"
                >
                  <time
                    dateTime={eventDate(alert).toISOString()}
                    className="w-12 shrink-0 pt-3 text-right font-mono text-[12px] text-ink-3 tabular-nums"
                  >
                    {format(eventDate(alert), "HH:mm")}
                  </time>
                  <span aria-hidden className={cn("relative z-10 mt-[1.05rem] size-2.5 shrink-0 rounded-full ring-4 ring-surface", SEVERITY_STYLES[tone].edgeBg)} />
                  <Link
                    href={`/alerts/${alert.id}`}
                    className="group -mx-2 flex min-w-0 flex-1 items-start gap-3 rounded-[var(--radius-md)] px-2 py-2.5 hover:bg-surface-hover"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <SeverityBadge messageId={alert.message_id} size="sm" />
                        <AlertStatusPill status={alert.status} scheduledAt={alert.scheduled_at} size="sm" />
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-ink-2">“{alert.content}”</p>
                      <p className="mt-1 text-[12px] text-ink-3">
                        {alert.cells.length} cell{alert.cells.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <ArrowRight aria-hidden className="mt-1 size-4 shrink-0 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </m.li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
