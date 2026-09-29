"use client";

import { ClassMixPanel } from "@/components/dashboard/class-mix-panel";
import { CommandHero } from "@/components/dashboard/command-hero";
import { ConnectivityPanel } from "@/components/dashboard/connectivity-panel";
import { InfrastructureStats } from "@/components/dashboard/infrastructure-stats";
import { KpiTiles } from "@/components/dashboard/kpi-tiles";
import { NetworkStatusPanel } from "@/components/dashboard/network-status-panel";
import { QuickTemplates } from "@/components/dashboard/quick-templates";
import { RecentAlertsPanel } from "@/components/dashboard/recent-alerts-panel";
import { ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts } from "@/hooks/use-alerts";
import { useCells, useStats, useTemplates } from "@/hooks/use-network";
import { useCurrentUser } from "@/hooks/use-session";

/**
 * Dashboard: readiness banner, operational counters, then activity (recent
 * alerts), network health, class mix and templates to start from.
 */
export default function DashboardPage() {
  const stats = useStats();
  const recent = useAlerts({ limit: 6 });
  const mix = useAlerts({ limit: 50 });
  const lastSent = useAlerts({ status: "SENT", limit: 1, sort_by: "sent_at", sort_order: "desc" });
  const cells = useCells();
  const templates = useTemplates({ active_only: true });
  const user = useCurrentUser();

  return (
    <div className="space-y-6">
      <CommandHero
        stats={stats.data}
        cells={cells.data}
        cellsStale={cells.isError}
        cellsUpdatedAt={cells.dataUpdatedAt}
        lastSent={lastSent.data?.data[0]}
        userName={user.data?.name}
      />

      {/* System Connectivity: CBC → MME → eNBs → Cells */}
      {stats.data?.network && (
        <ConnectivityPanel
          mmeStatus={stats.data.network.mmes_connected > 0 ? "connected" : "disconnected"}
          enbsConnected={stats.data.network.enbs_connected}
          enbsTotal={stats.data.cells.total}
          cellsOnline={stats.data.network.cells_online}
          cellsTotal={stats.data.cells.total}
        />
      )}

      {/* Infrastructure Stats: eNBs, MMEs, Cells - requested by Luis */}
      {stats.data?.network && (
        <InfrastructureStats stats={stats.data.network} />
      )}

      {stats.isError ? (
        <ErrorState title="Unable to load statistics" error={stats.error} onRetry={() => void stats.refetch()} />
      ) : stats.isPending ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-4" aria-busy>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-[164px] rounded-[16px]" />
          ))}
        </div>
      ) : (
        <KpiTiles stats={stats.data} />
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RecentAlertsPanel alerts={recent.data?.data ?? []} pending={recent.isPending} />
        </div>
        <div className="space-y-6 lg:col-span-5">
          <NetworkStatusPanel cells={cells.data ?? []} pending={cells.isPending} />
          <ClassMixPanel alerts={mix.data?.data ?? []} />
        </div>
      </div>

      <QuickTemplates templates={templates.data ?? []} />
    </div>
  );
}
