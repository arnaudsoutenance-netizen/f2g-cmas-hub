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
