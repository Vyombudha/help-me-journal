import { z } from "zod"
import { PAGE_ICONS } from "@/data/icons"

export const NewWorkspaceSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().min(1).max(200),
  icon: z.enum(PAGE_ICONS),
})

export type CreateWorkspaceInput = z.infer<typeof NewWorkspaceSchema>

export type CreateWorkspaceProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (newWorkspaceData: CreateWorkspaceInput) => void
}
