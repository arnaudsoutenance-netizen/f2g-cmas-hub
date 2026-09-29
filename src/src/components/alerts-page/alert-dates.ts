import { format, formatDistanceToNowStrict } from "date-fns";
import { enUS } from "date-fns/locale";
import type { Alert, AlertStatus, AlertType } from "@/types/domain";

export const ALERT_STATUSES: readonly AlertStatus[] = ["DRAFT", "SCHEDULED", "SENDING", "SENT", "FAILED", "CANCELLED"];
export const ALERT_TYPES: readonly AlertType[] = ["CMAS", "ETWS"];

export function parseStatus(value: string | null): AlertStatus | undefined {
  return ALERT_STATUSES.find((s) => s === value);
}

export function parseType(value: string | null): AlertType | undefined {
  return ALERT_TYPES.find((t) => t === value);
}

export function parsePage(value: string | null): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/** The one timestamp that matters for a row: sent, else scheduled, else created. */
export function keyDate(alert: Pick<Alert, "sent_at" | "scheduled_at" | "created_at">): { label: string; iso: string } {
  if (alert.sent_at) return { label: "Sent", iso: alert.sent_at };
  if (alert.scheduled_at) return { label: "Scheduled", iso: alert.scheduled_at };
  return { label: "Created", iso: alert.created_at };
}

export function formatShort(iso: string): string {
  return format(new Date(iso), "d MMM, HH:mm", { locale: enUS });
}

export function formatFull(iso: string): string {
  return format(new Date(iso), "d MMM yyyy, HH:mm:ss", { locale: enUS });
}

export function formatRelative(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true, locale: enUS });
}
