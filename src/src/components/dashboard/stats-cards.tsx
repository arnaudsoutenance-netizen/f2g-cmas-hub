"use client";

import { Card, CardContent } from "@/components/ui/card";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Ripple } from "@/components/magicui/ripple";
import { cn } from "@/lib/utils";
import {
  Send,
  Clock,
  AlertCircle,
  Radio,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Alertes envoyées",
      value: stats.alerts.sent,
      icon: Send,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
      trend: stats.today.sent,
      trendLabel: "aujourd'hui",
    },
    {
      title: "En attente",
      value: stats.alerts.scheduled,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Échecs",
      value: stats.alerts.failed,
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Cellules actives",
      value: stats.cells.active,
      total: stats.cells.total,
      icon: Radio,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/20"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-1">
                  <NumberTicker
                    value={card.value}
                    className="text-3xl font-bold tracking-tight text-foreground"
                  />
                  {card.total && (
                    <span className="text-lg text-muted-foreground">
                      /{card.total}
                    </span>
                  )}
                </div>
              </div>
              <div className={cn("rounded-full p-3", card.bgColor)}>
                <card.icon className={cn("h-6 w-6", card.color)} />
              </div>
            </div>
            {card.trend !== undefined && (
              <div className="mt-3 flex items-center gap-1 text-xs">
                {card.trend > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    card.trend > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground"
                  )}
                >
                  +{card.trend} {card.trendLabel}
                </span>
              </div>
            )}
          </CardContent>
          <Ripple
            className="opacity-30"
            mainCircleSize={120}
            numCircles={4}
          />
        </Card>
      ))}
    </div>
  );
}

// Success rate card
export function SuccessRateCard({ rate }: { rate: number }) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">
            Taux de succès
          </p>
          {rate >= 95 ? (
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-700 dark:text-green-400">
              Excellent
            </span>
          ) : rate >= 80 ? (
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
              Bon
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-700 dark:text-red-400">
              À améliorer
            </span>
          )}
        </div>
        <div className="flex items-end gap-2">
          <NumberTicker
            value={rate}
            decimalPlaces={1}
            className="text-4xl font-bold tracking-tight text-foreground"
          />
          <span className="text-2xl font-semibold text-muted-foreground mb-1">
            %
          </span>
        </div>
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              rate >= 95
                ? "bg-green-500"
                : rate >= 80
                ? "bg-yellow-500"
                : "bg-red-500"
            )}
            style={{ width: `${rate}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
