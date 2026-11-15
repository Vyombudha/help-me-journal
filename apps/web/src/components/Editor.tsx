import { useEffect } from "react"
import type { Block } from "@blocknote/core"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { useDebouncedCallback } from "use-debounce"
import { useUpdatePageContent } from "@/hooks/usePageMutations"
import "@blocknote/core/fonts/inter.css"
import { parseContent } from "@/lib/utils"
import { useTheme } from "./theme-provider"
import { toast } from "./ui/toast"

export default function Editor({
  pageId,
  content,
}: {
  pageId: string
  content: string
}) {
  const { resolvedTheme } = useTheme()
  const save = useUpdatePageContent()
  const editor = useCreateBlockNote({ initialContent: parseContent(content) })
  const debouncedSave = useDebouncedCallback((blocks: Block[]) => {
    save.mutate(
      { pageId, newContent: JSON.stringify(blocks) },
      {
        onError: () =>
          toast.add({
            type: "error",
            title: "Failed to save",
            description: "Your changes may be lost.",
            timeout: 0,
          }),
      }
    )
  }, 800)

  useEffect(() => () => debouncedSave.flush(), [debouncedSave])

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme}
      onChange={() => {
        debouncedSave(editor.document)
      }}
    />
  )
}
