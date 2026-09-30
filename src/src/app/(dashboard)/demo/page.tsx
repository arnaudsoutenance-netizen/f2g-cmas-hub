"use client";

import { useState } from "react";
import {
  Terminal,
  Copy,
  Check,
  Radio,
  MapPin,
  Users,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  command: string;
  category: "verification" | "injection" | "monitoring";
}

const TAC_COMMANDS: CommandItem[] = [
  {
    id: "all-attachments",
    title: "Derniers attachements avec TAC",
    description: "Voir les 15 derniers attachements UE avec leur TAC assigné",
    command: `docker logs mme 2>&1 | grep "$(date +%m/%d)" | grep -E "TAC\\[" | tail -15`,
    category: "verification",
  },
  {
    id: "ue1-tac",
    title: "UE1 - Vérification TAC",
    description: "IMSI 001010000123451 → Attendu TAC 2 (Douala)",
    command: `docker logs mme 2>&1 | grep -B2 '001010000123451' | grep 'TAC' | tail -1`,
    category: "verification",
  },
  {
    id: "ue2-tac",
    title: "UE2 - Vérification TAC",
    description: "IMSI 001010000123453 → Attendu TAC 2 (Douala)",
    command: `docker logs mme 2>&1 | grep -B2 '001010000123453' | grep 'TAC' | tail -1`,
    category: "verification",
  },
  {
    id: "ue3-tac",
    title: "UE3 - Vérification TAC",
    description: "IMSI 001010000099901 → Attendu TAC 1 (Yaoundé)",
    command: `docker logs mme 2>&1 | grep -B2 '001010000099901' | grep 'TAC' | tail -1`,
    category: "verification",
  },
  {
    id: "all-ues",
    title: "Tous les UE - Résumé complet",
    description: "Affiche le TAC de chaque UE en une seule commande",
    command: `echo '=== UE1 ===' && docker logs mme 2>&1 | grep -B2 '001010000123451' | grep 'TAC' | tail -1 && echo '=== UE2 ===' && docker logs mme 2>&1 | grep -B2 '001010000123453' | grep 'TAC' | tail -1 && echo '=== UE3 ===' && docker logs mme 2>&1 | grep -B2 '001010000099901' | grep 'TAC' | tail -1`,
    category: "verification",
  },
];

const ALERT_COMMANDS: CommandItem[] = [
  {
    id: "alert-tac1",
    title: "Alerte Yaoundé (TAC 1)",
    description: "Envoyer une alerte uniquement aux UE sur eNB1 (Yaoundé)",
    command: `curl -X POST http://localhost:8000/api/v1/alerts/send \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "⚠️ ALERTE YAOUNDÉ: Test Cell Broadcast TAC 1",
    "severity": "moderate",
    "target_tacs": [1]
  }'`,
    category: "injection",
  },
  {
    id: "alert-tac2",
    title: "Alerte Douala (TAC 2)",
    description: "Envoyer une alerte uniquement aux UE sur eNB2 (Douala)",
    command: `curl -X POST http://localhost:8000/api/v1/alerts/send \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "⚠️ ALERTE DOUALA: Test Cell Broadcast TAC 2",
    "severity": "moderate",
    "target_tacs": [2]
  }'`,
    category: "injection",
  },
  {
    id: "alert-all",
    title: "Alerte Nationale (Tous TAC)",
    description: "Envoyer une alerte à tous les UE du réseau",
    command: `curl -X POST http://localhost:8000/api/v1/alerts/send \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "🚨 ALERTE NATIONALE: Test Cell Broadcast Multi-TAC",
    "severity": "extreme",
    "target_tacs": [1, 2]
  }'`,
    category: "injection",
  },
];

const MONITOR_COMMANDS: CommandItem[] = [
  {
    id: "mme-status",
    title: "Statut MME",
    description: "Vérifier que le MME Open5GS est actif",
    command: `docker ps --filter "name=mme" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"`,
    category: "monitoring",
  },
  {
    id: "enb-connections",
    title: "Connexions eNB",
    description: "Voir les eNB connectés au MME via S1AP",
    command: `docker logs mme 2>&1 | grep -E "S1AP|eNB|ENB" | tail -10`,
    category: "monitoring",
  },
  {
    id: "subscriber-list",
    title: "Liste des abonnés",
    description: "Voir tous les abonnés enregistrés dans Open5GS",
    command: `docker exec -it mongo mongosh --quiet open5gs --eval "db.subscribers.find({}, {imsi:1, _id:0}).toArray()"`,
    category: "monitoring",
  },
];

