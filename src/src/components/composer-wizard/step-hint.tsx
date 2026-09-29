import { CircleAlert, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/** Says what is missing next to a disabled action, in words; never a grey button alone. */
export function StepHint({ id, blocker, readyText, className }: { id: string; blocker: string | null; readyText?: string; className?: string }) {
  return (
    <p id={id} aria-live="polite" className={cn("flex min-w-0 items-center gap-1.5 text-[13px]", blocker ? "text-ink-2" : "text-st-sent-fg", className)}>
      {blocker ? (
        <>
          <CircleAlert aria-hidden className="size-4 shrink-0 text-orange-fg" />
          <span>{blocker}</span>
        </>
      ) : readyText ? (
        <>
          <CircleCheck aria-hidden className="size-4 shrink-0" />
          <span>{readyText}</span>
        </>
      ) : null}
    </p>
  );
}
