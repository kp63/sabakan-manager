import React from "react";
import Operators from "@/features/dashboard/Players/Operators";
import OnlinePlayers from "@/features/dashboard/Players/OnlinePlayers";
import Whitelist from "@/features/dashboard/Players/Whitelist";
import BannedPlayers from "@/features/dashboard/Players/BannedPlayers";

const Players = () => (
  <div className="flex flex-col gap-3">
    <OnlinePlayers />
    <Operators />
    <Whitelist />
    <BannedPlayers />
  </div>
)

export default Players;
