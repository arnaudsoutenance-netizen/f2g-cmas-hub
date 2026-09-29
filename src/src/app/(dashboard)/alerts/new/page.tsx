"use client";

import { m } from "framer-motion";
import { Check, LibraryBig, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertClassPicker } from "@/components/composer/alert-class-picker";
import { CellTargetSelector } from "@/components/composer/cell-target-selector";
import { DurationField } from "@/components/composer/duration-field";
import { HandsetPreview } from "@/components/composer/handset-preview";
import { MessageComposer } from "@/components/composer/message-composer";
import { SendConfirmation } from "@/components/composer/send-confirmation";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { Button } from "@/components/ui/button";
import { useCreateAlert, useSendAlert } from "@/hooks/use-alerts";
import { useCells, useTemplates } from "@/hooks/use-network";
import { ApiError } from "@/lib/api/client";
import { classifyMessageId } from "@/lib/cmas/alert-classes";
import { measureCbs } from "@/lib/cmas/cbs-encoding";
import { formatDuration } from "@/lib/cmas/composer-utils";
import { pageEnter } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { AlertCreateInput } from "@/types/domain";
import { cellState } from "@/lib/cmas/cell-state";

const STEPS = [
  { id: "classe", label: "Class" },
  { id: "message", label: "Message" },
  { id: "cellules", label: "Cells" },
  { id: "duree", label: "Duration and send" },
] as const;

