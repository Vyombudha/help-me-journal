import { z } from "zod";
import { PAGE_ICONS } from "../data/pageIcons";
import { WORKSPACE_STATUSES } from "../data/statuses";

export const NewWorkspaceSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().min(1).max(200),
  icon: z.enum(PAGE_ICONS),
});

export const UpdateWorkspaceSchema = z.object({
  newName: z.string().trim().min(1).max(100),
  newDescription: z.string().min(1).max(200),
  newIcon: z.enum(PAGE_ICONS),
  newStatus: z.enum(WORKSPACE_STATUSES),
});

export const WorkspaceIdParamSchema = z.object({
  workspaceId: z.uuid(),
});

export type NewWorkspaceInput = z.infer<typeof NewWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;
