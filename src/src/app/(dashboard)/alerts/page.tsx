"use client";

import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { m } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  XCircle,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { SeverityBadge } from "@/components/alerts/severity-badge";
import { AlertStatusPill } from "@/components/alerts/alert-status-pill";
import { LinkButton } from "@/components/shared/link-button";
import { ErrorState } from "@/components/shared/states";
import { useAlerts, useDeleteAlert } from "@/hooks/use-alerts";
import { pageEnter } from "@/lib/motion";
import type { AlertStatus } from "@/types/domain";

const STATUS_TABS: { value: AlertStatus | "all"; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "DRAFT", label: "Brouillons" },
  { value: "SCHEDULED", label: "Programmées" },
  { value: "SENDING", label: "En cours" },
  { value: "SENT", label: "Envoyées" },
  { value: "FAILED", label: "Échecs" },
];

export default function AlertsPage() {
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "CMAS" | "ETWS">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Build filters for API
  const filters = {
    limit: 50,
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(typeFilter !== "all" && { alert_type: typeFilter }),
    ...(searchQuery && { search: searchQuery }),
  };

  const {
    data: alertsData,
    isPending,
    isError,
    error,
    refetch,
  } = useAlerts(filters);

  const deleteAlert = useDeleteAlert();

  const alerts = alertsData?.data ?? [];
  const total = alertsData?.pagination?.total ?? alerts.length;

  // Count by status (from current data)
  const statusCounts: Record<string, number> = {
    all: total,
    DRAFT: alerts.filter((a) => a.status === "DRAFT").length,
    SCHEDULED: alerts.filter((a) => a.status === "SCHEDULED").length,
    SENDING: alerts.filter((a) => a.status === "SENDING").length,
    SENT: alerts.filter((a) => a.status === "SENT").length,
    FAILED: alerts.filter((a) => a.status === "FAILED").length,
    CANCELLED: alerts.filter((a) => a.status === "CANCELLED").length,
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cette alerte ?")) {
      await deleteAlert.mutateAsync(id);
    }
  };

  return (
    <m.div {...pageEnter} className="space-y-5">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-semibold text-ink">
            Alertes
          </h1>
          <p className="text-[12px] text-ink-3">
            Gérez et suivez vos alertes Cell Broadcast
          </p>
        </div>
        <LinkButton size="sm" href="/alerts/new">
          <Plus className="size-3.5" /> Nouvelle alerte
        </LinkButton>
      </header>

      {/* Filters Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
          <Input
            placeholder="Rechercher par contenu ou ID..."
            className="h-8 pl-8 text-[13px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}
        >
          <SelectTrigger className="h-8 w-[140px] text-[13px]">
            <Filter className="mr-1.5 size-3.5" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="CMAS">CMAS</SelectItem>
            <SelectItem value="ETWS">ETWS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Tabs */}
      <Tabs
        value={statusFilter}
        onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
      >
        <TabsList className="h-8 w-full max-w-2xl">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-1.5 text-[12px]"
            >
              {tab.label}
              <span className="rounded bg-surface-sunken px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-ink-3">
                {statusCounts[tab.value] ?? 0}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Content */}
      {isError ? (
        <ErrorState
          title="Impossible de charger les alertes"
          error={error}
          onRetry={() => void refetch()}
        />
      ) : isPending ? (
        <AlertsTableSkeleton />
      ) : alerts.length === 0 ? (
        <EmptyState searchQuery={searchQuery} statusFilter={statusFilter} />
      ) : (
        <div className="rounded-xl border border-hairline bg-shell">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">Statut</TableHead>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[80px]">Cellules</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[50px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id} className="group">
                  <TableCell>
                    <AlertStatusPill status={alert.status} size="sm" />
                  </TableCell>
                  <TableCell>
                    <SeverityBadge messageId={alert.message_id} />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/alerts/${alert.id}`}
                      className="block hover:underline"
                    >
                      <p className="line-clamp-1 text-[13px] font-medium text-ink">
                        {alert.content || "Sans contenu"}
                      </p>
                      <p className="text-[11px] font-mono text-ink-3">
                        {alert.id.slice(0, 8)}
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-[13px] tabular-nums text-ink-2">
                      {alert.cells?.length ?? 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-[12px]">
                      {alert.sent_at ? (
                        <>
                          <p className="text-ink">
                            {format(new Date(alert.sent_at), "dd MMM", {
                              locale: fr,
                            })}
                          </p>
                          <p className="text-ink-3">
                            {format(new Date(alert.sent_at), "HH:mm")}
                          </p>
                        </>
                      ) : alert.scheduled_at ? (
                        <>
                          <p className="text-ink">
                            {format(new Date(alert.scheduled_at), "dd MMM", {
                              locale: fr,
                            })}
                          </p>
                          <p className="text-ink-3">
                            {format(new Date(alert.scheduled_at), "HH:mm")}
                          </p>
                        </>
                      ) : (
                        <p className="text-ink-3">
                          {formatDistanceToNow(new Date(alert.created_at), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
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
                          <Link href={`/alerts/${alert.id}`} className="flex items-center">
                            <Eye className="mr-2 size-4" />
                            Voir détails
                          </Link>
                        </DropdownMenuItem>
                        {(alert.status === "DRAFT" ||
                          alert.status === "SCHEDULED") && (
                          <DropdownMenuItem>
                            <Link href={`/alerts/${alert.id}/edit`} className="flex items-center">
                              <Edit className="mr-2 size-4" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Copy className="mr-2 size-4" />
                          Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {alert.status === "SCHEDULED" && (
                          <DropdownMenuItem className="text-danger">
                            <XCircle className="mr-2 size-4" />
                            Annuler
                          </DropdownMenuItem>
                        )}
                        {alert.status === "DRAFT" && (
                          <DropdownMenuItem
                            className="text-danger"
                            onClick={() => handleDelete(alert.id)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Supprimer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </m.div>
  );
}

function AlertsTableSkeleton() {
  return (
    <div className="rounded-xl border border-hairline bg-shell">
      <div className="divide-y divide-hairline">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  searchQuery,
  statusFilter,
}: {
  searchQuery: string;
  statusFilter: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-hairline bg-shell py-16 text-center">
      <Activity className="size-10 text-ink-3/50" />
      <h3 className="mt-3 text-[15px] font-medium text-ink">
        Aucune alerte trouvée
      </h3>
      <p className="mt-1 text-[13px] text-ink-3">
        {searchQuery
          ? "Essayez de modifier vos critères de recherche"
          : statusFilter !== "all"
            ? `Aucune alerte avec le statut "${statusFilter}"`
            : "Créez votre première alerte pour commencer"}
      </p>
      {!searchQuery && statusFilter === "all" && (
        <LinkButton size="sm" href="/alerts/new" className="mt-4">
          <Plus className="size-3.5" /> Créer une alerte
        </LinkButton>
      )}
    </div>
  );
}
