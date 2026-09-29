/**
 * Normalised cell-site state. The API types `status` as a free string and the
 * backend has written both "active"/"offline" and "ONLINE"/"OFFLINE", so every
 * screen reads the status through this function instead of comparing raw text.
 */
export type CellState = "online" | "offline" | "maintenance" | "unknown";

export function cellState(status: string | null | undefined): CellState {
  switch ((status ?? "").trim().toLowerCase()) {
    case "active":
    case "online":
      return "online";
    case "offline":
      return "offline";
    case "maintenance":
      return "maintenance";
    default:
      return "unknown";
  }
}

export const CELL_STATE_LABEL: Readonly<Record<CellState, string>> = {
  online: "Online",
  offline: "Offline",
  maintenance: "Maintenance",
  unknown: "Unknown",
};
