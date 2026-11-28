import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import IconPicker from "./IconPicker"
import { useState } from "react"
import type { PageIconName } from "@help-me-journal/shared/icons"
import { UpdateWorkspaceSchema } from "@help-me-journal/shared/schema"
import { toast } from "./ui/toast"
import type { UpdateWorkspaceTypes } from "@/types/UpdateWorkspace.types"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  WORKSPACE_STATUSES,
  type WorkspaceStatus,
} from "@help-me-journal/shared/data/statuses"

export default function EditWorkspace({
  name,
  description,
  icon,
  open,
  status,
  onOpenChange,
  onConfirm,
}: UpdateWorkspaceTypes) {
  const [iconName, setIconName] = useState<PageIconName>(icon)
  const [newStatus, setNewStatus] = useState<WorkspaceStatus>(status)
  function handleSubmission(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = UpdateWorkspaceSchema.safeParse({
      newName: formData.get("name"),
      newDescription: formData.get("description"),
      newIcon: iconName,
      newStatus,
    })

    if (!result.success) {
      toast.add({
        title: "Failed To Edit Your Workspace",
        description: result.error.issues[0].message,
      })
      return
    }

    onConfirm(result.data) // trimmed, validated, correctly typed
    onOpenChange(false) // close the dialog after confirming
  }
  const statusSelect: { label: string; value: WorkspaceStatus }[] = [
    { label: "in progress", value: WORKSPACE_STATUSES[0] },
    { label: "done", value: WORKSPACE_STATUSES[1] },
    { label: "abandoned", value: WORKSPACE_STATUSES[2] },
  ]
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
          <DialogDescription>
            Put the updated name and description of your new workspace here.
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form id="new-project-form" onSubmit={handleSubmission}>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue={name} required />
            </Field>
            <Field>
              <Label htmlFor="description-1">Description</Label>
              <Input
                id="description-1"
                name="description"
                defaultValue={description}
                required
              />
            </Field>

            <Field>
              <Label>Status</Label>
              <Select
                items={statusSelect}
                defaultValue={newStatus}
                onValueChange={(v) => v && setNewStatus(v as WorkspaceStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {statusSelect.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label>Icon</Label>
              <IconPicker
                value={iconName}
                onChange={(icon) => setIconName(icon)}
              />
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" form="new-project-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
