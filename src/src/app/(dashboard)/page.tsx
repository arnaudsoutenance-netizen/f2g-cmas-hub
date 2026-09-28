"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { m } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import { AlertTimeline } from "@/components/dashboard/alert-timeline";
import { KpiInstrumentPanel } from "@/components/dashboard/kpi-instrument-panel";
import { NetworkPanel } from "@/components/dashboard/network-panel";
import { LinkButton } from "@/components/shared/link-button";
import { pageEnter } from "@/lib/motion";

export default function DashboardPage() {
  return (
    <m.div {...pageEnter} className="space-y-6 lg:space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] leading-[30px] font-semibold text-ink sm:text-[32px] sm:leading-9">
            Tableau de bord
          </h1>
          <p className="mt-1 text-[13px] text-ink-3 first-letter:uppercase">
            {format(new Date(), "EEEE d MMMM · HH:mm", { locale: fr })} WAT
          </p>
        </div>
        <LinkButton size="md" href="/alerts/new">
          <Plus aria-hidden className="size-4" /> Nouvelle alerte
        </LinkButton>
      </header>

      <KpiInstrumentPanel />

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="rounded-[var(--radius-lg)] border border-hairline bg-surface p-5 lg:col-span-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[18px] leading-[26px] font-semibold tracking-[-0.01em] text-ink">Alertes récentes</h2>
            <Link href="/alerts" className="text-[13px] font-medium text-link hover:underline">
              Toutes les alertes →
            </Link>
          </div>
          <AlertTimeline />
        </section>
        <section className="rounded-[var(--radius-lg)] border border-hairline bg-surface p-5 lg:col-span-4">
          <h2 className="mb-4 text-[18px] leading-[26px] font-semibold tracking-[-0.01em] text-ink">Réseau</h2>
          <NetworkPanel />
        </section>
      </div>
    </m.div>
  );
}
