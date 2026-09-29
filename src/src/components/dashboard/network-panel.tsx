"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { enUS } from "date-fns/locale";
import Link from "next/link";
import { ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCells } from "@/hooks/use-network";
import { cn } from "@/lib/utils";
import type { CellSite } from "@/types/domain";
import { cellState } from "@/lib/cmas/cell-state";

const CELL_DOT: Readonly<Record<string, string>> = {
  active: "bg-st-sent",
  offline: "bg-st-failed",
  maintenance: "sev-hatch ring-1 ring-inset ring-ink-3",
};

function lastSeen(cell: CellSite): string {
  return cell.last_seen
    ? formatDistanceToNowStrict(new Date(cell.last_seen), { locale: enUS, addSuffix: true })
    : "never seen";
}

/** One square per cell: dense, honest, and it replaces three separate "cells" KPIs. */
export function NetworkPanel() {
  const { data: cells, isPending, isError, error, refetch } = useCells();

  if (isError) return <ErrorState title="Unable to load cells" error={error} onRetry={() => void refetch()} />;

  if (isPending) {
    return (
      <div className="space-y-4" aria-busy="true">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const active = cells.filter((c) => cellState(c.status) === "online");
  const offline = cells.filter((c) => cellState(c.status) === "offline");
  const maintenance = cells.filter((c) => cellState(c.status) === "maintenance");

  return (
    <div>
      <p className="flex items-baseline gap-2">
        <span className="text-[28px] leading-8 font-medium tracking-[-0.02em] text-ink tabular-nums">{active.length}</span>
        <span className="text-[14px] text-ink-3 tabular-nums">active / {cells.length}</span>
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-2">
        <li className="flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-full bg-st-sent" />{active.length} active</li>
        <li className="flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-full bg-st-failed" />{offline.length} offline</li>
        <li className="flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-full ring-[1.5px] ring-inset ring-ink-3" />{maintenance.length} maintenance</li>
      </ul>

      <div className="mt-4 grid grid-cols-[repeat(auto-fill,10px)] gap-1 rounded-[var(--radius-md)] bg-surface-sunken p-3">
        {cells.map((cell) => (
          <Tooltip key={cell.id}>
            <TooltipTrigger
              render={
                <Link
                  href="/cells"
                  aria-label={`${cell.name}, ${cell.status}`}
                  className={cn("size-2.5 rounded-[2px]", CELL_DOT[cell.status] ?? "bg-ink-3")}
                />
              }
            />
            <TooltipContent>
              {cell.name} · {lastSeen(cell)}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {offline.length > 0 && (
        <div className="mt-5">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">Offline</p>
          <ul className="mt-2 space-y-1.5">
            {offline.slice(0, 5).map((cell) => (
              <li key={cell.id} className="flex items-center justify-between gap-3 text-[13px]">
                <span className="truncate text-ink">{cell.name}</span>
                <span className="shrink-0 font-mono text-[12px] text-st-failed-fg">{lastSeen(cell)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link href="/cells" className="mt-5 inline-block text-[13px] font-medium text-link hover:underline">
        View cells →
      </Link>
    </div>
  );
}
