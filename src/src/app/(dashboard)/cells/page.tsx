"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { enUS } from "date-fns/locale";
import { CircleCheck, CircleHelp, CircleX, RadioTower, Wrench, type LucideIcon } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { useCells } from "@/hooks/use-network";
import { CELL_STATE_LABEL, cellState, type CellState } from "@/lib/cmas/cell-state";
import { groupCellsByRegion } from "@/lib/cmas/composer-utils";
import { cn } from "@/lib/utils";

const STATE_STYLE: Record<CellState, { icon: LucideIcon; text: string; chip: string }> = {
  online: { icon: CircleCheck, text: "text-st-sent-fg", chip: "bg-st-sent-tint text-st-sent-fg" },
  offline: { icon: CircleX, text: "text-st-failed-fg", chip: "bg-st-failed-tint text-st-failed-fg" },
  maintenance: { icon: Wrench, text: "text-sev-severe-fg", chip: "bg-sev-severe-tint text-sev-severe-fg" },
  unknown: { icon: CircleHelp, text: "text-ink-3", chip: "bg-surface-sunken text-ink-2" },
};

/** Cell sites grouped by region; offline sites first in each group. */
export default function CellsPage() {
  const { data: cells, isPending, isError, error, refetch, dataUpdatedAt } = useCells();

  const counts = { online: 0, offline: 0, maintenance: 0, unknown: 0 } satisfies Record<CellState, number>;
  for (const cell of cells ?? []) counts[cellState(cell.status)] += 1;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] leading-tight font-bold text-ink">Cells</h1>
          <p className="mt-0.5 text-[14px] text-ink-3">
            eNodeB / gNodeB sites that receive broadcasts
            {dataUpdatedAt > 0 ? ` · updated ${formatDistanceToNowStrict(dataUpdatedAt, { locale: enUS })} ago` : ""}
          </p>
        </div>
      </header>

      {isError ? (
        <ErrorState title="Unable to load cells" error={error} onRetry={() => void refetch()} />
      ) : isPending ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-busy>
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-32 rounded-[16px]" />
          ))}
        </div>
      ) : cells.length === 0 ? (
        <EmptyState icon={RadioTower} title="No cell site yet" description="Cell sites are added by an administrator from the backend." />
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(Object.keys(counts) as CellState[]).map((state) => {
              const { icon: Icon, text } = STATE_STYLE[state];
              return (
                <div key={state} className="rounded-[16px] border border-hairline bg-surface p-4 shadow-e1">
                  <dt className={cn("flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.08em] uppercase", text)}>
                    <Icon aria-hidden className="size-3.5" />
                    {CELL_STATE_LABEL[state]}
                  </dt>
                  <dd className="tnum mt-2 font-display text-[32px] leading-none font-bold text-ink">{counts[state]}</dd>
                </div>
              );
            })}
          </dl>

          {groupCellsByRegion(cells).map(([region, group]) => (
            <Panel key={region} title={region} description={`${group.length} site${group.length === 1 ? "" : "s"}`}>
              <ul className="-mr-px -mb-px grid md:grid-cols-2 xl:grid-cols-3">
                {[...group]
                  .sort((a, b) => Number(cellState(a.status) === "online") - Number(cellState(b.status) === "online") || a.name.localeCompare(b.name, "en"))
                  .map((cell) => {
                    const state = cellState(cell.status);
                    const { icon: Icon, chip } = STATE_STYLE[state];
                    return (
                      <li key={cell.id} className="space-y-3 border-r border-b border-hairline p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-ink">{cell.name}</p>
                            <p className="font-mono text-[12px] text-ink-3">{cell.cell_id}</p>
                          </div>
                          <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium", chip)}>
                            <Icon aria-hidden className="size-3.5" />
                            {CELL_STATE_LABEL[state]}
                          </span>
                        </div>
                        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[12px]">
                          <dt className="text-ink-3">eNodeB</dt>
                          <dd className="truncate font-mono text-ink-2">{cell.enb_ip}</dd>
                          {cell.location ? (
                            <>
                              <dt className="text-ink-3">Location</dt>
                              <dd className="truncate text-ink-2">{cell.location}</dd>
                            </>
                          ) : null}
                          <dt className="text-ink-3">Last seen</dt>
                          <dd className="text-ink-2">
                            {cell.last_seen
                              ? formatDistanceToNowStrict(new Date(cell.last_seen), { addSuffix: true, locale: enUS })
                              : "Never"}
                          </dd>
                        </dl>
                      </li>
                    );
                  })}
              </ul>
            </Panel>
          ))}
        </>
      )}
    </div>
  );
}
