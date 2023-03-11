import ServerStatus from "@/features/dashboard/ServerStatus";
import OnlinePlayers from "@/features/dashboard/Players/OnlinePlayers";
import SendCommand from "@/features/dashboard/SendCommand";
import React from "react";
import usePing from "@/hooks/usePing";
import { useAtom } from "jotai";
import { currentTabAtom } from "@/pages/dashboard";

const Dashboard = () => {
  const { data: ping } = usePing();
  const [, setCurrentTab] = useAtom(currentTabAtom);
  const goToLogsTab = () => setCurrentTab("logs");

  if (ping?.inspect?.state === "running" && ping.inspect.health !== "healthy") {

    return (
      <div className="items-center text-center text-gray-500 my-14">
        <p>サーバーは起動中です</p>
        <button className="mt-3 px-3 py-1.5 text-gray-700 dark:text-gray-300 underline rounded bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20" onClick={goToLogsTab}>Logsタブに移動</button>
      </div>
    );
  }

  if (!ping?.isOnline) {
    return (
      <div className="text-center my-14 text-gray-500">
        サーバーはオフラインです
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <ServerStatus />
      <OnlinePlayers />
      <SendCommand />
    </div>
  );
}

export default Dashboard;
