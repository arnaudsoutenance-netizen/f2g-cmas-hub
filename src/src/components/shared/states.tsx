"use client";

import { ChevronRight, CircleX, type LucideIcon, RotateCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

/** Left-aligned, one sentence, one action. No illustrations. */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("py-12", className)}>
      <span className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-surface-sunken text-ink-2">
        <Icon aria-hidden className="size-5" />
      </span>
      <p className="mt-4 font-display text-[18px] leading-6 font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-[52ch] text-[13px] text-ink-2">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title: string;
  error: unknown;
  onRetry?: () => void;
  className?: string;
}

/** Errors stay in place so the rest of the console remains usable during incidents. */
export function ErrorState({ title, error, onRetry, className }: ErrorStateProps) {
  const [open, setOpen] = useState(false);
  const message = error instanceof Error ? error.message : "Unknown error";
  const status = error instanceof ApiError ? error.status : undefined;

  return (
    <div role="alert" className={cn("rounded-[var(--radius-lg)] border border-danger/30 bg-surface p-5", className)}>
      <div className="flex items-start gap-3">
        <CircleX aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-ink">{title}</p>
          <p className="mt-0.5 text-[13px] text-ink-2">{message}</p>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-2 flex items-center gap-1 text-[12px] text-ink-3 hover:text-ink"
            aria-expanded={open}
          >
            <ChevronRight aria-hidden className={cn("size-3.5 transition-transform", open && "rotate-90")} />
            Technical details
          </button>
          {open && (
            <pre className="mt-2 overflow-x-auto rounded-[var(--radius-sm)] bg-surface-sunken p-3 font-mono text-[12px] text-ink-2">
              {status !== undefined ? `HTTP ${status} · ` : ""}
              {message}
            </pre>
          )}
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RotateCw aria-hidden className="size-3.5" /> Retry
          </Button>
        )}
      </div>
    </div>
  );
}
