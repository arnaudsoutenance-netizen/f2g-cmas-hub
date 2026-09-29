"use client";

import { m, useReducedMotion } from "framer-motion";
import { Inbox, Plus, SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Panel } from "@/components/dashboard/panel";
import { parsePage, parseStatus, parseType } from "@/components/alerts-page/alert-dates";
import { AlertsFilterBar } from "@/components/alerts-page/alerts-filter-bar";
import { AlertsList, AlertsListSkeleton, AlertsPagination } from "@/components/alerts-page/alerts-list";
import { DeleteDraftDialog } from "@/components/alerts-page/delete-draft-dialog";
import { StatusCounters } from "@/components/alerts-page/status-counters";
import { statusLabel } from "@/components/alerts/alert-status-pill";
import { LinkButton } from "@/components/shared/link-button";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { useAlerts } from "@/hooks/use-alerts";
import { useStats } from "@/hooks/use-network";
import { pageEnter } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Alert, AlertListFilters, AlertStatus, AlertType } from "@/types/domain";

const PAGE_SIZE = 20;

export default function AlertsPage() {
  return (
    <Suspense>
      <AlertsPageContent />
    </Suspense>
  );
}

/** Filters live in the URL (`?status=FAILED&type=CMAS&page=2`), so dashboard tiles can deep-link. */
function useUrlFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const status = parseStatus(params.get("status"));
  const type = parseType(params.get("type"));
  const page = parsePage(params.get("page"));

  const hrefWith = (next: { status?: AlertStatus; type?: AlertType; page?: number }) => {
    const q = new URLSearchParams();
    if (next.status) q.set("status", next.status);
    if (next.type) q.set("type", next.type);
    if (next.page && next.page > 1) q.set("page", String(next.page));
    const s = q.toString();
    return s ? `${pathname}?${s}` : pathname;
  };
  const go = (next: { status?: AlertStatus; type?: AlertType; page?: number }) =>
    router.replace(hrefWith(next), { scroll: false });

  return { status, type, page, hrefWith, go };
}

function AlertsPageContent() {
  const reduce = useReducedMotion();
  const { status, type, page, hrefWith, go } = useUrlFilters();
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<Alert | null>(null);

  const filters: AlertListFilters = {
    page,
    limit: PAGE_SIZE,
    ...(status ? { status } : {}),
    ...(type ? { alert_type: type } : {}),
  };
  const alerts = useAlerts(filters);
  const stats = useStats();

  // The API has no text search: filter the page that is loaded, and say so.
  const query = search.trim().toLowerCase();
  const rows = (alerts.data?.data ?? []).filter(
    (a) =>
      !query ||
      a.content.toLowerCase().includes(query) ||
      a.id.toLowerCase().startsWith(query) ||
      String(a.message_id).includes(query),
  );
  const serverEmpty = alerts.data?.data.length === 0;
  const hasFilters = status !== undefined || type !== undefined;

  const description = [
    status ? statusLabel(status) : "All statuses",
    type ?? "CMAS & ETWS",
    alerts.data ? `${alerts.data.pagination.total} alert${alerts.data.pagination.total === 1 ? "" : "s"}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <m.div {...(reduce ? {} : pageEnter)} className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] leading-tight font-bold text-ink">Alerts</h1>
          <p className="mt-0.5 text-[14px] text-ink-3">Every Cell Broadcast alert, from draft to delivery</p>
        </div>
        <LinkButton href="/alerts/new" className="h-9 px-3.5">
          <Plus aria-hidden className="size-4" /> New alert
        </LinkButton>
      </header>

      {stats.isError ? null : (
        <StatusCounters
          stats={stats.data?.alerts}
          pending={stats.isPending}
          active={status}
          hrefFor={(s) => hrefWith({ status: s, type })}
        />
      )}

      <Panel title="Alert list" description={description}>
        <div className="border-b border-hairline px-5 py-3">
          <AlertsFilterBar
            status={status}
            type={type}
            search={search}
            onStatusChange={(s) => go({ status: s, type })}
            onTypeChange={(t) => go({ status, type: t })}
            onSearchChange={setSearch}
            onClear={() => {
              setSearch("");
              go({});
            }}
          />
        </div>

        {alerts.isError ? (
          <div className="p-5">
            <ErrorState title="Unable to load alerts" error={alerts.error} onRetry={() => void alerts.refetch()} />
          </div>
        ) : alerts.isPending ? (
          <AlertsListSkeleton />
        ) : serverEmpty && !hasFilters ? (
          <EmptyState
            icon={Inbox}
            title="No alerts yet"
            description="Alerts you compose and broadcast will be listed here."
            action={<LinkButton href="/alerts/new">Compose the first alert</LinkButton>}
            className="px-5"
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No alert matches these filters"
            description={query ? "The search only covers the alerts on this page." : "Try another status or type."}
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  go({});
                }}
              >
                Clear filters
              </Button>
            }
            className="px-5"
          />
        ) : (
          <div aria-busy={alerts.isPlaceholderData} className={cn("transition-opacity", alerts.isPlaceholderData && "opacity-60")}>
            <AlertsList alerts={rows} onDelete={setToDelete} />
          </div>
        )}

        {alerts.data && !alerts.isError && alerts.data.pagination.total > 0 ? (
          <AlertsPagination
            pagination={alerts.data.pagination}
            shown={alerts.data.data.length}
            onPage={(p) => go({ status, type, page: p })}
          />
        ) : null}
      </Panel>

      <DeleteDraftDialog alert={toDelete} onClose={() => setToDelete(null)} />
    </m.div>
  );
}
