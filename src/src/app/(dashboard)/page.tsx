"use client";

import { format, formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { m } from "framer-motion";
import {
  Plus,
  Send,
  Clock,
  AlertCircle,
  Radio,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NetworkPanel } from "@/components/dashboard/network-panel";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { AlertStatusPill } from "@/components/alerts/alert-status-pill";
import { ErrorState } from "@/components/shared/states";
import { LinkButton } from "@/components/shared/link-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts } from "@/hooks/use-alerts";
import { useStats } from "@/hooks/use-network";
import { pageEnter } from "@/lib/motion";

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
    <m.div {...pageEnter} className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-semibold text-gray-900">Dashboard</h1>
          <p className="text-[14px] text-gray-500">
            Welcome to F2G CMAS Hub — Cell Broadcast Alert System
          </p>
        </div>
        <LinkButton size="sm" href="/alerts/new">
          <Plus className="size-4" /> New Alert
        </LinkButton>
      </header>

      {/* Stats Error */}
      {statsError ? (
        <ErrorState
          title="Unable to load stats"
          error={statsErr}
          onRetry={() => void refetchStats()}
        />
      ) : statsPending ? (
        <StatsSkeletons />
      ) : (
        /* Stats Cards Row - Minimalist style like screenshot */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Alerts Sent */}
          <StatCard
            label="Alerts Sent"
            value={stats.alerts.sent}
            icon={<Send className="h-full w-full" />}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-500"
            trend={
              stats.today.sent > 0
                ? { value: `+${stats.today.sent} today`, positive: true }
                : undefined
            }
          />

          {/* Pending / Scheduled */}
          <StatCard
            label="Pending"
            value={stats.alerts.scheduled + stats.alerts.draft}
            icon={<Clock className="h-full w-full" />}
            iconBg="bg-amber-50"
            iconColor="text-amber-500"
          />

          {/* Failed */}
          <StatCard
            label="Failed"
            value={stats.alerts.failed}
            icon={<AlertCircle className="h-full w-full" />}
            iconBg="bg-red-50"
            iconColor="text-red-500"
          />

          {/* Active Cells */}
          <StatCard
            label="Active Cells"
            value={stats.cells?.active ?? 0}
            suffix={stats.cells ? `/${stats.cells.total}` : undefined}
            icon={<Radio className="h-full w-full" />}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-500"
          />
        </div>
      )}

      {/* Main Grid: Alerts + Network */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Recent Alerts */}
        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-8">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900">Recent Alerts</h2>
              <p className="text-[12px] text-gray-500">Latest activity</p>
            </div>
            <Link
              href="/alerts"
              className="text-[13px] font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              View all →
            </Link>
          </div>

          {alertsPending ? (
            <div className="divide-y divide-gray-50">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <Skeleton className="size-8 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                <Activity className="size-6 text-gray-400" />
              </div>
              <p className="mt-3 text-[14px] font-medium text-gray-900">No recent alerts</p>
              <p className="mt-1 text-[13px] text-gray-500">Create your first alert to get started</p>
              <LinkButton size="sm" href="/alerts/new" className="mt-4">
                <Plus className="size-4" /> Create Alert
              </LinkButton>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {alerts.map((alert) => (
                <Link
                  key={alert.id}
                  href={`/alerts/${alert.id}`}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-gray-50"
                >
                  {/* Severity icon */}
                  <SeverityBadge messageId={alert.message_id} showId={false} />

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-gray-900">
                      {alert.content || "No content"}
                    </p>
                    <p className="flex items-center gap-1.5 text-[12px] text-gray-500">
                      <span className="font-mono text-[11px]">{alert.message_id}</span>
                      <span>·</span>
                      <span>
                        {formatDistanceToNow(new Date(alert.created_at), {
                          addSuffix: true,
                          locale: enUS,
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
        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-4">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-[15px] font-semibold text-gray-900">Network</h2>
            <p className="text-[12px] text-gray-500">Cell status</p>
          </div>
          <div className="p-4">
            <NetworkPanel />
          </div>
        </section>
      </div>
    </m.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * StatCard - Minimalist style matching screenshot
 * ───────────────────────────────────────────────────────────────────────────── */

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  suffix?: string;
}

function StatCard({
  label,
  value,
  icon,
  iconBg = "bg-gray-100",
  iconColor = "text-gray-500",
  trend,
  suffix,
}: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-medium text-gray-500">{label}</span>
        <div className="flex items-baseline gap-0.5">
          <span className="text-[32px] font-semibold leading-none tracking-tight text-gray-900">
            {value}
          </span>
          {suffix && (
            <span className="text-[18px] font-medium text-gray-400">{suffix}</span>
          )}
        </div>
        {trend && (
          <span
            className={cn(
              "mt-0.5 text-[12px] font-medium",
              trend.positive !== false ? "text-emerald-500" : "text-red-500"
            )}
          >
            {trend.positive !== false ? "↗" : "↘"} {trend.value}
          </span>
        )}
      </div>
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          iconBg
        )}
      >
        <div className={cn("h-6 w-6", iconColor)}>{icon}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Skeletons
 * ───────────────────────────────────────────────────────────────────────────── */

function StatsSkeletons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      ))}
    </div>
  );
}
