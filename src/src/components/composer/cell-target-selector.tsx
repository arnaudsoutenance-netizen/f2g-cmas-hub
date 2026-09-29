"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { enUS } from "date-fns/locale";
import { RadioTower, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { useCells } from "@/hooks/use-network";
import { groupCellsByRegion } from "@/lib/cmas/composer-utils";
import { cn } from "@/lib/utils";
import type { CellSite } from "@/types/domain";
import { cellState } from "@/lib/cmas/cell-state";

interface CellTargetSelectorProps {
  value: string[];
  onChange: (ids: string[]) => void;
  /** Presidential alerts are normally national. */
  presidential?: boolean;
}

/** The backend refuses offline cells, so only active cells can be targeted. */
const selectable = (cell: CellSite) => cellState(cell.status) === "online";

function TriCheckbox({ checked, indeterminate, disabled, onChange, label }: {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      disabled={disabled}
      ref={(el) => {
        if (el) el.indeterminate = Boolean(indeterminate);
      }}
      onChange={onChange}
      className="size-4 shrink-0 accent-[var(--primary)] disabled:opacity-40"
    />
  );
}

export function CellTargetSelector({ value, onChange, presidential = false }: CellTargetSelectorProps) {
  const { data: cells, isPending, isError, error, refetch } = useCells();
  const [query, setQuery] = useState("");
  const selected = useMemo(() => new Set(value), [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (cells ?? []).filter((c) => !q || c.name.toLowerCase().includes(q) || c.cell_id.toLowerCase().includes(q));
  }, [cells, query]);

  if (isError) return <ErrorState title="Could not load cells" error={error} onRetry={() => void refetch()} />;
  if (isPending) {
    return (
      <div className="space-y-2" aria-busy="true">
        {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    );
  }
  if (cells.length === 0) {
    return <EmptyState icon={RadioTower} title="No cells configured" description="Add cells on the Cells page before broadcasting an alert." />;
  }

  const activeCells = cells.filter(selectable);
  const offlineCount = cells.length - activeCells.length;

  const toggle = (ids: string[], on: boolean) => {
    const next = new Set(selected);
    for (const id of ids) {
      if (on) next.add(id);
      else next.delete(id);
    }
    onChange([...next]);
  };

  const allActiveSelected = activeCells.length > 0 && activeCells.every((c) => selected.has(c.id));

  return (
    <div className="overflow-hidden rounded-[12px] border border-hairline bg-shell">
      <div className="flex flex-wrap items-center gap-3 border-b border-hairline px-4 py-3">
        <label className="relative min-w-[200px] flex-1">
          <span className="sr-only">Search for a cell</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-3" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cell name or identifier…"
            className="h-9 w-full rounded-[8px] border border-control-border bg-shell pr-3 pl-9 text-[13px] text-ink placeholder:text-ink-3"
          />
        </label>
        <button
          type="button"
          onClick={() => onChange(allActiveSelected ? [] : activeCells.map((c) => c.id))}
          className="h-9 rounded-[8px] border border-control-border px-3 text-[13px] font-medium text-ink hover:bg-surface-hover"
        >
          {allActiveSelected ? "Deselect all" : "All active cells (national)"}
        </button>
        <span className="font-mono text-[12px] text-ink-2 tabular-nums">
          {value.length} selected / {activeCells.length} active
        </span>
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        {groupCellsByRegion(filtered).map(([region, group]) => {
          const groupActive = group.filter(selectable);
          const chosen = groupActive.filter((c) => selected.has(c.id)).length;
          return (
            <div key={region} className="border-b border-hairline last:border-b-0">
              <div className="flex items-center gap-3 bg-surface-sunken px-4 py-2">
                <TriCheckbox
                  label={`Select ${region}`}
                  checked={groupActive.length > 0 && chosen === groupActive.length}
                  indeterminate={chosen > 0 && chosen < groupActive.length}
                  disabled={groupActive.length === 0}
                  onChange={() => toggle(groupActive.map((c) => c.id), chosen < groupActive.length)}
                />
                <span className="flex-1 text-[13px] font-semibold text-ink">{region}</span>
                <span className="font-mono text-[12px] text-ink-3 tabular-nums">
                  {chosen}/{groupActive.length}
                </span>
              </div>
              <ul>
                {group.map((cell) => {
                  const canSelect = selectable(cell);
                  return (
                    <li key={cell.id}>
                      <label className={cn("flex h-11 items-center gap-3 px-4 pl-11 text-[13px]", canSelect ? "cursor-pointer hover:bg-surface-hover" : "cursor-not-allowed opacity-70")}>
                        <TriCheckbox
                          label={cell.name}
                          checked={selected.has(cell.id)}
                          disabled={!canSelect}
                          onChange={() => toggle([cell.id], !selected.has(cell.id))}
                        />
                        <span
                          aria-hidden
                          className={cn(
                            "size-2 shrink-0 rounded-full",
                            cellState(cell.status) === "online" ? "bg-st-sent" : cellState(cell.status) === "offline" ? "bg-st-failed" : "ring-[1.5px] ring-inset ring-ink-3",
                          )}
                        />
                        <span className="min-w-0 flex-1 truncate font-medium text-ink">{cell.name}</span>
                        <span className="hidden font-mono text-[12px] text-ink-3 sm:inline">{cell.cell_id}</span>
                        <span className={cn("w-32 text-right text-[12px]", canSelect ? "text-ink-3" : "text-st-failed-fg")}>
                          {cellState(cell.status) === "offline"
                            ? "Offline"
                            : cellState(cell.status) === "maintenance"
                              ? "Maintenance"
                              : cell.last_seen
                                ? `seen ${formatDistanceToNowStrict(new Date(cell.last_seen), { locale: enUS, addSuffix: true })}`
                                : "Active"}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {(offlineCount > 0 || (presidential && value.length < activeCells.length)) && (
        <div className="space-y-1 border-t border-hairline bg-surface-sunken px-4 py-2.5 text-[12px]">
          {offlineCount > 0 && (
            <p className="text-st-failed-fg">
              {offlineCount} offline or maintenance cell{offlineCount === 1 ? "" : "s"} cannot be targeted.
            </p>
          )}
          {presidential && value.length < activeCells.length && (
            <p className="text-sev-presidential-fg">A presidential alert is normally national: all active cells.</p>
          )}
        </div>
      )}
    </div>
  );
}
