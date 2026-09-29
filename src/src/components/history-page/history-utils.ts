import { format, startOfDay, subDays } from "date-fns";
import { enUS } from "date-fns/locale";
import { classifyMessageId, type AlertClassKey } from "@/lib/cmas/alert-classes";
import type { Alert, AlertStatus } from "@/types/domain";

/** Statuses that end an alert's life: the broadcast log only shows these. */
export const FINISHED_STATUSES = ["SENT", "FAILED", "CANCELLED"] as const satisfies readonly AlertStatus[];
export type FinishedStatus = (typeof FINISHED_STATUSES)[number];

export type StatusFilter = FinishedStatus | "all";
export type ClassFilter = AlertClassKey | "all";

/** The moment that matters for the log: sent, else scheduled, else created. */
export function historyTime(alert: Alert): string {
  return alert.sent_at ?? alert.scheduled_at ?? alert.created_at;
}

/** Newest first; ties broken by id so the order is stable across refetches. */
export function sortByHistoryTime(alerts: readonly Alert[]): Alert[] {
  return [...alerts].sort(
    (a, b) => new Date(historyTime(b)).getTime() - new Date(historyTime(a)).getTime() || b.id.localeCompare(a.id),
  );
}

export function filterHistory(alerts: readonly Alert[], status: StatusFilter, alertClass: ClassFilter): Alert[] {
  return alerts.filter(
    (a) =>
      (status === "all" || a.status === status) &&
      (alertClass === "all" || classifyMessageId(a.message_id)?.key === alertClass),
  );
}

/** "Today", "Yesterday", then "Monday 28 September 2026". */
export function dayLabel(date: Date, now: Date = new Date()): string {
  const day = startOfDay(date).getTime();
  if (day === startOfDay(now).getTime()) return "Today";
  if (day === startOfDay(subDays(now, 1)).getTime()) return "Yesterday";
  return format(date, "EEEE d MMMM yyyy", { locale: enUS });
}

export interface DayGroup {
  /** ISO date (yyyy-MM-dd), stable key and machine-readable `<time>` value. */
  key: string;
  label: string;
  alerts: Alert[];
}

/** Groups an already sorted list by local calendar day, preserving order. */
export function groupByDay(alerts: readonly Alert[], now: Date = new Date()): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const alert of alerts) {
    const date = new Date(historyTime(alert));
    const key = format(date, "yyyy-MM-dd");
    const last = groups.at(-1);
    if (last?.key === key) last.alerts.push(alert);
    else groups.push({ key, label: dayLabel(date, now), alerts: [alert] });
  }
  return groups;
}

/** Sent / (sent + failed); cancelled alerts were never attempted. Null when nothing was attempted. */
export function successRate(sent: number, failed: number): number | null {
  const attempted = sent + failed;
  return attempted === 0 ? null : (sent / attempted) * 100;
}

function csvCell(value: string | number | null): string {
  if (value === null) return "";
  const text = String(value);
  // Quote everything that could break a row, and neutralise spreadsheet formulas.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return /[",\r\n]/.test(safe) || safe !== text ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export const CSV_HEADER = [
  "id",
  "status",
  "alert_type",
  "message_id",
  "class",
  "created_at",
  "scheduled_at",
  "sent_at",
  "duration_s",
  "cells",
  "content",
] as const;

/** RFC 4180 CSV of the given rows, for incident reports. */
export function alertsToCsv(alerts: readonly Alert[]): string {
  const rows = alerts.map((a) =>
    [
      a.id,
      a.status,
      a.alert_type,
      a.message_id,
      classifyMessageId(a.message_id)?.label ?? null,
      a.created_at,
      a.scheduled_at,
      a.sent_at,
      a.duration,
      a.cells.length,
      a.content,
    ]
      .map(csvCell)
      .join(","),
  );
  return [CSV_HEADER.join(","), ...rows].join("\r\n") + "\r\n";
}
