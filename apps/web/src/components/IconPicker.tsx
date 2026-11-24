import { PAGE_ICONS, type PageIconName } from "@/data/icons"
import { ScrollArea } from "./ui/scroll-area"
import { DynamicIcon } from "lucide-react/dynamic"
import { Button } from "@base-ui/react"

type IconPickerProps = {
  value?: string
  onChange: (icon: PageIconName) => void
}

function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <ScrollArea className="h-32">
      <div className="grid grid-cols-4 gap-2 pr-3">
        {PAGE_ICONS.map((i) => (
          <Button
            onClick={() => onChange(i)}
            type="button"
            key={i}
            className={`flex items-center justify-center rounded-md p-2 hover:bg-accent ${
              value === i ? "bg-accent" : ""
            }`}
          >
            <DynamicIcon name={i} className="size-5" />
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}

export default IconPicker