function CommandCard({ item, onCopy }: { item: CommandItem; onCopy: (cmd: string) => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.command);
    setCopied(true);
    onCopy(item.command);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{item.title}</CardTitle>
            <CardDescription className="mt-1">{item.description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-st-sent-fg" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="p-3 rounded-lg bg-muted/50 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {item.command}
          </pre>
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 h-7 text-xs"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Copié!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copier
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DemoPage() {
  const [lastCopied, setLastCopied] = useState<string | null>(null);

  // Current lab status (would be fetched from API in production)
  const labStatus = {
    enb1: { name: "eNB1 Yaoundé", tac: 1, status: "online", ues: 1 },
    enb2: { name: "eNB2 Douala", tac: 2, status: "online", ues: 2 },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Demo Commands</h1>
            <p className="text-sm text-muted-foreground">
              Commandes de vérification TAC pour la démo CMAS Multi-Sites
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Lab Multi-TAC Active
        </Badge>
      </div>

      {/* Lab Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Radio className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">eNB Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Smartphone className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">UE Attachés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <MapPin className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">TAC Zones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Zap className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">1450</p>
                <p className="text-xs text-muted-foreground">EARFCN</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lab Topology */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            Topologie Lab Multi-TAC
          </CardTitle>
          <CardDescription>
            Distribution actuelle des UE par TAC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* eNB1 */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="font-medium">eNB1 - Yaoundé</span>
                </div>
                <Badge>TAC 1</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>PCI:</span>
                  <span className="font-mono">1</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Cell ID:</span>
                  <span className="font-mono">0x19B01</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>EARFCN:</span>
                  <span className="font-mono">1450</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">UE attachés:</span>
                  <Badge variant="secondary">UE3 (099901)</Badge>
                </div>
              </div>
            </div>

            {/* eNB2 */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="font-medium">eNB2 - Douala</span>
                </div>
                <Badge>TAC 2</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>PCI:</span>
                  <span className="font-mono">2</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Cell ID:</span>
                  <span className="font-mono">0x19C01</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>EARFCN:</span>
                  <span className="font-mono">1450</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">UE attachés:</span>
                  <div className="flex gap-1">
                    <Badge variant="secondary">UE1 (123451)</Badge>
                    <Badge variant="secondary">UE2 (123453)</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Command Tabs */}
      <Tabs defaultValue="verification" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="verification">Vérification TAC</TabsTrigger>
          <TabsTrigger value="injection">Injection Alertes</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="verification" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {TAC_COMMANDS.map((cmd) => (
              <CommandCard key={cmd.id} item={cmd} onCopy={setLastCopied} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="injection" className="space-y-4">
          <Card className="border-orange-500/20 bg-orange-500/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-500">Mode Démo</p>
                  <p className="text-sm text-muted-foreground">
                    Ces commandes envoient de vraies alertes Cell Broadcast. Les UE recevront les messages
                    uniquement s'ils sont sur le TAC ciblé.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            {ALERT_COMMANDS.map((cmd) => (
              <CommandCard key={cmd.id} item={cmd} onCopy={setLastCopied} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {MONITOR_COMMANDS.map((cmd) => (
              <CommandCard key={cmd.id} item={cmd} onCopy={setLastCopied} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Référence rapide IMSI → TAC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">UE</th>
                  <th className="text-left py-2 font-medium">IMSI</th>
                  <th className="text-left py-2 font-medium">TAC Attendu</th>
                  <th className="text-left py-2 font-medium">Location</th>
                  <th className="text-left py-2 font-medium">eNB</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">UE1</td>
                  <td className="py-2 font-mono text-xs">001010000123451</td>
                  <td className="py-2"><Badge>TAC 2</Badge></td>
                  <td className="py-2">Douala</td>
                  <td className="py-2">eNB2</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">UE2</td>
                  <td className="py-2 font-mono text-xs">001010000123453</td>
                  <td className="py-2"><Badge>TAC 2</Badge></td>
                  <td className="py-2">Douala</td>
                  <td className="py-2">eNB2</td>
                </tr>
                <tr>
                  <td className="py-2">UE3</td>
                  <td className="py-2 font-mono text-xs">001010000099901</td>
                  <td className="py-2"><Badge variant="outline">TAC 1</Badge></td>
                  <td className="py-2">Yaoundé</td>
                  <td className="py-2">eNB1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
