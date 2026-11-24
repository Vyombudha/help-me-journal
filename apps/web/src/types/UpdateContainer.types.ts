import type { UpdatePageNameInput } from "@help-me-journal/shared/schema"

export type UpdateContainerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (newContainerData: UpdatePageNameInput) => void
}
