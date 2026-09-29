// Types for F2G CMAS Hub

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
    { id: 4370, name: "Presidential", description: "National alert - No opt-out", category: "emergency", optOut: false },
    { id: 4371, name: "Extreme Immediate", description: "Extreme threat - Immediate action", category: "extreme", optOut: false },
    { id: 4372, name: "Extreme Likely", description: "Extreme threat - Likely", category: "extreme", optOut: false },
    { id: 4373, name: "Severe Immediate", description: "Severe threat - Immediate action", category: "severe", optOut: true },
    { id: 4374, name: "Severe Likely", description: "Severe threat - Likely", category: "severe", optOut: true },
    { id: 4375, name: "AMBER Alert", description: "Missing child", category: "amber", optOut: true },
    { id: 4376, name: "RMT", description: "Required monthly test", category: "test", optOut: true },
    { id: 4377, name: "Exercise", description: "Exercise/Drill", category: "test", optOut: true },
    { id: 4378, name: "Operator", description: "Operator alert", category: "operator", optOut: true },
  ],
  ETWS: [
    { id: 4352, name: "Earthquake", description: "Earthquake alert", category: "earthquake", optOut: false },
    { id: 4353, name: "Tsunami", description: "Tsunami alert", category: "tsunami", optOut: false },
    { id: 4354, name: "Earthquake+Tsunami", description: "Earthquake and tsunami", category: "combined", optOut: false },
    { id: 4355, name: "Test", description: "ETWS test", category: "test", optOut: true },
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
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  SENDING: "Sending",
  SENT: "Sent",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};
