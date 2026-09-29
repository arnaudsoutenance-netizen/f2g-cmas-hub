"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCells } from "@/hooks/use-network";
import { cn } from "@/lib/utils";

const TICKS = 7;

/** Persistent network summary: stale or failed polling never shows as green. */
export function NetworkStatus({ compact = false }: { compact?: boolean }) {
  const { data: cells, isError, isPending, dataUpdatedAt } = useCells();

  const total = cells?.length ?? 0;
  const active = cells?.filter((c) => c.status === "active").length ?? 0;
  const offline = cells?.filter((c) => c.status === "offline") ?? [];
  const maintenance = cells?.filter((c) => c.status === "maintenance") ?? [];
  const unknown = isError || isPending;

  const filled = total > 0 ? Math.round((active / total) * TICKS) : 0;
  const offlineTicks = total > 0 ? Math.min(TICKS - filled, Math.ceil((offline.length / total) * TICKS)) : 0;

  return (
    <Popover>
      <PopoverTrigger
        className="flex h-8 items-center gap-2.5 rounded-[var(--radius-sm)] border border-hairline bg-surface px-2.5 text-xs text-ink hover:bg-surface-hover"
        aria-label={unknown ? "Network status unknown" : `${active} active cells of ${total}`}
      >
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className={cn(
              "size-2 rounded-full",
              unknown ? "ring-[1.5px] ring-inset ring-ink-3" : isError ? "bg-st-failed" : "bg-st-sent",
            )}
          />
          <span className="font-mono font-medium">{unknown ? "Liaison inconnue" : "CBC"}</span>
        </span>
        {!unknown && (
          <>
            {!compact && (
              <span aria-hidden className="grid w-14 grid-cols-7 gap-[2px]">
                {Array.from({ length: TICKS }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 rounded-[1px]",
                      i < filled ? "bg-st-sent" : i < filled + offlineTicks ? "bg-st-failed" : "bg-hairline-strong",
                    )}
                  />
                ))}
              </span>
            )}
            <span className="font-mono tabular-nums">
              {active}/{total}
            </span>
            {!compact && offline.length > 0 && (
              <span className="text-st-failed-fg">· {offline.length} offline</span>
            )}
          </>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-hairline px-4 py-3">
          <p className="text-[15px] font-semibold text-ink">Broadcast Network</p>
          <p className="text-xs text-ink-3">
            {dataUpdatedAt > 0
              ? `Mis à jour il y a ${formatDistanceToNowStrict(dataUpdatedAt, { locale: fr })}`
              : "No data received"}
          </p>
        </div>
        <ul className="max-h-64 divide-y divide-hairline overflow-y-auto">
          {[...offline, ...maintenance].map((cell) => (
            <li key={cell.id} className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
              <span
                aria-hidden
                className={cn(
                  "size-2 rounded-full",
                  cell.status === "offline" ? "bg-st-failed" : "ring-[1.5px] ring-inset ring-ink-3",
                )}
              />
              <span className="flex-1 truncate text-ink">{cell.name}</span>
              <span className="font-mono text-[12px] text-ink-3">
                {cell.last_seen
                  ? formatDistanceToNowStrict(new Date(cell.last_seen), { locale: fr, addSuffix: true })
                  : cell.status === "maintenance"
                    ? "maintenance"
                    : "jamais vue"}
              </span>
            </li>
          ))}
          {!unknown && offline.length + maintenance.length === 0 && (
            <li className="px-4 py-3 text-[13px] text-ink-2">All cells are online.</li>
          )}
          {isError && <li className="px-4 py-3 text-[13px] text-danger">Le serveur ne répond pas.</li>}
        </ul>
        <div className="border-t border-hairline px-4 py-2.5">
          <Link href="/cells" className="text-[13px] font-medium text-link hover:underline">
            View cells →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
