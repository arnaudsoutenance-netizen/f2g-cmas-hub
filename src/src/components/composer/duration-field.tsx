"use client";

import { CalendarClock, Clock } from "lucide-react";
import { Slider } from "@base-ui/react/slider";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  clampDuration,
  DURATION_MAX_S,
  DURATION_MIN_S,
  DURATION_PRESETS_S,
  DURATION_STOPS_S,
  formatDuration,
} from "@/lib/cmas/composer-utils";
import { cn } from "@/lib/utils";

/** Index of the nearest slider stop for a duration. */
function stopIndex(seconds: number): number {
  let best = 0;
  DURATION_STOPS_S.forEach((stop, i) => {
    if (Math.abs(stop - seconds) < Math.abs((DURATION_STOPS_S[best] ?? 0) - seconds)) best = i;
  });
  return best;
}

export function DurationField({ value, onChange }: { value: number; onChange: (seconds: number) => void }) {
  const ids = { slider: useId(), minutes: useId(), label: useId() };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span id={ids.label} className="text-[13px] font-medium text-ink-2">
            Broadcast duration (cell repetition)
          </span>
          <span className="font-mono text-[15px] font-medium text-ink tabular-nums">{formatDuration(value)}</span>
        </div>
        <Slider.Root
          id={ids.slider}
          min={0}
          max={DURATION_STOPS_S.length - 1}
          step={1}
          value={stopIndex(value)}
          onValueChange={(index) => onChange(DURATION_STOPS_S[index] ?? value)}
          aria-labelledby={ids.label}
        >
          <Slider.Control className="flex h-6 w-full touch-none items-center select-none">
            <Slider.Track className="relative h-1.5 w-full rounded-full bg-hairline-strong">
              <Slider.Indicator className="rounded-full bg-primary" />
              <Slider.Thumb
                aria-labelledby={ids.label}
                getAriaValueText={() => formatDuration(value)}
                className="size-5 rounded-full border-2 border-primary bg-surface shadow-e1 outline-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus"
              />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
        <div className="flex flex-wrap items-center gap-2">
          {DURATION_PRESETS_S.map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              aria-pressed={value === preset}
              onClick={() => onChange(preset)}
              className={cn(
                "h-8 rounded-[8px] px-3 font-mono text-[12px]",
                value === preset ? "border-primary bg-navy-tint text-primary hover:bg-navy-tint" : "text-ink-2",
              )}
            >
              {formatDuration(preset)}
            </Button>
          ))}
          <label htmlFor={ids.minutes} className="ml-auto flex items-center gap-2 text-[12px] text-ink-3">
            Exact
            <Input
              id={ids.minutes}
              type="number"
              min={DURATION_MIN_S / 60}
              max={DURATION_MAX_S / 60}
              value={Math.round(value / 60)}
              onChange={(e) => onChange(clampDuration(Number(e.target.value) * 60))}
              className="h-8 w-20 rounded-[8px] border-control-border bg-surface px-2 text-right font-mono text-[13px] text-ink md:text-[13px]"
            />
            min
          </label>
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-[13px] font-medium text-ink-2">Send</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <span className="flex items-center gap-3 rounded-[12px] border border-primary bg-navy-tint px-4 py-3 text-[14px] font-medium text-primary">
            <Clock aria-hidden className="size-4" /> Immediate
          </span>
          <span
            aria-disabled
            className="flex items-start gap-3 rounded-[12px] border border-dashed border-hairline-strong px-4 py-3 text-[13px] text-ink-3"
          >
            <CalendarClock aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>
              <span className="block font-medium text-ink-2">Scheduled · unavailable</span>
              The server does not have a scheduler yet: a scheduled alert would never be sent.
            </span>
          </span>
        </div>
      </fieldset>
    </div>
  );
}
