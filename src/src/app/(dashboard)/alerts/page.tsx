"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Plus,
  Search,
  Filter,
  Send,
  Clock,
  AlertTriangle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { MOCK_ALERTS } from "@/lib/stores/alert-store";
import { STATUS_COLORS, STATUS_LABELS, MESSAGE_IDS, ALERT_COLORS } from "@/types";
import type { Alert, AlertStatus } from "@/types";

function getMessageInfo(messageId: number, alertType: Alert["alertType"]) {
  const messages = alertType === "CMAS" ? MESSAGE_IDS.CMAS : MESSAGE_IDS.ETWS;
  return messages.find((m) => m.id === messageId);
}

function getStatusIcon(status: AlertStatus) {
  switch (status) {
    case "SENT":
      return <Send className="h-4 w-4" />;
    case "SCHEDULED":
      return <Clock className="h-4 w-4" />;
    case "FAILED":
      return <AlertTriangle className="h-4 w-4" />;
    case "CANCELLED":
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
}

export default function AlertsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlerts = MOCK_ALERTS.filter((alert) => {
    if (statusFilter !== "all" && alert.status !== statusFilter) return false;
    if (typeFilter !== "all" && alert.alertType !== typeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        alert.content.toLowerCase().includes(query) ||
        alert.id.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const statusCounts = {
    all: MOCK_ALERTS.length,
    DRAFT: MOCK_ALERTS.filter((a) => a.status === "DRAFT").length,
    SCHEDULED: MOCK_ALERTS.filter((a) => a.status === "SCHEDULED").length,
    SENT: MOCK_ALERTS.filter((a) => a.status === "SENT").length,
    FAILED: MOCK_ALERTS.filter((a) => a.status === "FAILED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertes</h1>
          <p className="text-muted-foreground">
            Gérez et suivez vos alertes Cell Broadcast
          </p>
        </div>
        <Link href="/alerts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Alerte
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par contenu ou ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "all")}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="CMAS">CMAS</SelectItem>
                <SelectItem value="ETWS">ETWS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="all" className="gap-2">
            Toutes
            <Badge variant="secondary" className="ml-1">
              {statusCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="DRAFT" className="gap-2">
            Brouillons
            <Badge variant="secondary" className="ml-1">
              {statusCounts.DRAFT}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="SCHEDULED" className="gap-2">
            Programmées
            <Badge variant="secondary" className="ml-1">
              {statusCounts.SCHEDULED}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="SENT" className="gap-2">
            Envoyées
            <Badge variant="secondary" className="ml-1">
              {statusCounts.SENT}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="FAILED" className="gap-2">
            Échecs
            <Badge variant="secondary" className="ml-1">
              {statusCounts.FAILED}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredAlerts.length} alerte{filteredAlerts.length > 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">Aucune alerte trouvée</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Essayez de modifier vos critères de recherche"
                  : "Créez votre première alerte pour commencer"}
              </p>
              <Link href="/alerts/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une alerte
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Statut</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[40%]">Message</TableHead>
                  <TableHead>Cellules</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => {
                  const messageInfo = getMessageInfo(alert.messageId, alert.alertType);
                  return (
                    <TableRow key={alert.id} className="group">
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn("gap-1", STATUS_COLORS[alert.status])}
                        >
                          {getStatusIcon(alert.status)}
                          {STATUS_LABELS[alert.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-white",
                            messageInfo
                              ? ALERT_COLORS[messageInfo.category]
                              : "bg-gray-500"
                          )}
                        >
                          {messageInfo?.name || alert.messageId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium line-clamp-1">{alert.content}</p>
                        <p className="text-xs text-muted-foreground">
                          ID: {alert.id}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {alert.cells.length} cellule{alert.cells.length > 1 ? "s" : ""}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {alert.sentAt ? (
                            <>
                              <p>
                                {format(new Date(alert.sentAt), "dd MMM yyyy", {
                                  locale: fr,
                                })}
                              </p>
                              <p className="text-muted-foreground">
                                {format(new Date(alert.sentAt), "HH:mm")}
                              </p>
                            </>
                          ) : alert.scheduledAt ? (
                            <>
                              <p>
                                {format(new Date(alert.scheduledAt), "dd MMM yyyy", {
                                  locale: fr,
                                })}
                              </p>
                              <p className="text-muted-foreground">
                                {format(new Date(alert.scheduledAt), "HH:mm")}
                              </p>
                            </>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`/alerts/${alert.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir détails
                              </Link>
                            </DropdownMenuItem>
                            {(alert.status === "DRAFT" ||
                              alert.status === "SCHEDULED") && (
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {alert.status === "SCHEDULED" && (
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="h-4 w-4 mr-2" />
                                Annuler
                              </DropdownMenuItem>
                            )}
                            {alert.status === "DRAFT" && (
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
