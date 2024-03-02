"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { FormElementInstance } from "../FormElements";

type DesignerContextType = {
  elements: FormElementInstance[];
  setElements: Dispatch<SetStateAction<FormElementInstance[]>>;
  addElement: (index: number, element: FormElementInstance) => void;
  removeElement: (id: string) => void;
  selectedElement: FormElementInstance | null;
  updateElement: (id: string, element: FormElementInstance) => void;
  setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);
export default function DesignerContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance | null>(null);
  const [elements, setElements] = useState<FormElementInstance[]>([]);

  const addElement = (index: number, element: FormElementInstance) => {
    setElements((prev) => {
      const elements = [...prev];
      elements.splice(index, 0, element);
      return elements;
    });
  };
  const updateElement = (id: string, element: FormElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      const index = newElements.findIndex((el) => el.id === id);
      newElements[index] = element;
      return newElements;
    });
  };
  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };
  return (
    <DesignerContext.Provider
      value={{
        elements,
        setElements,
        updateElement,
        addElement,
        removeElement,
        selectedElement,
        setSelectedElement,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}
