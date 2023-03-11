import { List, ListItem } from "@/components/List";
import React from "react";
import usePing from "@/hooks/usePing";
import { People } from "react-bootstrap-icons";

import BoxGroup from "@/components/BoxGroup";
import PlayerListItem from "@/features/dashboard/atoms/PlayerListItem";

const OnlinePlayers = () => {
  const { data: ping } = usePing();

  if (!ping || !ping.isOnline) return <React.Fragment />

  return (
    <BoxGroup title="Online Players" icon={People}>
      {ping.data.players.list?.length ? (
        <List>
          {ping.data.players.list.map((player) => (
            <PlayerListItem player={player} key={player.id} />
          ))}
        </List>
      ) : (
        <div className="flex py-10 text-gray-400 justify-center bg-white dark:bg-[#282c34] rounded border border-gray-400 dark:border-gray-700">
          オンラインのプレイヤーは居ません
        </div>
      )}
    </BoxGroup>
  )
}

export default OnlinePlayers;
