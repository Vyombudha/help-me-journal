import type { Mood } from "@help-me-journal/shared/data/moods"
import type { NewPageInput } from "@help-me-journal/shared/schema"

export type CreatePageProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (newPageData: NewPageInput) => void
}

export type MoodsGroupProps = {
  moods: Mood[]
  onChange: (value: Mood[]) => void
}
