"use client";

import { ArrowUpRight, Clock, EyeOff, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { LinkButton } from "@/components/shared/link-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { measureCbs } from "@/lib/cmas/cbs-encoding";
import { formatDuration } from "@/lib/cmas/composer-utils";
import { cn } from "@/lib/utils";
import type { Template } from "@/types/domain";

interface TemplateCardProps {
  template: Template;
  /** Stable 1-based position in the whole library (not in the filtered view). */
  index: number;
  canManage: boolean;
  onEdit: (template: Template) => void;
  onDelete: (template: Template) => void;
}

/** One template as a numbered index entry; "Use" prefills the composer and sends nothing. */
export function TemplateCard({ template, index, canManage, onEdit, onDelete }: TemplateCardProps) {
  const titleId = `tpl-${template.id}`;
  const inactive = !template.is_active;

  return (
    <li className="bg-surface">
      <article aria-labelledby={titleId} className="group/tpl flex h-full gap-4 p-5">
        <span
          aria-hidden
          className={cn(
            "tnum font-display text-[28px] leading-none font-bold transition-colors motion-reduce:transition-none",
            inactive ? "text-hairline-strong" : "text-ink-3 group-hover/tpl:text-orange-deep",
          )}
        >
          {String(index).padStart(2, "0")}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 id={titleId} className="leading-snug font-semibold break-words text-ink">
                {template.name}
              </h3>
              <p className="mt-0.5 truncate font-mono text-[12px] text-ink-3">{template.category}</p>
            </div>
            {canManage ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Manage template ${template.name}`}
                      className="-mt-1 -mr-2 text-ink-3 hover:text-ink"
                    />
                  }
                >
                  <MoreHorizontal aria-hidden />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => onEdit(template)}>
                    <Pencil aria-hidden />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => onDelete(template)}>
                    <Trash2 aria-hidden />
                    Delete…
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge messageId={template.message_id} size="sm" />
            <span className="inline-flex items-center gap-1 text-[12px] text-ink-3">
              <Clock aria-hidden className="size-3.5" />
              <span className="sr-only">Default duration</span>
              {formatDuration(template.default_duration)}
            </span>
            {inactive ? (
              <span className="inline-flex h-5 items-center gap-1 rounded-full bg-surface-sunken px-2 text-[11px] font-medium text-ink-2">
                <EyeOff aria-hidden className="size-3" />
                Inactive
              </span>
            ) : null}
          </div>

          <p className="line-clamp-3 text-[13px] leading-snug text-ink-2">{template.content}</p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-hairline pt-3">
            <CbsFootprint text={template.content} />
            {inactive ? (
              <span className="text-[12px] text-ink-3">Enable to use</span>
            ) : (
              <LinkButton
                href={`/alerts/new?template=${encodeURIComponent(template.id)}`}
                variant="outline"
                size="sm"
                aria-label={`Use template ${template.name}`}
                className="h-8 group-hover/tpl:border-orange-deep group-hover/tpl:text-orange-deep"
              >
                Use
                <ArrowUpRight aria-hidden data-icon="inline-end" />
              </LinkButton>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}

/** Encoding and page count on the cell broadcast channel (93 GSM-7 or 41 UCS-2 chars per page). */
export function CbsFootprint({ text }: { text: string }) {
  const cbs = measureCbs(text);
  const ucs2 = cbs.encoding === "UCS-2";
  const forcedBy = cbs.nonGsmChars.slice(0, 4).join(" ");
  return (
    <p className="flex min-w-0 items-center gap-2 text-[12px] text-ink-3">
      <span
        className={cn(
          "rounded-[var(--radius-xs)] px-1.5 py-0.5 font-mono text-[11px] font-medium",
          ucs2 ? "bg-orange-tint text-orange-fg" : "bg-surface-sunken text-ink-2",
        )}
        title={ucs2 ? `UCS-2 forced by: ${forcedBy}` : "GSM-7 default alphabet"}
      >
        {cbs.encoding}
      </span>
      <span className="tnum">
        {cbs.pages} page{cbs.pages === 1 ? "" : "s"} · {cbs.units} chars
      </span>
      {ucs2 ? <span className="sr-only">UCS-2 is forced by the characters {forcedBy}</span> : null}
      {!cbs.fits ? <span className="font-medium text-danger">Too long</span> : null}
    </p>
  );
}

/**
 * Closes the last row so the hairline grid never shows an empty cell: it spans
 * whatever is left of the row at each breakpoint (1, 2 or 3 columns).
 */
const SPAN_MD = ["md:col-span-2", "md:col-span-1"] as const;
const SPAN_XL = ["xl:col-span-3", "xl:col-span-2", "xl:col-span-1"] as const;

export function StartFromScratchTile({ itemCount }: { itemCount: number }) {
  return (
    <li className={cn("bg-surface", SPAN_MD[itemCount % 2], SPAN_XL[itemCount % 3])}>
      <Link
        href="/alerts/new"
        className="group/new flex h-full min-h-[120px] items-center gap-4 p-5 transition-colors hover:bg-surface-hover focus-visible:outline-offset-[-2px] motion-reduce:transition-none"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-dashed border-hairline-strong text-ink-3 transition-colors group-hover/new:border-orange-deep group-hover/new:text-orange-deep">
          <Plus aria-hidden className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold text-ink">Start from scratch</span>
          <span className="block text-[13px] text-ink-3">Compose a new alert without a template.</span>
        </span>
      </Link>
    </li>
  );
}
