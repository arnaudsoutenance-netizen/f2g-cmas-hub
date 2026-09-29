"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { m } from "framer-motion";
import {
  Plus,
  Send,
  Radio,
  Clock,
  FileText,
  CircleAlert,
  TrendingUp,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { cn } from "cn";
import { NetworkPanel } from "@/components/dashboard/network-panel";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { AlertStatusPill } from "@/components/alerts/alert-status-pill";
import { CountUp } from "@/components/shared/count-up";
import { ErrorState } from "@/components/shared/states";
import { LinkButton } from "@/components/shared/link-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts } from "@/hooks/use-alerts";
import { useStats } from "@/hooks/use-network";
import { pageEnter } from "@/lib/motion";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const {
    data: stats,
    isPending: statsPending,
    isError: statsError,
    error: statsErr,
    refetch: refetchStats,
  } = useStats();
  const { data: alertsData, isPending: alertsPending } = useAlerts({ limit: 6 });

  const alerts = alertsData?.data ?? [];

  return (
    <m.div {...pageEnter} className="space-y-5">
      {/* Header compact */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-semibold leading-tight text-ink">
            Tableau de bord
          </h1>
          <p className="text-[12px] text-ink-3">
            {format(new Date(), "EEEE d MMMM · HH:mm", { locale: fr })} WAT
          </p>
        </div>
        <LinkButton size="sm" href="/alerts/new">
          <Plus className="size-3.5" /> Nouvelle alerte
        </LinkButton>
      </header>

      {/* Stats Error */}
      {statsError ? (
        <ErrorState
          title="Impossible de charger les indicateurs"
          error={statsErr}
          onRetry={() => void refetchStats()}
        />
      ) : statsPending ? (
        <StatsSkeletons />
      ) : (
        <>
          {/* Hero Stats Row - Berry Style */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Navy Hero Card */}
            <div className="relative overflow-hidden rounded-xl bg-[#1F3864] p-5">
              {/* Cercles décoratifs Berry - plus subtils */}
              <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/[0.04]" />
              <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-white/[0.03]" />
              
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-white/60">
                    Alertes envoyées
                  </p>
                  <p className="mt-1 font-display text-[36px] font-bold leading-none text-white tabular-nums">
                    <CountUp value={stats.alerts.sent} />
                  </p>
                  <p className="mt-1.5 text-[11px] text-white/50">
                    Total depuis le début
                  </p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-white/10">
                  <Send className="size-5 text-white/80" />
                </div>
              </div>
            </div>

            {/* Orange Hero Card */}
            <div className="relative overflow-hidden rounded-xl bg-[#B85418] p-5">
              <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/[0.04]" />
              <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-white/[0.03]" />
              
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-white/60">
                    Cellules actives
                  </p>
                  <p className="mt-1 font-display text-[36px] font-bold leading-none text-white tabular-nums">
                    <CountUp value={stats.cells?.active ?? 0} />
                  </p>
                  <p className="mt-1.5 text-[11px] text-white/50">
                    {stats.cells ? `Sur ${stats.cells.total} au total` : "—"}
                  </p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-white/10">
                  <Radio className="size-5 text-white/80" />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats - Compact row */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              label="Taux de succès"
              value={
                stats.alerts.sent + stats.alerts.failed > 0
                  ? `${stats.success_rate}%`
                  : "—"
              }
              icon={TrendingUp}
              detail={
                stats.success_rate >= 95
                  ? "Excellent"
                  : stats.success_rate >= 90
                    ? "Bon"
                    : "À améliorer"
              }
              detailColor={
                stats.success_rate >= 95
                  ? "text-st-sent-fg"
                  : stats.success_rate >= 90
                    ? "text-ink-3"
                    : "text-st-failed-fg"
              }
            />
            <StatCard
              label="Aujourd'hui"
              value={stats.today.sent}
              icon={Clock}
              detail={`${stats.today.scheduled} programmée${stats.today.scheduled !== 1 ? "s" : ""}`}
            />
            <StatCard
              label="Brouillons"
              value={stats.alerts.draft}
              icon={FileText}
              detail="En attente"
            />
            <StatCard
              label="Échecs"
              value={stats.alerts.failed}
              icon={CircleAlert}
              detail={stats.alerts.failed > 0 ? "À vérifier" : "Aucun"}
              detailColor={stats.alerts.failed > 0 ? "text-st-failed-fg" : undefined}
            />
          </div>
        </>
      )}

      {/* Main Grid: Alerts + Network */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Recent Alerts - Dense table style */}
        <section className="rounded-xl border border-hairline bg-shell lg:col-span-8">
          <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
            <div>
              <h2 className="text-[14px] font-semibold text-ink">Alertes récentes</h2>
              <p className="text-[11px] text-ink-3">Dernière activité</p>
            </div>
            <Link
              href="/alerts"
              className="text-[12px] font-medium text-link hover:underline"
            >
              Tout voir →
            </Link>
          </div>

          {alertsPending ? (
            <div className="divide-y divide-hairline">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <Skeleton className="size-6 rounded" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-2.5 w-1/3" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="size-8 text-ink-3/50" />
              <p className="mt-2 text-[13px] text-ink-3">Aucune alerte récente</p>
              <LinkButton size="sm" variant="outline" href="/alerts/new" className="mt-3">
                Créer une alerte
              </LinkButton>
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              {alerts.map((alert) => (
                <Link
                  key={alert.id}
                  href={`/alerts/${alert.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-surface-hover"
                >
                  {/* Severity icon */}
                  <SeverityBadge messageId={alert.message_id} showId={false} />

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-ink">
                      {alert.content || "Sans contenu"}
                    </p>
                    <p className="flex items-center gap-1.5 text-[11px] text-ink-3">
                      <span className="font-mono">{alert.message_id}</span>
                      <span>·</span>
                      <span>
                        {formatDistanceToNow(new Date(alert.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </p>
                  </div>

                  {/* Status */}
                  <AlertStatusPill status={alert.status} size="sm" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Network Panel */}
        <section className="rounded-xl border border-hairline bg-shell lg:col-span-4">
          <div className="border-b border-hairline px-4 py-3">
            <h2 className="text-[14px] font-semibold text-ink">Réseau</h2>
            <p className="text-[11px] text-ink-3">État des cellules</p>
          </div>
          <div className="p-4">
            <NetworkPanel />
          </div>
        </section>
      </div>
    </m.div>
  );
}

// Stat Card Component - Compact
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  detail?: string;
  detailColor?: string;
}

function StatCard({ label, value, icon: Icon, detail, detailColor }: StatCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-shell p-4">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wide text-ink-3">
          {label}
        </p>
        <Icon className="size-4 text-ink-3" strokeWidth={1.5} />
      </div>
      <p className="mt-1 font-display text-[24px] font-semibold leading-none text-ink tabular-nums">
        {typeof value === "number" ? <CountUp value={value} /> : value}
      </p>
      {detail && (
        <p className={cn("mt-1 text-[11px]", detailColor ?? "text-ink-3")}>
          {detail}
        </p>
      )}
    </div>
  );
}

// Skeletons
function StatsSkeletons() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-[120px] rounded-xl" />
        <Skeleton className="h-[120px] rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-hairline bg-shell p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-2 h-7 w-12" />
            <Skeleton className="mt-1 h-2.5 w-20" />
          </div>
        ))}
      </div>
    </>
  );
}
