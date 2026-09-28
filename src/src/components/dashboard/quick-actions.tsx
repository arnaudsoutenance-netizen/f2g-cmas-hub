"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  FileText,
  Play,
  Radio,
  Plus,
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    title: "Alerte Urgente",
    description: "Envoyer immédiatement",
    icon: AlertTriangle,
    href: "/alerts/new?urgent=true",
    color: "bg-red-500 hover:bg-red-600",
    textColor: "text-white",
  },
  {
    title: "Nouvelle Alerte",
    description: "Créer et programmer",
    icon: Plus,
    href: "/alerts/new",
    color: "bg-primary hover:bg-primary/90",
    textColor: "text-primary-foreground",
  },
  {
    title: "Test Mensuel",
    description: "Programmer un test",
    icon: Play,
    href: "/alerts/new?template=test",
    color: "bg-emerald-500 hover:bg-emerald-600",
    textColor: "text-white",
  },
  {
    title: "Depuis Template",
    description: "Utiliser un modèle",
    icon: FileText,
    href: "/templates",
    color: "bg-blue-500 hover:bg-blue-600",
    textColor: "text-white",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-auto flex-col items-center gap-2 py-4 px-3",
                  action.color,
                  action.textColor,
                  "transition-all duration-200 hover:scale-[1.02]"
                )}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className={cn("text-xs opacity-80")}>{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Cell Status Component
interface CellStatusProps {
  cells: Array<{
    id: string;
    name: string;
    status: "active" | "offline" | "maintenance";
  }>;
}

export function CellStatus({ cells }: CellStatusProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Statut des cellules</CardTitle>
        <Link href="/settings">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Gérer
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cells.map((cell) => (
            <div
              key={cell.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex items-center gap-3">
                <Radio className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{cell.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    cell.status === "active" && "bg-green-500",
                    cell.status === "offline" && "bg-red-500",
                    cell.status === "maintenance" && "bg-yellow-500"
                  )}
                />
                <span
                  className={cn(
                    "text-xs",
                    cell.status === "active" && "text-green-600 dark:text-green-400",
                    cell.status === "offline" && "text-red-600 dark:text-red-400",
                    cell.status === "maintenance" && "text-yellow-600 dark:text-yellow-400"
                  )}
                >
                  {cell.status === "active"
                    ? "En ligne"
                    : cell.status === "offline"
                    ? "Hors ligne"
                    : "Maintenance"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
