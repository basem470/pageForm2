"use client";

import { idGenerator } from "@/lib/idGenerator";
import { cn } from "@/lib/utils";
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useState } from "react";
import { BiSolidTrash } from "react-icons/bi";
import DesignerSidebar from "./DesignerSidebar";
import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from "./FormElements";
import useDesigner from "./hooks/useDesigner";
import { Button } from "./ui/button";
const Designer = () => {
  const {
    elements,
    addElement,
    removeElement,
    selectedElement,
    setSelectedElement,
  } = useDesigner();
  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;

      if (!active || !over) return;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;

      const isDroppingOverDesignerDropArea =
        over.data?.current?.isDesignerDropArea;
      const isDragginDesignerElement = active.data?.current?.isDesignerElement;

      //First scenario: dropping a sidebar element over the drop area

      if (isDesignerBtnElement && isDroppingOverDesignerDropArea) {
        const type = active.data?.current?.type as ElementsType;
        const newElement = FormElements[type].construct(idGenerator());
        addElement(elements.length, newElement);
        console.log("running first scenario");
        return;
      }

      //Second scenario: dropping a sidebar element over a designer element

      const isDroppingOverTopHalfDesignerElement =
        over.data?.current?.isTopHalfDesignerElement;

      const isDroppingOverBottomHalfDesignerElement =
        over.data?.current?.isBottomHalfDesignerElement;

      const droppingSidebarBtnOverDesignerElement =
        (isDroppingOverTopHalfDesignerElement ||
          isDroppingOverBottomHalfDesignerElement) &&
        active.data?.current?.isDesignerBtnElement;
      console.log(
        "isDroppingOverTopHalfDesignerElement",
        isDroppingOverTopHalfDesignerElement
      );
      console.log(
        "isDroppingOverBottomHalfDesignerElement",
        isDroppingOverBottomHalfDesignerElement
      );
      console.log(
        "active.data?.current?.isSidebarBtnElement",
        active.data?.current?.isDesignerBtnElement
      );
      console.log(
        "droppingSidebarBtnOverDesignerElement",
        droppingSidebarBtnOverDesignerElement
      );
      if (droppingSidebarBtnOverDesignerElement) {
        console.log("running 2nd scenario");
        const type = active.data?.current?.type as ElementsType;
        const overId = over.data?.current?.elementId;
        const newElement = FormElements[type].construct(idGenerator());
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (overElementIndex === -1) {
          throw new Error("Element not found");
        }
        let indexForNewElement = overElementIndex;

        if (isDroppingOverBottomHalfDesignerElement)
          indexForNewElement = overElementIndex + 1;
        addElement(indexForNewElement, newElement);
        return;
      }

      //Third scenario: dropping a designer element over a designer element

      console.log("isDragginDesignerElement", isDragginDesignerElement);

      const isDroppingOverDesignerElement =
        isDroppingOverTopHalfDesignerElement ||
        isDroppingOverBottomHalfDesignerElement;

      console.log(
        "isDroppingOverDesignerElement",
        isDroppingOverDesignerElement
      );
      const draggingDesignerElementOverDesignerElement =
        isDroppingOverDesignerElement && isDragginDesignerElement;
      console.log(
        "draggingDesignerElementOverDesignerElement",
        draggingDesignerElementOverDesignerElement
      );
      console.log("running first scenario");

      if (draggingDesignerElementOverDesignerElement) {
        const activeId = active.data.current?.elementId;
        const overId = over.data?.current?.elementId;
        console.log(
          "draggingDesignerElementOverDesignerElement",
          draggingDesignerElementOverDesignerElement
        );
        const activeElementIndex = elements.findIndex(
          (el) => el.id === activeId
        );
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("Element not found");
        }
        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);
        let indexForNewElement = overElementIndex;
        console.log("indexForNewElement", indexForNewElement);

        if (isDroppingOverBottomHalfDesignerElement)
          indexForNewElement = overElementIndex + 1;
        addElement(indexForNewElement, activeElement);
      }
    },
  });

  return (
    <div className="flex w-full h-full">
      <div
        className="p-4 w-full"
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
            droppable.isOver && "ring-2 ring-primary/20"
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
              Drop here
            </p>
          )}
          {droppable.isOver && elements.length === 0 && (
            <div className="p-4 w-full">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}
          {elements.length > 0 && (
            <div className="flex flex-col  w-full gap-2 p-4">
              {elements.map((element) => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
};

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  const { removeElement, selectedElement, setSelectedElement } = useDesigner();
  const [isMousedOver, setIsMousedOver] = useState(false);

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });
  if (draggable.isDragging) return null;
  const DesignerElement = FormElements[element.type].designerComponent;
  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.attributes}
      {...draggable.listeners}
      className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      onMouseEnter={() => setIsMousedOver(true)}
      onMouseLeave={() => setIsMousedOver(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
    >
      <div
        ref={topHalf.setNodeRef}
        className={"absolute h-1/2  w-full top-0 rounded-t-md"}
      ></div>
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute h-1/2  w-full bottom-0 rounded-b-md"
      ></div>

      {isMousedOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button
              className="h-full border bg-red-500 rounded-l-none flex justify-center z-20"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();

                return removeElement(element.id);
              }}
            >
              <BiSolidTrash className="h-6 w-6" />
            </Button>
          </div>
          <div
            className={
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
            }
          >
            <p className="text-muted-foreground text-sm">
              Click to properties or drag to move
            </p>
          </div>
        </>
      )}
      {topHalf.isOver && (
        <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none"></div>
      )}
      {bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none"></div>
      )}
      <div
        className={cn(
          "flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100",
          isMousedOver && "opacity-30"
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
    </div>
  );
}

export default Designer;
