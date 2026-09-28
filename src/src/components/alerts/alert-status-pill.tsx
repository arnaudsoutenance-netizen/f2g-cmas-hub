"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { AlertStatus } from "@/types/domain";

interface StatusStyle {
  label: string;
  pill: string;
  dot: string;
}

const STATUS_STYLES: Readonly<Record<AlertStatus, StatusStyle>> = {
  DRAFT: {
    label: "Brouillon",
    pill: "bg-surface-sunken text-ink-2 outline outline-1 outline-dashed outline-hairline-strong -outline-offset-1",
    dot: "ring-[1.5px] ring-inset ring-st-draft text-st-draft",
  },
  SCHEDULED: { label: "Programmée", pill: "bg-st-scheduled-tint text-st-scheduled-fg", dot: "bg-st-scheduled text-st-scheduled" },
  SENDING: { label: "En cours", pill: "bg-surface-sunken text-ink", dot: "status-pulse bg-st-sending text-st-sending" },
  SENT: { label: "Envoyée", pill: "bg-st-sent-tint text-st-sent-fg", dot: "bg-st-sent text-st-sent" },
  FAILED: { label: "Échec", pill: "bg-st-failed-tint text-st-failed-fg font-semibold", dot: "bg-st-failed text-st-failed" },
  CANCELLED: { label: "Annulée", pill: "bg-transparent text-ink-3 line-through decoration-1", dot: "bg-st-cancelled text-st-cancelled" },
};

interface AlertStatusPillProps {
  status: AlertStatus;
  progress?: { done: number; total: number };
  scheduledAt?: string | null;
  size?: "sm" | "md";
  className?: string;
}

/** Status is a dot on a quiet pill; only FAILED escalates to a tinted background. */
export function AlertStatusPill({ status, progress, scheduledAt, size = "md", className }: AlertStatusPillProps) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full font-medium whitespace-nowrap",
        size === "md" ? "h-6 px-2.5 text-xs" : "h-5 px-2 text-[11px]",
        style.pill,
        className,
      )}
    >
      <span aria-hidden className={cn("size-2 rounded-full", style.dot)} />
      {style.label}
      {status === "SENDING" && progress && (
        <span className="font-mono text-ink-2 tabular-nums">
          {progress.done}/{progress.total}
        </span>
      )}
      {status === "SCHEDULED" && scheduledAt && (
        <span className="font-mono tabular-nums opacity-80">
          · dans {formatDistanceToNowStrict(new Date(scheduledAt), { locale: fr })}
        </span>
      )}
    </span>
  );
}

export function statusLabel(status: AlertStatus): string {
  return STATUS_STYLES[status].label;
}
