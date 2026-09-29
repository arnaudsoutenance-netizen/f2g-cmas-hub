# 📄 F2G CMAS HUB — CODE SOURCE FRONTEND ACTUEL

Ce fichier contient TOUT le code source frontend à refactorer.

---

### Pages

## `src/src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "F2G CMAS Hub | Cell Broadcast Emergency Alert System",
  description:
    "Plateforme de gestion des alertes Cell Broadcast pour le Cameroun - F2G Solutions & KFOKAM48 Academy",
  keywords: ["CMAS", "Cell Broadcast", "Emergency Alert", "Cameroon", "F2G"],
  authors: [{ name: "Arnaud DJOUM", url: "https://f2g.cm" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
```


## `src/src/app/(dashboard)/layout.tsx`

```tsx
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="container py-6 max-w-7xl mx-auto px-4 md:px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </TooltipProvider>
  );
}
```


## `src/src/app/(dashboard)/page.tsx`

```tsx
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
```


## `src/src/app/(dashboard)/alerts/page.tsx`

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Plus,
  Search,
  Filter,
  Send,
  Clock,
  AlertTriangle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { MOCK_ALERTS } from "@/lib/stores/alert-store";
import { STATUS_COLORS, STATUS_LABELS, MESSAGE_IDS, ALERT_COLORS } from "@/types";
import type { Alert, AlertStatus } from "@/types";

function getMessageInfo(messageId: number, alertType: Alert["alertType"]) {
  const messages = alertType === "CMAS" ? MESSAGE_IDS.CMAS : MESSAGE_IDS.ETWS;
  return messages.find((m) => m.id === messageId);
}

function getStatusIcon(status: AlertStatus) {
  switch (status) {
    case "SENT":
      return <Send className="h-4 w-4" />;
    case "SCHEDULED":
      return <Clock className="h-4 w-4" />;
    case "FAILED":
      return <AlertTriangle className="h-4 w-4" />;
    case "CANCELLED":
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
}

export default function AlertsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlerts = MOCK_ALERTS.filter((alert) => {
    if (statusFilter !== "all" && alert.status !== statusFilter) return false;
    if (typeFilter !== "all" && alert.alertType !== typeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        alert.content.toLowerCase().includes(query) ||
        alert.id.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const statusCounts = {
    all: MOCK_ALERTS.length,
    DRAFT: MOCK_ALERTS.filter((a) => a.status === "DRAFT").length,
    SCHEDULED: MOCK_ALERTS.filter((a) => a.status === "SCHEDULED").length,
    SENT: MOCK_ALERTS.filter((a) => a.status === "SENT").length,
    FAILED: MOCK_ALERTS.filter((a) => a.status === "FAILED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertes</h1>
          <p className="text-muted-foreground">
            Gérez et suivez vos alertes Cell Broadcast
          </p>
        </div>
        <Link href="/alerts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Alerte
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par contenu ou ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "all")}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="CMAS">CMAS</SelectItem>
                <SelectItem value="ETWS">ETWS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="all" className="gap-2">
            Toutes
            <Badge variant="secondary" className="ml-1">
              {statusCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="DRAFT" className="gap-2">
            Brouillons
            <Badge variant="secondary" className="ml-1">
              {statusCounts.DRAFT}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="SCHEDULED" className="gap-2">
            Programmées
            <Badge variant="secondary" className="ml-1">
              {statusCounts.SCHEDULED}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="SENT" className="gap-2">
            Envoyées
            <Badge variant="secondary" className="ml-1">
              {statusCounts.SENT}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="FAILED" className="gap-2">
            Échecs
            <Badge variant="secondary" className="ml-1">
              {statusCounts.FAILED}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredAlerts.length} alerte{filteredAlerts.length > 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">Aucune alerte trouvée</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Essayez de modifier vos critères de recherche"
                  : "Créez votre première alerte pour commencer"}
              </p>
              <Link href="/alerts/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une alerte
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Statut</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[40%]">Message</TableHead>
                  <TableHead>Cellules</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => {
                  const messageInfo = getMessageInfo(alert.messageId, alert.alertType);
                  return (
                    <TableRow key={alert.id} className="group">
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn("gap-1", STATUS_COLORS[alert.status])}
                        >
                          {getStatusIcon(alert.status)}
                          {STATUS_LABELS[alert.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-white",
                            messageInfo
                              ? ALERT_COLORS[messageInfo.category]
                              : "bg-gray-500"
                          )}
                        >
                          {messageInfo?.name || alert.messageId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium line-clamp-1">{alert.content}</p>
                        <p className="text-xs text-muted-foreground">
                          ID: {alert.id}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {alert.cells.length} cellule{alert.cells.length > 1 ? "s" : ""}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {alert.sentAt ? (
                            <>
                              <p>
                                {format(new Date(alert.sentAt), "dd MMM yyyy", {
                                  locale: fr,
                                })}
                              </p>
                              <p className="text-muted-foreground">
                                {format(new Date(alert.sentAt), "HH:mm")}
                              </p>
                            </>
                          ) : alert.scheduledAt ? (
                            <>
                              <p>
                                {format(new Date(alert.scheduledAt), "dd MMM yyyy", {
                                  locale: fr,
                                })}
                              </p>
                              <p className="text-muted-foreground">
                                {format(new Date(alert.scheduledAt), "HH:mm")}
                              </p>
                            </>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`/alerts/${alert.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir détails
                              </Link>
                            </DropdownMenuItem>
                            {(alert.status === "DRAFT" ||
                              alert.status === "SCHEDULED") && (
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {alert.status === "SCHEDULED" && (
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="h-4 w-4 mr-2" />
                                Annuler
                              </DropdownMenuItem>
                            )}
                            {alert.status === "DRAFT" && (
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```


## `src/src/app/(dashboard)/alerts/new/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Send, Save, ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShineBorder } from "@/components/magicui/shine-border";
import { cn } from "@/lib/utils";
import { MESSAGE_IDS, ALERT_COLORS } from "@/types";
import { MOCK_CELLS, MOCK_TEMPLATES } from "@/lib/stores/alert-store";
import Link from "next/link";

// Validation schema
const alertSchema = z.object({
  alertType: z.enum(["CMAS", "ETWS"]),
  messageId: z.number().min(4352).max(4399),
  content: z.string().min(1, "Le message est requis").max(1395, "Maximum 1395 caractères"),
  cellIds: z.array(z.string()).min(1, "Sélectionnez au moins une cellule"),
  scheduleType: z.enum(["immediate", "scheduled"]),
  scheduledDate: z.date().optional(),
  scheduledTime: z.string().optional(),
  duration: z.number().min(60).max(86400),
});

type AlertFormData = z.infer<typeof alertSchema>;

export default function NewAlertPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const form = useForm<AlertFormData>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      alertType: "CMAS",
      messageId: 4370,
      content: "",
      cellIds: [],
      scheduleType: "immediate",
      duration: 3600,
    },
  });

  const alertType = form.watch("alertType");
  const messageId = form.watch("messageId");
  const content = form.watch("content");
  const scheduleType = form.watch("scheduleType");
  const selectedCells = form.watch("cellIds");

  const messages = alertType === "CMAS" ? MESSAGE_IDS.CMAS : MESSAGE_IDS.ETWS;
  const selectedMessage = messages.find((m) => m.id === messageId);

  const handleTemplateSelect = (templateId: string) => {
    const template = MOCK_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      form.setValue("alertType", template.alertType);
      form.setValue("messageId", template.messageId);
      form.setValue("content", template.content);
      form.setValue("duration", template.defaultDuration);
    }
  };

  const onSubmit = async (data: AlertFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (data.scheduleType === "immediate") {
        toast.success("Alerte envoyée avec succès!", {
          description: `Diffusée sur ${data.cellIds.length} cellule(s)`,
        });
      } else {
        toast.success("Alerte programmée!", {
          description: `Sera envoyée le ${data.scheduledDate ? format(data.scheduledDate, "dd MMMM yyyy", { locale: fr }) : ""}`,
        });
      }
      
      router.push("/alerts");
    } catch {
      toast.error("Erreur lors de l'envoi", {
        description: "Veuillez réessayer",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/alerts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouvelle Alerte</h1>
          <p className="text-muted-foreground">
            Créez et programmez une alerte Cell Broadcast
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Alert Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Type d&apos;alerte</CardTitle>
                <CardDescription>
                  Sélectionnez le système d&apos;alerte à utiliser
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={alertType}
                  onValueChange={(value) => {
                    form.setValue("alertType", value as "CMAS" | "ETWS");
                    // Reset messageId to first of the new type
                    const newMessages = value === "CMAS" ? MESSAGE_IDS.CMAS : MESSAGE_IDS.ETWS;
                    form.setValue("messageId", newMessages[0].id);
                  }}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="cmas"
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all",
                      alertType === "CMAS"
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-muted-foreground/50"
                    )}
                  >
                    <RadioGroupItem value="CMAS" id="cmas" className="sr-only" />
                    <AlertTriangle className="h-8 w-8 mb-2 text-orange-500" />
                    <span className="font-semibold">CMAS</span>
                    <span className="text-xs text-muted-foreground text-center">
                      Commercial Mobile Alert System
                    </span>
                  </Label>
                  <Label
                    htmlFor="etws"
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all",
                      alertType === "ETWS"
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-muted-foreground/50"
                    )}
                  >
                    <RadioGroupItem value="ETWS" id="etws" className="sr-only" />
                    <AlertTriangle className="h-8 w-8 mb-2 text-blue-500" />
                    <span className="font-semibold">ETWS</span>
                    <span className="text-xs text-muted-foreground text-center">
                      Earthquake & Tsunami Warning
                    </span>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Message ID Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Catégorie de l&apos;alerte</CardTitle>
                <CardDescription>
                  Choisissez la gravité et le type de message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={messageId.toString()}
                  onValueChange={(value) => form.setValue("messageId", parseInt(value ?? "0"))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {messages.map((msg) => (
                      <SelectItem key={msg.id} value={msg.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-white", ALERT_COLORS[msg.category])}>
                            {msg.id}
                          </Badge>
                          <span className="font-medium">{msg.name}</span>
                          <span className="text-muted-foreground">
                            - {msg.description}
                          </span>
                          {!msg.optOut && (
                            <Badge variant="destructive" className="ml-auto text-xs">
                              Obligatoire
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedMessage && (
                  <div className="mt-4 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-white", ALERT_COLORS[selectedMessage.category])}>
                        {selectedMessage.name}
                      </Badge>
                      {!selectedMessage.optOut && (
                        <Badge variant="outline" className="text-xs">
                          Pas de désactivation possible
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedMessage.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Message Content */}
            <Card>
              <CardHeader>
                <CardTitle>Contenu du message</CardTitle>
                <CardDescription>
                  Rédigez le message d&apos;alerte (max 1395 caractères)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Rédigez votre message d'alerte ici..."
                  className="min-h-[150px] resize-none"
                  {...form.register("content")}
                />
                <div className="flex items-center justify-between text-sm">
                  <span className={cn(
                    "text-muted-foreground",
                    content.length > 1395 && "text-destructive"
                  )}>
                    {content.length}/1395 caractères
                  </span>
                  {form.formState.errors.content && (
                    <span className="text-destructive">
                      {form.formState.errors.content.message}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cell Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Cellules cibles</CardTitle>
                <CardDescription>
                  Sélectionnez les cellules qui diffuseront l&apos;alerte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOCK_CELLS.map((cell) => (
                    <Label
                      key={cell.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                        selectedCells.includes(cell.id)
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/50",
                        cell.status === "offline" && "opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedCells.includes(cell.id)}
                          onCheckedChange={(checked) => {
                            const current = form.getValues("cellIds");
                            if (checked) {
                              form.setValue("cellIds", [...current, cell.id]);
                            } else {
                              form.setValue("cellIds", current.filter((id) => id !== cell.id));
                            }
                          }}
                          disabled={cell.status === "offline"}
                        />
                        <div>
                          <span className="font-medium">{cell.name}</span>
                          <p className="text-xs text-muted-foreground">
                            {cell.cellId} • {cell.location}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={cell.status === "active" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {cell.status === "active" ? "En ligne" : "Hors ligne"}
                      </Badge>
                    </Label>
                  ))}
                </div>
                {form.formState.errors.cellIds && (
                  <p className="text-sm text-destructive mt-2">
                    {form.formState.errors.cellIds.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle>Programmation</CardTitle>
                <CardDescription>
                  Choisissez quand envoyer l&apos;alerte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={scheduleType}
                  onValueChange={(value) => form.setValue("scheduleType", value as "immediate" | "scheduled")}
                  className="space-y-3"
                >
                  <Label
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      scheduleType === "immediate"
                        ? "border-primary bg-primary/5"
                        : "border-muted"
                    )}
                  >
                    <RadioGroupItem value="immediate" />
                    <div>
                      <span className="font-medium">Envoyer immédiatement</span>
                      <p className="text-xs text-muted-foreground">
                        L&apos;alerte sera diffusée dès validation
                      </p>
                    </div>
                  </Label>
                  <Label
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      scheduleType === "scheduled"
                        ? "border-primary bg-primary/5"
                        : "border-muted"
                    )}
                  >
                    <RadioGroupItem value="scheduled" />
                    <div>
                      <span className="font-medium">Programmer</span>
                      <p className="text-xs text-muted-foreground">
                        Choisir une date et heure d&apos;envoi
                      </p>
                    </div>
                  </Label>
                </RadioGroup>

                {scheduleType === "scheduled" && (
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !form.watch("scheduledDate") && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.watch("scheduledDate")
                              ? format(form.watch("scheduledDate")!, "PPP", { locale: fr })
                              : "Sélectionner"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={form.watch("scheduledDate")}
                            onSelect={(date) => form.setValue("scheduledDate", date)}
                            disabled={(date) => date < new Date()}
                            locale={fr}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Heure</Label>
                      <Input
                        type="time"
                        {...form.register("scheduledTime")}
                      />
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <Label>Durée de validité</Label>
                  <Select
                    value={form.watch("duration").toString()}
                    onValueChange={(value) => form.setValue("duration", parseInt(value ?? "0"))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1800">30 minutes</SelectItem>
                      <SelectItem value="3600">1 heure</SelectItem>
                      <SelectItem value="7200">2 heures</SelectItem>
                      <SelectItem value="14400">4 heures</SelectItem>
                      <SelectItem value="28800">8 heures</SelectItem>
                      <SelectItem value="86400">24 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder brouillon
              </Button>
              <Button type="submit" className="min-w-[150px]">
                <Send className="h-4 w-4 mr-2" />
                {scheduleType === "immediate" ? "Envoyer maintenant" : "Programmer"}
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar - Templates */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>
                Utilisez un modèle pré-défini
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {MOCK_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all",
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={cn("text-white text-xs", ALERT_COLORS[template.category])}>
                      {template.alertType}
                    </Badge>
                    <span className="font-medium text-sm">{template.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.content}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Preview */}
          {content && (
            <ShineBorder className="w-full" borderRadius={12}>
              <div className="w-full">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  APERÇU DU MESSAGE
                </p>
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive mb-1">
                    {selectedMessage?.name || "Alerte"}
                  </p>
                  <p className="text-sm">{content}</p>
                </div>
              </div>
            </ShineBorder>
          )}
        </div>
      </div>
    </div>
  );
}
```


## `src/src/app/(dashboard)/templates/page.tsx`

```tsx
"use client";

import Link from "next/link";
import {
  Plus,
  FileText,
  AlertTriangle,
  Clock,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { cn } from "@/lib/utils";
import { MOCK_TEMPLATES } from "@/lib/stores/alert-store";
import { ALERT_COLORS } from "@/types";

const categoryIcons: Record<string, React.ReactNode> = {
  emergency: <AlertTriangle className="h-6 w-6 text-red-500" />,
  extreme: <AlertTriangle className="h-6 w-6 text-orange-500" />,
  severe: <AlertTriangle className="h-6 w-6 text-amber-500" />,
  amber: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
  test: <Clock className="h-6 w-6 text-emerald-500" />,
  earthquake: <AlertTriangle className="h-6 w-6 text-red-700" />,
  tsunami: <AlertTriangle className="h-6 w-6 text-blue-700" />,
};

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground">
            Modèles d&apos;alertes pré-configurés pour un envoi rapide
          </p>
        </div>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Créer un template
        </Button>
      </div>

      {/* Template Grid */}
      <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-4">
        {MOCK_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/50"
          >
            {/* Category indicator */}
            <div
              className={cn(
                "absolute top-0 left-0 w-full h-1",
                ALERT_COLORS[template.category]
              )}
            />

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {categoryIcons[template.category] || (
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {template.alertType}
                      </Badge>
                      <Badge
                        className={cn(
                          "text-white text-xs",
                          ALERT_COLORS[template.category]
                        )}
                      >
                        ID {template.messageId}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Preview */}
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-sm line-clamp-3">{template.content}</p>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Durée par défaut:{" "}
                  {template.defaultDuration >= 3600
                    ? `${template.defaultDuration / 3600}h`
                    : `${template.defaultDuration / 60}min`}
                </span>
                {template.isActive ? (
                  <Badge variant="secondary" className="text-xs">
                    Actif
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Inactif
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link href={`/alerts/new?template=${template.id}`} className="flex-1">
                  <Button className="w-full" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Utiliser
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create New Template Card */}
        <Card className="flex items-center justify-center min-h-[250px] border-dashed hover:border-primary/50 cursor-pointer transition-all">
          <CardContent className="text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium">Créer un nouveau template</p>
            <p className="text-sm text-muted-foreground mt-1">
              Configurez un modèle réutilisable
            </p>
          </CardContent>
        </Card>
      </BentoGrid>

      {/* Info Section */}
      <Card className="bg-muted/30">
        <CardContent className="flex items-start gap-4 py-6">
          <div className="p-3 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">
              Qu&apos;est-ce qu&apos;un template ?
            </h3>
            <p className="text-sm text-muted-foreground">
              Les templates sont des modèles d&apos;alertes pré-configurés qui
              permettent d&apos;envoyer rapidement des alertes en situation
              d&apos;urgence. Chaque template définit le type d&apos;alerte, le
              Message ID, un contenu par défaut et une durée de validité.
              Utilisez-les pour gagner du temps lors d&apos;une situation
              critique.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Components - Layout

## `src/src/components/layout/sidebar.tsx`

```tsx
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
```


## `src/src/components/layout/header.tsx`

```tsx
"use client";

import { Bell, Search, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSyncExternalStore } from "react";

// Theme store for SSR-safe theme detection
function getThemeSnapshot() {
  if (typeof window === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  if (typeof document !== "undefined") {
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
  return () => observer.disconnect();
}

export function Header() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => "light" // Server snapshot
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b bg-card">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une alerte..."
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <span className="font-medium">Alerte envoyée</span>
              <span className="text-xs text-muted-foreground">
                L&apos;alerte Presidential a été diffusée sur 3 cellules
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <span className="font-medium">Test mensuel programmé</span>
              <span className="text-xs text-muted-foreground">
                Rappel : test mensuel prévu le 01/10 à 10h00
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
              <span className="font-medium text-destructive">Cellule offline</span>
              <span className="text-xs text-muted-foreground">
                La cellule Douala Port est hors ligne depuis 2h
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">Arnaud DJOUM</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

### Components - Dashboard

## `src/src/components/dashboard/stats-cards.tsx`

```tsx
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
```


## `src/src/components/dashboard/recent-alerts.tsx`

```tsx
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
```


## `src/src/components/dashboard/quick-actions.tsx`

```tsx
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
```

### Lib & Types

## `src/src/lib/utils.ts`

```tsx
export { cn } from "cn"
```


## `src/src/lib/stores/alert-store.ts`

```tsx
import { create } from "zustand";
import type { Alert, CellSite, DashboardStats, Template } from "@/types";

interface AlertStore {
  // Alerts
  alerts: Alert[];
  selectedAlert: Alert | null;
  isLoading: boolean;
  
  // Cells
  cells: CellSite[];
  
  // Templates
  templates: Template[];
  
  // Stats
  stats: DashboardStats | null;
  
  // Actions
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, data: Partial<Alert>) => void;
  deleteAlert: (id: string) => void;
  selectAlert: (alert: Alert | null) => void;
  setCells: (cells: CellSite[]) => void;
  setTemplates: (templates: Template[]) => void;
  setStats: (stats: DashboardStats) => void;
  setLoading: (loading: boolean) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  // Initial state
  alerts: [],
  selectedAlert: null,
  isLoading: false,
  cells: [],
  templates: [],
  stats: null,
  
  // Actions
  setAlerts: (alerts) => set({ alerts }),
  
  addAlert: (alert) =>
    set((state) => ({ alerts: [alert, ...state.alerts] })),
  
  updateAlert: (id, data) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, ...data } : a
      ),
      selectedAlert:
        state.selectedAlert?.id === id
          ? { ...state.selectedAlert, ...data }
          : state.selectedAlert,
    })),
  
  deleteAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
      selectedAlert:
        state.selectedAlert?.id === id ? null : state.selectedAlert,
    })),
  
  selectAlert: (alert) => set({ selectedAlert: alert }),
  
  setCells: (cells) => set({ cells }),
  
  setTemplates: (templates) => set({ templates }),
  
  setStats: (stats) => set({ stats }),
  
  setLoading: (isLoading) => set({ isLoading }),
}));

// Mock data for development
export const MOCK_CELLS: CellSite[] = [
  {
    id: "cell-001",
    name: "Yaoundé Centre",
    cellId: "YDE-001",
    enbIp: "192.168.1.101",
    enbPort: 22,
    location: "3.8480° N, 11.5021° E",
    status: "active",
    lastSeen: new Date(),
  },
  {
    id: "cell-002",
    name: "Yaoundé Nord",
    cellId: "YDE-002",
    enbIp: "192.168.1.102",
    enbPort: 22,
    location: "3.8680° N, 11.5121° E",
    status: "active",
    lastSeen: new Date(),
  },
  {
    id: "cell-003",
    name: "Douala Centre",
    cellId: "DLA-001",
    enbIp: "192.168.2.101",
    enbPort: 22,
    location: "4.0511° N, 9.7679° E",
    status: "active",
    lastSeen: new Date(),
  },
  {
    id: "cell-004",
    name: "Douala Port",
    cellId: "DLA-002",
    enbIp: "192.168.2.102",
    enbPort: 22,
    location: "4.0311° N, 9.7079° E",
    status: "offline",
  },
];

export const MOCK_TEMPLATES: Template[] = [
  {
    id: "tpl-001",
    name: "Alerte Présidentielle",
    category: "emergency",
    alertType: "CMAS",
    messageId: 4370,
    content: "ALERTE NATIONALE: [Insérer message]. Suivez les instructions des autorités.",
    defaultDuration: 3600,
    isActive: true,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "tpl-002",
    name: "AMBER Alert - Enfant disparu",
    category: "amber",
    alertType: "CMAS",
    messageId: 4375,
    content: "ALERTE AMBER: [NOM] [AGE] ans. Vu dernièrement à [LIEU]. Contact: 117.",
    defaultDuration: 7200,
    isActive: true,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "tpl-003",
    name: "Test Mensuel",
    category: "test",
    alertType: "CMAS",
    messageId: 4376,
    content: "TEST MENSUEL DU SYSTÈME D'ALERTE NATIONAL. Aucune action requise. Ceci est un test.",
    defaultDuration: 1800,
    isActive: true,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "tpl-004",
    name: "Alerte Séisme",
    category: "earthquake",
    alertType: "ETWS",
    messageId: 4352,
    content: "ALERTE SÉISME: Tremblement de terre détecté. Abritez-vous sous une table solide.",
    defaultDuration: 3600,
    isActive: true,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "tpl-005",
    name: "Alerte Inondation",
    category: "severe",
    alertType: "CMAS",
    messageId: 4373,
    content: "ALERTE INONDATION: Risque de crue dans votre zone. Évitez les déplacements.",
    defaultDuration: 7200,
    isActive: true,
    createdAt: new Date("2026-01-01"),
  },
];

export const MOCK_STATS: DashboardStats = {
  alerts: {
    total: 156,
    sent: 120,
    scheduled: 15,
    failed: 3,
    draft: 18,
  },
  today: {
    sent: 5,
    scheduled: 2,
  },
  cells: {
    total: 4,
    active: 3,
    offline: 1,
  },
  successRate: 97.5,
};

export const MOCK_ALERTS: Alert[] = [
  {
    id: "alert-001",
    alertType: "CMAS",
    messageId: 4370,
    content: "ALERTE NATIONALE: Restez chez vous. Informations à suivre sur les médias officiels.",
    status: "SENT",
    scheduledAt: new Date("2026-09-28T14:00:00"),
    sentAt: new Date("2026-09-28T14:00:05"),
    expiresAt: new Date("2026-09-28T15:00:00"),
    duration: 3600,
    createdAt: new Date("2026-09-28T10:00:00"),
    updatedAt: new Date("2026-09-28T14:00:05"),
    cells: [
      { cellId: "cell-001", name: "Yaoundé Centre", status: "sent", sentAt: new Date() },
      { cellId: "cell-002", name: "Yaoundé Nord", status: "sent", sentAt: new Date() },
    ],
    createdBy: { id: "user-001", name: "Jean Operator", email: "operator@f2g.cm" },
  },
  {
    id: "alert-002",
    alertType: "CMAS",
    messageId: 4375,
    content: "ALERTE AMBER: Marie DUPONT, 8 ans, disparue à Douala. Cheveux noirs, robe bleue. Contact 117.",
    status: "SENT",
    scheduledAt: new Date("2026-09-27T09:30:00"),
    sentAt: new Date("2026-09-27T09:30:02"),
    expiresAt: new Date("2026-09-27T16:30:00"),
    duration: 25200,
    createdAt: new Date("2026-09-27T09:00:00"),
    updatedAt: new Date("2026-09-27T09:30:02"),
    cells: [
      { cellId: "cell-003", name: "Douala Centre", status: "sent", sentAt: new Date() },
      { cellId: "cell-004", name: "Douala Port", status: "sent", sentAt: new Date() },
    ],
    createdBy: { id: "user-001", name: "Jean Operator", email: "operator@f2g.cm" },
  },
  {
    id: "alert-003",
    alertType: "CMAS",
    messageId: 4376,
    content: "TEST MENSUEL DU SYSTÈME D'ALERTE NATIONAL. Aucune action requise. Ceci est un test.",
    status: "SCHEDULED",
    scheduledAt: new Date("2026-10-01T10:00:00"),
    sentAt: null,
    expiresAt: null,
    duration: 1800,
    createdAt: new Date("2026-09-28T08:00:00"),
    updatedAt: new Date("2026-09-28T08:00:00"),
    cells: [
      { cellId: "cell-001", name: "Yaoundé Centre", status: "pending" },
      { cellId: "cell-002", name: "Yaoundé Nord", status: "pending" },
      { cellId: "cell-003", name: "Douala Centre", status: "pending" },
    ],
    createdBy: { id: "user-001", name: "Jean Operator", email: "operator@f2g.cm" },
  },
  {
    id: "alert-004",
    alertType: "ETWS",
    messageId: 4352,
    content: "ALERTE SÉISME: Tremblement de terre magnitude 4.5 détecté. Éloignez-vous des bâtiments.",
    status: "DRAFT",
    scheduledAt: null,
    sentAt: null,
    expiresAt: null,
    duration: 3600,
    createdAt: new Date("2026-09-28T11:00:00"),
    updatedAt: new Date("2026-09-28T11:00:00"),
    cells: [],
    createdBy: { id: "user-001", name: "Jean Operator", email: "operator@f2g.cm" },
  },
];
```


## `src/src/types/index.ts`

```tsx
// Types pour F2G CMAS Hub

export type AlertType = "CMAS" | "ETWS";

export type AlertStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "SENDING"
  | "SENT"
  | "FAILED"
  | "CANCELLED";

export type UserRole = "ADMIN" | "OPERATOR" | "VIEWER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface CellSite {
  id: string;
  name: string;
  cellId: string;
  enbIp: string;
  enbPort: number;
  location: string | null;
  status: "active" | "offline" | "maintenance";
  lastSeen?: Date;
}

export interface AlertCell {
  cellId: string;
  name: string;
  status: "pending" | "sent" | "failed";
  sentAt?: Date;
}

export interface Alert {
  id: string;
  alertType: AlertType;
  messageId: number;
  content: string;
  status: AlertStatus;
  scheduledAt?: Date | null;
  sentAt?: Date | null;
  expiresAt?: Date | null;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  cells: AlertCell[];
  template?: Template | null;
  createdBy: Pick<User, "id" | "name" | "email">;
}

export interface AlertLog {
  id: string;
  alertId: string;
  action: string;
  status: "success" | "error" | "info";
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  alertType: AlertType;
  messageId: number;
  content: string;
  defaultDuration: number;
  isActive: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  alerts: {
    total: number;
    sent: number;
    scheduled: number;
    failed: number;
    draft: number;
  };
  today: {
    sent: number;
    scheduled: number;
  };
  cells: {
    total: number;
    active: number;
    offline: number;
  };
  successRate: number;
}

// Message ID configurations
export const MESSAGE_IDS = {
  CMAS: [
    { id: 4370, name: "Presidential", description: "Alerte nationale - Pas de opt-out", category: "emergency", optOut: false },
    { id: 4371, name: "Extreme Immediate", description: "Menace extrême - Action immédiate", category: "extreme", optOut: false },
    { id: 4372, name: "Extreme Likely", description: "Menace extrême - Probable", category: "extreme", optOut: false },
    { id: 4373, name: "Severe Immediate", description: "Menace grave - Action immédiate", category: "severe", optOut: true },
    { id: 4374, name: "Severe Likely", description: "Menace grave - Probable", category: "severe", optOut: true },
    { id: 4375, name: "AMBER Alert", description: "Enfant disparu", category: "amber", optOut: true },
    { id: 4376, name: "RMT", description: "Test mensuel requis", category: "test", optOut: true },
    { id: 4377, name: "Exercise", description: "Exercice/Drill", category: "test", optOut: true },
    { id: 4378, name: "Operator", description: "Alerte opérateur", category: "operator", optOut: true },
  ],
  ETWS: [
    { id: 4352, name: "Earthquake", description: "Alerte séisme", category: "earthquake", optOut: false },
    { id: 4353, name: "Tsunami", description: "Alerte tsunami", category: "tsunami", optOut: false },
    { id: 4354, name: "Earthquake+Tsunami", description: "Séisme et tsunami", category: "combined", optOut: false },
    { id: 4355, name: "Test", description: "Test ETWS", category: "test", optOut: true },
  ],
} as const;

export type MessageIdConfig = typeof MESSAGE_IDS.CMAS[number] | typeof MESSAGE_IDS.ETWS[number];

// Alert severity colors
export const ALERT_COLORS: Record<string, string> = {
  emergency: "bg-red-600",
  extreme: "bg-orange-600",
  severe: "bg-amber-600",
  amber: "bg-yellow-600",
  test: "bg-emerald-600",
  operator: "bg-blue-600",
  earthquake: "bg-red-700",
  tsunami: "bg-blue-700",
  combined: "bg-purple-700",
};

// Status colors
export const STATUS_COLORS: Record<AlertStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SCHEDULED: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  SENDING: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  SENT: "bg-green-500/20 text-green-700 dark:text-green-400",
  FAILED: "bg-red-500/20 text-red-700 dark:text-red-400",
  CANCELLED: "bg-gray-500/20 text-gray-700 dark:text-gray-400",
};

export const STATUS_LABELS: Record<AlertStatus, string> = {
  DRAFT: "Brouillon",
  SCHEDULED: "Programmée",
  SENDING: "En cours",
  SENT: "Envoyée",
  FAILED: "Échec",
  CANCELLED: "Annulée",
};
```

### Styles

## `src/src/app/globals.css`

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-background: var(--sidebar-background);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  
  /* Animations */
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;
  --animate-shine: shine 14s ease-in-out infinite;
  --animate-ripple: ripple 3s ease-out infinite;
  --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-ping: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.6 0.18 40);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.6 0.18 40);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar-background: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.7 0.18 40);
  --primary-foreground: oklch(0.145 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(0.3 0 0);
  --input: oklch(0.3 0 0);
  --ring: oklch(0.7 0.18 40);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar-background: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.3 0 0);
  --sidebar-ring: oklch(0.439 0.194 263.745);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom keyframes */
@keyframes accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes accordion-up {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}

@keyframes shine {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

@layer utilities {
  .animate-accordion-down {
    animation: accordion-down 0.2s ease-out;
  }
  .animate-accordion-up {
    animation: accordion-up 0.2s ease-out;
  }
  .animate-shine {
    animation: shine var(--shine-pulse-duration, 14s) ease-in-out infinite;
  }
  .animate-ripple {
    animation: ripple 3s ease-out infinite;
    animation-delay: calc(var(--i, 0) * 0.06s);
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: oklch(0.7 0 0);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: oklch(0.6 0 0);
}

.dark ::-webkit-scrollbar-thumb {
  background: oklch(0.4 0 0);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: oklch(0.5 0 0);
}
```
