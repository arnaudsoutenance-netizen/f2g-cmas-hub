"use client";

import { useMemo } from "react";
import { useAlerts } from "@/hooks/use-alerts";
import type { Alert, AlertListFilters } from "@/types/domain";
import { sortByHistoryTime, type FinishedStatus } from "./history-utils";

/** Backend cap (`limit` ≤ 100); the log shows the latest page of each status. */
export const HISTORY_PAGE_SIZE = 100;

const base = { page: 1, limit: HISTORY_PAGE_SIZE, sort_by: "created_at", sort_order: "desc" } as const satisfies AlertListFilters;

/**
 * The API filters on one status at a time, so the log is three parallel
 * queries merged client-side. Counters use each query's server-side total.
 */
export function useAlertHistory() {
  const sent = useAlerts({ ...base, status: "SENT" });
  const failed = useAlerts({ ...base, status: "FAILED" });
  const cancelled = useAlerts({ ...base, status: "CANCELLED" });
  const queries = [sent, failed, cancelled] as const;

  const alerts = useMemo<Alert[]>(
    () => sortByHistoryTime([...(sent.data?.data ?? []), ...(failed.data?.data ?? []), ...(cancelled.data?.data ?? [])]),
    [sent.data, failed.data, cancelled.data],
  );

  const totals: Record<FinishedStatus, number> = {
    SENT: sent.data?.pagination.total ?? 0,
    FAILED: failed.data?.pagination.total ?? 0,
    CANCELLED: cancelled.data?.pagination.total ?? 0,
  };

  const failing = queries.find((q) => q.isError);

  return {
    alerts,
    totals,
    /** True when at least one status has more rows than the page we loaded. */
    truncated: alerts.length < totals.SENT + totals.FAILED + totals.CANCELLED,
    isPending: queries.some((q) => q.isPending),
    isError: failing !== undefined,
    error: failing?.error ?? null,
    dataUpdatedAt: Math.min(...queries.map((q) => q.dataUpdatedAt)),
    refetch: () => Promise.all(queries.map((q) => q.refetch())),
  };
}
