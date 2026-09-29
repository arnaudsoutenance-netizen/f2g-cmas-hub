"use client";

import { format, formatDistanceToNowStrict } from "date-fns";
import { enUS } from "date-fns/locale";
import { m } from "framer-motion";
import { FileStack, Plus, TriangleAlert } from "lucide-react";
import { useSyncExternalStore } from "react";
import { LoginShader } from "@/components/auth/login-shader";
import { CountUp } from "@/components/shared/count-up";
import { LinkButton } from "@/components/shared/link-button";
import { cellState } from "@/lib/cmas/cell-state";
import { dur, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Alert, CellSite, DashboardStats } from "@/types/domain";

const noopSubscribe = () => () => {};

/** Hour of day on the client only; the server snapshot is null, so SSR never guesses the time zone. */
function useHour(): number | null {
  return useSyncExternalStore(noopSubscribe, () => new Date().getHours(), () => null);
}

function greeting(hour: number | null): string {
  if (hour === null) return "Welcome back";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: dur.slow * 1.6, ease: ease.emphasized },
});

type Readiness = { tone: "ok" | "warn" | "idle"; text: string };

function readinessOf(cells: readonly CellSite[] | undefined, stale: boolean, updatedAt: number): Readiness {
  // Stale or failed polling is never shown as ready (DESIGN.md: stale data is never green).
  if (stale) {
    return {
      tone: "idle",
      text: updatedAt > 0 ? `Network status unknown · last update ${format(updatedAt, "HH:mm")}` : "Network status unknown",
    };
  }
  if (cells === undefined) return { tone: "idle", text: "Checking the network…" };
  const total = cells.length;
  if (total === 0) return { tone: "idle", text: "No cell site configured yet" };
  const online = cells.filter((c) => cellState(c.status) === "online").length;
  if (online === total) return { tone: "ok", text: `All ${total} cell sites online · ready to broadcast` };
  if (online === 0) return { tone: "warn", text: `No cell site online (0/${total}) · broadcasts cannot reach phones` };
  return { tone: "warn", text: `${total - online} of ${total} cell sites not online · broadcasts will skip them` };
}

/**
 * Dashboard banner carrying the login screen's identity: the same navy shader,
 * Baloo headline and orange accent. It answers the operator's first question,
 * "can I broadcast right now?", before any number.
 */
export function CommandHero({
  stats,
  cells,
  cellsStale,
  cellsUpdatedAt,
  lastSent,
  userName,
}: {
  stats: DashboardStats | undefined;
  cells: readonly CellSite[] | undefined;
  cellsStale: boolean;
  cellsUpdatedAt: number;
  lastSent: Alert | undefined;
  userName: string | undefined;
}) {
  const hour = useHour();
  const firstName = userName?.split(" ")[0];
  const readiness = readinessOf(cells, cellsStale, cellsUpdatedAt);
  const delivered = (stats?.alerts.sent ?? 0) + (stats?.alerts.failed ?? 0);

  return (
    <section aria-labelledby="hero-title" className="dark relative isolate overflow-hidden rounded-[16px] bg-rail text-ink shadow-e2">
      <LoginShader className="absolute inset-0 -z-10 size-full opacity-40" />
      <span aria-hidden className="absolute -top-24 left-1/3 -z-10 size-80 rounded-full bg-brand-orange/10 blur-[100px]" />

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:items-end lg:gap-6">
        <div className="space-y-5 lg:col-span-7">
          <m.span
            {...rise(0.02)}
            className="inline-flex items-center gap-2 rounded-full border border-brand-orange/25 bg-brand-orange/10 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-orange-fg uppercase"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-brand-orange" />
            Cell Broadcast · Cameroon
          </m.span>

          <m.h1 {...rise(0.08)} id="hero-title" className="font-display text-[34px] leading-[1.05] font-bold tracking-tight sm:text-[42px]">
            <span className="sr-only">Dashboard · </span>
            {greeting(hour)}
            {firstName ? (
              <>
                ,{" "}
                <span className="bg-gradient-to-br from-rail-ink via-brand-orange to-orange-fg bg-clip-text text-transparent">
                  {firstName}
                </span>
              </>
            ) : null}
          </m.h1>

          <m.div {...rise(0.14)} role="status">
            {readiness.tone === "warn" ? (
              <p className="inline-flex items-start gap-2.5 rounded-[10px] border border-st-failed/40 bg-st-failed-tint/40 px-3 py-2 text-[16px] font-semibold text-ink">
                <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-st-failed" />
                {readiness.text}
              </p>
            ) : (
              <p className="flex items-center gap-2.5 text-[15px] text-ink-2">
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    readiness.tone === "ok" ? "status-pulse bg-st-sent text-st-sent" : "ring-[1.5px] ring-inset ring-ink-3",
                  )}
                />
                {readiness.text}
              </p>
            )}
          </m.div>

          <m.div {...rise(0.2)} className="flex flex-wrap gap-3">
            <LinkButton href="/alerts/new" size="lg" className="gap-2 bg-orange-deep text-orange-on hover:bg-orange-deep/90">
              <Plus aria-hidden className="size-4" />
              New alert
            </LinkButton>
            <LinkButton href="/templates" size="lg" variant="outline" className="gap-2">
              <FileStack aria-hidden className="size-4" />
              Templates
            </LinkButton>
          </m.div>
        </div>

        <m.dl {...rise(0.26)} className="grid grid-cols-3 gap-3 rounded-[12px] border border-hairline bg-surface/70 p-4 lg:col-span-5">
          <HeroFigure label="Last broadcast">
            {lastSent?.sent_at ? (
              <time dateTime={lastSent.sent_at} className="text-[0.62em]">
                {formatDistanceToNowStrict(new Date(lastSent.sent_at), { locale: enUS })}
              </time>
            ) : (
              "—"
            )}
          </HeroFigure>
          <HeroFigure label="Total broadcast">{stats ? <CountUp value={stats.alerts.sent} /> : "—"}</HeroFigure>
          <HeroFigure label="Success rate">
            {/* No deliveries yet means no rate, not 100 %. */}
            {stats && delivered > 0 ? (
              <>
                <CountUp value={stats.success_rate} />
                <span className="text-[0.55em] text-ink-2">%</span>
              </>
            ) : (
              "—"
            )}
          </HeroFigure>
        </m.dl>
      </div>
    </section>
  );
}

function HeroFigure({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col-reverse justify-between gap-1.5">
      <dt className="text-[10px] font-semibold tracking-[0.12em] text-balance text-ink-2 uppercase">{label}</dt>
      <dd className="tnum font-display text-[28px] leading-none font-bold text-orange-fg sm:text-[34px]">{children}</dd>
    </div>
  );
}
