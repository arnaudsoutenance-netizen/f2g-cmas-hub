"use client";

import { CircleX, LoaderCircle, LockKeyhole, RotateCw } from "lucide-react";
import { useId, useState } from "react";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { classifyMessageId } from "@/lib/cmas/alert-classes";
import type { CbsSizing } from "@/lib/cmas/cbs-encoding";
import { formatDuration } from "@/lib/cmas/composer-utils";
import { SEVERITY_STYLES } from "@/lib/cmas/severity-styles";
import { useSessionStore } from "@/lib/stores/session-store";
import { cn } from "@/lib/utils";

export const PRESIDENTIAL_PHRASE = "NATIONAL BROADCAST";

export interface AlertDraft {
  messageId: number;
  message: string;
  cellCount: number;
  durationS: number;
  sizing: CbsSizing;
}

interface SendConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: AlertDraft;
  onConfirm: () => void;
  pending: boolean;
  error: string | null;
}

/** Friction proportional to blast radius, from decisions only: never timers or animations. */
export function SendConfirmation({ open, onOpenChange, draft, onConfirm, pending, error }: SendConfirmationProps) {
  const cls = classifyMessageId(draft.messageId);
  const user = useSessionStore((s) => s.user);
  const [reviewed, setReviewed] = useState(false);
  const [phrase, setPhrase] = useState("");
  const ids = { check: useId(), phrase: useId() };

  if (!cls) return null;
  const style = SEVERITY_STYLES[cls.tone];
  const level = cls.confirmLevel;
  const phraseOk = phrase.trim().toUpperCase() === PRESIDENTIAL_PHRASE;
  const ready = level === "light" || (level === "standard" && reviewed) || (level === "presidential" && phraseOk);

  const close = (next: boolean) => {
    if (!next) {
      setReviewed(false);
      setPhrase("");
    }
    onOpenChange(next);
  };

  const confirm = () => {
    // Send-path rule: the request is dispatched first, synchronously.
    if (ready && !pending) onConfirm();
  };

  const label =
    level === "light"
      ? "Broadcast test"
      : level === "presidential"
        ? "Broadcast presidential alert"
        : `Broadcast to ${draft.cellCount} cell${draft.cellCount === 1 ? "" : "s"}`;

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className={cn("gap-0 overflow-hidden rounded-[16px] p-0 sm:max-w-[560px]", level === "presidential" && "sm:max-w-[640px]")}>
        <span aria-hidden className={cn("block w-full", level === "presidential" ? "h-1.5" : "h-1", style.edgeBg)} />
        <div className="space-y-5 p-6">
          <div className="space-y-2">
            <DialogTitle className="text-[18px] leading-[26px] font-semibold text-ink">
              {level === "presidential" ? "Presidential alert: national broadcast" : "Confirm broadcast"}
            </DialogTitle>
            <DialogDescription render={<div />} className="flex items-center gap-2 text-[13px] text-ink-3">
              <SeverityBadge messageId={draft.messageId} variant="solid" /> · {cls.alertType}
            </DialogDescription>
          </div>

          {level === "presidential" && (
            <p className="flex gap-2.5 rounded-[8px] bg-sev-presidential-tint p-3 text-[13px] text-sev-presidential-fg">
              <LockKeyhole aria-hidden className="mt-0.5 size-4 shrink-0" />
              This alert cannot be disabled by recipients. It will be broadcast to {draft.cellCount} cell
              {draft.cellCount === 1 ? "" : "s"}.
            </p>
          )}

          <blockquote
            className={cn(
              "rounded-[8px] bg-surface-sunken px-4 py-3 whitespace-pre-wrap text-ink",
              level === "presidential" ? "text-[16px] leading-[26px]" : "max-h-40 overflow-y-auto text-[15px] leading-6",
            )}
          >
            {draft.message}
          </blockquote>

          <dl className="grid grid-cols-[110px_1fr] gap-y-1.5 text-[13px]">
            <dt className="text-ink-3">Cells</dt>
            <dd className="font-mono text-ink tabular-nums">{draft.cellCount}</dd>
            <dt className="text-ink-3">Duration</dt>
            <dd className="font-mono text-ink">{formatDuration(draft.durationS)}</dd>
            <dt className="text-ink-3">Send</dt>
            <dd className="text-ink">Immediate</dd>
            <dt className="text-ink-3">Encoding</dt>
            <dd className="font-mono text-ink">
              {draft.sizing.encoding} · {draft.sizing.pages} page{draft.sizing.pages > 1 ? "s" : ""}
            </dd>
          </dl>

          {level === "standard" && (
            <label htmlFor={ids.check} className="flex cursor-pointer items-start gap-3 text-[14px] text-ink">
              <input
                id={ids.check}
                type="checkbox"
                checked={reviewed}
                onChange={(e) => setReviewed(e.target.checked)}
                className="mt-1 size-4 accent-[var(--primary)]"
              />
              I have reviewed the message and checked the target cells.
            </label>
          )}

          {level === "presidential" && (
            <div className="space-y-1.5">
              <label htmlFor={ids.phrase} className="text-[13px] text-ink-2">
                To confirm, type <strong className="font-mono text-ink">{PRESIDENTIAL_PHRASE}</strong>
              </label>
              <input
                id={ids.phrase}
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="h-11 w-full rounded-[8px] border border-control-border bg-shell px-3 font-mono text-[15px] text-ink uppercase"
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirm();
                }}
              />
              {!phraseOk && phrase.length > 0 && <p className="text-[12px] text-ink-3">Incomplete entry.</p>}
              {user && (
                <p className="text-[12px] text-ink-3">
                  Signed by {user.name} · {new Date().toLocaleTimeString("en-US")}
                </p>
              )}
            </div>
          )}

          {error && (
            <div role="alert" className="flex items-start gap-2.5 rounded-[8px] border border-danger/30 bg-danger-tint p-3 text-[13px] text-danger">
              <CircleX aria-hidden className="mt-0.5 size-4 shrink-0" />
              <span className="flex-1">{error}</span>
              <button type="button" onClick={confirm} className="flex items-center gap-1 font-medium underline-offset-2 hover:underline">
                <RotateCw aria-hidden className="size-3.5" /> Retry
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-hairline bg-surface-sunken px-6 py-4">
          <Button variant="outline" size="md" onClick={() => close(false)}>
            Cancel
          </Button>
          <Button size="lg" disabled={!ready || pending} onClick={confirm} className={cn("rounded-[8px]", style.button)}>
            {pending && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
            {pending ? "Broadcasting…" : label}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
