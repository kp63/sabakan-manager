import React, { ForwardedRef, forwardRef } from "react";
import clsx from "clsx";
import { Label } from "flowbite-react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

// eslint-disable-next-line react/display-name
const Input = forwardRef(
  ({ className, label, ...props }: Props, ref: ForwardedRef<HTMLInputElement>) => (
    label ? (
      <label>
        <span className="block text-sm font-medium text-gray-900 dark:text-gray-300 pb-1">{label}</span>
        <input className={clsx(
          'px-3 py-2 rounded border border-gray-300 dark:bg-[#1a1e24] dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:!border-blue-500 outline-none transition',
          className
        )} {...props} ref={ref} />
      </label>
    ) : (
      <input className={clsx(
        'px-3 py-2 rounded border border-gray-300 dark:bg-[#1a1e24] dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:!border-blue-500 outline-none transition',
        className
      )} {...props} ref={ref} />
    )
  )
)

export default Input
