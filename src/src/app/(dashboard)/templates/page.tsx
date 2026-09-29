"use client";

import { m } from "framer-motion";
import { FileText, Plus, SearchX } from "lucide-react";
import { useState } from "react";

import { Panel } from "@/components/dashboard/panel";
import { LinkButton } from "@/components/shared/link-button";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { DeleteTemplateDialog } from "@/components/templates-page/delete-template-dialog";
import { EditTemplateDialog } from "@/components/templates-page/edit-template-dialog";
import { StartFromScratchTile, TemplateCard } from "@/components/templates-page/template-card";
import { TemplateCounters } from "@/components/templates-page/template-counters";
import { classesInUse, matchesQuery } from "@/components/templates-page/template-families";
import { TemplateFilters, type ClassFilter } from "@/components/templates-page/template-filters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTemplates } from "@/hooks/use-network";
import { useCurrentUser } from "@/hooks/use-session";
import { classifyMessageId } from "@/lib/cmas/alert-classes";
import { pageEnter } from "@/lib/motion";
import type { Template } from "@/types/domain";

/** Template library: numbered index of ready-made messages; "Use" prefills the composer. */
export default function TemplatesPage() {
  const user = useCurrentUser();
  const isAdmin = user.data?.role === "ADMIN";
  // Admins also see inactive templates so they can re-enable them.
  const templates = useTemplates({ active_only: !isAdmin });

  const [classFilter, setClassFilter] = useState<ClassFilter>("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Template | null>(null);
  const [deleting, setDeleting] = useState<Template | null>(null);

  const all = templates.data ?? [];
  const numbered = all.map((template, i) => ({ template, index: i + 1 }));
  const visible = numbered.filter(
    ({ template }) =>
      (classFilter === "all" || classifyMessageId(template.message_id)?.key === classFilter) &&
      matchesQuery(template, query),
  );
  const filtered = classFilter !== "all" || query.trim() !== "";
  const clearFilters = () => {
    setClassFilter("all");
    setQuery("");
  };

  return (
    <m.div {...pageEnter} className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] leading-tight font-bold text-ink">Templates</h1>
          <p className="mt-0.5 text-[14px] text-ink-3">
            Ready-made messages. Using one prefills the composer; nothing is broadcast until you confirm.
          </p>
        </div>
        <LinkButton href="/alerts/new" size="md">
          <Plus aria-hidden data-icon="inline-start" />
          New alert
        </LinkButton>
      </header>

      {templates.isError ? (
        <ErrorState title="Unable to load templates" error={templates.error} onRetry={() => void templates.refetch()} />
      ) : templates.isPending ? (
        <TemplatesSkeleton />
      ) : all.length === 0 ? (
        <Panel title="Library">
          <EmptyState
            icon={FileText}
            title="No template yet"
            description="Templates are prepared by an administrator. You can still compose an alert from scratch."
            action={
              <LinkButton href="/alerts/new" variant="outline" size="sm">
                New alert
              </LinkButton>
            }
            className="px-5"
          />
        </Panel>
      ) : (
        <>
          <TemplateCounters templates={all} />

          <TemplateFilters
            classes={classesInUse(all)}
            total={all.length}
            value={classFilter}
            onChange={setClassFilter}
            query={query}
            onQueryChange={setQuery}
          />

          <Panel
            title="Library"
            description={
              filtered
                ? `${visible.length} of ${all.length} template${all.length === 1 ? "" : "s"}`
                : `${all.length} template${all.length === 1 ? "" : "s"}${isAdmin ? " · you can edit and delete" : ""}`
            }
            action={
              filtered ? (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          >
            {visible.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No template matches"
                description="Try another class or a shorter search."
                action={
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
                className="px-5"
              />
            ) : (
              <ol className="grid gap-px bg-hairline md:grid-cols-2 xl:grid-cols-3">
                {visible.map(({ template, index }) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    index={index}
                    canManage={isAdmin}
                    onEdit={setEditing}
                    onDelete={setDeleting}
                  />
                ))}
                <StartFromScratchTile itemCount={visible.length} />
              </ol>
            )}
          </Panel>
        </>
      )}

      {isAdmin ? (
        <>
          <EditTemplateDialog template={editing} onClose={() => setEditing(null)} />
          <DeleteTemplateDialog template={deleting} onClose={() => setDeleting(null)} />
        </>
      ) : null}
    </m.div>
  );
}

function TemplatesSkeleton() {
  return (
    <div className="space-y-6" aria-busy aria-label="Loading templates">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[118px] rounded-[16px]" />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-full" />
        ))}
      </div>
      <div className="overflow-hidden rounded-[16px] border border-hairline bg-surface shadow-e1">
        <div className="border-b border-hairline px-5 py-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-1.5 h-3 w-40" />
        </div>
        <div className="grid gap-px bg-hairline md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex gap-4 bg-surface p-5">
              <Skeleton className="h-7 w-9" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
