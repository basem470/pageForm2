"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuHeading1, LuHeading2 } from "react-icons/lu";
import { z } from "zod";
import {
  ElementsType,
  FormElementInstance,
  FormElementType,
} from "../FormElements";
import useDesigner from "../hooks/useDesigner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const extraAttributes = {
  subtitle: "Subtitle Field",
};

const propertiesSchema = z.object({
  subtitle: z.string().min(2).max(20),
});

const type: ElementsType = "SubtitleField";

export const SubtitleFieldFormElement: FormElementType = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes: {
      subtitle: "Subtitle Field",
    },
  }),
  designerBtnElement: {
    icon: LuHeading2,
    label: "Subtitle Field",
  },

  designerComponent: DesignerComponent,
  formPreviewComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (): boolean => true,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};
type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { subtitle } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Subtitle Field</Label>
      <p className="text-lg">{subtitle}</p>
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;

  const { subtitle } = element.extraAttributes;
  return <p className="text-lg">{subtitle}</p>;
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      subtitle: element.extraAttributes.subtitle,
    },
  });
  console.log("element", element.extraAttributes);
  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { subtitle } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        subtitle,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
