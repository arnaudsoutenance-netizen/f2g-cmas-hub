"use client";

import { format } from "date-fns";
import { m, useReducedMotion } from "framer-motion";
import { Download, FilterX, History, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";
import { HistoryFilters } from "@/components/history-page/history-filters";
import { HistoryLog, HistoryLogSkeleton } from "@/components/history-page/history-log";
import { HistoryStats, HistoryStatsSkeleton } from "@/components/history-page/history-stats";
import {
  alertsToCsv,
  filterHistory,
  groupByDay,
  type ClassFilter,
  type StatusFilter,
} from "@/components/history-page/history-utils";
import { HISTORY_PAGE_SIZE, useAlertHistory } from "@/components/history-page/use-alert-history";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { LinkButton } from "@/components/shared/link-button";
import { Button } from "@/components/ui/button";
import { dur, ease } from "@/lib/motion";
import type { Alert } from "@/types/domain";

function downloadCsv(rows: readonly Alert[]) {
  const blob = new Blob([alertsToCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cmas-history-${format(new Date(), "yyyyMMdd-HHmm")}.csv`;
  link.click();
  // Some browsers start the download asynchronously; release the blob afterwards.
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  toast.success(`Exported ${rows.length} alert${rows.length === 1 ? "" : "s"}`);
}

/** Broadcast log: every alert that reached a final state, newest first, grouped by day. */
export default function HistoryPage() {
  const history = useAlertHistory();
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [alertClass, setAlertClass] = useState<ClassFilter>("all");

  const visible = useMemo(() => filterHistory(history.alerts, status, alertClass), [history.alerts, status, alertClass]);
  const groups = useMemo(() => groupByDay(visible), [visible]);
  const filtered = status !== "all" || alertClass !== "all";
  const hasAny = history.alerts.length > 0;
  const ready = !history.isPending && !history.isError;

  const clearFilters = () => {
    setStatus("all");
    setAlertClass("all");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] leading-tight font-bold text-ink">History</h1>
          <p className="mt-0.5 text-[14px] text-ink-3">
            Broadcast log
            {ready && history.dataUpdatedAt > 0
              ? ` · updated ${format(history.dataUpdatedAt, "HH:mm")}`
              : ""}
          </p>
        </div>
        <Button variant="outline" size="md" disabled={!ready || visible.length === 0} onClick={() => downloadCsv(visible)}>
          <Download aria-hidden className="size-4" />
          Export CSV
        </Button>
      </header>

      {history.isError ? (
        <ErrorState title="Unable to load the broadcast log" error={history.error} onRetry={() => void history.refetch()} />
      ) : history.isPending ? (
        <div className="space-y-6" aria-busy aria-label="Loading the broadcast log">
          <HistoryStatsSkeleton />
          <div className="overflow-hidden rounded-[16px] border border-hairline bg-surface shadow-e1">
            <HistoryLogSkeleton />
          </div>
        </div>
      ) : !hasAny ? (
        <>
          <HistoryStats totals={history.totals} />
          <Panel title="Broadcast log" description="Sent, failed and cancelled alerts, newest first">
            <EmptyState
              icon={History}
              title="Nothing broadcast yet"
              description="Alerts appear here once they have been sent, have failed or were cancelled."
              action={<LinkButton href="/alerts/new">Compose an alert</LinkButton>}
              className="px-5"
            />
          </Panel>
        </>
      ) : (
        <>
          <HistoryStats totals={history.totals} />

          <Panel
            title="Broadcast log"
            description={
              filtered
                ? `${visible.length} of ${history.alerts.length} alerts match the filters`
                : `${history.alerts.length} alert${history.alerts.length === 1 ? "" : "s"}, newest first`
            }
          >
            <div className="flex flex-col gap-3 border-b border-hairline px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <HistoryFilters status={status} alertClass={alertClass} onStatusChange={setStatus} onClassChange={setAlertClass} />
              {filtered ? (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="self-start sm:self-auto">
                  <FilterX aria-hidden />
                  Clear filters
                </Button>
              ) : null}
            </div>

            <p className="sr-only" aria-live="polite">
              {visible.length} alert{visible.length === 1 ? "" : "s"} shown
            </p>

            {history.truncated ? (
              <p className="flex items-start gap-2 border-b border-hairline bg-surface-sunken px-4 py-2.5 text-[12px] text-ink-2 sm:px-5">
                <Info aria-hidden className="mt-px size-3.5 shrink-0" />
                Showing the latest {HISTORY_PAGE_SIZE} alerts per outcome; counters above cover the full log.
              </p>
            ) : null}

            <m.div
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur.moderate, ease: ease.standard }}
            >
              {visible.length === 0 ? (
                <EmptyState
                  icon={FilterX}
                  title="No alert matches these filters"
                  description="Try another outcome or class, or clear the filters to see the whole log."
                  action={
                    <Button variant="outline" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  }
                  className="px-5"
                />
              ) : (
                <HistoryLog groups={groups} />
              )}
            </m.div>
          </Panel>
        </>
      )}
    </div>
  );
}
