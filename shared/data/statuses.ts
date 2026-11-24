export const WORKSPACE_STATUSES = [
  "IN_PROGRESS",
  "COMPLETED",
  "ABANDONED",
] as const;
export type WorkspaceStatus = (typeof WORKSPACE_STATUSES)[number];
