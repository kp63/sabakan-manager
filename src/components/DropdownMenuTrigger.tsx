import React, { KeyboardEvent, ReactNode, useMemo } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from "clsx";
import { Icon, IconProps } from "react-bootstrap-icons";
import { UrlObject } from "url";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListItem } from "@/components/List";
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
  plain: "",
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

  let previewType: string | undefined = undefined;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={className}>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="start" side="right" alignOffset={-6} onContextMenu={handleContextMenu} className={clsx(
          "flex flex-col text-left select-none focus:outline-none text-sm z-45 animate-[menuFadeIn_.12s_ease-out]",
          "py-1 m-2",
          "bg-white shadow-lg ring-1 ring-black/20",
          "dark:bg-gray-700 dark:shadow-xl rounded w-56",
        )}>
          {items.map((item, index) => {

            if (item?.type === 'sep') {
              if (items.length === 0) return undefined;
              if (index === items.length - 1) return undefined;
              if (previewType === 'sep') return undefined;
              previewType = item?.type;

              return <hr key={index} className="my-1 dark:border-t-gray-600" />
            }

            previewType = item?.type;

            if (item?.title) {
              return <div key={index} className="text-gray-600 dark:text-gray-300 text-sm ml-1 px-2 py-1.5">{item.title}</div>
            }

            if (item?.label) {
              const Icon = item?.icon ?? ((props: IconProps) => <React.Fragment />);
              if (typeof item.href !== "undefined") {
                return (
                  <DropdownMenu.Item key={index} asChild>
                    <Link href={item.href}
                          data-key={index}
                          className={clsx(
                            buttonCommonStyle,
                            variants[item.variant ?? 'primary'],
                            "py-1.5"
                          )}
                    >
                      <div className="flex items-center">
                        {item?.icon && <span className="w-[24px]"><Icon size={16} /></span>}
                        {item.label}
                      </div>

                      {/*{item.shortcutKey && (*/}
                      {/*  <span className="text-xs text-gray-500 dark:text-gray-300">{item.shortcutKey}</span>*/}
                      {/*)}*/}
                    </Link>
                  </DropdownMenu.Item>
                )
              }

              return (
                <DropdownMenu.Item key={index}
                                  data-key={index}
                                  disabled={item.disabled}
                                  onClick={item.onClick}
                                  className={clsx(
                                    buttonCommonStyle,
                                    variants[item.variant ?? 'primary'],
                                    "cursor-pointer py-1.5",
                                  )}
                >
                  <div className="flex items-center">
                    {item?.icon && <span className="w-[24px]"><Icon size={16} /></span>}
                    {item.label}
                  </div>

                  {/*{item.shortcutKey && (*/}
                  {/*  <span className="text-xs text-gray-500 dark:text-gray-300">{item.shortcutKey}</span>*/}
                  {/*)}*/}
                </DropdownMenu.Item>
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
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ContextMenuTrigger;
