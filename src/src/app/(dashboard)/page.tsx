"use client";

import { StatsCards, SuccessRateCard } from "@/components/dashboard/stats-cards";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { QuickActions, CellStatus } from "@/components/dashboard/quick-actions";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { MOCK_STATS, MOCK_ALERTS, MOCK_CELLS } from "@/lib/stores/alert-store";
import { Radio, Smartphone, Send } from "lucide-react";
import { useRef } from "react";

export default function DashboardPage() {
  const stats = MOCK_STATS;
  const alerts = MOCK_ALERTS;
  const cells = MOCK_CELLS;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue sur F2G CMAS Hub — Système d&apos;alerte Cell Broadcast
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentAlerts alerts={alerts} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions />
          <SuccessRateCard rate={stats.successRate} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cell Status */}
        <CellStatus cells={cells} />

        {/* Architecture Visualization */}
        <div className="lg:col-span-2">
          <ArchitectureVisualization />
        </div>
      </div>
    </div>
  );
}

// Architecture visualization component
function ArchitectureVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const enb1Ref = useRef<HTMLDivElement>(null);
  const enb2Ref = useRef<HTMLDivElement>(null);
  const enb3Ref = useRef<HTMLDivElement>(null);

  return (
    <BentoCard
      name="Architecture du système"
      description="Diffusion Cell Broadcast en temps réel"
      className="min-h-[280px]"
    >
      <div
        ref={containerRef}
        className="relative flex items-center justify-center w-full h-48 mt-4"
      >
        {/* Hub Central */}
        <div
          ref={hubRef}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-primary-foreground shadow-lg"
        >
          <Send className="h-8 w-8" />
        </div>

        {/* eNodeBs */}
        <div
          ref={enb1Ref}
          className="absolute right-8 top-4 z-10 flex items-center justify-center w-12 h-12 rounded-lg bg-card border-2 border-green-500 shadow-md"
        >
          <Radio className="h-6 w-6 text-green-600" />
        </div>
        <div
          ref={enb2Ref}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-lg bg-card border-2 border-green-500 shadow-md"
        >
          <Radio className="h-6 w-6 text-green-600" />
        </div>
        <div
          ref={enb3Ref}
          className="absolute right-8 bottom-4 z-10 flex items-center justify-center w-12 h-12 rounded-lg bg-card border-2 border-red-500 shadow-md"
        >
          <Radio className="h-6 w-6 text-red-500" />
        </div>

        {/* UEs (phones) */}
        <div className="absolute right-[-20px] top-4 flex gap-1">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          <Smartphone className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 flex gap-1">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          <Smartphone className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="absolute right-[-20px] bottom-4 flex gap-1 opacity-40">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Animated Beams */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={hubRef}
          toRef={enb1Ref}
          gradientStartColor="#22c55e"
          gradientStopColor="#16a34a"
          pathColor="#e5e7eb"
          pathOpacity={0.2}
          curvature={-30}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={hubRef}
          toRef={enb2Ref}
          gradientStartColor="#f97316"
          gradientStopColor="#ea580c"
          pathColor="#e5e7eb"
          pathOpacity={0.2}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={hubRef}
          toRef={enb3Ref}
          gradientStartColor="#ef4444"
          gradientStopColor="#dc2626"
          pathColor="#e5e7eb"
          pathOpacity={0.2}
          curvature={30}
        />
      </div>
    </BentoCard>
  );
}
