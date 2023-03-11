import { twMerge } from "tailwind-merge";
import React, { ForwardedRef, forwardRef } from "react";

type Props = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

const variants = {
  empty: '',
  plain: `text-white bg-gray-500 hover:bg-gray-500/80 focus:active:bg-gray-600 focus:ring-gray-400`,
  primary: `text-white bg-blue-500 hover:bg-blue-500/80 focus:active:bg-blue-600 focus:ring-blue-400`,
  warning: 'text-white bg-yellow-500 hover:bg-yellow-500/80 focus:active:bg-yellow-600 focus:ring-yellow-400',
  danger: 'text-white bg-red-500/80 hover:bg-red-500/60 focus:active:bg-red-600/80 focus:ring-red-400',
}

const sizes = {
  sm: `px-1.5 py-1 text-sm`,
  normal: 'px-3 py-2',
  lg: 'px-3 py-2',
}

// eslint-disable-next-line react/display-name
const Button = forwardRef(({ size = 'normal', children, className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & Props, ref: ForwardedRef<HTMLButtonElement>) => (
  <button className={twMerge(
    sizes[size],
    'border border-transparent' +
    ' flex items-center justify-center text-center font-medium rounded-md' +
    ' focus:z-10 focus:ring-2 outline-none',
    variants[variant], className)} {...props} ref={ref}>{children}</button>
))

export default Button
