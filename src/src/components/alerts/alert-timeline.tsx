"use client";

import { m, LazyMotion, domAnimation } from "framer-motion";
import { 
  FileEdit, 
  Clock, 
  Send, 
  CheckCircle, 
  XCircle, 
  Ban,
  type LucideIcon 
} from "lucide-react";
import { cn } from "cn";
import type { AlertStatus } from "@/types/domain";

interface TimelineEvent {
  status: AlertStatus;
  timestamp: string | Date | null;
  label: string;
  description?: string;
}

interface AlertTimelineProps {
  events: TimelineEvent[];
  currentStatus: AlertStatus;
  className?: string;
}

const statusConfig: Record<AlertStatus, { icon: LucideIcon; color: string; bgColor: string }> = {
  DRAFT: { icon: FileEdit, color: "text-ink-3", bgColor: "bg-surface-sunken" },
  SCHEDULED: { icon: Clock, color: "text-st-scheduled-fg", bgColor: "bg-st-scheduled" },
  SENDING: { icon: Send, color: "text-primary", bgColor: "bg-primary-tint" },
  SENT: { icon: CheckCircle, color: "text-st-sent-fg", bgColor: "bg-st-sent" },
  FAILED: { icon: XCircle, color: "text-st-failed-fg", bgColor: "bg-st-failed" },
  CANCELLED: { icon: Ban, color: "text-ink-3", bgColor: "bg-surface-sunken" },
};

export function AlertTimeline({ events, currentStatus, className }: AlertTimelineProps) {
  return (
    <LazyMotion features={domAnimation}>
      <div className={cn("relative pl-8", className)}>
        {/* Vertical line */}
        <div className="absolute left-3 top-3 bottom-3 w-px bg-hairline" />

        {events.map((event, i) => {
          const config = statusConfig[event.status];
          const Icon = config.icon;
          const isActive = event.status === currentStatus;
          const isPast = events.findIndex(e => e.status === currentStatus) > i;
          const isFuture = events.findIndex(e => e.status === currentStatus) < i;

          return (
            <m.div
              key={event.status}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="relative mb-4 last:mb-0"
            >
              {/* Status dot */}
              <div
                className={cn(
                  "absolute -left-5 top-1 flex size-6 items-center justify-center rounded-full",
                  "ring-2 ring-shell transition-all",
                  isActive && "ring-4",
                  isPast ? config.bgColor : isFuture ? "bg-surface-sunken" : config.bgColor
                )}
              >
                <Icon
                  className={cn(
                    "size-3",
                    isPast ? config.color : isFuture ? "text-ink-disabled" : config.color
                  )}
                />
              </div>

              {/* Content */}
              <div
                className={cn(
                  "ml-4 rounded-lg border p-3 transition-all",
                  isActive
                    ? "border-primary/30 bg-primary-tint"
                    : "border-hairline bg-shell"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={cn(
                      "text-[13px] font-medium",
                      isFuture ? "text-ink-3" : "text-ink"
                    )}
                  >
                    {event.label}
                  </h4>
                  {event.timestamp && (
                    <span className="text-[11px] font-mono text-ink-3">
                      {typeof event.timestamp === "string"
                        ? event.timestamp
                        : event.timestamp.toLocaleString("fr-FR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                    </span>
                  )}
                </div>
                {event.description && (
                  <p className="mt-0.5 text-[12px] text-ink-3">{event.description}</p>
                )}
              </div>
            </m.div>
          );
        })}
      </div>
    </LazyMotion>
  );
}

/**
 * Build timeline events from an alert object
 */
export function buildAlertTimeline(alert: {
  status: AlertStatus;
  created_at: string;
  scheduled_at?: string | null;
  sent_at?: string | null;
}): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      status: "DRAFT",
      timestamp: alert.created_at,
      label: "Brouillon créé",
      description: "Alerte en cours de rédaction",
    },
  ];

  if (alert.scheduled_at) {
    events.push({
      status: "SCHEDULED",
      timestamp: alert.scheduled_at ?? null,
      label: "Programmée",
      description: "Envoi automatique prévu",
    });
  }

  if (alert.status === "SENDING" || alert.status === "SENT" || alert.status === "FAILED") {
    events.push({
      status: "SENDING",
      timestamp: null,
      label: "Envoi en cours",
      description: "Diffusion vers les cellules",
    });
  }

  if (alert.status === "SENT") {
    events.push({
      status: "SENT",
      timestamp: alert.sent_at ?? null,
      label: "Envoyée",
      description: "Diffusion réussie",
    });
  }

  if (alert.status === "FAILED") {
    events.push({
      status: "FAILED",
      timestamp: null,
      label: "Échec",
      description: "La diffusion a échoué",
    });
  }

  if (alert.status === "CANCELLED") {
    events.push({
      status: "CANCELLED",
      timestamp: null,
      label: "Annulée",
      description: "Alerte annulée par l'opérateur",
    });
  }

  return events;
}

export default AlertTimeline;
