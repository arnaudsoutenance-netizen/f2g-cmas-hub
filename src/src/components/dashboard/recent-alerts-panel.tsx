"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { enUS } from "date-fns/locale";
import { m } from "framer-motion";
import { Inbox } from "lucide-react";
import Link from "next/link";
import { AlertStatusPill, STATUS_STYLES } from "@/components/alerts/alert-status-pill";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { EmptyState } from "@/components/shared/states";
import { LinkButton } from "@/components/shared/link-button";
import { Skeleton } from "@/components/ui/skeleton";
import { dur, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Alert } from "@/types/domain";
import { Panel } from "./panel";

/** The one timestamp that matters for the row: sent, else scheduled, else created. */
function when(alert: Alert): string {
  return alert.sent_at ?? alert.scheduled_at ?? alert.created_at;
}

/** Latest alerts as a vertical timeline: class badge, message, status, age. */
export function RecentAlertsPanel({ alerts, pending }: { alerts: readonly Alert[]; pending: boolean }) {
  return (
    <Panel
      title="Recent alerts"
      description="Latest alerts, all statuses"
      action={
        <LinkButton href="/alerts" variant="ghost" size="sm">
          View all
        </LinkButton>
      }
    >
      {pending ? (
        <ul className="space-y-4 p-5" aria-busy>
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="flex gap-4">
              <Skeleton className="mt-1 size-2.5 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </li>
          ))}
        </ul>
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No alerts yet"
          description="Alerts you compose and broadcast will appear here."
          action={<LinkButton href="/alerts/new">Compose the first alert</LinkButton>}
          className="m-5"
        />
      ) : (
        <ol className="relative px-5 py-2">
          <span aria-hidden className="absolute top-6 bottom-6 left-[25px] w-px bg-hairline-strong" />
          {alerts.map((alert, i) => (
            <m.li
              key={alert.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: dur.moderate, ease: ease.standard }}
            >
              <Link
                href={`/alerts/${alert.id}`}
                className="relative -mx-2 flex gap-4 rounded-[10px] px-2 py-3 transition-colors hover:bg-surface-hover focus-visible:outline-offset-[-2px]"
              >
                <span aria-hidden className={cn("relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full", STATUS_STYLES[alert.status].dot)} />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="grid grid-cols-[1fr_auto] items-start gap-x-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <SeverityBadge messageId={alert.message_id} size="sm" />
                      <AlertStatusPill status={alert.status} size="sm" scheduledAt={alert.scheduled_at} />
                    </div>
                    <time dateTime={when(alert)} className="pt-0.5 text-[12px] whitespace-nowrap text-ink-3">
                      {formatDistanceToNowStrict(new Date(when(alert)), { addSuffix: true, locale: enUS })}
                    </time>
                  </div>
                  <p className="line-clamp-2 text-[14px] leading-snug text-ink-2">{alert.content}</p>
                </div>
              </Link>
            </m.li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
