/**
 * Types for action logging system
 */

export type ActionType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VIEW"
  | "ASSIGN"
  | "COMPLETE"
  | "CANCEL"
  | "APPROVE"
  | "REJECT"
  | "SEND"
  | "RECEIVE";

export type EntityType =
  | "TRIP"
  | "VEHICLE"
  | "DRIVER"
  | "CLIENT"
  | "JOB_CARD"
  | "INSPECTION"
  | "TYRE"
  | "USER"
  | "DOCUMENT"
  | "INVOICE"
  | "MAINTENANCE"
  | "FUEL"
  | "EXPENSE";

export type ActionCategory =
  | "OPERATIONS"
  | "MAINTENANCE"
  | "FINANCE"
  | "ADMIN"
  | "COMPLIANCE"
  | "SECURITY";

export interface ActionLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: ActionType;
  entityType: EntityType;
  entityId: string;
  entityName?: string;
  description: string;
  details?: Record<string, any>;
  severity: "low" | "medium" | "high" | "critical";
  category: ActionCategory;
  relatedEntityId?: string;
  relatedEntityType?: EntityType;
}
