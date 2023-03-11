import React, { Fragment, ReactNode } from "react";
import ManagerLayout from "@/components/layouts/ManagerLayout";
import usePing from "@/hooks/usePing";
import useServerInfo from "@/hooks/useServerInfo";
import Preferences from "@/features/dashboard/Preferences";
import Dashboard from "@/features/dashboard/Dashboard";
import Logs from "@/features/dashboard/Logs";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { Gear, Icon, Newspaper, PeopleFill, Speedometer2 } from "react-bootstrap-icons";
import { atom, useAtom } from "jotai";
import Players from "@/features/dashboard/Players";
import { GetServerSideProps } from "next";
import { config } from "@/utils/serverside";
import { getCsrfToken } from "next-auth/react";

type Tabs<T extends string = string> = {
  [key in T]: {
    icon?: Icon;
    label: ReactNode;
    render: (() => JSX.Element) | ReactNode;
  }
};

const tabs: Tabs = {
  dashboard: {
    icon: Speedometer2,
    label: "Dashboard",
    render: Dashboard
  },
  preferences: {
    icon: Gear,
    label: "Preferences",
    render: Preferences
  },
  players: {
    icon: PeopleFill,
    label: "Players",
    render: Players
  },
  logs: {
    icon: Newspaper,
    label: "Logs",
    render: Logs
  }
}

export const currentTabAtom = atom<keyof typeof tabs>("dashboard");

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      panelName: config.panelName,
    },
  }
}

export default function Page({ panelName }: { panelName: string }) {
  const [currentTab, setCurrentTab] = useAtom(currentTabAtom);
  const { data: ping, error: pingError } = usePing();
  const { data: info, error: infoError } = useServerInfo();

  if (pingError || infoError || !ping || !info) {
    return <ManagerLayout panelName={panelName} />
  }

  return (
    <ManagerLayout panelName={panelName}>
      <Tab.Group>
        <div className="flex space-x-1 rounded-t-xl bg-gray-700/10 dark:bg-gray-700/40 p-1">
          {Object.keys(tabs).map((key) => {
            const { label, icon: Icon } = tabs[key];
            const selected = key === currentTab;

            return (
              <button
                key={key}
                onClick={() => setCurrentTab(key)}
                className={clsx(
                  'flex justify-center items-center gap-1 w-full rounded-lg py-2 text-sm font-medium text-gray-700',
                  'ring-gray-400/60 dark:ring-gray-200/60 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'hover:bg-white/[0.12] text-gray-700 hover:text-gray-500 dark:text-blue-100 dark:hover:text-white'
                )}>
                {Icon && <Icon />}
                {label}
              </button>
            )
          })}
        </div>
        <div className="rounded-b-xl border-t dark:border-t-gray-700 bg-gray-700/10 dark:bg-gray-700/40 p-2">
          {currentTab && (() => {
            const { render: Render } = tabs[currentTab];

            if (typeof Render === "undefined") {
              return <Fragment />
            }

            return typeof Render === "function" ? <Render /> : Render;
          })()}
        </div>
      </Tab.Group>
    </ManagerLayout>
  )
}
