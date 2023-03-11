import React, { ForwardedRef, forwardRef } from "react";
import clsx from "clsx";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
};

// eslint-disable-next-line react/display-name
const Checkbox = forwardRef(
  ({ className, label, ...props }: Props, ref: ForwardedRef<HTMLInputElement>) => (
    <label className="flex items-center gap-1">
      <input type="checkbox" id="remember" ref={ref} className={clsx('rounded', className)} {...props} />
      {label && (
        <span className="block text-sm font-medium text-gray-900 dark:text-gray-300">
        {label}
      </span>
      )}
    </label>
  )
)

export default Checkbox
