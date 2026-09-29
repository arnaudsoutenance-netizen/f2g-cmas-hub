"use client";

import { Activity, FileText, FlaskConical, Megaphone, type LucideIcon } from "lucide-react";
import { CountUp } from "@/components/shared/count-up";
import { cn } from "@/lib/utils";
import type { Template } from "@/types/domain";
import { countFamilies } from "./template-families";

interface Counter {
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  /** Static class strings only (Tailwind v4 scans source text). */
  chip: string;
}

/** Library size by broad family: public CMAS, ETWS warnings, tests and exercises. */
export function TemplateCounters({ templates }: { templates: readonly Template[] }) {
  const families = countFamilies(templates);
  const inactive = templates.filter((t) => !t.is_active).length;

  const counters: Counter[] = [
    {
      label: "Templates",
      value: templates.length,
      detail: inactive > 0 ? `${inactive} inactive` : "All active",
      icon: FileText,
      chip: "bg-navy-tint text-primary",
    },
    {
      label: "CMAS",
      value: families.cmas,
      detail: "Public warnings",
      icon: Megaphone,
      chip: "bg-orange-tint text-orange-fg",
    },
    {
      label: "ETWS",
      value: families.etws,
      detail: "Earthquake & tsunami",
      icon: Activity,
      chip: "bg-sev-etws-tint text-sev-etws-fg",
    },
    {
      label: "Tests",
      value: families.test,
      detail: "Tests & exercises",
      icon: FlaskConical,
      chip: "bg-sev-test-tint text-sev-test-fg",
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {counters.map(({ label, value, detail, icon: Icon, chip }) => (
        <div key={label} className="rounded-[16px] border border-hairline bg-surface p-4 shadow-e1 sm:p-5">
          <dt className="flex items-center gap-2 text-[13px] font-medium text-ink-2">
            <span className={cn("grid size-7 shrink-0 place-items-center rounded-[8px]", chip)}>
              <Icon aria-hidden className="size-4" />
            </span>
            {label}
          </dt>
          <dd className="mt-3">
            <CountUp value={value} className="tnum block font-display text-[32px] leading-none font-bold text-ink" />
            <span className="mt-1.5 block text-[12px] text-ink-3">{detail}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
