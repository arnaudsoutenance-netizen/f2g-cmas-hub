"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { BatteryMedium, LockKeyhole, SignalHigh } from "lucide-react";
import { useState } from "react";
import { classifyMessageId } from "@/lib/cmas/alert-classes";
import { ALERT_CLASS_ICONS, SEVERITY_STYLES } from "@/lib/cmas/severity-styles";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Platform = "android" | "ios";

interface HandsetPreviewProps {
  messageId: number | null;
  message: string;
  className?: string;
}

/** A physical object, so the "device" treatment is justified here and nowhere else. */
export function HandsetPreview({ messageId, message, className }: HandsetPreviewProps) {
  const [platform, setPlatform] = useState<Platform>("android");
  const reduce = useReducedMotion();
  const cls = messageId === null ? undefined : classifyMessageId(messageId);
  const style = cls ? SEVERITY_STYLES[cls.tone] : undefined;
  const Icon = cls ? ALERT_CLASS_ICONS[cls.key] : null;
  const isTest = cls?.tone === "test";

  return (
    <figure className={cn("flex flex-col items-center gap-3", className)}>
      <m.div
        key={`${messageId ?? "none"}-${platform}`}
        animate={reduce || !cls ? undefined : { x: [0, -2, 2, -1, 0] }}
        transition={{ duration: 0.28 }}
        role="img"
        aria-label={cls ? `Handset preview: ${cls.handsetTitle}. ${message || "empty message"}` : "Handset preview: no class selected"}
        className="relative aspect-[9/19.5] w-[280px] rounded-[44px] bg-device-bezel p-2.5 shadow-e3 ring-1 ring-device-bezel/40"
      >
        <div className="relative flex h-full flex-col overflow-hidden rounded-[36px] bg-device-screen bg-[radial-gradient(circle_at_30%_20%,color-mix(in_srgb,var(--brand-navy)_35%,transparent),transparent_60%)] font-device text-device-ink">
          <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-medium">
            <span className="tabular-nums">09:41</span>
            <span className="flex items-center gap-1">
              <SignalHigh aria-hidden className="size-3" />
              <BatteryMedium aria-hidden className="size-3.5" />
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {!cls || !style || !Icon ? (
              <m.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid flex-1 place-items-center px-8 text-center">
                <span className="flex flex-col items-center gap-2 text-[13px] text-device-ink-2">
                  <LockKeyhole aria-hidden className="size-5" />
                  Choose an alert class
                </span>
              </m.div>
            ) : (
              <m.div
                key={`${cls.key}-${platform}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={spring.gentle}
                className={cn("relative mx-3 overflow-hidden rounded-[16px] bg-device-card shadow-e2", platform === "android" ? "mt-auto mb-auto" : "mt-10 rounded-[22px]")}
              >
                <div className={cn("flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold", style.solid)}>
                  <Icon aria-hidden className="size-4 shrink-0" />
                  <span className="truncate">{platform === "ios" ? "Emergency Alert" : cls.handsetTitle}</span>
                </div>
                <div className="relative max-h-[300px] overflow-y-auto px-4 py-3">
                  {platform === "ios" && <p className="mb-1 text-[13px] font-semibold text-device-ink">{cls.handsetTitle}</p>}
                  <p className={cn("text-[14px] leading-[21px] whitespace-pre-wrap", message ? "text-device-ink" : "text-device-ink-2 italic")}>
                    {message || "Your message will appear here"}
                  </p>
                  {isTest && (
                    <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center font-display text-[44px] font-bold text-device-ink/8 -rotate-[18deg]">
                      TEST
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-device-ink/10 px-4 py-2 text-[12px] text-device-ink-2">
                  <span>Now</span>
                  <span className="font-semibold text-device-ink">OK</span>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </m.div>

      <RadioGroup
        aria-label="Preview platform"
        value={platform}
        onValueChange={(next) => setPlatform(next === "ios" ? "ios" : "android")}
        className="flex rounded-[8px] bg-surface-sunken p-1 text-[12px]"
      >
        {(["android", "ios"] as const).map((p) => (
          <Radio.Root
            key={p}
            value={p}
            className={cn(
              "h-7 min-w-[64px] rounded-[6px] px-3 font-medium focus-visible:outline-offset-0",
              platform === p ? "bg-surface text-ink shadow-e1" : "text-ink-3 hover:text-ink",
            )}
          >
            {p === "android" ? "Android" : "iOS"}
          </Radio.Root>
        ))}
      </RadioGroup>
      <figcaption className="max-w-[300px] text-center text-[12px] leading-[18px] text-ink-3">
        Indicative preview. The title and sound depend on the handset; only the text body is controlled by the console.
      </figcaption>
    </figure>
  );
}
