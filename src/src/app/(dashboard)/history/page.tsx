"use client";

import { useQuery } from "@tanstack/react-query";
import { History, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface Alert {
  id: string;
  message: string;
  status: "sent" | "failed" | "cancelled";
  createdAt: string;
  sentAt?: string;
  cellCount: number;
  alertClass?: string;
}

async function fetchAlertHistory(): Promise<Alert[]> {
  const res = await fetch("/api/alerts?status=sent,failed,cancelled&limit=50");
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

const statusConfig = {
  sent: {
    icon: CheckCircle2,
    color: "text-st-sent-fg",
    bg: "bg-st-sent-tint",
    badge: "bg-st-sent-tint text-st-sent-fg hover:bg-st-sent-tint",
  },
  failed: {
    icon: XCircle,
    color: "text-st-failed-fg",
    bg: "bg-st-failed-tint",
    badge: "bg-st-failed-tint text-st-failed-fg hover:bg-st-failed-tint",
  },
  cancelled: {
    icon: AlertTriangle,
    color: "text-st-cancelled-fg",
    bg: "bg-st-cancelled-tint",
    badge: "bg-st-cancelled-tint text-st-cancelled-fg hover:bg-st-cancelled-tint",
  },
};

export default function HistoryPage() {
  const { data: alerts, isLoading, isError } = useQuery({
    queryKey: ["alertHistory"],
    queryFn: fetchAlertHistory,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
          <History className="h-6 w-6 text-primary" />
          Alert History
        </h1>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
          <History className="h-6 w-6 text-primary" />
          Alert History
        </h1>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive font-medium">Unable to load history</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
          <History className="h-6 w-6 text-primary" />
          Alert History
        </h1>
        <span className="text-sm text-muted-foreground">
          {alerts?.length ?? 0} alerts
        </span>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-st-sent" />
              <span className="text-3xl font-bold">
                {alerts?.filter((a) => a.status === "sent").length ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-st-failed" />
              <span className="text-3xl font-bold">
                {alerts?.filter((a) => a.status === "failed").length ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-st-cancelled" />
              <span className="text-3xl font-bold">
                {alerts?.filter((a) => a.status === "cancelled").length ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert List */}
      <Card>
        <CardContent className="p-0 divide-y">
          {alerts && alerts.length > 0 ? (
            alerts.map((alert) => {
              const config = statusConfig[alert.status];
              const StatusIcon = config.icon;
              return (
                <div
                  key={alert.id}
                  className="p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <StatusIcon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(alert.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <span>{alert.cellCount} cells</span>
                    </div>
                  </div>
                  <Badge className={config.badge}>{alert.status}</Badge>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No alerts in history yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
