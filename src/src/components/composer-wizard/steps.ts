export type StepIndex = 0 | 1 | 2 | 3;
export type StepStatus = "todo" | "current" | "done";

export interface WizardStep {
  index: StepIndex;
  number: string;
  label: string;
  title: string;
  description: string;
}

/** The four composer steps, always walked in this order. */
export const WIZARD_STEPS: readonly WizardStep[] = [
  {
    index: 0,
    number: "01",
    label: "Class",
    title: "Choose the alert class",
    description: "The class sets the handset behaviour and how much confirmation the broadcast needs.",
  },
  {
    index: 1,
    number: "02",
    label: "Message",
    title: "Write the message",
    description: "Exactly what handsets will show. Keep it short: what, where, what to do.",
  },
  {
    index: 2,
    number: "03",
    label: "Cells",
    title: "Select the target cells",
    description: "Only active cells can receive a broadcast.",
  },
  {
    index: 3,
    number: "04",
    label: "Review & send",
    title: "Review and send",
    description: "Set the duration, check every detail, then save a draft or broadcast.",
  },
];

export const LAST_STEP: StepIndex = 3;

export function toStepIndex(n: number): StepIndex {
  return n <= 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : 3;
}
