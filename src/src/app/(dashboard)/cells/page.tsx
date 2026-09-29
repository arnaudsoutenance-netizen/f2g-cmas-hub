"use client";

import { useQuery } from "@tanstack/react-query";
import { RadioTower, CheckCircle2, XCircle, Signal, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Cell {
  id: string;
  name: string;
  tac: number;
  status: "online" | "offline";
  signalStrength?: number;
  lastSeen?: string;
}

async function fetchCells(): Promise<Cell[]> {
  const res = await fetch("/api/cells");
  if (!res.ok) throw new Error("Failed to fetch cells");
  return res.json();
}

export default function CellsPage() {
  const { data: cells, isLoading, isError } = useQuery({
    queryKey: ["cells"],
    queryFn: fetchCells,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Cells</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !cells) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Cells</h1>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive font-medium">Unable to load cells</p>
            <p className="text-sm text-muted-foreground mt-1">
              Check that the backend is running
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onlineCells = cells.filter((c) => c.status === "online");
  const offlineCells = cells.filter((c) => c.status === "offline");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Cells</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {onlineCells.length} online
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {offlineCells.length} offline
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cells
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <RadioTower className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold">{cells.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span className="text-3xl font-bold text-emerald-600">
                {onlineCells.length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Offline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-3xl font-bold text-red-600">
                {offlineCells.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cells Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cells.map((cell) => (
          <Card
            key={cell.id}
            className={`transition-all hover:shadow-md ${
              cell.status === "offline" ? "opacity-60" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      cell.status === "online"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    <RadioTower className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{cell.name}</p>
                    <p className="text-xs text-muted-foreground">
                      TAC: {cell.tac}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={cell.status === "online" ? "default" : "destructive"}
                  className={
                    cell.status === "online"
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : ""
                  }
                >
                  {cell.status}
                </Badge>
              </div>

              {cell.status === "online" && (
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Signal className="h-3 w-3" />
                    {cell.signalStrength ?? "-"} dBm
                  </span>
                  <span className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    Connected
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
