"use client";

import { CircleCheck, CircleDashed, CircleX, RadioTower, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Panel } from "@/components/dashboard/panel";
import { EmptyState } from "@/components/shared/states";
import { AlertStatusTimeline } from "@/components/ui/status-timeline";
import { classifyMessageId, MESSAGE_ID_SUBLABELS } from "@/lib/cmas/alert-classes";
import { formatDuration } from "@/lib/cmas/composer-utils";
import { SEVERITY_STYLES } from "@/lib/cmas/severity-styles";
import { cn } from "@/lib/utils";
import type { AlertCell, AlertDetail, AlertLog, CellSite } from "@/types/domain";
import { formatFull, formatRelative, formatShort } from "./alert-dates";

/** The broadcast text, set large, with the class colour as a left edge. */
export function MessagePanel({ alert }: { alert: AlertDetail }) {
  const alertClass = classifyMessageId(alert.message_id);
  const edge = alertClass ? SEVERITY_STYLES[alertClass.tone].edgeBg : "bg-hairline-strong";
  const chars = alert.content.length;
  return (
    <Panel title="Message" description={`${chars} character${chars === 1 ? "" : "s"} · shown on handsets as ${alertClass?.handsetTitle ?? "an alert"}`}>
      <div className="relative px-5 py-5 pl-7">
        <span aria-hidden className={cn("absolute top-5 bottom-5 left-5 w-1 rounded-full", edge)} />
        <blockquote className="text-[17px] leading-relaxed break-words whitespace-pre-wrap text-ink sm:text-[19px]">
          {alert.content || <span className="text-ink-3 italic">No message</span>}
        </blockquote>
      </div>
    </Panel>
  );
}

function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[112px_1fr] gap-3 px-5 py-2.5 sm:grid-cols-[140px_1fr]">
      <dt className="text-[13px] text-ink-3">{term}</dt>
      <dd className="min-w-0 text-[13px] text-ink">{children}</dd>
    </div>
  );
}

function When({ iso }: { iso: string | null }) {
  if (!iso) return <span className="text-ink-3">—</span>;
  return (
    <time dateTime={iso} className="tabular-nums">
      {formatFull(iso)} <span className="text-ink-3">· {formatRelative(iso)}</span>
    </time>
  );
}

export function DetailsPanel({ alert }: { alert: AlertDetail }) {
  const alertClass = classifyMessageId(alert.message_id);
  const sub = MESSAGE_ID_SUBLABELS[alert.message_id];
  return (
    <Panel title="Details" description="Identifiers and timing">
      <dl className="divide-y divide-hairline py-1">
        <Row term="Alert ID">
          <span className="font-mono text-[12px] break-all text-ink-2">{alert.id}</span>
        </Row>
        <Row term="Message ID">
          <span className="font-mono tabular-nums">{alert.message_id}</span>
          {sub ? <span className="text-ink-3"> · {sub}</span> : null}
        </Row>
        <Row term="Type">
          {alert.alert_type}
          {alertClass ? <span className="text-ink-3"> · {alertClass.label}</span> : null}
        </Row>
        <Row term="Duration">{formatDuration(alert.duration)}</Row>
        <Row term="Created">
          <When iso={alert.created_at} />
        </Row>
        {alert.scheduled_at ? (
          <Row term="Scheduled for">
            <When iso={alert.scheduled_at} />
          </Row>
        ) : null}
        <Row term="Sent">
          <When iso={alert.sent_at} />
        </Row>
        {alert.expires_at ? (
          <Row term="Expires">
            <When iso={alert.expires_at} />
          </Row>
        ) : null}
        {alert.created_by_user ? <Row term="Created by">{alert.created_by_user.name}</Row> : null}
      </dl>
    </Panel>
  );
}

const LOG_LABEL: Record<string, string> = {
  CREATED: "Created",
  UPDATED: "Edited",
  SENDING: "Broadcast started",
  SENT: "Broadcast completed",
  FAILED: "Broadcast failed",
  CANCELLED: "Cancelled",
};

function logLabel(log: AlertLog): string {
  return LOG_LABEL[log.action] ?? log.action.charAt(0) + log.action.slice(1).toLowerCase();
}

