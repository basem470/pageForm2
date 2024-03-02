"use client";

import { HiCursorClick } from "react-icons/hi";
import { FormElementInstance, FormElements } from "./FormElements";
import { Button } from "./ui/button";
import { useCallback, useRef, useState, useTransition } from "react";
import { toast } from "./ui/use-toast";
import { isValid } from "date-fns";
import { ImSpinner2 } from "react-icons/im";
import { SubmitForm } from "@/actions/form";

export default function FormSubmitComponent({
  formUrl,
  content,
}: {
  formUrl: string;
  content: FormElementInstance[];
}) {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || "";
      const isValid = FormElements[field.type].validate(field, actualValue);
      console.log(isValid);
      if (!isValid) {
        formErrors.current[field.id] = true;
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }
    return true;
  }, [content]);
  const submitValue = (key: string, value: string) => {
    formValues.current[key] = value;
  };

  const submitForm = async () => {
    formErrors.current = {};
    const validForm = validateForm();
    if (!validForm) {
      setRenderKey(new Date().getTime());
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      console.log("the form is not valid");
      return;
    }
    try {
      console.log("the form is valid, submitting!");

      const jsonContent = JSON.stringify(formValues.current);
      await SubmitForm(formUrl, jsonContent);
      setSubmitted(true);
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
    console.log(formValues.current);
  };

  if (submitted)
    return (
      <div className="flex justify-center w-full h-full items-center p-8">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
          <h1 className="text-2xl  font-bold">Form submitted!</h1>
          <p className="text-muted-foreground">
            Thank you for submitting, you can close this page now
          </p>
        </div>
      </div>
    );
  return (
    <div className="flex justify-center w-full h-full items-center p-8">
      <div
        key={renderKey}
        className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded"
      >
        {content.map((el) => {
          const FormElement = FormElements[el.type].formPreviewComponent;
          return (
            <FormElement
              key={el.id}
              elementInstance={el}
              submitValue={submitValue}
              isInvalid={formErrors.current[el.id]}
              defaultValue={formValues.current[el.id]}
            />
          );
        })}
        <Button
          className="mt-8"
          disabled={pending}
          onClick={() => {
            startTransition(submitForm);
          }}
        >
          {!pending && (
            <>
              <HiCursorClick className="mr-2" />
              Submit
            </>
          )}
          {pending && <ImSpinner2 className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
