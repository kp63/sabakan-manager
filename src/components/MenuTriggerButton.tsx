import { Menu, Transition } from "@headlessui/react";
import React, { AnchorHTMLAttributes, forwardRef, ReactNode } from "react";
import Link from "next/link";
import { UrlObject } from "url";
import clsx from "clsx";
import { Icon, IconProps } from "react-bootstrap-icons";

type C = string | ReactNode | ((args: {
  active: boolean;
  disabled: boolean;
}) => string | ReactNode);

export type MenuItem = {
  type?: 'sep';
  title?: string;
  label?: C;
  icon?: Icon;
  onClick?: () => void;
  href?: string | UrlObject;
  disabled?: boolean;
  variant?: keyof typeof variants;
}

const variants = {
  primary: ['text-gray-900 dark:text-white', 'bg-blue-500 text-white'],
  danger: ['text-red-500', 'bg-red-500/30 text-red-600 dark:text-red-400'],
  warning: ['text-yellow-500', 'bg-yellow-500/30 text-yellow-400']
} as const;

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  items: MenuItem[];
  openedClassName?: string;
}

const MenuTriggerButton = ({ items, children, className, openedClassName, ...props }: Props) => {
  return (
    <Menu as="div" className="relative text-left z-20 select-none">
      <Menu.Button as={"div"}>
        {({ open }) => (
          <button className={clsx(className, open && openedClassName)} {...props}>
            {children}
          </button>
        )}
      </Menu.Button>
      <MenuItems items={items} />
    </Menu>
  )
}

export const MenuItems = ({ items, backdrop, ...props }: { items: MenuItem[], static?: boolean, backdrop?: boolean }) => {
  return (
    <Transition
      show={props.static}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items static={props.static} className={'absolute right-0 mt-2 w-56 origin-top-right' +
        ' divide-y divide-gray-100 rounded-md' +
        ' bg-white shadow-lg ring-1 ring-black ring-opacity-5' +
        ' dark:bg-gray-700 dark:shadow-xl' +
        ' focus:outline-none text-sm z-45'}>
        <div className="px-1 py-1">
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
                  <Menu.Item key={index}>
                    {(args) => (
                      <Link key={index}
                            href={item.href as (string | UrlObject)}
                            className={`${
                              variants[item.variant ?? 'primary'][args.active ? 1 : 0]
                            } group flex w-full items-center rounded-md px-3 py-2 text-sm`}>
                        {item?.icon && (
                          <span className="w-[24px]">
                            <Icon size={16} />
                        </span>
                        )}
                        {typeof item?.label === "function" ? item.label(args) : item.label}
                      </Link>
                    )}
                  </Menu.Item>
                )
              }

              return (
                <Menu.Item key={index}>
                  {(args) => (
                    <button key={index}
                            disabled={item.disabled}
                            onClick={item.onClick}
                            className={`${
                              variants[item.variant ?? 'primary'][args.active ? 1 : 0]
                            } group flex w-full items-center rounded-md px-3 py-2 text-sm`}
                    >
                      {item?.icon && (
                        <span className="w-[24px]">
                            <Icon size={16} />
                        </span>
                      )}
                      {typeof item?.label === "function" ? item.label(args) : item.label}
                    </button>
                  )}
                </Menu.Item>
              )
            }

            return <React.Fragment key={index} />
          })}
        </div>
      </Menu.Items>
    </Transition>
  )
}

export default MenuTriggerButton
