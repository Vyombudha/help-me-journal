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
import type { CreateWorkspaceProps } from "@/types/CreateWorkspace.types"
import IconPicker from "./IconPicker"
import { useState } from "react"
import type { PageIconName } from "@help-me-journal/shared/icons"
import { NewWorkspaceSchema } from "@help-me-journal/shared/schema"
import { toast } from "./ui/toast"
export default function CreateWorkspace({
  open,
  onOpenChange,
  onConfirm,
}: CreateWorkspaceProps) {
  const [iconName, setIconName] = useState<PageIconName>("audio-lines")
  function handleSubmission(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = NewWorkspaceSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      icon: iconName,
    })

    if (!result.success) {
      toast.add({
        title: "Failed To Create Your Workspace",
        description: result.error.issues[0].message,
      })
      return
    }

    onConfirm(result.data) // trimmed, validated, correctly typed
    onOpenChange(false) // close the dialog after confirming
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Put the name and description of your new project here. Click save
            when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form id="new-project-form" onSubmit={handleSubmission}>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" required />
            </Field>
            <Field>
              <Label htmlFor="description-1">Description</Label>
              <Input id="description-1" name="description" required />
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
