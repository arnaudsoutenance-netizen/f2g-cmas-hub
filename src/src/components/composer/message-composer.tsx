"use client";

import { CircleCheck, TriangleAlert, WandSparkles } from "lucide-react";
import { useId, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CBS_MAX_PAGES, measureCbs } from "@/lib/cmas/cbs-encoding";
import { convertToGsm7 } from "@/lib/cmas/composer-utils";
import { cn } from "@/lib/utils";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}

/** What you type is what the phone shows, with its encoding cost always visible. */
export function MessageComposer({ value, onChange, invalid }: MessageComposerProps) {
  const ids = { textarea: useId(), meter: useId() };
  const sizing = useMemo(() => measureCbs(value), [value]);
  const ratio = sizing.units / sizing.maxUnits;
  const counterTone = !sizing.fits ? "text-danger" : ratio >= 0.9 ? "text-sev-severe-fg" : "text-ink-2";
  const filledPages = value.length === 0 ? 0 : sizing.pages;

  const convert = () => {
    const previous = value;
    onChange(convertToGsm7(value));
    toast("Message converted to GSM-7", {
      description: "Incompatible accented characters were replaced.",
      action: { label: "Undo", onClick: () => onChange(previous) },
    });
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "overflow-hidden rounded-[12px] border bg-surface focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus",
          !sizing.fits || invalid ? "border-danger" : "border-control-border",
        )}
      >
        <label htmlFor={ids.textarea} className="sr-only">
          Alert message
        </label>
        <Textarea
          id={ids.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!sizing.fits || invalid}
          aria-describedby={ids.meter}
          placeholder="Write the message exactly as it will appear on handsets. Keep it short: what, where, what to do."
          rows={8}
          className="block max-h-[420px] min-h-[220px] w-full resize-y rounded-none border-0 bg-transparent px-4 py-3.5 text-[16px] leading-[26px] text-ink [field-sizing:fixed] placeholder:text-ink-3 focus:outline-none focus-visible:ring-0 aria-invalid:ring-0 md:text-[16px] dark:bg-transparent"
        />
        <div
          id={ids.meter}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline bg-surface-sunken px-4 py-2.5 text-[12px]"
        >
          <span className="flex items-center gap-2" aria-label={`${filledPages} of ${CBS_MAX_PAGES} page(s)`}>
            <span aria-hidden className="flex gap-[3px]">
              {Array.from({ length: CBS_MAX_PAGES }, (_, i) => (
                <span
                  key={i}
                  className={cn("h-2 w-1.5 rounded-[1px]", i < filledPages ? (sizing.fits ? "bg-ink-2" : "bg-danger") : "bg-hairline-strong")}
                />
              ))}
            </span>
            <span className="font-mono text-ink-2 tabular-nums">
              {filledPages}/{CBS_MAX_PAGES} pages
            </span>
          </span>
          <span
            className={cn("flex items-center gap-1 font-mono font-medium", sizing.encoding === "GSM-7" ? "text-st-sent-fg" : "text-sev-severe-fg")}
            title={sizing.encoding === "UCS-2" ? "UCS-2: 41 characters per page instead of 93" : "GSM-7: 93 characters per page"}
          >
            {sizing.encoding === "GSM-7" ? <CircleCheck aria-hidden className="size-3.5" /> : <TriangleAlert aria-hidden className="size-3.5" />}
            {sizing.encoding}
          </span>
          <span aria-live="polite" className={cn("ml-auto font-mono tabular-nums", counterTone)}>
            {sizing.units} / {sizing.maxUnits} characters
          </span>
        </div>
      </div>

      {sizing.encoding === "UCS-2" && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[8px] bg-sev-severe-tint px-3 py-2 text-[13px] text-sev-severe-fg">
          <TriangleAlert aria-hidden className="size-4 shrink-0" />
          <span>
            {sizing.nonGsmChars.length} character{sizing.nonGsmChars.length === 1 ? "" : "s"} force
            {sizing.nonGsmChars.length === 1 ? "s" : ""} UCS-2 encoding (615 characters max instead of 1395):
          </span>
          <span className="flex flex-wrap gap-1">
            {sizing.nonGsmChars.map((ch) => (
              <kbd key={ch} className="rounded-[4px] bg-surface px-1.5 font-mono text-[12px] text-ink">
                {ch === " " ? "space" : ch}
              </kbd>
            ))}
          </span>
          <Button type="button" variant="ghost" size="sm" className="ml-auto text-sev-severe-fg" onClick={convert}>
            <WandSparkles aria-hidden className="size-3.5" /> Convert to GSM-7
          </Button>
        </div>
      )}
      {!sizing.fits && (
        <p role="alert" className="text-[13px] text-danger">
          Message too long: {sizing.units - sizing.maxUnits} character(s) over the {sizing.encoding} limit.
        </p>
      )}
    </div>
  );
}
