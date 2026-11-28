import * as React from "react"
import { ChevronsUpDown, MoreHorizontalIcon, Plus } from "lucide-react"
import type { WorkspaceStatus } from "@help-me-journal/shared/data/statuses"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { NewWorkspaceInput } from "@help-me-journal/shared/schema"
import CreateWorkspace from "./CreateWorkspace"
import {
  useCreateWorkspace,
  useDeleteWorkspace,
  useUpdateWorkspace,
} from "@/hooks/useWorkspaceMutations"
import { toast } from "./ui/toast"
import { useParams } from "react-router-dom"
import WorkspaceCard from "./WorkspaceCard"
import ConfirmDelete from "./ConfirmDelete"
import EditWorkspace from "./EditWorkspace"
import type { PageIconName } from "@help-me-journal/shared/icons"
import { DynamicIcon } from "lucide-react/dynamic"
import { STATUS } from "@/lib/utils"

export type WorkspaceItem = {
  id: string
  name: string
  logo: PageIconName
  status: WorkspaceStatus
  description: string
  isDefault: boolean
}

export function WorkspaceSwticher({
  workspaces = [],
}: {
  workspaces?: WorkspaceItem[]
}) {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { isMobile } = useSidebar()
  const [menuOpen, setMenuOpen] = React.useState(false)
  // Derive the active workspace; falls back to the first until the user picks one.

  const activeWorkspace =
    workspaces.find((w) => w.id === workspaceId) ?? workspaces[0]
  const createWorkspace = useCreateWorkspace()
  const [deleteTarget, setDeleteTarget] = React.useState<WorkspaceItem | null>(
    null
  )
  const [editTarget, setEditTarget] = React.useState<WorkspaceItem | null>(null)
  const deleteWorkspace = useDeleteWorkspace()
  const updateWorkspace = useUpdateWorkspace()

  const COLLAPSED_COUNT = 4
  const [expanded, setExpanded] = React.useState(false)
  const visibleWorkspaces = expanded
    ? workspaces
    : workspaces.slice(0, COLLAPSED_COUNT)
  const hasOverflow = workspaces.length > COLLAPSED_COUNT
  if (!activeWorkspace) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <DynamicIcon name={activeWorkspace.logo} />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {activeWorkspace.name}
              </span>
              <span className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                <span
                  className={`size-1.5 shrink-0 rounded-full ${STATUS[activeWorkspace.status].dot}`}
                />
                {STATUS[activeWorkspace.status].label}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-lg"
            align="start"

            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>
              {visibleWorkspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  onDelete={setDeleteTarget}
                  onEdit={setEditTarget}
                />
              ))}
            </DropdownMenuGroup>
            {hasOverflow && (
              <SidebarMenuItem onClick={() => setExpanded((prev) => !prev)}>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <MoreHorizontalIcon className="text-sidebar-foreground/70" />
                  <span>{expanded ? "more" : "less"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => setMenuOpen(true)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add Workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <CreateWorkspace
          open={menuOpen}
          onOpenChange={setMenuOpen}
          onConfirm={(newWsData: NewWorkspaceInput) => {
            toast.promise(createWorkspace.mutateAsync(newWsData), {
              loading: `Creating Workspace`,
              success: `Workspace Created`,
              error: `Failed to Create Workspace`,
            })
          }}
        />
        {editTarget && (
          <EditWorkspace
            key={editTarget.id}
            open
            name={editTarget.name}
            description={editTarget.description}
            icon={editTarget.logo}
            onOpenChange={(open) => {
              if (!open) setEditTarget(null)
            }}
            status={editTarget.status}
            onConfirm={(newWorkspaceData) => {
              toast.promise(
                updateWorkspace.mutateAsync({
                  id: editTarget.id,
                  ...newWorkspaceData,
                }),
                {
                  loading: "Updating Workspace",
                  success: "Workspace Updated",
                  error: "Failed to Update Workspace",
                }
              )
            }}
          />
        )}
        <ConfirmDelete
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null)
          }}
          onConfirm={() => {
            if (!deleteTarget) return
            toast.promise(deleteWorkspace.mutateAsync(deleteTarget.id), {
              loading: "Deleting Workspace",
              success: "Workspace Deleted",
              error: "Failed to Delete Workspace",
            })
          }}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
