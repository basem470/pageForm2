import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import { SidebarBtnElementDragOverlay } from "./SidebarBtnElement";
import { ElementsType, FormElements } from "./FormElements";
import useDesigner from "./hooks/useDesigner";

const DragOverlayWrapper = () => {
  const { elements } = useDesigner();
  const [draggedElement, setDraggedElement] = useState<Active | null>(null);
  useDndMonitor({
    onDragStart: (event) => setDraggedElement(event.active),
    onDragCancel: () => setDraggedElement(null),
    onDragEnd: () => setDraggedElement(null),
  });
  let node = (
    <div className="flex w-full h-full flex-col items-center justify-center gap-4">
      No drag overlay
    </div>
  );
  if (!draggedElement) return null;
  const isSidebarBtnElement =
    draggedElement.data?.current?.isDesignerBtnElement;
  if (isSidebarBtnElement) {
    const type = draggedElement.data?.current?.type as ElementsType;
    node = <SidebarBtnElementDragOverlay fromElement={FormElements[type]} />;
  }

  const isDesignerElement = draggedElement.data?.current?.isDesignerElement;
  if (isDesignerElement) {
    const elementId = draggedElement.data?.current?.elementId;
    const type = draggedElement.data?.current?.type as ElementsType;
    const element = elements.find((el) => el.id === elementId);
    if (!element) node = <div>Element not found!</div>;
    else {
      const DesignerElementComponent =
        FormElements[element.type].designerComponent;
      node = (
        <div className="flex bg-accent border rounded-md h-[120px] w-full py-2 px-4 opacity-80 pointer pointer-events-none">
          <DesignerElementComponent elementInstance={element} />
        </div>
      );
    }
  }
  return <DragOverlay>{node}</DragOverlay>;
};

export default DragOverlayWrapper;
