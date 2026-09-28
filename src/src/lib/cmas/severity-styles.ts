import {
  Activity,
  CalendarCheck,
  ClipboardCheck,
  FlaskConical,
  Landmark,
  type LucideIcon,
  OctagonAlert,
  TriangleAlert,
  UserSearch,
  WavesArrowUp,
} from "lucide-react";
import type { AlertClassKey, SeverityTone } from "./alert-classes";

/**
 * Static severity class strings. Tailwind v4 only generates classes it can see
 * literally in the source, so never build these with string interpolation.
 */
export interface SeverityStyle {
  solid: string;
  tint: string;
  outline: string;
  /** 4 px bar / dot / node colour. */
  edgeBg: string;
  edgeBorder: string;
  fg: string;
  selected: string;
  /** Header strip of the handset popup and severity-coloured send buttons. */
  button: string;
}

export const SEVERITY_STYLES: Readonly<Record<SeverityTone, SeverityStyle>> = {
  presidential: {
    solid: "bg-sev-presidential text-sev-presidential-on",
    tint: "bg-sev-presidential-tint text-sev-presidential-fg ring-1 ring-inset ring-sev-presidential-edge/35",
    outline: "text-sev-presidential-fg ring-1 ring-inset ring-sev-presidential-edge",
    edgeBg: "bg-sev-presidential-edge",
    edgeBorder: "border-sev-presidential-edge",
    fg: "text-sev-presidential-fg",
    selected: "bg-sev-presidential-tint border-sev-presidential-edge ring-1 ring-sev-presidential-edge",
    button: "bg-sev-presidential text-sev-presidential-on hover:bg-sev-presidential/90",
  },
  extreme: {
    solid: "bg-sev-extreme text-sev-extreme-on",
    tint: "bg-sev-extreme-tint text-sev-extreme-fg ring-1 ring-inset ring-sev-extreme-edge/35",
    outline: "text-sev-extreme-fg ring-1 ring-inset ring-sev-extreme-edge",
    edgeBg: "bg-sev-extreme-edge",
    edgeBorder: "border-sev-extreme-edge",
    fg: "text-sev-extreme-fg",
    selected: "bg-sev-extreme-tint border-sev-extreme-edge ring-1 ring-sev-extreme-edge",
    button: "bg-sev-extreme text-sev-extreme-on hover:bg-sev-extreme/90",
  },
  severe: {
    // Light gold is 1.76:1 on cream, so solids always carry the edge ring.
    solid: "bg-sev-severe text-sev-severe-on ring-1 ring-inset ring-sev-severe-edge",
    tint: "bg-sev-severe-tint text-sev-severe-fg ring-1 ring-inset ring-sev-severe-edge/35",
    outline: "text-sev-severe-fg ring-1 ring-inset ring-sev-severe-edge",
    edgeBg: "bg-sev-severe-edge",
    edgeBorder: "border-sev-severe-edge",
    fg: "text-sev-severe-fg",
    selected: "bg-sev-severe-tint border-sev-severe-edge ring-1 ring-sev-severe-edge",
    button: "bg-sev-severe text-sev-severe-on ring-1 ring-inset ring-sev-severe-edge hover:bg-sev-severe/90",
  },
  amber: {
    solid: "bg-sev-amber text-sev-amber-on",
    tint: "bg-sev-amber-tint text-sev-amber-fg ring-1 ring-inset ring-sev-amber-edge/35",
    outline: "text-sev-amber-fg ring-1 ring-inset ring-sev-amber-edge",
    edgeBg: "bg-sev-amber-edge",
    edgeBorder: "border-sev-amber-edge",
    fg: "text-sev-amber-fg",
    selected: "bg-sev-amber-tint border-sev-amber-edge ring-1 ring-sev-amber-edge",
    button: "bg-sev-amber text-sev-amber-on hover:bg-sev-amber/90",
  },
  etws: {
    solid: "bg-sev-etws text-sev-etws-on",
    tint: "bg-sev-etws-tint text-sev-etws-fg ring-1 ring-inset ring-sev-etws-edge/35",
    outline: "text-sev-etws-fg ring-1 ring-inset ring-sev-etws-edge",
    edgeBg: "bg-sev-etws-edge",
    edgeBorder: "border-sev-etws-edge",
    fg: "text-sev-etws-fg",
    selected: "bg-sev-etws-tint border-sev-etws-edge ring-1 ring-sev-etws-edge",
    button: "bg-sev-etws text-sev-etws-on hover:bg-sev-etws/90",
  },
  test: {
    solid: "bg-sev-test text-sev-test-on",
    tint: "sev-hatch bg-sev-test-tint text-sev-test-fg outline outline-1 outline-dashed outline-sev-test-edge -outline-offset-1",
    outline: "text-sev-test-fg outline outline-1 outline-dashed outline-sev-test-edge -outline-offset-1",
    edgeBg: "bg-sev-test-edge",
    edgeBorder: "border-sev-test-edge border-dashed",
    fg: "text-sev-test-fg",
    selected: "bg-sev-test-tint border-sev-test-edge border-dashed ring-1 ring-sev-test-edge",
    button: "bg-sev-test text-sev-test-on hover:bg-sev-test/90",
  },
};

export const ALERT_CLASS_ICONS: Readonly<Record<AlertClassKey, LucideIcon>> = {
  presidential: Landmark,
  extreme: OctagonAlert,
  severe: TriangleAlert,
  amber: UserSearch,
  "monthly-test": CalendarCheck,
  exercise: ClipboardCheck,
  earthquake: Activity,
  tsunami: WavesArrowUp,
  "earthquake-tsunami": WavesArrowUp,
  "etws-test": FlaskConical,
};
