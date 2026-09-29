"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";
import { m } from "framer-motion";
import Link from "next/link";
import { AlertStatusPill } from "@/components/alerts/alert-status-pill";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { cn } from "@/lib/utils";
import type { Alert } from "@/types/domain";

export interface ActivityFeedProps {
  alerts: Alert[];
  maxItems?: number;
  className?: string;
  emptyMessage?: string;
}

export function ActivityFeed({
  alerts,
  maxItems = 5,
  className,
  emptyMessage = "Aucune alerte récente",
}: ActivityFeedProps) {
  const items = alerts.slice(0, maxItems);

  if (items.length === 0) {
    return (
      <div className={cn("py-8 text-center", className)}>
        <p className="text-[13px] text-ink-3">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {items.map((alert, index) => (
        <m.div
          key={alert.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            delay: index * 0.03,
          }}
        >
          <Link
            href={`/alerts/${alert.id}`}
            className="group flex items-center gap-3 rounded-[8px] px-3 py-2.5 transition-colors hover:bg-surface-hover"
          >
            {/* Severity indicator */}
            <SeverityBadge messageId={alert.message_id} size="sm" showId={false} />

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-ink group-hover:text-primary">
                {alert.content.slice(0, 60)}
                {alert.content.length > 60 && "…"}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-3">
                <span className="font-mono">{alert.message_id}</span>
                <span>·</span>
                <span>
                  {formatDistanceToNowStrict(new Date(alert.created_at), {
                    locale: fr,
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            {/* Status */}
            <AlertStatusPill status={alert.status} size="sm" />
          </Link>
        </m.div>
      ))}
    </div>
  );
}

// Version compacte pour sidebar ou widgets
export function ActivityFeedCompact({
  alerts,
  maxItems = 3,
  className,
}: Omit<ActivityFeedProps, "emptyMessage">) {
  const items = alerts.slice(0, maxItems);

  if (items.length === 0) {
    return (
      <p className={cn("py-4 text-center text-[12px] text-ink-3", className)}>
        Aucune activité
      </p>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((alert) => (
        <Link
          key={alert.id}
          href={`/alerts/${alert.id}`}
          className="flex items-center gap-2 text-[12px] hover:text-primary"
        >
          <span
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              alert.status === "SENT" && "bg-st-sent",
              alert.status === "SENDING" && "bg-primary animate-pulse",
              alert.status === "FAILED" && "bg-st-failed",
              alert.status === "SCHEDULED" && "bg-st-scheduled",
              alert.status === "DRAFT" && "bg-ink-3"
            )}
          />
          <span className="min-w-0 flex-1 truncate text-ink-2">
            {alert.content.slice(0, 40)}…
          </span>
          <span className="shrink-0 font-mono text-[10px] text-ink-3">
            {formatDistanceToNowStrict(new Date(alert.created_at), {
              locale: fr,
            })}
          </span>
        </Link>
      ))}
    </div>
  );
}

export default ActivityFeed;
