"use client";

import { CircleCheck, CircleHelp, CircleX, RadioTower, Wrench, type LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/states";
import { LinkButton } from "@/components/shared/link-button";
import { Skeleton } from "@/components/ui/skeleton";
import { CELL_STATE_LABEL, cellState, type CellState } from "@/lib/cmas/cell-state";
import { groupCellsByRegion } from "@/lib/cmas/composer-utils";
import { cn } from "@/lib/utils";
import type { CellSite } from "@/types/domain";
import { Panel } from "./panel";

/** Icon plus colour, so the state survives grayscale and colour-blindness (WCAG 1.4.1). */
const STATE_ICON: Record<CellState, { icon: LucideIcon; className: string }> = {
  online: { icon: CircleCheck, className: "text-st-sent-fg" },
  offline: { icon: CircleX, className: "text-st-failed-fg" },
  maintenance: { icon: Wrench, className: "text-sev-severe-fg" },
  unknown: { icon: CircleHelp, className: "text-ink-3" },
};

/** Cell sites grouped by region with a ring showing the share that is online. */
export function NetworkStatusPanel({ cells, pending }: { cells: readonly CellSite[]; pending: boolean }) {
  const online = cells.filter((c) => cellState(c.status) === "online").length;
  const share = cells.length === 0 ? 0 : online / cells.length;

  return (
    <Panel
      title="Network"
      description="eNodeB / gNodeB cell sites"
      action={
        <LinkButton href="/cells" variant="ghost" size="sm">
          Manage
        </LinkButton>
      }
    >
      {pending ? (
        <div className="space-y-3 p-5">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      ) : cells.length === 0 ? (
        <EmptyState icon={RadioTower} title="No cell site yet" description="Add an eNodeB to start targeting broadcasts." className="m-5" />
      ) : (
        <div className="space-y-5 p-5">
          <div className="flex items-center gap-4">
            <OnlineRing share={share} />
            <div>
              <p className="tnum font-display text-[28px] leading-none font-bold text-ink">
                {online}
                <span className="text-[16px] text-ink-3">/{cells.length}</span>
              </p>
              <p className="mt-1 text-[13px] text-ink-3">cell sites online</p>
            </div>
          </div>

          <ul className="space-y-4">
            {groupCellsByRegion(cells).map(([region, group]) => (
              <li key={region}>
                <p className="mb-2 text-[11px] font-semibold tracking-[0.1em] text-ink-3 uppercase">{region}</p>
                <ul className="space-y-2">
                  {group.map((cell) => {
                    const state = cellState(cell.status);
                    const { icon: Icon, className } = STATE_ICON[state];
                    return (
                      <li
                        key={cell.id}
                        className="rounded-lg border border-hairline bg-surface-sunken px-3 py-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Icon aria-hidden className={cn("size-4", className)} />
                            <div>
                              <p className="font-mono text-[13px] font-medium text-ink">{cell.cell_id}</p>
                              <p className="text-[11px] text-ink-3">{cell.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {state !== "online" && (
                              <p className={cn("text-[11px] font-medium", className)}>{CELL_STATE_LABEL[state]}</p>
                            )}
                          </div>
                        </div>
                        {/* Technical details row */}
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-hairline pt-2">
                          <span className="inline-flex items-center gap-1 text-[11px]">
                            <span className="text-ink-3">TAC</span>
                            <span className="font-mono text-ink-2">{cell.tac}</span>
                          </span>
                          {cell.pci !== undefined && cell.pci !== null && (
                            <span className="inline-flex items-center gap-1 text-[11px]">
                              <span className="text-ink-3">PCI</span>
                              <span className="font-mono text-ink-2">{cell.pci}</span>
                            </span>
                          )}
                          {cell.earfcn !== undefined && cell.earfcn !== null && (
                            <span className="inline-flex items-center gap-1 text-[11px]">
                              <span className="text-ink-3">EARFCN</span>
                              <span className="font-mono text-ink-2">{cell.earfcn}</span>
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-[11px]">
                            <span className="text-ink-3">IP</span>
                            <span className="font-mono text-ink-2">{cell.enb_ip}</span>
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}

/** SVG ring; the number is repeated in text next to it. */
function OnlineRing({ share }: { share: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 56 56" className="size-14 shrink-0 -rotate-90" aria-hidden>
      <circle cx="28" cy="28" r={r} fill="none" strokeWidth="6" className="stroke-hairline-strong" />
      {share > 0 ? (
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - share)}
          className={cn(
            "transition-[stroke-dashoffset] duration-700 motion-reduce:transition-none",
            share === 1 ? "stroke-st-sent" : "stroke-sev-severe-edge",
          )}
        />
      ) : (
        <circle cx="28" cy="28" r={r} fill="none" strokeWidth="6" strokeDasharray="4 5" className="stroke-st-failed" />
      )}
    </svg>
  );
}
