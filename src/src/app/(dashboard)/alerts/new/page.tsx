"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Save, Send, Smartphone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type KeyboardEvent, Suspense, useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { AlertClassPicker } from "@/components/composer/alert-class-picker";
import { CapFieldsEditor, type CapFields } from "@/components/composer/cap-fields-editor";
import { CellTargetSelector } from "@/components/composer/cell-target-selector";
import { DurationField } from "@/components/composer/duration-field";
import { HandsetPreview } from "@/components/composer/handset-preview";
import { MessageComposer } from "@/components/composer/message-composer";
import { SendConfirmation } from "@/components/composer/send-confirmation";
import { ReviewSummary } from "@/components/composer-wizard/review-summary";
import { StepHint } from "@/components/composer-wizard/step-hint";
import { StepPanel } from "@/components/composer-wizard/step-panel";
import { LAST_STEP, type StepIndex, type StepStatus, toStepIndex, WIZARD_STEPS } from "@/components/composer-wizard/steps";
import { TemplateLoader } from "@/components/composer-wizard/template-loader";
import { WizardStepper } from "@/components/composer-wizard/wizard-stepper";
import { Button } from "@/components/ui/button";
import { useCreateAlert, useSendAlert } from "@/hooks/use-alerts";
import { useCells, useTemplates } from "@/hooks/use-network";
import { ApiError } from "@/lib/api/client";
import { classifyMessageId } from "@/lib/cmas/alert-classes";
import { measureCbs } from "@/lib/cmas/cbs-encoding";
import { cellState } from "@/lib/cmas/cell-state";
import { formatDuration } from "@/lib/cmas/composer-utils";
import { dur, ease, pageEnter } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { AlertCreateInput } from "@/types/domain";

function errorText(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "Broadcast failed. Please try again.";
}

const INTERACTIVE = "button, a, input, textarea, select, [role=radio], [role=checkbox], [role=slider], [contenteditable=true]";

