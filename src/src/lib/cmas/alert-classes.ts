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
  /** Requires the heavier, type-to-confirm send flow. */
  critical: boolean;
}

export const ALERT_CLASSES: readonly AlertClass[] = [
  {
    key: "presidential",
    alertType: "CMAS",
    label: "Presidential",
    handsetTitle: "Presidential Alert",
    description: "National threat issued at the highest level of government.",
    messageIds: [4370],
    defaultMessageId: 4370,
    tone: "presidential",
    optOut: false,
    critical: true,
  },
  {
    key: "extreme",
    alertType: "CMAS",
    label: "Extreme",
    handsetTitle: "Extreme Alert",
    description: "Imminent threat to life or property, observed or likely.",
    messageIds: [4371, 4372],
    defaultMessageId: 4371,
    tone: "extreme",
    optOut: false,
    critical: false,
  },
  {
    key: "severe",
    alertType: "CMAS",
    label: "Severe",
    handsetTitle: "Severe Alert",
    description: "Severe weather or hazard expected in the area.",
    messageIds: [4373, 4374, 4375, 4376, 4377, 4378],
    defaultMessageId: 4373,
    tone: "severe",
    optOut: true,
    critical: false,
  },
  {
    key: "amber",
    alertType: "CMAS",
    label: "AMBER",
    handsetTitle: "AMBER Alert",
    description: "Child abduction — ask the public for information.",
    messageIds: [4379],
    defaultMessageId: 4379,
    tone: "amber",
    optOut: true,
    critical: false,
  },
  {
    key: "monthly-test",
    alertType: "CMAS",
    label: "Monthly test",
    handsetTitle: "Test Alert",
    description: "Required monthly test of the national alert system.",
    messageIds: [4380],
    defaultMessageId: 4380,
    tone: "test",
    optOut: true,
    critical: false,
  },
  {
    key: "exercise",
    alertType: "CMAS",
    label: "Exercise",
    handsetTitle: "Exercise Alert",
    description: "Drill for authorities and operators; no public action.",
    messageIds: [4381],
    defaultMessageId: 4381,
    tone: "test",
    optOut: true,
    critical: false,
  },
  {
    key: "earthquake",
    alertType: "ETWS",
    label: "Earthquake",
    handsetTitle: "Earthquake Warning",
    description: "ETWS primary warning for an earthquake.",
    messageIds: [4352],
    defaultMessageId: 4352,
    tone: "etws",
    optOut: false,
    critical: false,
  },
  {
    key: "tsunami",
    alertType: "ETWS",
    label: "Tsunami",
    handsetTitle: "Tsunami Warning",
    description: "ETWS primary warning for a tsunami.",
    messageIds: [4353],
    defaultMessageId: 4353,
    tone: "etws",
    optOut: false,
    critical: false,
  },
  {
    key: "earthquake-tsunami",
    alertType: "ETWS",
    label: "Earthquake + tsunami",
    handsetTitle: "Earthquake & Tsunami Warning",
    description: "ETWS combined earthquake and tsunami warning.",
    messageIds: [4354],
    defaultMessageId: 4354,
    tone: "etws",
    optOut: false,
    critical: false,
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
    critical: false,
  },
] as const;

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
