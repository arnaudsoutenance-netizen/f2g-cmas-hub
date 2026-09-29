"use client";

import Link from "next/link";
import { m } from "framer-motion";
import {
  Plus,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { LinkButton } from "@/components/shared/link-button";
import { ErrorState } from "@/components/shared/states";
import { useTemplates, useDeleteTemplate } from "@/hooks/use-network";
import { classifyMessageId } from "@/lib/cmas/alert-classes";
import { formatDuration } from "@/lib/cmas/composer-utils";
import { pageEnter } from "@/lib/motion";

export default function TemplatesPage() {
  const { data: templates, isPending, isError, error, refetch } = useTemplates();
  const deleteTemplate = useDeleteTemplate();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete template "${name}"?`)) {
      await deleteTemplate.mutateAsync(id);
    }
  };

  return (
    <m.div {...pageEnter} className="space-y-5">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-semibold text-ink">
            Templates
          </h1>
          <p className="text-[12px] text-ink-3">
            Pre-configured alert templates for quick broadcasting
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="size-3.5 mr-1.5" />
          Create Template
        </Button>
      </header>

      {/* Content */}
      {isError ? (
        <ErrorState
          title="Failed to load templates"
          error={error}
          onRetry={() => void refetch()}
        />
      ) : isPending ? (
        <TemplatesGridSkeleton />
      ) : !templates || templates.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const alertClass = classifyMessageId(template.message_id);
            
            return (
              <div
                key={template.id}
                className="group relative flex flex-col rounded-xl border border-hairline bg-shell p-4 transition-shadow hover:shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[14px] font-semibold text-ink">
                      {template.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <SeverityBadge messageId={template.message_id} />
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 size-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-danger"
                        onClick={() => handleDelete(template.id, template.name)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Content preview */}
                <p className="mt-3 line-clamp-2 text-[13px] text-ink-2">
                  {template.content || "No content"}
                </p>

                {/* Footer */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-hairline">
                  <span className="text-[11px] text-ink-3">
                    Duration: {formatDuration(template.default_duration)}
                  </span>
                  <LinkButton
                    size="xs"
                    variant="outline"
                    href={`/alerts/new?template=${template.id}`}
                  >
                    <Send className="size-3" />
                    Use
                  </LinkButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </m.div>
  );
}

function TemplatesGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex flex-col rounded-xl border border-hairline bg-shell p-4"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-hairline bg-shell py-16 text-center">
      <FileText className="size-10 text-ink-3/50" />
      <h3 className="mt-3 text-[15px] font-medium text-ink">
        No templates
      </h3>
      <p className="mt-1 max-w-sm text-[13px] text-ink-3">
        Create templates to speed up composing recurring alerts
      </p>
      <Button variant="outline" size="sm" className="mt-4">
        <Plus className="size-3.5 mr-1.5" />
        Create Template
      </Button>
    </div>
  );
}
