"use client";

import { CircleCheck, TriangleAlert, WandSparkles } from "lucide-react";
import { useId, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    toast("Message converti en GSM-7", {
      description: "Les accents incompatibles ont été remplacés.",
      action: { label: "Annuler", onClick: () => onChange(previous) },
    });
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "overflow-hidden rounded-[12px] border bg-shell focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus",
          !sizing.fits || invalid ? "border-danger" : "border-control-border",
        )}
      >
        <label htmlFor={ids.textarea} className="sr-only">
          Message de l&apos;alerte
        </label>
        <textarea
          id={ids.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!sizing.fits || invalid}
          aria-describedby={ids.meter}
          placeholder="Rédigez le message tel qu'il apparaîtra sur les téléphones. Soyez bref : quoi, où, que faire."
          rows={8}
          className="block max-h-[420px] min-h-[220px] w-full resize-y bg-transparent px-4 py-3.5 text-[16px] leading-[26px] text-ink placeholder:text-ink-3 focus:outline-none"
        />
        <div
          id={ids.meter}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline bg-surface-sunken px-4 py-2.5 text-[12px]"
        >
          <span className="flex items-center gap-2" aria-label={`${filledPages} page(s) sur ${CBS_MAX_PAGES}`}>
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
            title={sizing.encoding === "UCS-2" ? "UCS-2 : 41 caractères par page au lieu de 93" : "GSM-7 : 93 caractères par page"}
          >
            {sizing.encoding === "GSM-7" ? <CircleCheck aria-hidden className="size-3.5" /> : <TriangleAlert aria-hidden className="size-3.5" />}
            {sizing.encoding}
          </span>
          <span aria-live="polite" className={cn("ml-auto font-mono tabular-nums", counterTone)}>
            {sizing.units} / {sizing.maxUnits} caractères
          </span>
        </div>
      </div>

      {sizing.encoding === "UCS-2" && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[8px] bg-sev-severe-tint px-3 py-2 text-[13px] text-sev-severe-fg">
          <TriangleAlert aria-hidden className="size-4 shrink-0" />
          <span>
            {sizing.nonGsmChars.length} caractère{sizing.nonGsmChars.length > 1 ? "s" : ""} force
            {sizing.nonGsmChars.length > 1 ? "nt" : ""} l&apos;encodage UCS-2 (615 caractères max au lieu de 1395) :
          </span>
          <span className="flex flex-wrap gap-1">
            {sizing.nonGsmChars.map((ch) => (
              <kbd key={ch} className="rounded-[4px] bg-shell px-1.5 font-mono text-[12px] text-ink">
                {ch === " " ? "espace" : ch}
              </kbd>
            ))}
          </span>
          <Button type="button" variant="ghost" size="sm" className="ml-auto text-sev-severe-fg" onClick={convert}>
            <WandSparkles aria-hidden className="size-3.5" /> Convertir en GSM-7
          </Button>
        </div>
      )}
      {!sizing.fits && (
        <p role="alert" className="text-[13px] text-danger">
          Message trop long : {sizing.units - sizing.maxUnits} caractère(s) en trop pour l&apos;encodage {sizing.encoding}.
        </p>
      )}
    </div>
  );
}
