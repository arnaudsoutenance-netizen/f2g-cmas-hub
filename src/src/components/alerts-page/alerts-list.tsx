"use client";

import { ChevronLeft, ChevronRight, RadioTower, Trash2 } from "lucide-react";
import Link from "next/link";
import { AlertStatusPill } from "@/components/alerts/alert-status-pill";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Alert, PaginationMeta } from "@/types/domain";
import { formatFull, formatRelative, formatShort, keyDate } from "./alert-dates";

function cellCount(alert: Alert): string {
  const n = alert.cells.length;
  return `${n} cell${n === 1 ? "" : "s"}`;
}

function DateCell({ alert }: { alert: Alert }) {
  const { label, iso } = keyDate(alert);
  return (
    <time dateTime={iso} title={formatFull(iso)} className="block">
      <span className="block text-[13px] whitespace-nowrap text-ink tabular-nums">{formatShort(iso)}</span>
      <span className="block text-[12px] whitespace-nowrap text-ink-3">
        {label} {formatRelative(iso)}
      </span>
    </time>
  );
}

function DeleteButton({ alert, onDelete }: { alert: Alert; onDelete: (alert: Alert) => void }) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={`Delete draft ${alert.id.slice(0, 8)}`}
      title="Delete draft"
      onClick={() => onDelete(alert)}
      className="text-ink-3 hover:bg-danger-tint hover:text-danger"
    >
      <Trash2 aria-hidden className="size-4" />
    </Button>
  );
}

/** Desktop: a real table with column headers. */
function AlertsTable({ alerts, onDelete }: { alerts: readonly Alert[]; onDelete: (alert: Alert) => void }) {
  return (
    <Table className="hidden md:table">
      <TableHeader>
        <TableRow className="border-hairline hover:bg-transparent">
          <TableHead className="h-10 pl-5 text-[12px] font-semibold tracking-[0.06em] text-ink-3 uppercase">Class</TableHead>
          <TableHead className="h-10 text-[12px] font-semibold tracking-[0.06em] text-ink-3 uppercase">Message</TableHead>
          <TableHead className="h-10 text-[12px] font-semibold tracking-[0.06em] text-ink-3 uppercase">Status</TableHead>
          <TableHead className="h-10 text-right text-[12px] font-semibold tracking-[0.06em] text-ink-3 uppercase">Cells</TableHead>
          <TableHead className="h-10 text-[12px] font-semibold tracking-[0.06em] text-ink-3 uppercase">Date</TableHead>
          <TableHead className="h-10 pr-5 text-right">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((alert) => (
          <TableRow key={alert.id} className="border-hairline hover:bg-surface-hover">
            <TableCell className="py-3 pl-5 align-top">
              <SeverityBadge messageId={alert.message_id} size="sm" />
            </TableCell>
            <TableCell className="w-full max-w-0 py-3 align-top">
              <Link
                href={`/alerts/${alert.id}`}
                className="block rounded-[6px] focus-visible:outline-offset-[-2px]"
              >
                <span className="block truncate text-[14px] font-medium text-ink hover:underline">
                  {alert.content || "No message"}
                </span>
                <span className="block font-mono text-[12px] text-ink-3">
                  {alert.id.slice(0, 8)} · {alert.alert_type}
                </span>
              </Link>
            </TableCell>
            <TableCell className="py-3 align-top">
              <AlertStatusPill status={alert.status} size="sm" />
            </TableCell>
            <TableCell className="py-3 text-right align-top text-[13px] text-ink-2 tabular-nums">
              {alert.cells.length}
            </TableCell>
            <TableCell className="py-3 align-top">
              <DateCell alert={alert} />
            </TableCell>
            <TableCell className="py-2.5 pr-5 text-right align-top">
              {alert.status === "DRAFT" ? <DeleteButton alert={alert} onDelete={onDelete} /> : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Mobile: stacked cards; the delete control sits beside the link, never inside it. */
function AlertsCards({ alerts, onDelete }: { alerts: readonly Alert[]; onDelete: (alert: Alert) => void }) {
  return (
    <ul className="divide-y divide-hairline md:hidden">
      {alerts.map((alert) => {
        const { label, iso } = keyDate(alert);
        return (
          <li key={alert.id} className="flex items-start gap-1 px-3 py-1">
            <Link
              href={`/alerts/${alert.id}`}
              className="flex min-w-0 flex-1 gap-2 rounded-[10px] px-2 py-3 transition-colors hover:bg-surface-hover focus-visible:outline-offset-[-2px]"
            >
              <span className="min-w-0 flex-1 space-y-2">
                <span className="flex flex-wrap items-center gap-1.5">
                  <SeverityBadge messageId={alert.message_id} size="sm" />
                  <AlertStatusPill status={alert.status} size="sm" />
                </span>
                <span className="line-clamp-2 block text-[14px] leading-snug text-ink">{alert.content || "No message"}</span>
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink-3">
                  <time dateTime={iso}>
                    {label} {formatShort(iso)}
                  </time>
                  <span className="inline-flex items-center gap-1">
                    <RadioTower aria-hidden className="size-3" />
                    {cellCount(alert)}
                  </span>
                </span>
              </span>
              <ChevronRight aria-hidden className="mt-1 size-4 shrink-0 text-ink-3" />
            </Link>
            {alert.status === "DRAFT" ? (
              <div className="pt-2.5">
                <DeleteButton alert={alert} onDelete={onDelete} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function AlertsList({ alerts, onDelete }: { alerts: readonly Alert[]; onDelete: (alert: Alert) => void }) {
  return (
    <>
      <AlertsTable alerts={alerts} onDelete={onDelete} />
      <AlertsCards alerts={alerts} onDelete={onDelete} />
    </>
  );
}

export function AlertsListSkeleton() {
  return (
    <ul className="divide-y divide-hairline" aria-busy aria-label="Loading alerts">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="flex items-center gap-4 px-5 py-4">
          <Skeleton className="hidden h-5 w-24 md:block" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-40 md:hidden" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="hidden h-5 w-20 rounded-full md:block" />
          <Skeleton className="hidden h-8 w-24 md:block" />
        </li>
      ))}
    </ul>
  );
}

export function AlertsPagination({
  pagination,
  shown,
  onPage,
}: {
  pagination: PaginationMeta;
  shown: number;
  onPage: (page: number) => void;
}) {
  const { page, limit, total, total_pages } = pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(total, (page - 1) * limit + shown);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 border-t border-hairline px-5 py-3">
      <p className="text-[12px] text-ink-3 tabular-nums" aria-live="polite">
        {from}–{to} of {total}
      </p>
      {total_pages > 1 ? (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
            <ChevronLeft aria-hidden className="size-3.5" /> Previous
          </Button>
          <span className="hidden text-[12px] text-ink-3 tabular-nums sm:inline">
            Page {page} of {total_pages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= total_pages} onClick={() => onPage(page + 1)}>
            Next <ChevronRight aria-hidden className="size-3.5" />
          </Button>
        </div>
      ) : null}
    </nav>
  );
}
