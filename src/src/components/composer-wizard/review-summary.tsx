"use client";

import { Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { Button } from "@/components/ui/button";
import { classifyMessageId } from "@/lib/cmas/alert-classes";
import { type CbsSizing } from "@/lib/cmas/cbs-encoding";
import { cellState } from "@/lib/cmas/cell-state";
import { formatDuration, groupCellsByRegion } from "@/lib/cmas/composer-utils";
import type { CellSite } from "@/types/domain";
import type { StepIndex } from "./steps";

interface ReviewSummaryProps {
  messageId: number | null;
  message: string;
  sizing: CbsSizing;
  cellIds: readonly string[];
  cells: readonly CellSite[] | undefined;
  durationS: number;
  onEdit: (step: StepIndex) => void;
}

function Row({ label, editLabel, onEdit, children }: { label: string; editLabel?: string; onEdit?: () => void; children: ReactNode }) {
  return (
    <div className="grid gap-x-4 gap-y-2 px-4 py-3.5 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-start">
      <dt className="pt-0.5 text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">{label}</dt>
      <dd className="min-w-0 text-[14px] text-ink">{children}</dd>
      {onEdit && editLabel ? (
        <dd className="sm:-my-1">
          <Button variant="ghost" size="sm" onClick={onEdit} aria-label={editLabel} className="h-8 px-2.5 text-[13px] text-link">
            <Pencil aria-hidden className="size-3.5" /> Edit
          </Button>
        </dd>
      ) : (
        <dd className="hidden sm:block" />
      )}
    </div>
  );
}

/** Everything that will go on air, in reading order, each with a way back to its step. */
export function ReviewSummary({ messageId, message, sizing, cellIds, cells, durationS, onEdit }: ReviewSummaryProps) {
  const cls = messageId === null ? undefined : classifyMessageId(messageId);
  const selected = new Set(cellIds);
  const chosen = (cells ?? []).filter((c) => selected.has(c.id));
  const activeCount = (cells ?? []).filter((c) => cellState(c.status) === "online").length;
  const regions = groupCellsByRegion(chosen);
  const national = activeCount > 0 && chosen.length === activeCount;

  return (
    <dl className="divide-y divide-hairline overflow-hidden rounded-[12px] border border-hairline">
      <Row label="Class" editLabel="Edit alert class" onEdit={() => onEdit(0)}>
        {messageId !== null && cls ? (
          <span className="flex flex-wrap items-center gap-2">
            <SeverityBadge messageId={messageId} />
            <span className="text-[13px] text-ink-3">{cls.alertType}</span>
          </span>
        ) : (
          <span className="text-ink-3">Not chosen</span>
        )}
      </Row>

      <Row label="Message" editLabel="Edit message" onEdit={() => onEdit(1)}>
        <blockquote className="max-h-40 overflow-y-auto rounded-[8px] bg-surface-sunken px-3.5 py-2.5 text-[15px] leading-6 whitespace-pre-wrap">
          {message.trim() || <span className="text-ink-3 italic">Empty</span>}
        </blockquote>
        <p className="mt-1.5 font-mono text-[12px] text-ink-3">
          {sizing.encoding} · {message ? sizing.pages : 0} page{sizing.pages > 1 ? "s" : ""} · {sizing.units} / {sizing.maxUnits} characters
        </p>
      </Row>

      <Row label="Cells" editLabel="Edit target cells" onEdit={() => onEdit(2)}>
        <p>
          <span className="tnum font-semibold">{cellIds.length}</span> cell{cellIds.length === 1 ? "" : "s"}
          {regions.length > 0 && (
            <span className="text-ink-3">
              {" "}
              in {regions.length} region{regions.length === 1 ? "" : "s"}
            </span>
          )}
          {national && <span className="text-ink-3"> · all active cells (national)</span>}
        </p>
        {regions.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Cells per region">
            {regions.map(([region, group]) => (
              <li key={region} className="rounded-[6px] bg-surface-sunken px-2 py-0.5 text-[12px] text-ink-2">
                {region} <span className="tnum font-mono text-ink">{group.length}</span>
              </li>
            ))}
          </ul>
        )}
      </Row>

      <Row label="Duration">
        <span className="font-mono">{formatDuration(durationS)}</span>
        <span className="text-ink-3"> · immediate send</span>
      </Row>
    </dl>
  );
}
