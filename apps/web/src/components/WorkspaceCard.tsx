import { useNavigate } from "react-router-dom"
import { Pencil, Star, Trash2 } from "lucide-react"
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./ui/dropdown-menu"
import type { WorkspaceItem } from "./workspace-switcher"
import { DynamicIcon } from "lucide-react/dynamic"
import { useSetDefaultWorkspace } from "@/hooks/useWorkspaceMutations"
import { toast } from "./ui/toast"

function WorkspaceCard({
  workspace,
  onDelete,
  onEdit,
}: {
  workspace: WorkspaceItem
  onDelete: (workspace: WorkspaceItem) => void
  onEdit: (workspace: WorkspaceItem) => void
}) {
  const navigate = useNavigate()
  const setDefaultWs = useSetDefaultWorkspace()
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger
        openOnHover
        className="gap-2 p-2"
        onClick={() => navigate(`/w/${workspace.id}`)}
      >
        <div className="flex size-6 items-center justify-center rounded-md border">
          <span className="flex shrink-0 items-center [&>svg]:size-3.5 [&>svg]:shrink-0">
            <DynamicIcon name={workspace.logo} />
          </span>
        </div>
        {workspace.name}
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent className="min-w-44">
        <DropdownMenuItem
          onClick={() => {
            onEdit(workspace)
          }}
        >
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            toast.promise(setDefaultWs.mutateAsync({ id: workspace.id }), {
              loading: "Setting as Default",
              success: "Set as Default",
              error: "Failed to Set as Defaut",
            })
          }}
        >
          <Star
            className={
              workspace.isDefault ? "fill-yellow-500 text-yellow-500" : ""
            }
          />
          Make Default
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            onDelete(workspace)
          }}
        >
          <Trash2 /> Delete workspace
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

export default WorkspaceCard
