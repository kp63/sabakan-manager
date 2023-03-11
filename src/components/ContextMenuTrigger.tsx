import React, { KeyboardEvent, ReactNode, useMemo } from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import clsx from "clsx";
import { Icon, IconProps } from "react-bootstrap-icons";
import { UrlObject } from "url";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { DotFilledIcon, CheckIcon, ChevronRightIcon } from '@radix-ui/react-icons';

export type MenuItem = {
  type?: 'sep';
  title?: string;
  label?: ReactNode;
  icon?: Icon;
  onClick?: () => void;
  href?: string | UrlObject;
  disabled?: boolean;
  variant?: keyof typeof variants;
  shortcutKey?: string;
}

const buttonCommonStyle = "flex justify-between items-center w-full px-3 text-sm outline-none";
const variants = {
  primary: "text-gray-900 dark:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white",
  danger: "text-red-500 data-[highlighted]:bg-red-500/30 data-[highlighted]:text-red-600 data-[highlighted]:dark:text-red-400",
  warning: "text-yellow-500 data-[highlighted]:bg-yellow-500/30 data-[highlighted]:text-yellow-400"
} as const;

type Props = {
  items: MenuItem[];
  openedClassName?: string;
  children: ReactNode;
  className?: string;
}

const ContextMenuTrigger = ({ children, className, items }: Props) => {
  const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();

  if (!items?.length) {
    return <div className={className}>{children}</div>;
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className={className}>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content alignOffset={-6} data-align="center" onContextMenu={handleContextMenu} className={clsx(
          "flex flex-col text-left select-none focus:outline-none text-sm z-45",
          "py-0.5 px-0.5",
          "bg-white shadow-lg ring-1 ring-black/20",
          "dark:bg-gray-700 dark:shadow-xl rounded-md w-56",
        )}>
          {items.map((item, index) => {

            if (item?.type === 'sep') {
              return <hr key={index} className="my-1 dark:border-t-gray-600" />
            }

            if (item?.title) {
              return <div key={index} className="text-gray-600 dark:text-gray-300 text-sm ml-1 p-2">{item.title}</div>
            }

            if (item?.label) {
              const Icon = item?.icon ?? ((props: IconProps) => <React.Fragment />);
              if (typeof item.href !== "undefined") {
                return (
                  <ContextMenu.Item key={index} asChild>
                    <Link href={item.href}
                          data-key={index}
                          className={clsx(
                            buttonCommonStyle,
                            variants[item.variant ?? 'primary'],
                            "py-2 rounded-md"
                          )}
                    >
                      <div className="flex">
                        {item?.icon && <span className="w-[24px]"><Icon size={16} /></span>}
                        {item.label}
                      </div>

                      {/*{item.shortcutKey && (*/}
                      {/*  <span className="text-xs text-gray-500 dark:text-gray-300">{item.shortcutKey}</span>*/}
                      {/*)}*/}
                    </Link>
                  </ContextMenu.Item>
                )
              }

              return (
                <ContextMenu.Item key={index}
                                  data-key={index}
                                  disabled={item.disabled}
                                  onClick={item.onClick}
                                  className={clsx(
                                    buttonCommonStyle,
                                    variants[item.variant ?? 'primary'],
                                    "cursor-pointer py-2 rounded-md",
                                  )}
                >
                  <div className="flex">
                    {item?.icon && <span className="w-[24px]"><Icon size={16} /></span>}
                    {item.label}
                  </div>

                  {/*{item.shortcutKey && (*/}
                  {/*  <span className="text-xs text-gray-500 dark:text-gray-300">{item.shortcutKey}</span>*/}
                  {/*)}*/}
                </ContextMenu.Item>
              )
            }
          })}
          {/*<ContextMenu.Item className="group flex w-full items-center px-3 py-2 text-sm">*/}
          {/*  Back <div className="RightSlot">⌘+[</div>*/}
          {/*</ContextMenu.Item>*/}
          {/*<ContextMenu.Item className="ContextMenuItem" disabled>*/}
          {/*  Foward <div className="RightSlot">⌘+]</div>*/}
          {/*</ContextMenu.Item>*/}
          {/*<ContextMenu.Item className="ContextMenuItem">*/}
          {/*  Reload <div className="RightSlot">⌘+R</div>*/}
          {/*</ContextMenu.Item>*/}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export default ContextMenuTrigger;
