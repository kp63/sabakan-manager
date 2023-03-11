import { NextApiRequest, NextApiResponse } from "next";
import { FullQueryResponse, JavaStatusResponse, queryFull, QueryOptions, status } from "minecraft-server-util";
import { isPlayer, Player } from "@/types/Player";
import { Simulate } from "react-dom/test-utils";
import { config, getServerInspect, ServerInspectReturn } from "@/utils/serverside";

const options: QueryOptions = {
  sessionID: 1, // a random 32-bit signed number, optional
  enableSRV: true, // SRV record lookup
  timeout: 1000
};

type BaseData = {
  version: `${number}`;
  players: {
    online: number;
    max: number;
    list: Player[];
  }
  motd: string;
  motd_raw: string;
}

export type ServerPingResponseData = BaseData & {
  protocol_version: number;
  favicon: string | null;
  latency: number;
}

export type ServerQueryResponseData = BaseData & {
  plugins: string[]
  world: string;
}


export type ServerPingResponse = {
  isOnline: false;
  status: 'offline';
  inspect?: ServerInspectReturn;
  message: string;
} | {
  isOnline: true;
  status: 'online';
  mode: 'ping';
  inspect?: ServerInspectReturn;
  data: ServerPingResponseData;
  raw_data: JavaStatusResponse;
} | {
  isOnline: true;
  status: 'online';
  mode: 'query';
  inspect?: ServerInspectReturn;
  data: ServerQueryResponseData;
  raw_data: FullQueryResponse;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ServerPingResponse>) => {
  const inspect = getServerInspect();

  try {
    const data = await queryFull(config.server.host, config.server.port, options);

    res.status(200).json({
      isOnline: true,
      status: 'online',
      mode: 'query',
      inspect: inspect ?? undefined,
      data: {
        version: data.version as `${number}`,
        players: {
          online: data.players.online,
          max: data.players.max,
          list: sortPlayersList(data.players.list)
        },
        motd: data.motd.clean,
        motd_raw: data.motd.raw,
        plugins: data.plugins,
        world: data.map,
      },
      raw_data: data,
    })
  } catch (e: any) {
    try {
      const data = await status(config.server.host, config.server.port, options);

      res.status(200).json({
        isOnline: true,
        status: 'online',
        inspect: inspect ?? undefined,
        mode: 'ping',
        data: {
          version: data.version.name as `${number}`,
          protocol_version: data.version.protocol as number,
          players: {
            online: data.players.online,
            max: data.players.max,
            list: sortPlayersList(data.players.sample)
          },
          motd: data.motd.clean,
          motd_raw: data.motd.raw,
          favicon: data.favicon,
          latency: data.roundTripLatency,
        },
        raw_data: data,
      })
    } catch (e: any) {
      res.status(200).json({
        isOnline: false,
        status: 'offline',
        inspect: inspect ?? undefined,
        message: e.message
      })
    }
  }
}

const filterPlayerList = (players: any[]): Player[] => {
  const filteredPlayers: Player[] = [];
  for (const key in players) {
    const player = players[key];

    if (isPlayer(player)) {
      filteredPlayers.push(player)
    } else if (typeof player === "object") {
      if (player?.id && player?.name) {
        filteredPlayers.push({
          id: player.id,
          name: player.name,
        })
      }
    }
  }

  return filteredPlayers;
}

const sortPlayersList = (players: any): Player[] => {
  if (typeof players !== "object") return [];

  players = filterPlayerList(players);

  const filtered: Player[] = players?.filter((player: unknown) => isPlayer(player)) || [];

  return filtered ? filtered.sort((a, b) => a.name.localeCompare(b.name)) : [];
}

export default handler
