import type { PageIconName } from "@help-me-journal/shared/icons"
import type { UpdateWorkspaceInput } from "@help-me-journal/shared/schema"

export type UpdateWorkspaceTypes = {
  name: string
  description: string
  icon: PageIconName
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (newWorkspaceData: UpdateWorkspaceInput) => void
}
