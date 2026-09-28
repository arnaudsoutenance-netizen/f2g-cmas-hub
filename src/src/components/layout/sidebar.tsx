"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  History,
  Settings,
  Radio,
  Bell,
} from "lucide-react";
import { ShineBorder } from "@/components/magicui/shine-border";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Alertes", href: "/alerts", icon: AlertTriangle },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Historique", href: "/history", icon: History },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-card border-r">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
          <Radio className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">F2G CMAS</h1>
          <p className="text-xs text-muted-foreground">Cell Broadcast Hub</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Quick Action */}
      <div className="px-4 pb-6">
        <Link href="/alerts/new">
          <ShineBorder
            className="w-full cursor-pointer transition-transform hover:scale-[1.02]"
            borderRadius={12}
          >
            <div className="flex items-center gap-3 w-full">
              <Bell className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">
                  Nouvelle Alerte
                </p>
                <p className="text-xs text-muted-foreground">
                  Créer une alerte rapide
                </p>
              </div>
            </div>
          </ShineBorder>
        </Link>
      </div>

      {/* Status */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
          </div>
          <span className="text-xs text-muted-foreground">
            Système opérationnel
          </span>
        </div>
      </div>
    </div>
  );
}
