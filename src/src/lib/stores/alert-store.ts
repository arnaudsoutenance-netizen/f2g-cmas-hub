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
