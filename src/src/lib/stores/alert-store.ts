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
  // Initial state - empty, will be populated from API
  alerts: [],
  selectedAlert: null,
  isLoading: false,
  cells: [],
  templates: [],
  stats: null,
  
  // Actions
  setAlerts: (alerts) => set({ alerts }),
  
  addAlert: (alert) => set((state) => ({ 
    alerts: [alert, ...state.alerts] 
  })),
  
  updateAlert: (id, data) => set((state) => ({
    alerts: state.alerts.map((a) => 
      a.id === id ? { ...a, ...data } : a
    ),
  })),
  
  deleteAlert: (id) => set((state) => ({
    alerts: state.alerts.filter((a) => a.id !== id),
    selectedAlert: state.selectedAlert?.id === id ? null : state.selectedAlert,
  })),
  
  selectAlert: (alert) => set({ selectedAlert: alert }),
  
  setCells: (cells) => set({ cells }),
  
  setTemplates: (templates) => set({ templates }),
  
  setStats: (stats) => set({ stats }),
  
  setLoading: (isLoading) => set({ isLoading }),
}));
