/**
 * Domain types derived from the generated OpenAPI schema.
 * Regenerate `api.gen.ts` with `pnpm gen:api` whenever the backend changes.
 */
import type { components } from "./api.gen";

type Schemas = components["schemas"];

export type AlertType = Schemas["AlertType"];
export type AlertStatus = Schemas["AlertStatus"];
export type UserRole = Schemas["UserRole"];

export type Alert = Schemas["AlertResponse"];
export type AlertDetail = Schemas["AlertDetailResponse"];
export type AlertCell = Schemas["AlertCellResponse"];
export type AlertLog = Schemas["AlertLogResponse"];
export type AlertCreateInput = Schemas["AlertCreate"];
export type AlertUpdateInput = Schemas["AlertUpdate"];
export type AlertSendResult = Schemas["AlertSendResponse"];

export type Template = Schemas["TemplateResponse"];
export type TemplateCreateInput = Schemas["TemplateCreate"];
export type TemplateUpdateInput = Schemas["TemplateUpdate"];

export type CellSite = Schemas["CellSiteResponse"];
export type CellSiteCreateInput = Schemas["CellSiteCreate"];
export type CellSiteUpdateInput = Schemas["CellSiteUpdate"];
export type CellHealth = Schemas["CellStatusResponse"];

export type DashboardStats = Schemas["DashboardStats"];
export type User = Schemas["UserResponse"];
export type AccessToken = Schemas["Token"];
export type PaginationMeta = Schemas["PaginationMeta"];

/** The backend declares `data` as an untyped array; this narrows it per endpoint. */
export interface Paginated<T> {
  data: T[];
  pagination: PaginationMeta;
}

export type CellStatus = "active" | "offline" | "maintenance";

export interface AlertListFilters {
  status?: AlertStatus;
  alert_type?: AlertType;
  page?: number;
  limit?: number;
  sort_by?: "created_at" | "sent_at" | "scheduled_at";
  sort_order?: "asc" | "desc";
}
