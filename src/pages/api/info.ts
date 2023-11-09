import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import ServerProperties from "@/types/ServerProperties";
import {
  BannedIP,
  BannedPlayer, ConfigPlayer,
  isBannedIPObjectList,
  isBannedPlayerObjectList, isConfigPlayerList,
} from "@/types/Player";
import {
  getServerBukkitConfig,
  getServerProperties,
  config,
  parseJsonFile,
  parseYamlFile
} from "@/utils/serverside";
import ServerBukkitConfig from "@/types/ServerBukkitConfig";
import ServerSpigotConfig from "@/types/ServerSpigotConfig";
import os from "os";

export type ServerInfoResponse = {
  properties: Partial<ServerProperties> | null;
  bukkit: Partial<ServerBukkitConfig> | null;
  spigot: Partial<ServerSpigotConfig> | null;
  ops: ConfigPlayer[] | null;
  whitelist: ConfigPlayer[] | null;
  bannedPlayers: BannedPlayer[] | null;
  bannedIps: BannedIP[] | null;
  [key: string]: any;
}

export type ServerInfoErrorResponse = {
  message: 'Server not found.'
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ServerInfoResponse | ServerInfoErrorResponse>) => {
  if (!fs.existsSync(`${config.server.dataPath}/server.properties`)) {
    if (process.env.DEBUG) {
      return res.status(404).json({
        message: 'Server not found.',
        details: `File "${config.server.dataPath}/server.properties" not found`,
        runner: os.userInfo().username,
      })
    }
    return res.status(404).json({
      message: 'Server not found.',
    })
  }

  const properties = getServerProperties(config.server.dataPath);

  const ops = parseJsonFile(`${config.server.dataPath}/ops.json`);
  const bannedPlayers = parseJsonFile(`${config.server.dataPath}/banned-players.json`);
  const bannedIps = parseJsonFile(`${config.server.dataPath}/banned-ips.json`);
  const whitelist = parseJsonFile(`${config.server.dataPath}/whitelist.json`);

  const bukkit = getServerBukkitConfig(config.server.dataPath);
  const spigot = parseYamlFile(`${config.server.dataPath}/spigot.yml`);

  res.status(200).json({
    properties,
    bukkit,
    ops: isConfigPlayerList(ops) ? ops : [],
    bannedPlayers: isBannedPlayerObjectList(bannedPlayers) ? bannedPlayers : [],
    bannedIps: isBannedIPObjectList(bannedIps) ? bannedIps : [],
    whitelist,
    spigot,
  })
}

export default handler
