"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import {
  AlertTriangle,
  Building2,
  CircleCheck,
  Cloud,
  Factory,
  Flame,
  Globe,
  HeartPulse,
  HelpCircle,
  Mountain,
  Shield,
  Siren,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NativeSelect } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// CAP ENUMS (Common Alerting Protocol - OASIS Standard)
// ═══════════════════════════════════════════════════════════════════════════════

export type CapCategory =
  | "Geo"
  | "Met"
  | "Safety"
  | "Security"
  | "Rescue"
  | "Fire"
  | "Health"
  | "Env"
  | "Transport"
  | "Infra"
  | "CBRNE"
  | "Other";

export type CapResponseType =
  | "Shelter"
  | "Evacuate"
  | "Prepare"
  | "Execute"
  | "Avoid"
  | "Monitor"
  | "Assess"
  | "AllClear"
  | "None";

export type CapSeverity = "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown";

export type CapUrgency = "Immediate" | "Expected" | "Future" | "Past" | "Unknown";

export type CapCertainty = "Observed" | "Likely" | "Possible" | "Unlikely" | "Unknown";

export interface CapFields {
  category: CapCategory;
  responseType: CapResponseType;
  severity: CapSeverity;
  urgency: CapUrgency;
  certainty: CapCertainty;
  language: string;
  senderName: string;
  eventCode: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORY_CONFIG: Record<CapCategory, { icon: LucideIcon; label: string; description: string }> = {
  Geo: { icon: Mountain, label: "Geophysical", description: "Earthquake, landslide, volcano" },
  Met: { icon: Cloud, label: "Meteorological", description: "Weather, flood, cyclone" },
  Safety: { icon: Shield, label: "Public Safety", description: "General emergency" },
  Security: { icon: Siren, label: "Security", description: "Law enforcement, terrorism" },
  Rescue: { icon: Users, label: "Rescue", description: "Search and rescue operations" },
  Fire: { icon: Flame, label: "Fire", description: "Wildfire, urban fire" },
  Health: { icon: HeartPulse, label: "Health", description: "Disease outbreak, contamination" },
  Env: { icon: Globe, label: "Environment", description: "Pollution, radiation" },
  Transport: { icon: Truck, label: "Transport", description: "Road, rail, air incidents" },
  Infra: { icon: Building2, label: "Infrastructure", description: "Power, telecom, water" },
  CBRNE: { icon: Factory, label: "CBRNE", description: "Chemical, biological, nuclear" },
  Other: { icon: HelpCircle, label: "Other", description: "Miscellaneous alerts" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SEVERITY CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const SEVERITY_CONFIG: Record<CapSeverity, { color: string; bg: string; description: string }> = {
  Extreme: { color: "text-red-600", bg: "bg-red-500/10 border-red-500/30", description: "Extraordinary threat to life or property" },
  Severe: { color: "text-orange-600", bg: "bg-orange-500/10 border-orange-500/30", description: "Significant threat" },
  Moderate: { color: "text-amber-600", bg: "bg-amber-500/10 border-amber-500/30", description: "Possible threat" },
  Minor: { color: "text-blue-600", bg: "bg-blue-500/10 border-blue-500/30", description: "Minimal threat" },
  Unknown: { color: "text-ink-3", bg: "bg-ink/5 border-ink/10", description: "Severity unknown" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// URGENCY CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const URGENCY_CONFIG: Record<CapUrgency, { label: string; description: string }> = {
  Immediate: { label: "Immediate", description: "Response required NOW" },
  Expected: { label: "Expected", description: "Response required within 1 hour" },
  Future: { label: "Future", description: "Response required in near future" },
  Past: { label: "Past", description: "Event has occurred, no response needed" },
  Unknown: { label: "Unknown", description: "Urgency unknown" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CERTAINTY CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const CERTAINTY_CONFIG: Record<CapCertainty, { label: string; probability: string }> = {
  Observed: { label: "Observed", probability: "Determined to have occurred" },
  Likely: { label: "Likely", probability: "> 50% probability" },
  Possible: { label: "Possible", probability: "< 50% probability" },
  Unlikely: { label: "Unlikely", probability: "Not expected to occur" },
  Unknown: { label: "Unknown", probability: "Certainty unknown" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSE TYPE CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const RESPONSE_CONFIG: Record<CapResponseType, { label: string; description: string }> = {
  Shelter: { label: "Shelter", description: "Take shelter in place" },
  Evacuate: { label: "Evacuate", description: "Relocate as instructed" },
  Prepare: { label: "Prepare", description: "Make preparations" },
  Execute: { label: "Execute", description: "Execute pre-planned actions" },
  Avoid: { label: "Avoid", description: "Avoid hazard area" },
  Monitor: { label: "Monitor", description: "Attend to information sources" },
  Assess: { label: "Assess", description: "Evaluate situation" },
  AllClear: { label: "All Clear", description: "Threat has passed" },
  None: { label: "None", description: "No action recommended" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// LANGUAGES
// ═══════════════════════════════════════════════════════════════════════════════

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "zh", label: "中文" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT CODES (subset for Cameroon)
// ═══════════════════════════════════════════════════════════════════════════════

const EVENT_CODES = [
  { code: "CDW", label: "CDW - Civil Danger Warning" },
  { code: "EQW", label: "EQW - Earthquake Warning" },
  { code: "FLW", label: "FLW - Flood Warning" },
  { code: "FRW", label: "FRW - Fire Warning" },
  { code: "HUW", label: "HUW - Hurricane Warning" },
  { code: "TOR", label: "TOR - Tornado Warning" },
  { code: "TSW", label: "TSW - Tsunami Warning" },
  { code: "VOW", label: "VOW - Volcano Warning" },
  { code: "LAE", label: "LAE - Local Area Emergency" },
  { code: "LEW", label: "LEW - Law Enforcement Warning" },
  { code: "CAE", label: "CAE - Child Abduction Emergency" },
  { code: "EVI", label: "EVI - Evacuation Immediate" },
  { code: "CEM", label: "CEM - Civil Emergency Message" },
  { code: "ADR", label: "ADR - Administrative Message" },
  { code: "RWT", label: "RWT - Required Weekly Test" },
  { code: "RMT", label: "RMT - Required Monthly Test" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface CapFieldsEditorProps {
  value: Partial<CapFields>;
  onChange: (fields: Partial<CapFields>) => void;
}

function SectionTitle({ children, description }: { children: React.ReactNode; description?: string }) {
  return (
    <div className="mb-3">
      <h4 className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">{children}</h4>
      {description && <p className="mt-0.5 text-[12px] text-ink-3">{description}</p>}
    </div>
  );
}

function CategoryTile({
  category,
  selected,
  onClick,
}: {
  category: CapCategory;
  selected: boolean;
  onClick: () => void;
}) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-200",
        "hover:scale-[1.02] active:scale-[0.98]",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-hairline bg-surface hover:border-ink/20 hover:bg-surface-hover"
      )}
    >
      {selected && (
        <CircleCheck className="absolute -top-1.5 -right-1.5 size-4 text-primary" />
      )}
      <Icon className={cn("size-5", selected ? "text-primary" : "text-ink-2")} />
      <span className={cn("text-[12px] font-medium", selected ? "text-primary" : "text-ink")}>{config.label}</span>
    </button>
  );
}

function SeverityTile({
  severity,
  selected,
  onClick,
}: {
  severity: CapSeverity;
  selected: boolean;
  onClick: () => void;
}) {
  const config = SEVERITY_CONFIG[severity];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition-all duration-200",
        "hover:scale-[1.01] active:scale-[0.99]",
        selected ? config.bg : "border-hairline bg-surface hover:bg-surface-hover",
        selected && "ring-2 ring-offset-1"
      )}
    >
      {selected && <CircleCheck className={cn("absolute top-2 right-2 size-4", config.color)} />}
      <span className={cn("text-[14px] font-semibold", config.color)}>{severity}</span>
      <span className="text-[11px] text-ink-3">{config.description}</span>
    </button>
  );
}

export function CapFieldsEditor({ value, onChange }: CapFieldsEditorProps) {
  const update = <K extends keyof CapFields>(key: K, val: CapFields[K]) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-8">
      {/* Category Grid */}
      <section>
        <SectionTitle description="What type of hazard or emergency?">Category</SectionTitle>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {(Object.keys(CATEGORY_CONFIG) as CapCategory[]).map((cat) => (
            <CategoryTile
              key={cat}
              category={cat}
              selected={value.category === cat}
              onClick={() => update("category", cat)}
            />
          ))}
        </div>
      </section>

      {/* Severity Scale */}
      <section>
        <SectionTitle description="How dangerous is this event?">Severity</SectionTitle>
        <div className="grid gap-2 sm:grid-cols-5">
          {(["Extreme", "Severe", "Moderate", "Minor", "Unknown"] as CapSeverity[]).map((sev) => (
            <SeverityTile
              key={sev}
              severity={sev}
              selected={value.severity === sev}
              onClick={() => update("severity", sev)}
            />
          ))}
        </div>
      </section>

      {/* Urgency & Certainty Row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <section>
          <SectionTitle description="When is response required?">Urgency</SectionTitle>
          <RadioGroup
            value={value.urgency ?? null}
            onValueChange={(val) => update("urgency", val as CapUrgency)}
            className="space-y-2"
          >
            {(Object.keys(URGENCY_CONFIG) as CapUrgency[]).map((urg) => (
              <Radio.Root
                key={urg}
                value={urg}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 transition-colors",
                  value.urgency === urg
                    ? "border-primary bg-primary/5"
                    : "border-hairline hover:bg-surface-hover"
                )}
              >
                <div
                  className={cn(
                    "size-4 rounded-full border-2 transition-colors",
                    value.urgency === urg ? "border-primary bg-primary" : "border-ink-3"
                  )}
                >
                  {value.urgency === urg && (
                    <div className="m-0.5 size-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <span className="text-[13px] font-medium text-ink">{URGENCY_CONFIG[urg].label}</span>
                  <span className="ml-2 text-[11px] text-ink-3">{URGENCY_CONFIG[urg].description}</span>
                </div>
              </Radio.Root>
            ))}
          </RadioGroup>
        </section>

        <section>
          <SectionTitle description="How certain is this threat?">Certainty</SectionTitle>
          <RadioGroup
            value={value.certainty ?? null}
            onValueChange={(val) => update("certainty", val as CapCertainty)}
            className="space-y-2"
          >
            {(Object.keys(CERTAINTY_CONFIG) as CapCertainty[]).map((cert) => (
              <Radio.Root
                key={cert}
                value={cert}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 transition-colors",
                  value.certainty === cert
                    ? "border-primary bg-primary/5"
                    : "border-hairline hover:bg-surface-hover"
                )}
              >
                <div
                  className={cn(
                    "size-4 rounded-full border-2 transition-colors",
                    value.certainty === cert ? "border-primary bg-primary" : "border-ink-3"
                  )}
                >
                  {value.certainty === cert && (
                    <div className="m-0.5 size-2 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <span className="text-[13px] font-medium text-ink">{CERTAINTY_CONFIG[cert].label}</span>
                  <span className="ml-2 text-[11px] text-ink-3">{CERTAINTY_CONFIG[cert].probability}</span>
                </div>
              </Radio.Root>
            ))}
          </RadioGroup>
        </section>
      </div>

      {/* Response Type */}
      <section>
        <SectionTitle description="What should people do?">Response Type</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(RESPONSE_CONFIG) as CapResponseType[]).map((resp) => (
            <button
              key={resp}
              type="button"
              onClick={() => update("responseType", resp)}
              className={cn(
                "rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200",
                value.responseType === resp
                  ? "border-primary bg-primary text-white"
                  : "border-hairline bg-surface text-ink hover:bg-surface-hover"
              )}
            >
              {RESPONSE_CONFIG[resp].label}
            </button>
          ))}
        </div>
      </section>

      {/* Language & Event Code Row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <section>
          <SectionTitle>Language</SectionTitle>
          <NativeSelect
            value={value.language ?? "en"}
            onChange={(e) => update("language", e.target.value)}
            className="w-full"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </NativeSelect>
        </section>

        <section>
          <SectionTitle>Event Code</SectionTitle>
          <NativeSelect
            value={value.eventCode ?? "CDW"}
            onChange={(e) => update("eventCode", e.target.value)}
            className="w-full font-mono"
          >
            {EVENT_CODES.map((ev) => (
              <option key={ev.code} value={ev.code}>
                {ev.label}
              </option>
            ))}
          </NativeSelect>
        </section>
      </div>

      {/* Sender Name */}
      <section>
        <SectionTitle description="Organization broadcasting this alert">Sender Name</SectionTitle>
        <input
          type="text"
          value={value.senderName ?? ""}
          onChange={(e) => update("senderName", e.target.value)}
          placeholder="e.g. Ministry of Territorial Administration"
          className={cn(
            "w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-[14px] text-ink",
            "placeholder:text-ink-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          )}
        />
      </section>
    </div>
  );
}
