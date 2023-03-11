import React from "react";
import { List, ListItem } from "@/components/List";
import useServerInfo from "@/hooks/useServerInfo";
import PlayerListItem from "@/features/dashboard/atoms/PlayerListItem";
import { PersonCheck } from "react-bootstrap-icons";
import BoxGroup from "@/components/BoxGroup";
import PlayerControlForm from "@/features/dashboard/atoms/PlayerControlForm";

const Whitelist = () => {
  const { data: info } = useServerInfo();

  if (!info?.ops) return <React.Fragment />

  return (
    <BoxGroup title="Whitelist" icon={PersonCheck}>
      <List>
        {info.whitelist?.length ? (
          info.whitelist.map((player) => (
            <PlayerListItem player={player} key={player.uuid} />
          ))
        ) : (
          <ListItem className="py-10 text-gray-400 justify-center bg-white dark:bg-[#282c34] rounded-t">
            ホワイトリストは空です
          </ListItem>
        )}

        <li className="p-0.5 rounded-b bg-gray-300 dark:bg-gray-700">
          <PlayerControlForm type="whitelist add" />
        </li>
      </List>
    </BoxGroup>
  )
}

export default Whitelist
