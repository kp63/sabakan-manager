import React, { ForwardedRef, forwardRef } from "react";
import clsx from "clsx";
import { Label } from "flowbite-react";
import { twMerge } from "tailwind-merge";

type Props = React.InputHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

// eslint-disable-next-line react/display-name
const Select = forwardRef(
  ({ className, label, children, ...props }: Props, ref: ForwardedRef<HTMLSelectElement>) => (
    label ? (
      <label>
        <span className="block text-sm font-medium text-gray-900 dark:text-gray-300 pb-1">{label}</span>
        <select className={twMerge(
          'px-3 py-2 rounded border border-gray-300 dark:bg-[#1a1e24] dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:!border-blue-500 outline-none transition',
          className
        )} {...props} ref={ref}>{children}</select>
      </label>
    ) : (
      <select className={twMerge(
        'pl-3 py-2 rounded border border-gray-300 dark:bg-[#1a1e24] dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:!border-blue-500 outline-none transition',
        className
      )} {...props} ref={ref}>{children}</select>
    )
  )
)

export default Select
