"use client";

import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteAlert } from "@/hooks/use-alerts";
import type { Alert } from "@/types/domain";

/** Confirms deletion of a draft. Anything other than a DRAFT is refused. */
export function DeleteDraftDialog({ alert, onClose }: { alert: Alert | null; onClose: () => void }) {
  const remove = useDeleteAlert();
  const open = alert !== null && alert.status === "DRAFT";

  const confirm = () => {
    if (!alert || alert.status !== "DRAFT") return;
    remove.mutate(alert.id, {
      onSuccess: () => {
        toast.success("Draft deleted");
        onClose();
      },
      onError: (error) =>
        toast.error("Could not delete the draft", { description: error instanceof Error ? error.message : undefined }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (!next && !remove.isPending ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-[17px] font-semibold text-ink">Delete this draft?</DialogTitle>
          <DialogDescription className="text-[13px] text-ink-2">
            The draft is removed permanently. It was never broadcast, so no handset is affected.
          </DialogDescription>
        </DialogHeader>
        {alert ? (
          <div className="space-y-2 rounded-[10px] border border-hairline bg-surface-sunken p-3">
            <SeverityBadge messageId={alert.message_id} size="sm" />
            <p className="line-clamp-3 text-[13px] text-ink-2">{alert.content || "No message"}</p>
          </div>
        ) : null}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" disabled={remove.isPending} />}>Keep draft</DialogClose>
          <Button variant="danger-outline" onClick={confirm} disabled={remove.isPending}>
            {remove.isPending ? <Loader2 aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" /> : <Trash2 aria-hidden className="size-3.5" />}
            Delete draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
