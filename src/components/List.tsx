import React, { forwardRef } from "react";
import { twMerge } from 'tailwind-merge';

export const List = ({ className, children, ...props }: React.HTMLAttributes<HTMLUListElement>) => children ? (
  <ul className={twMerge("bg-gray-50 border-gray-300 border dark:bg-gray-700 dark:border-gray-600 rounded shadow", className)} {...props}>{children}</ul>
) : <React.Fragment />

// eslint-disable-next-line react/display-name
export const ListItem = forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(({ className, children, ...props }, ref) => (
  <li ref={ref} className={twMerge("flex items-center px-2.5 py-1.5 gap-1.5 border-b last:border-b-0 border-b-gray-200 dark:border-b-gray-600", className)} {...props}>{children}</li>
))
// eslint-disable-next-line react/display-name
export const ButtonListItem = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, children, ...props }, ref) => (
  <li className="flex border-b last:border-b-0 border-b-gray-200 dark:border-b-gray-600">
    <button className={twMerge("flex items-center px-2.5 py-1.5 gap-1.5", className)} {...props} ref={ref}>{children}</button>
  </li>
))
