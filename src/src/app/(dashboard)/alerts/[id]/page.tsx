"use client";

import { m, useReducedMotion } from "framer-motion";
import { ArrowLeft, SearchX } from "lucide-react";
import { useParams } from "next/navigation";
import { formatRelative } from "@/components/alerts-page/alert-dates";
import { CellsPanel, DetailsPanel, LifecyclePanel, MessagePanel } from "@/components/alerts-page/alert-detail-sections";
import { AlertStatusPill } from "@/components/alerts/alert-status-pill";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { LinkButton } from "@/components/shared/link-button";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlert } from "@/hooks/use-alerts";
import { useCells } from "@/hooks/use-network";
import { ApiError } from "@/lib/api/client";
import { classifyMessageId } from "@/lib/cmas/alert-classes";
import { pageEnter } from "@/lib/motion";

function BackLink() {
  return (
    <LinkButton href="/alerts" variant="ghost" size="sm" className="-ml-2 text-ink-2">
      <ArrowLeft aria-hidden className="size-3.5" /> All alerts
    </LinkButton>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy aria-label="Loading alert">
      <div className="space-y-3">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Skeleton className="h-[180px] rounded-[16px]" />
          <Skeleton className="h-[220px] rounded-[16px]" />
        </div>
        <div className="space-y-6 lg:col-span-5">
          <Skeleton className="h-[360px] rounded-[16px]" />
        </div>
      </div>
    </div>
  );
}

/** Read-only view of one alert. Sending and cancelling live in the composer, not here. */
export default function AlertDetailPage() {
  const reduce = useReducedMotion();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: alert, isPending, isError, error, refetch } = useAlert(id);
  const sites = useCells();

  if (isPending) return <DetailSkeleton />;

  if (isError) {
    const notFound = error instanceof ApiError && (error.status === 404 || error.status === 422);
    return (
      <div className="space-y-4">
        <BackLink />
        {notFound ? (
          <EmptyState
            icon={SearchX}
            title="Alert not found"
            description="It may have been deleted, or the link is wrong."
            action={<LinkButton href="/alerts">Back to alerts</LinkButton>}
          />
        ) : (
          <ErrorState title="Unable to load this alert" error={error} onRetry={() => void refetch()} />
        )}
      </div>
    );
  }

  const alertClass = classifyMessageId(alert.message_id);
  const title = alertClass ? alertClass.handsetTitle : `Message ID ${alert.message_id}`;

  return (
    <m.div {...(reduce ? {} : pageEnter)} className="space-y-6">
      <header className="space-y-3">
        <BackLink />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge messageId={alert.message_id} />
              <AlertStatusPill status={alert.status} scheduledAt={alert.scheduled_at} />
            </div>
            <h1 className="font-display text-[28px] leading-tight font-bold text-ink">{title}</h1>
            <p className="text-[14px] text-ink-3">
              {alert.alert_type} · <span className="font-mono">{alert.id.slice(0, 8)}</span> · created {formatRelative(alert.created_at)}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="min-w-0 space-y-6 lg:col-span-7">
          <MessagePanel alert={alert} />
          <LifecyclePanel alert={alert} />
          <CellsPanel alert={alert} sites={sites.data} />
        </div>
        <div className="min-w-0 space-y-6 lg:col-span-5">
          <DetailsPanel alert={alert} />
        </div>
      </div>
    </m.div>
  );
}
