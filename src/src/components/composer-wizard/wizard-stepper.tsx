"use client";

import { Circle, CircleCheck, CircleDot, Lock, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type StepIndex, type StepStatus, WIZARD_STEPS } from "./steps";

const STATUS: Record<StepStatus, { icon: LucideIcon; text: string; tone: string; number: string }> = {
  todo: { icon: Circle, text: "To do", tone: "text-ink-3", number: "text-ink-3" },
  current: { icon: CircleDot, text: "In progress", tone: "text-orange-fg", number: "text-orange-fg" },
  done: { icon: CircleCheck, text: "Done", tone: "text-st-sent-fg", number: "text-st-sent-fg" },
};

interface WizardStepperProps {
  current: StepIndex;
  statusOf: (index: StepIndex) => StepStatus;
  reachable: (index: StepIndex) => boolean;
  onSelect: (index: StepIndex) => void;
}

/**
 * Numbered step index (01…04), after omicron-ui's showcase typography.
 * Back to any unlocked step is free; forward is only possible once the previous steps are valid.
 */
export function WizardStepper({ current, statusOf, reachable, onSelect }: WizardStepperProps) {
  const active = WIZARD_STEPS[current];
  return (
    <nav aria-label="Alert creation steps">
      <p className="mb-2 text-[12px] text-ink-3 sm:hidden">
        Step {current + 1} of {WIZARD_STEPS.length} · <span className="font-medium text-ink">{active?.label}</span>
      </p>
      <ol className="grid grid-cols-4 gap-px overflow-hidden rounded-[16px] border border-hairline bg-hairline shadow-e1">
        {WIZARD_STEPS.map((step) => {
          const status = statusOf(step.index);
          const open = reachable(step.index);
          const { icon: Icon, text, tone, number } = STATUS[status];
          const isCurrent = status === "current";
          return (
            <li key={step.number} className="bg-surface">
              <Button
                variant="ghost"
                disabled={!open && !isCurrent}
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => !isCurrent && onSelect(step.index)}
                className={cn(
                  "relative h-full w-full flex-col items-start justify-start gap-1 rounded-none px-2.5 py-3 text-left whitespace-normal focus-visible:outline-offset-[-2px] sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-4",
                  "before:absolute before:inset-x-0 before:top-0 before:h-[3px]",
                  isCurrent ? "bg-surface before:bg-orange-deep hover:bg-surface" : "hover:bg-surface-hover",
                  !open && !isCurrent && "opacity-60 disabled:opacity-60",
                )}
              >
                <span aria-hidden className={cn("tnum font-display text-[22px] leading-none font-bold sm:text-[28px]", number)}>
                  {step.number}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className={cn("text-[12px] leading-4 sm:text-[14px] sm:leading-5", isCurrent ? "font-semibold text-ink" : "font-medium text-ink-2")}>
                    <span className="sr-only">Step {step.number}: </span>
                    {step.label}
                  </span>
                  <span className={cn("flex items-center gap-1 text-[12px] leading-4", tone)}>
                    {!open && !isCurrent ? <Lock aria-hidden className="size-3" /> : <Icon aria-hidden className="size-3" />}
                    <span className="sr-only sm:not-sr-only">{text}</span>
                    {!open && !isCurrent && <span className="sr-only">, locked until the previous steps are complete</span>}
                  </span>
                </span>
              </Button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
