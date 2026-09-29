"use client";

import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteTemplate } from "@/hooks/use-network";
import type { Template } from "@/types/domain";

/** Admin-only, permanent deletion behind an explicit confirmation. */
export function DeleteTemplateDialog({ template, onClose }: { template: Template | null; onClose: () => void }) {
  const remove = useDeleteTemplate();

  const confirm = () => {
    if (!template) return;
    remove.mutate(template.id, {
      onSuccess: () => {
        toast.success("Template deleted", { description: template.name });
        onClose();
      },
      onError: (error) =>
        toast.error("Could not delete the template", {
          description: error instanceof Error ? error.message : undefined,
        }),
    });
  };

  return (
    <Dialog open={template !== null} onOpenChange={(open) => (open || remove.isPending ? undefined : onClose())}>
      <DialogContent role="alertdialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-[18px] font-semibold text-ink">Delete this template?</DialogTitle>
          <DialogDescription className="text-[13px] text-ink-2">
            <span className="font-semibold text-ink">{template?.name}</span> will be removed for every operator. This
            cannot be undone. Alerts already sent from it are not affected. To hide it temporarily, set it inactive instead.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-surface-sunken">
          <Button type="button" variant="outline" onClick={onClose} disabled={remove.isPending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={confirm} disabled={remove.isPending}>
            {remove.isPending ? (
              <Loader2 aria-hidden className="animate-spin motion-reduce:animate-none" />
            ) : (
              <Trash2 aria-hidden />
            )}
            Delete template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
