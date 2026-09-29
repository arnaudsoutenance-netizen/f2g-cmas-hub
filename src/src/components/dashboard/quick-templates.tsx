"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { LinkButton } from "@/components/shared/link-button";
import { formatDuration } from "@/lib/cmas/composer-utils";
import type { Template } from "@/types/domain";
import { Panel } from "./panel";

/**
 * Ready-to-use templates as a numbered index (01, 02…), after omicron-ui's
 * showcase typography. Opening one prefills the composer; nothing is sent.
 */
export function QuickTemplates({ templates }: { templates: readonly Template[] }) {
  if (templates.length === 0) return null;
  // Full rows only (3 per row on wide screens), so the grid never ends with an empty cell.
  const shown = templates.length >= 6 ? 6 : Math.max(3, templates.length - (templates.length % 3));
  return (
    <Panel
      title="Start from a template"
      description="Prefills the composer. Nothing is broadcast until you confirm."
      action={
        <LinkButton href="/templates" variant="ghost" size="sm">
          All templates
        </LinkButton>
      }
    >
      <ol className="grid gap-px bg-hairline md:grid-cols-2 xl:grid-cols-3">
        {templates.slice(0, shown).map((tpl, i) => (
          <li key={tpl.id} className="bg-surface">
            <Link
              href={`/alerts/new?template=${encodeURIComponent(tpl.id)}`}
              className="group/tpl flex h-full gap-4 p-5 transition-colors hover:bg-surface-hover focus-visible:outline-offset-[-2px]"
            >
              <span className="tnum font-display text-[28px] leading-none font-bold text-ink-3 transition-colors group-hover/tpl:text-orange-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-ink">{tpl.name}</p>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 text-ink-3 transition-transform motion-reduce:transition-none group-hover/tpl:translate-x-0.5 group-hover/tpl:-translate-y-0.5 group-hover/tpl:text-orange-deep"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge messageId={tpl.message_id} size="sm" showId={false} />
                  <span className="text-[12px] text-ink-3">{formatDuration(tpl.default_duration)}</span>
                </div>
                <p className="line-clamp-2 text-[13px] leading-snug text-ink-3">{tpl.content}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
