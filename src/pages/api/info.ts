import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import _path from "path";
import ServerProperties from "@/types/ServerProperties";
import {
  BannedIP,
  BannedPlayer, ConfigPlayer,
  isBannedIPObjectList,
  isBannedPlayerObjectList, isConfigPlayerList,
  isPlayerList,
  Player
} from "@/types/Player";
import {
  getServerBukkitConfig,
  getServerProperties,
  parseIniFile,
  config,
  parseJsonFile,
  parseYamlFile
} from "@/utils/serverside";
import ServerBukkitConfig from "@/types/ServerBukkitConfig";
import ServerSpigotConfig from "@/types/ServerSpigotConfig";

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

const baseDir = _path.resolve(config.server.basePath);
const dataDir = _path.join(baseDir, 'data');

const handler = async (req: NextApiRequest, res: NextApiResponse<ServerInfoResponse | ServerInfoErrorResponse>) => {
  if (!fs.existsSync(`${dataDir}/server.properties`)) {
    res.status(404).json({
      message: 'Server not found.',
    })
  }

  const properties = getServerProperties(dataDir);

  const ops = parseJsonFile(`${dataDir}/ops.json`);
  const bannedPlayers = parseJsonFile(`${dataDir}/banned-players.json`);
  const bannedIps = parseJsonFile(`${dataDir}/banned-ips.json`);
  const whitelist = parseJsonFile(`${dataDir}/whitelist.json`);

  const bukkit = getServerBukkitConfig(dataDir);
  const spigot = parseYamlFile(`${dataDir}/spigot.yml`);

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

const readFileSync = (path: string, fallback: any = null) =>
  fs.existsSync(path) ? fs.readFileSync(path, 'utf-8') : fallback

export default handler
