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
import { comingSoon } from "@/lib/utils"

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
            comingSoon("Changing Default Workspaces")
          }}
        >
          <Star /> Make default
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
