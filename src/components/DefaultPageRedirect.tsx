import { Navigate, useParams } from "react-router-dom"
import { useWorkspaces } from "@/hooks/useWorkspaces"
import { usePages } from "@/hooks/usePages"
import { Skeleton } from "./ui/skeleton"
import { EmptyData } from "./EmptyData"
import { toast } from "./ui/toast"

const lastPageKey = (workspaceId: string) => `lastPage:${workspaceId}`

function readLastPage(workspaceId: string) {
  try {
    return localStorage.getItem(lastPageKey(workspaceId))
  } catch {
    return null
  }
}

function DefaultPageRedirect() {
  const { workspaceId: urlWorkspaceId } = useParams<{ workspaceId: string }>()
  const {
    data: workspaces,
    isLoading: loadingWorkspaces,
    isError: workspacesError,
  } = useWorkspaces()

  const workspaceId =
    workspaces?.find((ws) => ws.id === urlWorkspaceId)?.id ??
    workspaces?.find((ws) => ws.isDefault)?.id ??
    workspaces?.[0]?.id

  const {
    data: pages,
    isLoading: loadingPages,
    isError: pagesError,
  } = usePages(workspaceId!)

  if (loadingWorkspaces || (workspaceId && loadingPages)) {
    return <Skeleton className="m-4 h-8 w-64" />
  }

  if (workspacesError || pagesError) {
    toast.add({
      title: "Cannot Load Your Workspace",
    })
    return <p className="p-4">Something went wrong loading your workspace.</p>
  }

  if (!workspaceId) {
    return <p className="p-4">No workspace found.</p>
  }

  if (!pages?.length) {
    return <EmptyData workspaceId={workspaceId} />
  }

  const lastId = readLastPage(workspaceId)
  const target = pages.find((p) => p.id === lastId) ?? pages[0]

  return <Navigate to={`/w/${workspaceId}/p/${target.id}`} replace />
}

export default DefaultPageRedirect
