import { apiRequest } from "./client";
import type {
  AccessToken,
  Alert,
  AlertCreateInput,
  AlertDetail,
  AlertListFilters,
  AlertSendResult,
  AlertUpdateInput,
  CellHealth,
  CellSite,
  CellSiteCreateInput,
  CellSiteUpdateInput,
  CellStatus,
  DashboardStats,
  Paginated,
  Template,
  TemplateCreateInput,
  TemplateUpdateInput,
  User,
} from "@/types/domain";

export const authApi = {
  login(email: string, password: string): Promise<AccessToken> {
    const form = new URLSearchParams({ username: email, password, grant_type: "password" });
    return apiRequest<AccessToken>("/auth/login", { method: "POST", form });
  },
  me: (signal?: AbortSignal) => apiRequest<User>("/auth/me", { signal }),
};

export const alertsApi = {
  list: (filters: AlertListFilters, signal?: AbortSignal) =>
    apiRequest<Paginated<Alert>>("/alerts", { query: { ...filters }, signal }),
  get: (id: string, signal?: AbortSignal) => apiRequest<AlertDetail>(`/alerts/${id}`, { signal }),
  create: (input: AlertCreateInput) => apiRequest<Alert>("/alerts", { method: "POST", json: input }),
  update: (id: string, input: AlertUpdateInput) =>
    apiRequest<Alert>(`/alerts/${id}`, { method: "PATCH", json: input }),
  remove: (id: string) => apiRequest<void>(`/alerts/${id}`, { method: "DELETE" }),
  send: (id: string, immediate = true) =>
    apiRequest<AlertSendResult>(`/alerts/${id}/send`, { method: "POST", json: { immediate } }),
  cancel: (id: string) => apiRequest<Alert>(`/alerts/${id}/cancel`, { method: "POST" }),
};

export const templatesApi = {
  list: (params: { category?: string; alert_type?: Alert["alert_type"]; active_only?: boolean } = {}, signal?: AbortSignal) =>
    apiRequest<Template[]>("/templates", { query: params, signal }),
  create: (input: TemplateCreateInput) => apiRequest<Template>("/templates", { method: "POST", json: input }),
  update: (id: string, input: TemplateUpdateInput) =>
    apiRequest<Template>(`/templates/${id}`, { method: "PATCH", json: input }),
  remove: (id: string) => apiRequest<void>(`/templates/${id}`, { method: "DELETE" }),
};

export const cellsApi = {
  list: (status?: CellStatus, signal?: AbortSignal) => apiRequest<CellSite[]>("/cells", { query: { status }, signal }),
  create: (input: CellSiteCreateInput) => apiRequest<CellSite>("/cells", { method: "POST", json: input }),
  update: (id: string, input: CellSiteUpdateInput) =>
    apiRequest<CellSite>(`/cells/${id}`, { method: "PATCH", json: input }),
  remove: (id: string) => apiRequest<void>(`/cells/${id}`, { method: "DELETE" }),
  status: (id: string, signal?: AbortSignal) => apiRequest<CellHealth>(`/cells/${id}/status`, { signal }),
  healthCheck: () => apiRequest<CellHealth[]>("/cells/health-check", { method: "POST" }),
};

export const statsApi = {
  dashboard: (signal?: AbortSignal) => apiRequest<DashboardStats>("/stats", { signal }),
};
