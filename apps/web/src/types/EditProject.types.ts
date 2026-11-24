import type { UpdateWorkspaceInput } from "@help-me-journal/shared/schema"

export type UpdateWorkspaceProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (newWorkspaceData: UpdateWorkspaceInput) => void
}
