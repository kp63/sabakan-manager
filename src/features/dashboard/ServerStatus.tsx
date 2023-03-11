import { List, ListItem } from "@/components/List";
import React from "react";
import usePing from "@/hooks/usePing";
import BoxGroup from "@/components/BoxGroup";
import { HddNetwork } from "react-bootstrap-icons";

const ServerStatus = () => {
  const { data: ping } = usePing();

  if (!ping || ping.status !== "online") return <React.Fragment />

  return (
    <BoxGroup title="Server Status" icon={HddNetwork}>
      <List>
        <ListItem><b>MOTD</b>{ping.data.motd}</ListItem>
        <ListItem><b>バージョン</b>{ping.data.version}</ListItem>
        {ping.mode === 'query' && (
          <>
            <ListItem><b>マップ</b>{ping.data.world}</ListItem>
            <ListItem><b>プラグイン</b>{ping.data.plugins.join(', ')}</ListItem>
          </>
        )}
        <ListItem><b>プレイヤー数</b>{ping.data.players.online} / {ping.data.players.max}</ListItem>
      </List>
    </BoxGroup>
  )
}

export default ServerStatus;
