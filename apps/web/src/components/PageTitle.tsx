import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { useDebouncedCallback } from "use-debounce"
import { useUpdatePageTitle } from "@/hooks/usePageMutations"
import { readTitle } from "@/lib/utils"
import { toast } from "@/components/ui/toast"
import type { PageDTO } from "@/types/dtos"

type PageListItem = Omit<PageDTO, "content">

export default function PageTitle({
  pageId,
  title,
}: {
  pageId: string
  title: string | undefined
}) {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const queryClient = useQueryClient()
  const save = useUpdatePageTitle()
  const [initial] = useState(() => readTitle(title))
  const [value, setValue] = useState(initial)
  const latest = useRef(initial)

  const listKey = ["pages", workspaceId]
  const pageKey = ["page", pageId]

  const patchCache = (next: string) => {
    // breadcrumb + sidebar read from this one
    queryClient.setQueryData<PageListItem[]>(listKey, (old) =>
      old?.map((p) => (p.id === pageId ? { ...p, title: next } : p))
    )
    queryClient.setQueryData<PageDTO>(pageKey, (old) =>
      old ? { ...old, title: next } : old
    )
  }

  const debouncedSave = useDebouncedCallback(() => {
    save.mutateAsync({ pageId, newTitle: latest.current }).catch(() => {
      queryClient.invalidateQueries({ queryKey: listKey })
      queryClient.invalidateQueries({ queryKey: pageKey })
      toast.add({ type: "error", title: "Failed to save title" })
    })
  }, 800)

  useEffect(() => {
    return () => {
      debouncedSave.flush()
    }
  }, [debouncedSave])

  return (
    <input
      value={value}
      placeholder="Untitled Page"
      aria-label="Page title"
      onChange={(e) => {
        const next = e.target.value
        latest.current = next
        setValue(next)
        queryClient.cancelQueries({ queryKey: listKey })
        queryClient.cancelQueries({ queryKey: pageKey })
        patchCache(next)
        debouncedSave()
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault()
      }}
      className="w-full bg-transparent font-[Inter,sans-serif] text-5xl leading-tight font-bold text-foreground outline-none placeholder:text-muted-foreground"
    />
  )
}
