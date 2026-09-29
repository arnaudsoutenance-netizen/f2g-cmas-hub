"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  RadioTower,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface AlertDetail {
  id: string;
  message: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "failed" | "cancelled";
  createdAt: string;
  sentAt?: string;
  scheduledFor?: string;
  cells: { id: string; name: string; tac: number }[];
  alertClass?: {
    id: number;
    name: string;
    category: string;
  };
  duration?: number;
  language?: string;
}

async function fetchAlert(id: string): Promise<AlertDetail> {
  const res = await fetch(`/api/alerts/${id}`);
  if (!res.ok) throw new Error("Failed to fetch alert");
  return res.json();
}

const statusConfig = {
  draft: {
    icon: FileText,
    color: "text-st-draft-fg",
    bg: "bg-st-draft-tint",
    label: "Draft",
  },
  scheduled: {
    icon: Clock,
    color: "text-st-scheduled-fg",
    bg: "bg-st-scheduled-tint",
    label: "Scheduled",
  },
  sending: {
    icon: Send,
    color: "text-st-sending-fg",
    bg: "bg-st-sending-tint",
    label: "Sending",
  },
  sent: {
    icon: CheckCircle2,
    color: "text-st-sent-fg",
    bg: "bg-st-sent-tint",
    label: "Sent",
  },
  failed: {
    icon: XCircle,
    color: "text-st-failed-fg",
    bg: "bg-st-failed-tint",
    label: "Failed",
  },
  cancelled: {
    icon: AlertTriangle,
    color: "text-st-cancelled-fg",
    bg: "bg-st-cancelled-tint",
    label: "Cancelled",
  },
};

export default function AlertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const alertId = params.id as string;

  const { data: alert, isLoading, isError } = useQuery({
    queryKey: ["alert", alertId],
    queryFn: () => fetchAlert(alertId),
    enabled: !!alertId,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (isError || !alert) {
    return (
      <div className="p-6 space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive font-medium">Alert not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const config = statusConfig[alert.status];
  const StatusIcon = config.icon;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Alert Details
          </h1>
          <p className="text-sm text-muted-foreground">ID: {alert.id}</p>
        </div>
        <Badge className={`${config.bg} ${config.color}`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{alert.message}</p>
            </CardContent>
          </Card>

          {/* Cells */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RadioTower className="h-4 w-4" />
                Target Cells ({alert.cells.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {alert.cells.map((cell) => (
                  <div
                    key={cell.id}
                    className="p-3 rounded-lg bg-muted/50 flex items-center gap-3"
                  >
                    <RadioTower className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{cell.name}</p>
                      <p className="text-xs text-muted-foreground">
                        TAC: {cell.tac}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alert.alertClass && (
                <div>
                  <p className="text-xs text-muted-foreground">Alert Class</p>
                  <p className="font-medium">{alert.alertClass.name}</p>
                </div>
              )}
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-medium">
                  {format(new Date(alert.createdAt), "PPpp")}
                </p>
              </div>
              {alert.sentAt && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Sent</p>
                    <p className="font-medium">
                      {format(new Date(alert.sentAt), "PPpp")}
                    </p>
                  </div>
                </>
              )}
              {alert.scheduledFor && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Scheduled for</p>
                    <p className="font-medium">
                      {format(new Date(alert.scheduledFor), "PPpp")}
                    </p>
                  </div>
                </>
              )}
              {alert.duration && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium">{alert.duration} minutes</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {(alert.status === "draft" || alert.status === "scheduled") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {alert.status === "draft" && (
                  <Button className="w-full" disabled>
                    <Send className="h-4 w-4 mr-2" />
                    Send Alert
                  </Button>
                )}
                <Button variant="outline" className="w-full" disabled>
                  Cancel
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
