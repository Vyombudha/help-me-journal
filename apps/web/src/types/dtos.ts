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
}

// ---- Request payloads ----
// POST /api/v1/workspaces
export interface CreateWorkspaceDTO {
  name: string // trimmed, 1-30 chars, unique per owner
  description: string // 1-200 chars
}

// PATCH /api/v1/workspaces/:workspaceId (both required)
export interface UpdateWorkspaceDTO {
  newName: string
  newDescription: string
}

// PATCH /api/v1/workspaces/:workspaceId/icon (both required)
export interface UpdateWorkspaceIconDTO {
  newIcon: IconName
}

// POST /api/v1/workspaces/:workspaceId/pages
export interface CreatePageDTO {
  title: string // trimmed, 1-500 chars, unique per workspace
  moods: Mood[] // required, may be empty
}

// PATCH /api/v1/pages/:pageId/title
export interface UpdatePageTitleDTO {
  newTitle: string
}

// PATCH /api/v1/pages/:pageId/content
export interface UpdatePageContentDTO {
  newContent: string // required, may be an empty string, no length limit
}

// PATCH /api/v1/pages/:pageId/icon
export interface UpdatePageIconDTO {
  newIcon: string // required, may be an empty string, no length limit
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
