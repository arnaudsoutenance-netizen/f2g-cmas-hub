"use client";

import { Loader2 } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useSaveTemplate } from "@/hooks/use-network";
import { measureCbs } from "@/lib/cmas/cbs-encoding";
import { DURATION_STOPS_S, formatDuration } from "@/lib/cmas/composer-utils";
import type { Template } from "@/types/domain";
import { CbsFootprint } from "./template-card";

/** Admin-only edit of an existing template. The alert class is fixed once created. */
export function EditTemplateDialog({ template, onClose }: { template: Template | null; onClose: () => void }) {
  return (
    <Dialog open={template !== null} onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        {template ? <EditForm key={template.id} template={template} onClose={onClose} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function EditForm({ template, onClose }: { template: Template; onClose: () => void }) {
  const save = useSaveTemplate();
  const ids = useId();
  const [name, setName] = useState(template.name);
  const [category, setCategory] = useState(template.category);
  const [content, setContent] = useState(template.content);
  const [duration, setDuration] = useState(String(template.default_duration));
  const [active, setActive] = useState(template.is_active);

  const durations = DURATION_STOPS_S.some((s) => s === template.default_duration)
    ? [...DURATION_STOPS_S]
    : [...DURATION_STOPS_S, template.default_duration].sort((a, b) => a - b);

  const cbs = measureCbs(content);
  const nameMissing = name.trim() === "";
  const contentMissing = content.trim() === "";
  const invalid = nameMissing || contentMissing || category.trim() === "" || !cbs.fits;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (invalid) return;
    save.mutate(
      {
        id: template.id,
        input: {
          name: name.trim(),
          category: category.trim(),
          content,
          default_duration: Number(duration),
          is_active: active,
        },
      },
      {
        onSuccess: () => {
          toast.success("Template updated", { description: name.trim() });
          onClose();
        },
        onError: (error) =>
          toast.error("Could not update the template", {
            description: error instanceof Error ? error.message : undefined,
          }),
      },
    );
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle className="font-display text-[18px] font-semibold text-ink">Edit template</DialogTitle>
        <DialogDescription className="text-[13px] text-ink-3">
          Changes apply to new alerts only. Alerts already sent are not affected.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-wrap items-center gap-2 text-[12px] text-ink-3">
        <SeverityBadge messageId={template.message_id} size="sm" />
        <span>Class is fixed; create a new template to change it.</span>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={`${ids}-name`} className="text-[13px] text-ink">
          Name
        </Label>
        <Input
          id={`${ids}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={nameMissing}
          required
          maxLength={200}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor={`${ids}-category`} className="text-[13px] text-ink">
            Category
          </Label>
          <Input
            id={`${ids}-category`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-invalid={category.trim() === ""}
            required
            maxLength={50}
          />
        </div>
        <div className="grid gap-1.5">
          <Label id={`${ids}-duration-label`} className="text-[13px] text-ink">
            Default duration
          </Label>
          <Select value={duration} onValueChange={(v) => v !== null && setDuration(v)}>
            <SelectTrigger aria-labelledby={`${ids}-duration-label`} className="h-8 w-full">
              <SelectValue>{(v: string) => formatDuration(Number(v))}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {durations.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {formatDuration(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={`${ids}-content`} className="text-[13px] text-ink">
          Message
        </Label>
        <Textarea
          id={`${ids}-content`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-invalid={contentMissing || !cbs.fits}
          aria-describedby={`${ids}-cbs`}
          rows={5}
          required
          className="min-h-28"
        />
        <div id={`${ids}-cbs`} aria-live="polite">
          <CbsFootprint text={content} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-[12px] border border-hairline px-3 py-2.5">
        <Label htmlFor={`${ids}-active`} className="flex-col items-start gap-0.5 text-[13px] text-ink">
          Active
          <span className="text-[12px] font-normal text-ink-3">Inactive templates are hidden from the composer.</span>
        </Label>
        <Switch id={`${ids}-active`} checked={active} onCheckedChange={setActive} />
      </div>

      <DialogFooter className="bg-surface-sunken">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={invalid || save.isPending}>
          {save.isPending ? <Loader2 aria-hidden className="animate-spin motion-reduce:animate-none" /> : null}
          Save changes
        </Button>
      </DialogFooter>
    </form>
  );
}
