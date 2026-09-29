"use client";

import { CheckCircle2, Circle, Radio, Server, Wifi, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionStatus {
  name: string;
  type: "mme" | "enb" | "cell";
  status: "connected" | "disconnected" | "degraded";
  ip?: string;
  latency?: number;
}

interface ConnectivityPanelProps {
  mmeStatus: "connected" | "disconnected";
  enbsConnected: number;
  enbsTotal: number;
  cellsOnline: number;
  cellsTotal: number;
}

const STATUS_CONFIG = {
  connected: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    pulse: "bg-emerald-500",
    label: "Connected",
  },
  disconnected: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    pulse: "bg-red-500",
    label: "Disconnected",
  },
  degraded: {
    icon: Circle,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    pulse: "bg-amber-500",
    label: "Degraded",
  },
};

function ConnectionLine({ status }: { status: "connected" | "disconnected" | "degraded" }) {
  return (
    <div className="flex items-center gap-1 px-2">
      <div
        className={cn(
          "h-[2px] w-8 transition-colors",
          status === "connected" && "bg-emerald-500",
          status === "disconnected" && "bg-red-500",
          status === "degraded" && "bg-amber-500 animate-pulse"
        )}
      />
      <div
        className={cn(
          "size-2 rounded-full",
          status === "connected" && "bg-emerald-500",
          status === "disconnected" && "bg-red-500",
          status === "degraded" && "bg-amber-500 animate-pulse"
        )}
      />
      <div
        className={cn(
          "h-[2px] w-8 transition-colors",
          status === "connected" && "bg-emerald-500",
          status === "disconnected" && "bg-red-500",
          status === "degraded" && "bg-amber-500 animate-pulse"
        )}
      />
    </div>
  );
}

function NodeBox({
  icon: Icon,
  label,
  sublabel,
  status,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  status: "connected" | "disconnected" | "degraded";
}) {
  const config = STATUS_CONFIG[status];
  return (
    <div className={cn("relative flex flex-col items-center gap-1 rounded-lg border p-3", config.bg, "border-hairline")}>
      {/* Pulse indicator */}
      <div className="absolute -top-1 -right-1">
        <span className="relative flex size-3">
          {status === "connected" && (
            <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", config.pulse)} />
          )}
          <span className={cn("relative inline-flex size-3 rounded-full", config.pulse)} />
        </span>
      </div>
      <Icon className={cn("size-6", config.color)} />
      <span className="text-[12px] font-semibold text-ink">{label}</span>
      {sublabel && <span className="text-[10px] text-ink-3">{sublabel}</span>}
    </div>
  );
}

/** Shows connectivity status between CBC server and network elements */
export function ConnectivityPanel({ mmeStatus, enbsConnected, enbsTotal, cellsOnline, cellsTotal }: ConnectivityPanelProps) {
  const enbStatus = enbsConnected === enbsTotal ? "connected" : enbsConnected === 0 ? "disconnected" : "degraded";
  const cellStatus = cellsOnline === cellsTotal ? "connected" : cellsOnline === 0 ? "disconnected" : "degraded";

  return (
    <div className="rounded-xl border border-hairline bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-ink">System Connectivity</h3>
          <p className="text-[12px] text-ink-3">Real-time connection status</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "size-2 rounded-full",
              mmeStatus === "connected" && enbStatus !== "disconnected" ? "bg-emerald-500" : "bg-red-500"
            )}
          />
          <span className="text-[11px] font-medium text-ink-2">
            {mmeStatus === "connected" && enbStatus !== "disconnected" ? "Operational" : "Degraded"}
          </span>
        </div>
      </div>

      {/* Connection diagram */}
      <div className="flex items-center justify-center gap-0 overflow-x-auto py-4">
        {/* CBC Server */}
        <NodeBox icon={Server} label="CBC" sublabel="This server" status={mmeStatus} />

        <ConnectionLine status={mmeStatus} />

        {/* MME */}
        <NodeBox icon={Server} label="MME" sublabel="Open5GS" status={mmeStatus} />

        <ConnectionLine status={enbStatus} />

        {/* eNBs */}
        <NodeBox
          icon={Radio}
          label="eNBs"
          sublabel={`${enbsConnected}/${enbsTotal}`}
          status={enbStatus}
        />

        <ConnectionLine status={cellStatus} />

        {/* Cells */}
        <NodeBox
          icon={Wifi}
          label="Cells"
          sublabel={`${cellsOnline}/${cellsTotal}`}
          status={cellStatus}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 border-t border-hairline pt-3">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", config.pulse)} />
            <span className="text-[11px] text-ink-3">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
