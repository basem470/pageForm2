import React from "react";
import { FormElementInstance, FormElements } from "./FormElements";
import SidebarBtnElement from "./SidebarBtnElement";
import { Separator } from "./ui/separator";

const FormElementsSidebar = () => {
  return (
    <div>
      <p className="text-sm text-foreground/70">Drage and drop elements</p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center">
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
          Layout Elements
        </p>
        <SidebarBtnElement fromElement={FormElements.TitleField} />
        <SidebarBtnElement fromElement={FormElements.SubtitleField} />
        <SidebarBtnElement fromElement={FormElements.ParagraphField} />
        <SidebarBtnElement fromElement={FormElements.SeparatorField} />
        <SidebarBtnElement fromElement={FormElements.SpacerField} />
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
          Form Elements
        </p>
        <SidebarBtnElement fromElement={FormElements.TextField} />
        <SidebarBtnElement fromElement={FormElements.NumberField} />
        <SidebarBtnElement fromElement={FormElements.TextAreaField} />
        <SidebarBtnElement fromElement={FormElements.DateField} />
        <SidebarBtnElement fromElement={FormElements.SelectField} />
        <SidebarBtnElement fromElement={FormElements.CheckboxField} />
      </div>
    </div>
  );
};

export default FormElementsSidebar;
