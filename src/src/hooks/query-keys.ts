import type { AlertListFilters, CellStatus } from "@/types/domain";

export const queryKeys = {
  me: ["auth", "me"] as const,
  stats: ["stats"] as const,
  alerts: {
    all: ["alerts"] as const,
    list: (filters: AlertListFilters) => ["alerts", "list", filters] as const,
    detail: (id: string) => ["alerts", "detail", id] as const,
  },
  templates: {
    all: ["templates"] as const,
    list: (params: object) => ["templates", "list", params] as const,
  },
  cells: {
    all: ["cells"] as const,
    list: (status?: CellStatus) => ["cells", "list", status ?? "all"] as const,
    status: (id: string) => ["cells", "status", id] as const,
  },
};
