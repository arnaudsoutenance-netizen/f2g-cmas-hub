"use client";

import { LibraryBig } from "lucide-react";
import { NativeSelect } from "@/components/ui/native-select";
import type { Template } from "@/types/domain";

interface TemplateLoaderProps {
  templates: readonly Template[];
  value: string | null;
  onLoad: (id: string) => void;
}

/** Prefills class, message and duration from a saved template. Nothing is sent. */
export function TemplateLoader({ templates, value, onLoad }: TemplateLoaderProps) {
  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <label htmlFor="composer-template" className="flex shrink-0 items-center gap-1.5 text-[13px] text-ink-2">
        <LibraryBig aria-hidden className="size-4" />
        Load a template
      </label>
      <div className="min-w-0 flex-1 sm:w-[260px] sm:flex-none">
        <NativeSelect
          id="composer-template"
          variant="outline"
          size="lg"
          value={value ?? ""}
          onChange={(e) => e.target.value && onLoad(e.target.value)}
          className="rounded-[8px] text-[13px] text-ink"
        >
          <option value="">Choose a template…</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} · {t.message_id}
            </option>
          ))}
        </NativeSelect>
      </div>
    </div>
  );
}
