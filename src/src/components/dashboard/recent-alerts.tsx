"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ChevronRight,
  Send,
  Clock,
  AlertTriangle,
  Radio,
} from "lucide-react";
import Link from "next/link";
import type { Alert } from "@/types";
import { STATUS_COLORS, STATUS_LABELS, MESSAGE_IDS } from "@/types";

interface RecentAlertsProps {
  alerts: Alert[];
}

function getAlertIcon(status: Alert["status"]) {
  switch (status) {
    case "SENT":
      return <Send className="h-4 w-4 text-green-600" />;
    case "SCHEDULED":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "FAILED":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    default:
      return <Radio className="h-4 w-4 text-muted-foreground" />;
  }
}

function getMessageName(messageId: number, alertType: Alert["alertType"]) {
  const messages = alertType === "CMAS" ? MESSAGE_IDS.CMAS : MESSAGE_IDS.ETWS;
  const found = messages.find((m) => m.id === messageId);
  return found?.name || `ID ${messageId}`;
}

function getMessageColor(messageId: number) {
  if (messageId === 4370 || messageId === 4379) return "bg-red-600";
  if (messageId >= 4371 && messageId <= 4372) return "bg-orange-600";
  if (messageId >= 4373 && messageId <= 4374) return "bg-amber-600";
  if (messageId === 4375) return "bg-yellow-600";
  if (messageId >= 4376 && messageId <= 4378) return "bg-emerald-600";
  if (messageId === 4352) return "bg-red-700";
  if (messageId === 4353) return "bg-blue-700";
  return "bg-gray-600";
}

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Alertes récentes</CardTitle>
        <Link href="/alerts">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Voir tout
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune alerte récente
            </div>
          ) : (
            alerts.slice(0, 5).map((alert) => (
              <Link
                key={alert.id}
                href={`/alerts/${alert.id}`}
                className="block"
              >
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                  {/* Status indicator */}
                  <div className="mt-1">{getAlertIcon(alert.status)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={cn(
                          "text-white text-xs",
                          getMessageColor(alert.messageId)
                        )}
                      >
                        {getMessageName(alert.messageId, alert.alertType)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", STATUS_COLORS[alert.status])}
                      >
                        {STATUS_LABELS[alert.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {alert.content}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>
                        {alert.sentAt
                          ? format(new Date(alert.sentAt), "dd MMM yyyy HH:mm", {
                              locale: fr,
                            })
                          : alert.scheduledAt
                          ? format(
                              new Date(alert.scheduledAt),
                              "dd MMM yyyy HH:mm",
                              { locale: fr }
                            )
                          : format(new Date(alert.createdAt), "dd MMM yyyy HH:mm", {
                              locale: fr,
                            })}
                      </span>
                      <span>•</span>
                      <span>{alert.cells.length} cellule(s)</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