function Composer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();
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
  
  // CAP fields (Common Alerting Protocol)
  const [capFields, setCapFields] = useState<Partial<CapFields>>({
    category: "Safety",
    severity: "Severe",
    urgency: "Immediate",
    certainty: "Observed",
    responseType: "Monitor",
    language: "en",
    eventCode: "CEM",
    senderName: "F2G CMAS Hub",
  });

  // Wizard position: the current step, the furthest step reached, and the travel direction for the transition.
  const [step, setStep] = useState<StepIndex>(0);
  const [furthest, setFurthest] = useState<StepIndex>(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Focus moves to the new step's heading once it is mounted (after the exit transition).
  const focusPending = useRef(false);
  const headingRef = useCallback((el: HTMLHeadingElement | null) => {
    if (el && focusPending.current) {
      focusPending.current = false;
      el.focus();
    }
  }, []);

  const sizing = useMemo(() => measureCbs(message), [message]);
  const alertClass = messageId === null ? undefined : classifyMessageId(messageId);

  const jumpTo = (target: StepIndex, focus: boolean) => {
    setDirection(target >= step ? 1 : -1);
    setStep(target);
    setFurthest((f) => (target > f ? target : f));
    focusPending.current = focus;
  };

  const applyTemplate = (id: string): boolean => {
    const tpl = templates?.find((t) => t.id === id);
    if (!tpl) return false;
    setTemplateId(tpl.id);
    setMessageId(tpl.message_id);
    setMessage(tpl.content);
    setDurationS(tpl.default_duration);
    return true;
  };

  // Prefill from ?template=<id> once templates are loaded (e.g. "Use" in the gallery), then open step 03.
  const templateParam = searchParams.get("template");
  if (templateParam && templates && appliedTemplateParam !== templateParam) {
    setAppliedTemplateParam(templateParam);
    if (applyTemplate(templateParam)) {
      setStep(3);
      setFurthest(3);
    }
  }

  const loadTemplate = (id: string) => {
    if (!applyTemplate(id)) return;
    toast("Template loaded", { description: "Class, message and duration prefilled. Choose the target cells." });
    if (step < 3) jumpTo(3, true);
  };

  const onClassChange = (id: number) => {
    setMessageId(id);
    // Presidential alerts are national by default.
    if (classifyMessageId(id)?.confirmLevel === "presidential" && cellIds.length === 0 && cells) {
      setCellIds(cells.filter((c) => cellState(c.status) === "online").map((c) => c.id));
    }
  };

  const valid: Record<StepIndex, boolean> = {
    0: alertClass !== undefined,
    1: capFields.category !== undefined && capFields.severity !== undefined,
    2: message.trim().length > 0 && sizing.fits,
    3: cellIds.length > 0,
    4: true,
  };
  const stepBlocker: Record<StepIndex, string | null> = {
    0: valid[0] ? null : "Choose an alert class to continue.",
    1: valid[1] ? null : "Select category and severity to continue.",
    2: valid[2] ? null : message.trim().length === 0 ? "Write the message to continue." : "Shorten the message: it exceeds the maximum size.",
    3: valid[3] ? null : "Select at least one cell to continue.",
    4: null,
  };
  const blocker = stepBlocker[0] ?? stepBlocker[1] ?? stepBlocker[2] ?? stepBlocker[3];

  const reachable = (i: StepIndex) => i <= furthest && WIZARD_STEPS.slice(0, i).every((s) => valid[s.index]);
  const statusOf = (i: StepIndex): StepStatus =>
    i === step ? "current" : i < LAST_STEP && i <= furthest && valid[i] ? "done" : "todo";

  const goNext = () => {
    if (step < LAST_STEP && valid[step]) jumpTo(toStepIndex(step + 1), true);
  };
  const goBack = () => {
    if (step > 0) jumpTo(toStepIndex(step - 1), true);
  };

  // Enter on a non-interactive target (e.g. the focused step heading), or Ctrl/⌘+Enter from anywhere, moves on.
  const onStepKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing || step === LAST_STEP) return;
    const withModifier = e.ctrlKey || e.metaKey;
    if (!withModifier && e.target instanceof HTMLElement && e.target.closest(INTERACTIVE)) return;
    if (!valid[step]) return;
    e.preventDefault();
    goNext();
  };

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
  const current = WIZARD_STEPS[step] ?? WIZARD_STEPS[0];
  const hintId = `wizard-hint-${step}`;
  const offset = reduce ? 0 : 16;

  const backButton =
    step > 0 ? (
      <Button variant="outline" size="md" onClick={goBack} className="rounded-[8px]">
        <ChevronLeft aria-hidden className="size-4" /> Back
      </Button>
    ) : null;

  const footer =
    step < LAST_STEP ? (
      <>
        {backButton}
        <StepHint id={hintId} blocker={stepBlocker[step]} className="order-last basis-full sm:order-none sm:basis-auto sm:flex-1" />
        <span className="ml-auto hidden text-[12px] text-ink-3 lg:inline">
          <kbd className="rounded-[4px] border border-hairline-strong bg-surface px-1.5 font-mono text-[11px] text-ink-2">Ctrl</kbd>{" "}
          <kbd className="rounded-[4px] border border-hairline-strong bg-surface px-1.5 font-mono text-[11px] text-ink-2">Enter</kbd>
        </span>
        <Button
          size="lg"
          onClick={goNext}
          disabled={!valid[step]}
          focusableWhenDisabled
          aria-describedby={hintId}
          className="ml-auto rounded-[8px] lg:ml-0"
        >
          Next: {WIZARD_STEPS[step + 1]?.label}
          <ChevronRight aria-hidden className="size-4" />
        </Button>
      </>
    ) : (
      <>
        {backButton}
        <StepHint id={hintId} blocker={blocker} className="order-last basis-full sm:order-none sm:basis-auto sm:flex-1" />
        <div className="ml-auto flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <Button variant="outline" size="lg" className="flex-1 rounded-[8px] sm:flex-none" disabled={blocker !== null || pending} onClick={saveDraft}>
            <Save aria-hidden className="size-4" /> Save draft
          </Button>
          <Button
            size="lg"
            className="flex-1 rounded-[8px] sm:flex-none"
            disabled={blocker !== null || pending}
            aria-describedby={hintId}
            onClick={() => setConfirmOpen(true)}
          >
            <Send aria-hidden className="size-4" /> Review and broadcast
          </Button>
        </div>
      </>
    );

  return (
    <m.div {...pageEnter} className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] leading-tight font-bold text-ink">New alert</h1>
          <p className="mt-0.5 text-[14px] text-ink-3">Four steps: class, message, cells, then review. Nothing is broadcast until you confirm.</p>
        </div>
        {templates && templates.length > 0 && <TemplateLoader templates={templates} value={templateId} onLoad={loadTemplate} />}
      </header>

      <WizardStepper current={step} statusOf={statusOf} reachable={reachable} onSelect={(i) => reachable(i) && jumpTo(i, true)} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div onKeyDown={onStepKeyDown} className="min-w-0">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <m.div
              key={step}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * offset }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: -d * offset }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: dur.base, ease: ease.standard }}
            >
              <StepPanel step={current} headingRef={headingRef} footer={footer}>
                {step === 0 && <AlertClassPicker value={messageId} onChange={onClassChange} />}
                {step === 1 && <CapFieldsEditor value={capFields} onChange={setCapFields} />}
                {step === 2 && <MessageComposer value={message} onChange={setMessage} />}
                {step === 3 && (
                  <CellTargetSelector value={cellIds} onChange={setCellIds} presidential={alertClass?.confirmLevel === "presidential"} />
                )}
                {step === 4 && (
                  <div className="space-y-6">
                    <ReviewSummary
                      messageId={messageId}
                      message={message}
                      sizing={sizing}
                      cellIds={cellIds}
                      cells={cells}
                      durationS={durationS}
                      onEdit={(i) => jumpTo(i, true)}
                    />
                    <section aria-labelledby="wizard-duration-title" className="space-y-3">
                      <h3 id="wizard-duration-title" className="font-display text-[17px] leading-tight font-semibold text-ink">
                        Duration and timing
                      </h3>
                      <DurationField value={durationS} onChange={setDurationS} />
                    </section>
                  </div>
                )}
              </StepPanel>
            </m.div>
          </AnimatePresence>
        </div>

        <aside aria-label="Handset preview" className="lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-[16px] border border-hairline bg-surface shadow-e1">
            <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
              <div>
                <h2 className="font-display text-[17px] leading-tight font-semibold text-ink">Handset preview</h2>
                <p className="mt-0.5 text-[12px] text-ink-3">Updates as you compose.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                aria-expanded={previewOpen}
                aria-controls="wizard-preview-body"
                onClick={() => setPreviewOpen((o) => !o)}
              >
                <Smartphone aria-hidden className="size-3.5" /> {previewOpen ? "Hide" : "Show"}
              </Button>
            </div>
            <div id="wizard-preview-body" className={cn("space-y-4 p-5", previewOpen ? "block" : "hidden", "lg:block")}>
              <HandsetPreview messageId={messageId} message={message} />
            </div>
            <dl className="grid grid-cols-[88px_1fr] gap-y-1.5 border-t border-hairline px-5 py-4 text-[13px]">
              <dt className="text-ink-3">Class</dt>
              <dd>{messageId !== null ? <SeverityBadge messageId={messageId} size="sm" /> : <span className="text-ink-3">Not chosen</span>}</dd>
              <dt className="text-ink-3">Cells</dt>
              <dd className="font-mono text-ink tabular-nums">{cellIds.length}</dd>
              <dt className="text-ink-3">Encoding</dt>
              <dd className="font-mono text-ink">
                {sizing.encoding} · {message ? sizing.pages : 0} pg
              </dd>
              <dt className="text-ink-3">Duration</dt>
              <dd className="font-mono text-ink">{formatDuration(durationS)} · immediate</dd>
            </dl>
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