/** Lifecycle stepper, then the audit log returned by the API. */
export function LifecyclePanel({ alert }: { alert: AlertDetail }) {
  const logs = [...alert.logs].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const sendingLog = alert.logs.find((l) => l.action === "SENDING");
  const endLog = alert.logs.find((l) => l.action === "FAILED" || l.action === "CANCELLED");

  return (
    <Panel title="Lifecycle" description="Where this alert stands">
      <div className="px-3 pt-6 pb-4 sm:px-6">
        <AlertStatusTimeline
          currentStatus={alert.status}
          timestamps={{
            DRAFT: formatShort(alert.created_at),
            SCHEDULED: alert.scheduled_at ? formatShort(alert.scheduled_at) : undefined,
            SENDING: sendingLog ? formatShort(sendingLog.timestamp) : undefined,
            SENT: alert.sent_at ? formatShort(alert.sent_at) : undefined,
            FAILED: endLog ? formatShort(endLog.timestamp) : undefined,
            CANCELLED: endLog ? formatShort(endLog.timestamp) : undefined,
          }}
        />
      </div>
      {logs.length > 0 ? (
        <div className="border-t border-hairline px-5 py-4">
          <h3 className="text-[12px] font-semibold tracking-[0.08em] text-ink-3 uppercase">Activity</h3>
          <ol className="relative mt-3 space-y-3">
            <span aria-hidden className="absolute top-1.5 bottom-1.5 left-[4px] w-px bg-hairline-strong" />
            {logs.map((log) => (
              <li key={log.id} className="relative flex gap-3">
                <span aria-hidden className="relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full bg-surface ring-[1.5px] ring-ink-3 ring-inset" />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-baseline justify-between gap-x-3 text-[13px]">
                    <span className="font-medium text-ink">{logLabel(log)}</span>
                    <time dateTime={log.timestamp} title={formatFull(log.timestamp)} className="text-[12px] text-ink-3 tabular-nums">
                      {formatShort(log.timestamp)}
                    </time>
                  </p>
                  {log.message ? <p className="mt-0.5 text-[12px] break-words text-ink-2">{log.message}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </Panel>
  );
}

const CELL_STATUS: Record<string, { label: string; icon: LucideIcon; chip: string }> = {
  sent: { label: "Delivered", icon: CircleCheck, chip: "bg-st-sent-tint text-st-sent-fg" },
  failed: { label: "Failed", icon: CircleX, chip: "bg-st-failed-tint text-st-failed-fg" },
  pending: { label: "Pending", icon: CircleDashed, chip: "bg-surface-sunken text-ink-2" },
};

function cellStatus(cell: AlertCell) {
  return CELL_STATUS[cell.status] ?? CELL_STATUS.pending;
}

/** `cells[].cell_id` is the cell-site UUID; the site list gives it a readable name and code. */
export function CellsPanel({ alert, sites }: { alert: AlertDetail; sites: readonly CellSite[] | undefined }) {
  const byId = new Map((sites ?? []).map((s) => [s.id, s]));
  const cells = alert.cells;
  const delivered = cells.filter((c) => c.status === "sent").length;
  const failed = cells.filter((c) => c.status === "failed").length;
  const summary =
    cells.length === 0
      ? "No cell targeted"
      : [`${cells.length} cell${cells.length === 1 ? "" : "s"}`, delivered ? `${delivered} delivered` : null, failed ? `${failed} failed` : null]
          .filter(Boolean)
          .join(" · ");

  return (
    <Panel title="Target cells" description={summary}>
      {cells.length === 0 ? (
        <EmptyState icon={RadioTower} title="No target cell" description="This alert has no cell attached." className="px-5 py-8" />
      ) : (
        <ul className="divide-y divide-hairline">
          {cells.map((cell) => {
            const st = cellStatus(cell);
            const site = byId.get(cell.cell_id);
            return (
              <li key={cell.id} className="flex items-center gap-3 px-5 py-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-sunken text-ink-2">
                  <RadioTower aria-hidden className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{cell.cell_name ?? site?.name ?? "Unknown cell site"}</p>
                  <p className="truncate font-mono text-[12px] text-ink-3">
                    {site?.cell_id ?? cell.cell_id}
                    {cell.sent_at ? ` · ${formatShort(cell.sent_at)}` : ""}
                  </p>
                </div>
                <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium", st.chip)}>
                  <st.icon aria-hidden className="size-3.5" />
                  {st.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
