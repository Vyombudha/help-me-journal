// Shared API types for Help Me Journal.

import type { IconName } from "lucide-react/dynamic"

// ---- Enums ----
export const WORKSPACE_STATUSES = [
  "IN_PROGRESS",
  "COMPLETED",
  "ABANDONED",
] as const
export type WorkspaceStatus = (typeof WORKSPACE_STATUSES)[number]

export const MOODS = [
  "HAPPY",
  "CALM",
  "SAD",
  "ANGRY",
  "ANXIOUS",
  "EXCITED",
  "TIRED",
  "NEUTRAL",
] as const
export type Mood = (typeof MOODS)[number]

// ---- Resources ----
export interface UserDTO {
  id: string // Clerk user ID
  email: string
  name: string | null
  createdAt: string
  updatedAt: string
}

export interface WorkspaceDTO {
  id: string // UUID
  name: string
  description: string
  isDefault: boolean
  ownerId: string
  icon: IconName
  createdAt: string
  updatedAt: string
  status: WorkspaceStatus
}

export interface PageDTO {
  id: string // UUID
  title: string
  content: string
  workspaceId: string
  templateConfig: Record<string, unknown> | null
  moods: Mood[]
  icon: IconName
  createdAt: string
  updatedAt: string
}

export interface GetAllPagesDTO {
  id: string
  title: string
  icon: IconName
}
// ---- Responses ----
export interface SuccessResponse<T> {
  success: true
  data: T
}

export interface ErrorResponse {
  success: false
  message: string
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse
