import React from "react";
import { FormElementType } from "./FormElements";
import { Button } from "./ui/button";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

const SidebarBtnElement = ({
  fromElement,
}: {
  fromElement: FormElementType;
}) => {
  const { label, icon: Icon } = fromElement.designerBtnElement;
  const draggable = useDraggable({
    id: `desginer-btn-${fromElement.type}`,
    data: { type: fromElement.type, isDesignerBtnElement: true },
  });
  return (
    <Button
      ref={draggable.setNodeRef}
      variant={"outline"}
      className={cn(
        "flex flex-col gap-2 h-[120px] w-[120px] cursor-grab",
        draggable.isDragging && "ring-2 ring-primary"
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Icon className="h-8 w-8 text-primary " />
      <p className="text-xs">{label}</p>
    </Button>
  );
};
export const SidebarBtnElementDragOverlay = ({
  fromElement,
}: {
  fromElement: FormElementType;
}) => {
  const { label, icon: Icon } = fromElement.designerBtnElement;
  const draggable = useDraggable({
    id: `desginer-btn-${fromElement.type}`,
    data: { type: fromElement.type, isDesignerBtnElement: true },
  });
  return (
    <Button
      variant={"outline"}
      className={cn("flex flex-col gap-2 h-[120px] w-[120px] cursor-grab")}
    >
      <Icon className="h-8 w-8 text-primary " />
      <p className="text-xs">{label}</p>
    </Button>
  );
};

export default SidebarBtnElement;
