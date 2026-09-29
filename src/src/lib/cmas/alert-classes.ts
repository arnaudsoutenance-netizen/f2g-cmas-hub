import type { AlertType } from "@/types/domain";

/**
 * Alert classes and message identifiers per 3GPP TS 23.041 §9.4.1.2.2.
 * Handsets pick the popup style, tone and opt-out rules from the message ID,
 * so these numbers must match the standard exactly.
 */
export type AlertClassKey =
  | "presidential"
  | "extreme"
  | "severe"
  | "amber"
  | "monthly-test"
  | "exercise"
  | "earthquake"
  | "tsunami"
  | "earthquake-tsunami"
  | "etws-test";

export type SeverityTone = "presidential" | "extreme" | "severe" | "amber" | "test" | "etws";

/** Send friction scales with blast radius (DESIGN.md §6.7). */
export type ConfirmLevel = "light" | "standard" | "presidential";

export interface AlertClass {
  key: AlertClassKey;
  alertType: AlertType;
  label: string;
  handsetTitle: string;
  description: string;
  messageIds: readonly number[];
  defaultMessageId: number;
  tone: SeverityTone;
  optOut: boolean;
  confirmLevel: ConfirmLevel;
}

export const ALERT_CLASSES: readonly AlertClass[] = [
  {
    key: "presidential",
    alertType: "CMAS",
    label: "Presidential",
    handsetTitle: "Presidential Alert",
    description: "Nationwide broadcast; cannot be disabled on handsets.",
    messageIds: [4370],
    defaultMessageId: 4370,
    tone: "presidential",
    optOut: false,
    confirmLevel: "presidential",
  },
  {
    key: "extreme",
    alertType: "CMAS",
    label: "Extreme",
    handsetTitle: "Extreme Alert",
    description: "Imminent threat to life or property.",
    messageIds: [4371, 4372],
    defaultMessageId: 4371,
    tone: "extreme",
    optOut: false,
    confirmLevel: "standard",
  },
  {
    key: "severe",
    alertType: "CMAS",
    label: "Severe",
    handsetTitle: "Severe Alert",
    description: "Severe threat expected: weather, flooding, landslide.",
    messageIds: [4373, 4374, 4375, 4376, 4377, 4378],
    defaultMessageId: 4373,
    tone: "severe",
    optOut: true,
    confirmLevel: "standard",
  },
  {
    key: "amber",
    alertType: "CMAS",
    label: "AMBER (Child Abduction)",
    handsetTitle: "AMBER Alert",
    description: "Child abduction; call for witnesses.",
    messageIds: [4379],
    defaultMessageId: 4379,
    tone: "amber",
    optOut: true,
    confirmLevel: "standard",
  },
  {
    key: "monthly-test",
    alertType: "CMAS",
    label: "Monthly test",
    handsetTitle: "Required Monthly Test",
    description: "Required monthly test of the national system.",
    messageIds: [4380],
    defaultMessageId: 4380,
    tone: "test",
    optOut: true,
    confirmLevel: "light",
  },
  {
    key: "exercise",
    alertType: "CMAS",
    label: "Exercise",
    handsetTitle: "Exercise Alert",
    description: "Authority and operator exercise; no public action required.",
    messageIds: [4381],
    defaultMessageId: 4381,
    tone: "test",
    optOut: true,
    confirmLevel: "light",
  },
  {
    key: "earthquake",
    alertType: "ETWS",
    label: "Earthquake",
    handsetTitle: "Earthquake Alert",
    description: "Primary ETWS earthquake warning.",
    messageIds: [4352],
    defaultMessageId: 4352,
    tone: "etws",
    optOut: false,
    confirmLevel: "standard",
  },
  {
    key: "tsunami",
    alertType: "ETWS",
    label: "Tsunami",
    handsetTitle: "Tsunami Alert",
    description: "Primary ETWS tsunami warning.",
    messageIds: [4353],
    defaultMessageId: 4353,
    tone: "etws",
    optOut: false,
    confirmLevel: "standard",
  },
  {
    key: "earthquake-tsunami",
    alertType: "ETWS",
    label: "Earthquake + Tsunami",
    handsetTitle: "Earthquake and Tsunami Alert",
    description: "Combined ETWS earthquake and tsunami warning.",
    messageIds: [4354],
    defaultMessageId: 4354,
    tone: "etws",
    optOut: false,
    confirmLevel: "standard",
  },
  {
    key: "etws-test",
    alertType: "ETWS",
    label: "ETWS test",
    handsetTitle: "ETWS Test",
    description: "Test of the earthquake and tsunami warning chain.",
    messageIds: [4355],
    defaultMessageId: 4355,
    tone: "test",
    optOut: true,
    confirmLevel: "light",
  },
] as const;

/** Urgency · certainty sub-labels for the ranged CMAS identifiers (TS 23.041). */
export const MESSAGE_ID_SUBLABELS: Readonly<Record<number, string>> = {
  4371: "Immediate · Observed",
  4372: "Immediate · Likely",
  4373: "Expected · Observed",
  4374: "Expected · Likely",
  4375: "Immediate · Observed",
  4376: "Immediate · Likely",
  4377: "Expected · Observed",
  4378: "Expected · Likely",
};

const BY_MESSAGE_ID = new Map<number, AlertClass>(
  ALERT_CLASSES.flatMap((c) => c.messageIds.map((id) => [id, c] as const)),
);

/** Resolve the alert class of a message ID; undefined for IDs outside the standard ranges. */
export function classifyMessageId(messageId: number): AlertClass | undefined {
  return BY_MESSAGE_ID.get(messageId);
}

export function getAlertClass(key: AlertClassKey): AlertClass {
  const found = ALERT_CLASSES.find((c) => c.key === key);
  if (!found) throw new Error(`Unknown alert class: ${key}`);
  return found;
}
