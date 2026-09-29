"use client";

import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { m, LazyMotion, domAnimation } from "framer-motion";
import {
  Plus,
  Send,
  Clock,
  AlertTriangle,
  Radio,
  Activity,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { AlertStatusPill } from "@/components/alerts/alert-status-pill";
import { ErrorState } from "@/components/shared/states";
import { LinkButton } from "@/components/shared/link-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts } from "@/hooks/use-alerts";
import { useStats } from "@/hooks/use-network";

const pageEnter = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
};

export default function DashboardPage() {
  const {
    data: stats,
    isPending: statsPending,
    isError: statsError,
    error: statsErr,
    refetch: refetchStats,
  } = useStats();
  const { data: alertsData, isPending: alertsPending } = useAlerts({ limit: 5 });

  const alerts = alertsData?.data ?? [];

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header - Clean & Minimal */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
              Dashboard
            </h1>
            <p className="mt-0.5 text-sm text-ink-3">
              Cell Broadcast Alert System Overview
            </p>
          </div>
          <LinkButton href="/alerts/new" className="gap-2">
            <Plus className="size-4" />
            New Alert
          </LinkButton>
        </header>

        {/* Stats Error */}
        {statsError ? (
          <ErrorState
            title="Unable to load statistics"
            error={statsErr}
            onRetry={() => void refetchStats()}
          />
        ) : statsPending ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Hero Cards Row - Berry Style */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Primary Hero - Navy */}
              <HeroCard
                variant="navy"
                label="Total Alerts Sent"
                value={stats.alerts.sent}
                subtitle={stats.today.sent > 0 ? `+${stats.today.sent} today` : "No alerts today"}
                icon={Send}
              />
              
              {/* Secondary Hero - Orange */}
              <HeroCard
                variant="orange"
                label="Network Coverage"
                value={stats.cells?.active ?? 0}
                suffix={`/${stats.cells?.total ?? 0}`}
                subtitle={`${stats.success_rate}% success rate`}
                icon={Radio}
              />
            </div>

            {/* Stats Grid - Compact Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Pending"
                value={stats.alerts.scheduled + stats.alerts.draft}
                icon={Clock}
                color="amber"
                detail={`${stats.alerts.draft} drafts`}
              />
              <MetricCard
                label="Scheduled"
                value={stats.alerts.scheduled}
                icon={Zap}
                color="blue"
                detail="Awaiting broadcast"
              />
              <MetricCard
                label="Failed"
                value={stats.alerts.failed}
                icon={XCircle}
                color="red"
                detail={stats.alerts.failed > 0 ? "Requires attention" : "All clear"}
              />
              <MetricCard
                label="Success Rate"
                value={`${stats.success_rate}%`}
                icon={TrendingUp}
                color="emerald"
                detail="Delivery performance"
              />
            </div>
          </>
        )}

        {/* Main Content - Full Width Recent Alerts */}
        <section>
          <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-hairline bg-surface-sunken/50 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                  <Activity className="size-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-ink">Recent Alerts</h2>
                  <p className="text-xs text-ink-3">Latest broadcast activity</p>
                </div>
              </div>
              <Link
                href="/alerts"
                className="group flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
              >
                View all
                <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Alerts List */}
            {alertsPending ? (
              <AlertsListSkeleton />
            ) : alerts.length === 0 ? (
              <EmptyAlerts />
            ) : (
              <div className="divide-y divide-hairline">
                {alerts.map((alert, idx) => (
                  <m.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={`/alerts/${alert.id}`}
                      className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-hover"
                    >
                      <SeverityBadge messageId={alert.message_id} showId={false} />
                      
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink group-hover:text-primary">
                          {alert.content || "No content"}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-3">
                          <code className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[10px]">
                            {alert.message_id}
                          </code>
                          <span>·</span>
                          <span>
                            {formatDistanceToNow(new Date(alert.created_at), {
                              addSuffix: true,
                              locale: enUS,
                            })}
                          </span>
                        </div>
                      </div>

                      <AlertStatusPill status={alert.status} size="sm" />
                    </Link>
                  </m.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </m.div>
    </LazyMotion>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Hero Card - Berry Style with Decorative Circles
 * ═══════════════════════════════════════════════════════════════════════════ */

interface HeroCardProps {
  variant: "navy" | "orange";
  label: string;
  value: number;
  suffix?: string;
  subtitle: string;
  icon: React.ElementType;
}

function HeroCard({ variant, label, value, suffix, subtitle, icon: Icon }: HeroCardProps) {
  const isNavy = variant === "navy";
  
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        isNavy ? "bg-[#1F3864]" : "bg-[#B85418]"
      )}
    >
      {/* Decorative circles - Berry style */}
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 size-40 rounded-full",
          isNavy ? "bg-white/[0.04]" : "bg-white/[0.06]"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -bottom-6 -right-6 size-28 rounded-full",
          isNavy ? "bg-white/[0.03]" : "bg-white/[0.04]"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full",
          isNavy ? "bg-white/[0.02]" : "bg-white/[0.02]"
        )}
      />

      {/* Content */}
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/60">
            {label}
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-4xl font-bold tabular-nums text-white">
              {value}
            </span>
            {suffix && (
              <span className="text-xl font-medium text-white/50">{suffix}</span>
            )}
          </div>
          <p className="mt-2 text-sm text-white/70">{subtitle}</p>
        </div>
        
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-xl",
            isNavy ? "bg-white/10" : "bg-white/15"
          )}
        >
          <Icon className="size-6 text-white/90" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Metric Card - Compact Stats
 * ═══════════════════════════════════════════════════════════════════════════ */

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: "emerald" | "amber" | "red" | "blue";
  detail?: string;
}

const colorMap = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
  },
};

function MetricCard({ label, value, icon: Icon, color, detail }: MetricCardProps) {
  const colors = colorMap[color];
  
  return (
    <div className="rounded-xl border border-hairline bg-surface p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className={cn("flex size-10 items-center justify-center rounded-lg", colors.bg)}>
          <Icon className={cn("size-5", colors.text)} strokeWidth={1.5} />
        </div>
        <span className={cn("size-2 rounded-full", colors.dot)} />
      </div>
      
      <div className="mt-3">
        <p className="text-xs font-medium text-ink-3">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold tabular-nums text-ink">{value}</p>
        {detail && (
          <p className="mt-1 text-xs text-ink-3">{detail}</p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Empty State
 * ═══════════════════════════════════════════════════════════════════════════ */

function EmptyAlerts() {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-sunken">
        <Activity className="size-6 text-ink-3" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-ink">No alerts yet</h3>
      <p className="mt-1 max-w-xs text-xs text-ink-3">
        Create your first Cell Broadcast alert to start broadcasting to the network.
      </p>
      <LinkButton href="/alerts/new" size="sm" className="mt-4">
        <Plus className="size-4" />
        Create Alert
      </LinkButton>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Skeletons
 * ═══════════════════════════════════════════════════════════════════════════ */

function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[140px] rounded-2xl" />
        <Skeleton className="h-[140px] rounded-2xl" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-hairline bg-surface p-4">
            <Skeleton className="size-10 rounded-lg" />
            <Skeleton className="mt-3 h-3 w-16" />
            <Skeleton className="mt-2 h-7 w-12" />
          </div>
        ))}
      </div>
    </>
  );
}

function AlertsListSkeleton() {
  return (
    <div className="divide-y divide-hairline">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3.5">
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
