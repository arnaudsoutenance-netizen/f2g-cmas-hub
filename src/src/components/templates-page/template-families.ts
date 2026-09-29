import { ALERT_CLASSES, classifyMessageId, type AlertClass, type AlertClassKey } from "@/lib/cmas/alert-classes";
import type { Template } from "@/types/domain";

/** Broad families shown in the counters: public CMAS, ETWS warnings, and tests/exercises. */
export type TemplateFamily = "cmas" | "etws" | "test";

export function familyOf(template: Pick<Template, "message_id" | "alert_type">): TemplateFamily {
  const alertClass = classifyMessageId(template.message_id);
  if (alertClass?.tone === "test") return "test";
  return (alertClass?.alertType ?? template.alert_type) === "ETWS" ? "etws" : "cmas";
}

export function countFamilies(templates: readonly Template[]): Record<TemplateFamily, number> {
  const counts: Record<TemplateFamily, number> = { cmas: 0, etws: 0, test: 0 };
  for (const t of templates) counts[familyOf(t)] += 1;
  return counts;
}

/** Alert classes that have at least one template, in standard order, with their counts. */
export function classesInUse(templates: readonly Template[]): Array<{ alertClass: AlertClass; count: number }> {
  const counts = new Map<AlertClassKey, number>();
  for (const t of templates) {
    const key = classifyMessageId(t.message_id)?.key;
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return ALERT_CLASSES.filter((c) => counts.has(c.key)).map((alertClass) => ({
    alertClass,
    count: counts.get(alertClass.key) ?? 0,
  }));
}

export function matchesQuery(template: Template, query: string): boolean {
  const q = query.trim().toLocaleLowerCase("en");
  if (q === "") return true;
  return [template.name, template.category, template.content, String(template.message_id)].some((field) =>
    field.toLocaleLowerCase("en").includes(q),
  );
}
