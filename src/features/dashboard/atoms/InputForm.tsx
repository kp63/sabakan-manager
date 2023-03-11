import { ListItem } from "@/components/List";
import Input from "@/components/Input";
import Button from "@/components/Button";
import React, { forwardRef, HTMLProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  prefixAddon?: ReactNode;
  submitText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

// eslint-disable-next-line react/display-name
const InputForm = forwardRef<HTMLInputElement, Props>(({ className, disabled, readOnly, prefixAddon, submitText, ...props }: Props, ref) => {
  return (
    <ListItem className="bg-gray-200 dark:bg-gray-800 rounded-b items-stretch p-1 gap-0">
      {prefixAddon && (
        <span className="flex items-center rounded-l px-2.5 bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 border-r-0">{prefixAddon}</span>
      )}
      <Input ref={ref} readOnly={disabled} {...props} className={twMerge(`rounded-none flex-1${!prefixAddon ? " rounded-l-md" : ""}`, className)} />
      <Button type="submit" className="rounded-l-none" disabled={disabled}>{submitText ?? "Submit"}</Button>
    </ListItem>
  )
})

export default InputForm;
