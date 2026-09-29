"use client";

import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS, type WizardStep } from "./steps";

interface StepPanelProps {
  step: WizardStep;
  /** Receives the heading so the page can move focus to it on every step change. */
  headingRef: Ref<HTMLHeadingElement>;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
}

/** One wizard step: numbered header, body, and a sticky-feeling action bar. */
export function StepPanel({ step, headingRef, children, footer, className }: StepPanelProps) {
  const headingId = `wizard-step-${step.number}-title`;
  return (
    <section aria-labelledby={headingId} className={cn("overflow-hidden rounded-[16px] border border-hairline bg-surface shadow-e1", className)}>
      <header className="flex items-start gap-4 border-b border-hairline px-5 py-4 sm:px-6">
        <span aria-hidden className="tnum font-display text-[34px] leading-none font-bold text-orange-fg">
          {step.number}
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.08em] text-ink-3 uppercase">
            Step {step.index + 1} of {WIZARD_STEPS.length}
          </p>
          <h2
            id={headingId}
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-[20px] leading-7 font-semibold text-ink focus-visible:outline-offset-4"
          >
            {step.title}
          </h2>
          <p className="mt-0.5 text-[13px] text-ink-3">{step.description}</p>
        </div>
      </header>
      <div className="p-5 sm:p-6">{children}</div>
      <footer className="flex flex-wrap items-center gap-3 border-t border-hairline bg-surface-sunken px-5 py-4 sm:px-6">{footer}</footer>
    </section>
  );
}
