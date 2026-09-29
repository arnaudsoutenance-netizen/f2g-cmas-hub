"use client";

import { m, useReducedMotion } from "framer-motion";
import { ALERT_CLASSES, classifyMessageId, type SeverityTone } from "@/lib/cmas/alert-classes";
import { dur, ease } from "@/lib/motion";
import type { Alert } from "@/types/domain";
import { Panel } from "./panel";

/** Bar fill per tone. Severity colours are allowed here: the chart is about alert classes. */
const BAR: Record<SeverityTone, string> = {
  presidential: "bg-sev-presidential",
  extreme: "bg-sev-extreme",
  severe: "bg-sev-severe ring-1 ring-sev-severe-edge ring-inset",
  amber: "bg-sev-amber",
  etws: "bg-sev-etws",
  test: "bg-sev-test",
};

/** Share of each alert class among alerts that actually went out (sent or failed), largest first. */
export function ClassMixPanel({ alerts }: { alerts: readonly Alert[] }) {
  const reduce = useReducedMotion();
  const broadcast = alerts.filter((a) => a.status === "SENT" || a.status === "FAILED");
  const counts = new Map<string, number>();
  for (const alert of broadcast) {
    const key = classifyMessageId(alert.message_id)?.key;
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const rows = ALERT_CLASSES.filter((c) => counts.has(c.key))
    .map((c) => ({ cls: c, count: counts.get(c.key) ?? 0 }))
    .sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...rows.map((r) => r.count));

  return (
    <Panel title="Alert classes" description={`Broadcast alerts, last ${broadcast.length}`}>
      {rows.length === 0 ? (
        <p className="p-5 text-[13px] text-ink-3">Nothing broadcast yet. Drafts are not counted.</p>
      ) : (
        <ul className="space-y-3 p-5">
          {rows.map(({ cls, count }, i) => (
            <li key={cls.key} className="space-y-1.5">
              <div className="flex items-baseline justify-between text-[13px]">
                <span className="font-medium text-ink-2">{cls.label}</span>
                <span className="tnum text-ink-3">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-sunken">
                <m.div
                  className={`h-full rounded-full ${BAR[cls.tone]}`}
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${(count / max) * 100}%` }}
                  transition={{ delay: 0.1 + i * 0.05, duration: dur.slow * 2, ease: ease.emphasized }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
