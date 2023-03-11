import React, { ReactNode } from "react";
import { Icon, People } from "react-bootstrap-icons";
import { twMerge } from "tailwind-merge";

type Props = {
  children?: ReactNode;
  title?: ReactNode;
  icon?: Icon;
  className?: string
  titleClassName?: string
  iconClassName?: string
}

const BoxGroup = ({ children, title, icon: Icon, className, titleClassName, iconClassName }: Props) => (
  <div className={twMerge("border-l-2 border-l-gray-500 ml-1 pl-2", className)}>
    <h3 className={twMerge("flex items-center gap-1 font-medium mb-1", titleClassName)}>{Icon && <Icon className={iconClassName} />} {title}</h3>
    {children}
  </div>
)

export default BoxGroup;