function Section({ id, index, title, children }: { id: string; index: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 rounded-[12px] bg-shell p-5 sm:p-6">
      <h2 id={`${id}-title`} className="mb-5 flex items-center gap-3 text-[18px] leading-[26px] font-semibold text-ink">
        <span className="grid size-7 place-items-center rounded-full bg-navy-tint font-mono text-[13px] text-primary">{index}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function errorText(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "Broadcast failed. Please try again.";
}

function Composer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: templates } = useTemplates({ active_only: true });
  const { data: cells } = useCells();
  const createAlert = useCreateAlert();
  const sendAlert = useSendAlert();

  const [messageId, setMessageId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [cellIds, setCellIds] = useState<string[]>([]);
  const [durationS, setDurationS] = useState(1_800);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [appliedTemplateParam, setAppliedTemplateParam] = useState<string | null>(null);

  const sizing = useMemo(() => measureCbs(message), [message]);
  const alertClass = messageId === null ? undefined : classifyMessageId(messageId);

  const applyTemplate = (id: string) => {
    const tpl = templates?.find((t) => t.id === id);
    if (!tpl) return;
    setTemplateId(tpl.id);
    setMessageId(tpl.message_id);
    setMessage(tpl.content);
    setDurationS(tpl.default_duration);
  };

  // Prefill from ?template=<id> once templates are loaded (e.g. "Use" in the gallery).
  const templateParam = searchParams.get("template");
  if (templateParam && templates && appliedTemplateParam !== templateParam) {
    setAppliedTemplateParam(templateParam);
    applyTemplate(templateParam);
  }

  const onClassChange = (id: number) => {
    setMessageId(id);
    // Presidential alerts are national by default.
    if (classifyMessageId(id)?.confirmLevel === "presidential" && cellIds.length === 0 && cells) {
      setCellIds(cells.filter((c) => cellState(c.status) === "online").map((c) => c.id));
    }
  };

  const done = {
    classe: alertClass !== undefined,
    message: message.trim().length > 0 && sizing.fits,
    cellules: cellIds.length > 0,
    duree: true,
  };
  const blocker = !done.classe
    ? "Choose an alert class."
    : !done.message
      ? message.trim().length === 0
        ? "Write the message."
        : "The message exceeds the maximum size."
      : !done.cellules
        ? "Select at least one cell."
        : null;

  const payload = (): AlertCreateInput | null =>
    alertClass && messageId !== null
      ? {
          alert_type: alertClass.alertType,
          message_id: messageId,
          content: message.trim(),
          duration: durationS,
          cell_ids: cellIds,
          template_id: templateId,
        }
      : null;

  const saveDraft = () => {
    const input = payload();
    if (!input) return;
    createAlert.mutate(input, {
      onSuccess: (alert) => {
        toast.success("Draft saved");
        router.push(`/alerts/${alert.id}`);
      },
      onError: (error) => toast.error("Could not save", { description: errorText(error) }),
    });
  };

  // Send-path rule (DESIGN.md §5.3): the request goes out first; UI follows.
  const broadcast = () => {
    const input = payload();
    if (!input) return;
    setSendError(null);
    createAlert.mutate(input, {
      onSuccess: (alert) =>
        sendAlert.mutate(
          { id: alert.id },
          {
            onSuccess: (result) => {
              setConfirmOpen(false);
              router.push(`/alerts/${result.id}`);
              toast.success("Broadcast started", { description: result.message });
            },
            onError: (error) => {
              setSendError(`Alert saved as draft but not broadcast: ${errorText(error)}`);
              router.prefetch(`/alerts/${alert.id}`);
            },
          },
        ),
      onError: (error) => setSendError(errorText(error)),
    });
  };

  const pending = createAlert.isPending || sendAlert.isPending;

  return (
    <m.div {...pageEnter} className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-[12px] bg-shell px-5 py-4 sm:px-6">
        <div>
          <h1 className="font-display text-[24px] leading-[30px] font-semibold text-ink">New alert</h1>
          <p className="text-[13px] text-ink-3">Class, message, cells, duration: check the preview before broadcasting.</p>
        </div>
        {templates && templates.length > 0 && (
          <label className="flex items-center gap-2 text-[13px] text-ink-2">
            <LibraryBig aria-hidden className="size-4" />
            <span className="sr-only sm:not-sr-only">Load a template</span>
            <select
              value={templateId ?? ""}
              onChange={(e) => e.target.value && applyTemplate(e.target.value)}
              className="h-10 max-w-[260px] rounded-[8px] border border-control-border bg-shell px-3 text-[13px] text-ink"
            >
              <option value="">Choose a template…</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} · {t.message_id}
                </option>
              ))}
            </select>
          </label>
        )}
      </header>

      <div className="grid gap-5 lg:grid-cols-12">
        <nav aria-label="Steps" className="hidden lg:col-span-2 lg:block">
          <ol className="sticky top-28 space-y-1 rounded-[12px] bg-shell p-3">
            {STEPS.map((step, i) => (
              <li key={step.id}>
                <a
                  href={`#${step.id}`}
                  className="flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-[13px] text-ink-2 hover:bg-surface-hover hover:text-ink"
                >
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[11px]",
                      done[step.id] ? "border-st-sent bg-st-sent-tint text-st-sent-fg" : "border-hairline-strong text-ink-3",
                    )}
                  >
                    {done[step.id] ? <Check aria-hidden className="size-3.5" /> : i + 1}
                  </span>
                  {step.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-5 lg:col-span-6">
          <Section id="classe" index={1} title="Alert class">
            <AlertClassPicker value={messageId} onChange={onClassChange} />
          </Section>
          <Section id="message" index={2} title="Message">
            <MessageComposer value={message} onChange={setMessage} />
          </Section>
          <Section id="cellules" index={3} title="Target cells">
            <CellTargetSelector value={cellIds} onChange={setCellIds} presidential={alertClass?.confirmLevel === "presidential"} />
          </Section>
          <Section id="duree" index={4} title="Duration and send">
            <DurationField value={durationS} onChange={setDurationS} />
          </Section>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-4 rounded-[12px] bg-shell p-5">
            <HandsetPreview messageId={messageId} message={message} />
            <dl className="grid grid-cols-[96px_1fr] gap-y-1.5 border-t border-hairline pt-4 text-[13px]">
              <dt className="text-ink-3">Class</dt>
              <dd>{messageId !== null ? <SeverityBadge messageId={messageId} size="sm" /> : <span className="text-ink-3">—</span>}</dd>
              <dt className="text-ink-3">Cells</dt>
              <dd className="font-mono text-ink tabular-nums">{cellIds.length}</dd>
              <dt className="text-ink-3">Encoding</dt>
              <dd className="font-mono text-ink">
                {sizing.encoding} · {message ? sizing.pages : 0} pg
              </dd>
              <dt className="text-ink-3">Duration</dt>
              <dd className="font-mono text-ink">{formatDuration(durationS)} · immediate</dd>
            </dl>
            <div className="space-y-2">
              <Button size="lg" className="w-full rounded-[8px]" disabled={blocker !== null || pending} onClick={() => setConfirmOpen(true)}>
                Review and broadcast
              </Button>
              {blocker && <p className="text-center text-[12px] text-ink-3">{blocker}</p>}
              <Button variant="ghost" size="md" className="w-full" disabled={blocker !== null || pending} onClick={saveDraft}>
                <Save aria-hidden className="size-4" /> Save draft
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {messageId !== null && (
        <SendConfirmation
          open={confirmOpen}
          onOpenChange={(open) => {
            setConfirmOpen(open);
            if (!open) setSendError(null);
          }}
          draft={{ messageId, message: message.trim(), cellCount: cellIds.length, durationS, sizing }}
          onConfirm={broadcast}
          pending={pending}
          error={sendError}
        />
      )}
    </m.div>
  );
}

export default function NewAlertPage() {
  return (
    <Suspense>
      <Composer />
    </Suspense>
  );
}
