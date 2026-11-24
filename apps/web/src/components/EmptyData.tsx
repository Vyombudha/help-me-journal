import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { IconFolderCode } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useCreatePage } from "@/hooks/usePageMutations"
import { useCreateWorkspace } from "@/hooks/useWorkspaceMutations" // your existing hook
import { toast } from "./ui/toast"
import type {
  NewPageInput,
  NewWorkspaceInput,
} from "@help-me-journal/shared/schema"
import CreateWorkspace from "./CreateWorkspace"

const newPageData: NewPageInput = {
  title: "New Page",
  moods: ["CALM", "HAPPY"],
}

export function EmptyData({ workspaceId }: { workspaceId?: string }) {
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const createWorkspace = useCreateWorkspace()
  const createPage = useCreatePage(workspaceId ?? "")

  const hasWorkspace = !!workspaceId

  const handleCreatePage = () => {
    if (!workspaceId) return
    toast.promise(
      createPage.mutateAsync(newPageData).then((page) => {
        navigate(`/w/${workspaceId}/p/${page.id}`)
        return page
      }),
      {
        loading: "Creating page",
        success: "Page created",
        error: "Failed to create page",
      }
    )
  }

  const handleCreateWorkspace = (data: NewWorkspaceInput) => {
    toast.promise(
      createWorkspace.mutateAsync(data).then((ws) => {
        navigate(`/w/${ws.id}`)
        return ws
      }),
      {
        loading: "Creating workspace",
        success: "Workspace created",
        error: "Failed to create workspace",
      }
    )
  }

  return (
    <div className="col-span-full flex h-2/3 w-full items-start">
      <Empty className="h-full w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconFolderCode className="size-16 pb-2" />
          </EmptyMedia>
          <EmptyTitle className="text-3xl">
            {hasWorkspace ? "No pages yet" : "No workspaces yet"}
          </EmptyTitle>
          <EmptyDescription className="text-xl">
            {hasWorkspace
              ? "You haven't created any pages yet. Get started by creating your first page."
              : "Create a workspace to start organizing your pages."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-2">
          {hasWorkspace ? (
            <Button size="lg" onClick={handleCreatePage}>
              Create page
            </Button>
          ) : (
            <Button size="lg" onClick={() => setDialogOpen(true)}>
              Create workspace
            </Button>
          )}
        </EmptyContent>
      </Empty>

      <CreateWorkspace
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleCreateWorkspace}
      />
    </div>
  )
}
