import type { NewWorkspaceInput } from "@help-me-journal/shared/schema"

export type CreateWorkspaceProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (newWorkspaceData: NewWorkspaceInput) => void
}
