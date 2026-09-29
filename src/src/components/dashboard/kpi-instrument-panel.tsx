"use client";

import Link from "next/link";
import { CountUp } from "@/components/shared/count-up";
import { ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/use-network";
import { cn } from "@/lib/utils";
import type { AlertStatus } from "@/types/domain";

const overline = "text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase";

interface LedgerSegment {
  status: AlertStatus;
  label: string;
  value: number;
  bar: string;
}

/** One instrument cluster divided by hairlines — deliberately not a row of KPI cards. */
export function KpiInstrumentPanel() {
  const { data: stats, isPending, isError, error, refetch } = useStats();

  if (isError) {
    return <ErrorState title="Could not load indicators" error={error} onRetry={() => void refetch()} />;
  }

  if (isPending) {
    return (
      <section className="grid rounded-[var(--radius-lg)] border border-hairline bg-surface lg:grid-cols-12" aria-busy="true">
        {[3, 6, 3].map((span, i) => (
          <div key={i} className={cn("space-y-4 p-5", span === 6 ? "lg:col-span-6" : "lg:col-span-3", i > 0 && "border-t border-hairline lg:border-t-0 lg:border-l")}>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </section>
    );
  }

  const { alerts, today, success_rate: rate } = stats;
  const ledger: LedgerSegment[] = [
    { status: "SENT", label: "Sent", value: alerts.sent, bar: "bg-st-sent" },
    { status: "SCHEDULED", label: "Scheduled", value: alerts.scheduled, bar: "bg-st-scheduled" },
    { status: "DRAFT", label: "Drafts", value: alerts.draft, bar: "bg-st-draft/70" },
    { status: "FAILED", label: "Failed", value: alerts.failed, bar: "bg-st-failed" },
  ];
  const ledgerTotal = Math.max(1, ledger.reduce((sum, s) => sum + s.value, 0));
  // The API reports 100 % when nothing has been sent yet; that is not a success rate.
  const hasDeliveries = alerts.sent + alerts.failed > 0;
  const rateTone = !hasDeliveries ? "text-ink-3" : rate < 90 ? "text-danger" : rate < 95 ? "text-sev-severe-fg" : "text-ink";

  return (
    <section aria-label="Indicators" className="grid rounded-[var(--radius-lg)] border border-hairline bg-surface lg:grid-cols-12">
      <div className="p-5 lg:col-span-3">
        <p className={overline}>Success rate</p>
        <p className={cn("mt-3 flex items-baseline gap-1 text-[48px] leading-[48px] font-medium tracking-[-0.03em]", rateTone)}>
          {hasDeliveries ? (
            <>
              <CountUp value={rate} />
              <span className="text-[14px] leading-5 text-ink-3">%</span>
            </>
          ) : (
            <span aria-label="No data">—</span>
          )}
        </p>
        <p className="mt-3 text-[13px] text-ink-3">
          {hasDeliveries ? "Alerts sent without cell failures." : "No alerts sent yet."}
        </p>
      </div>

      <div className="border-t border-hairline p-5 lg:col-span-6 lg:border-t-0 lg:border-l">
        <div className="flex items-baseline justify-between gap-4">
          <p className={overline}>Alert Registry</p>
          <p className="text-[28px] leading-8 font-medium tracking-[-0.02em] text-ink">
            <CountUp value={alerts.total} />
          </p>
        </div>
        <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-surface-sunken" role="img" aria-label={ledger.map((s) => `${s.label} ${s.value}`).join(", ")}>
          {ledger.map((s) => (
            <span key={s.status} className={s.bar} style={{ width: `${(s.value / ledgerTotal) * 100}%` }} />
          ))}
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          {ledger.map((s) => (
            <Link
              key={s.status}
              href={`/alerts?status=${s.status}`}
              className="-mx-1.5 rounded-[var(--radius-sm)] px-1.5 py-1 hover:bg-surface-hover"
            >
              <dt className="flex items-center gap-1.5 text-[12px] text-ink-2">
                <span aria-hidden className={cn("size-2 rounded-full", s.bar)} />
                {s.label}
              </dt>
              <dd className="mt-0.5 text-[20px] leading-7 font-medium text-ink tabular-nums">
                <CountUp value={s.value} />
              </dd>
            </Link>
          ))}
        </dl>
      </div>

      <div className="border-t border-hairline p-5 lg:col-span-3 lg:border-t-0 lg:border-l">
        <p className={overline}>Today</p>
        <dl className="mt-3 space-y-3">
          <div className="flex items-baseline gap-3">
            <dd className="text-[28px] leading-8 font-medium tracking-[-0.02em] text-ink">
              <CountUp value={today.sent} />
            </dd>
            <dt className="text-[13px] text-ink-2">sent</dt>
          </div>
          <div className="flex items-baseline gap-3">
            <dd className="text-[28px] leading-8 font-medium tracking-[-0.02em] text-ink">
              <CountUp value={today.scheduled} />
            </dd>
            <dt className="text-[13px] text-ink-2">scheduled</dt>
          </div>
        </dl>
      </div>
    </section>
  );
}
