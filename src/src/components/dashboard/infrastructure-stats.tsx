"use client";

import { Radio, Server, Wifi } from "lucide-react";
import { CountUp } from "@/components/shared/count-up";
import { cn } from "@/lib/utils";

interface InfraStats {
  enbs_connected: number;
  mmes_connected: number;
  cells_online: number;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}

function StatCard({ label, value, icon, colorClass }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-hairline bg-surface p-3">
      <div className={cn("grid size-10 shrink-0 place-items-center rounded-lg", colorClass)}>
        {icon}
      </div>
      <div>
        <p className="tnum font-display text-[24px] leading-none font-bold text-ink">
          <CountUp value={value} />
        </p>
        <p className="mt-0.5 text-[12px] text-ink-3">{label}</p>
      </div>
    </div>
  );
}

/** Display eNBs, MMEs, and Cells connected - requested by Luis */
export function InfrastructureStats({ stats }: { stats?: InfraStats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard
        label="eNBs Connected"
        value={stats.enbs_connected}
        icon={<Radio className="size-5 text-white" />}
        colorClass="bg-blue-600"
      />
      <StatCard
        label="MMEs Connected"
        value={stats.mmes_connected}
        icon={<Server className="size-5 text-white" />}
        colorClass="bg-purple-600"
      />
      <StatCard
        label="Cells Online"
        value={stats.cells_online}
        icon={<Wifi className="size-5 text-white" />}
        colorClass="bg-emerald-600"
      />
    </div>
  );
}
