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
