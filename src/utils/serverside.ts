import camelcaseKeys from "camelcase-keys";
import ini from "ini";
import fs from "fs";
import { isServerPropertiesPartial } from "@/types/ServerProperties";
import { isServerBukkitConfig } from "@/types/ServerBukkitConfig";
import yaml from "js-yaml";
import { QueryOptions, status } from "minecraft-server-util";
import { ConfigPlayer, isConfigPlayer, isPlayer, Player } from "@/types/Player";
import { spawnSync } from "child_process";
import {
  DockerInspectHealthStatuses,
  DockerInspectStateStatuses,
  isDockerInspectHealthStatuses,
  isDockerInspectStateStatuses
} from "@/types/DockerInspect";
import path from "path";
import Config from "@/types/Config";
import configLoader from "@/utils/serverside/configLoader";

const rootDir = path.resolve(`${process.env.ROOT}/../`)

export const configFilePath = fs.realpathSync(path.resolve(`${rootDir}/config.yml`));

const loadConfig = (): Config => {
  let data: any = {};

  try {
    const loaded = yaml.load(fs.readFileSync(configFilePath, "utf-8"));
    if (typeof loaded === "object") {
      data = loaded;
    }
  } catch (e) {}

  const defaultServerBasePath = path.resolve(`${rootDir}/servers/main`);
  let serverBasePath: string = "";
  if (typeof data?.server["base-path"] === "string") {
    const _path = path.resolve(rootDir, data?.server["base-path"]);
    if (fs.existsSync(_path)) {
      serverBasePath = fs.realpathSync(_path);
    } else {
      console.warn(`config.server.basePath is replaced to default directory, because directory "${_path}" hasn't exist.`);
    }
  }

  if (serverBasePath === "") {
    if (!fs.existsSync(defaultServerBasePath)) {
      fs.mkdirSync(defaultServerBasePath, { recursive: true });
    }
    serverBasePath = fs.realpathSync(defaultServerBasePath);
  }

  const login: [string, string] = (typeof data?.login === "string" && data.login.includes(":")) ? data.login.split(":") : ["admin", "sabakan"]

  return {
    panelName: configLoader.string(data["panel-name"]) ?? "Sabakan Manager",
    app: {
      rootDir,
      configFilePath
    },
    features: {
      sendCommand: configLoader.boolean(data?.features['send-command']),
    },
    server: {
      type: "docker", // configLoader.enum(data?.server?.type, ["docker", "screen", "systemd"]),
      basePath: serverBasePath,
      dataPath: `${serverBasePath}${path.sep}data`,
      serviceName: configLoader.string(data?.server["service-name"]) ?? "mc",
      host: configLoader.string(data?.server.host) ?? "127.0.0.1",
      port: configLoader.port(data?.server.port) ?? 25565,
      rconPort: configLoader.port(data?.server["rcon-port"]) ?? 25575,
      rconPassword: configLoader.string(data?.server["rcon-password"]) ?? "",
    },
    login: login,
    dockerPath: configLoader.string(data["docker-path"]) ?? "docker",
  };
};

export let config = loadConfig();

export const reloadConfig = () => {
  config = loadConfig();
}

export const replaceConfig = (config: Config) => {
  const data = yaml.dump(config);
  fs.writeFileSync(configFilePath, data);
}

const options: QueryOptions = {
  sessionID: 1, // a random 32-bit signed number, optional
  enableSRV: true, // SRV record lookup
  timeout: 1000
};

/**
 * サーバーのオンライン状況を返します
 */
export const isServerOnline = async () => {
  try {
    // const res = await fetch(`https://api.mcstatus.io/v2/status/java/${config.server.host}:${config.server.port}`)
    await status(config.server.host, config.server.port, options);
    return true;
  } catch (e) {
    return false;
  }
}

// Load file functions...
export const parseIniFile = (filePath: string) => {
  const file = getFile(filePath);
  if (!file) return null;

  const parsed = ini.parse(file);
  if (!parsed) return null;

  return camelcaseKeys(parsed);
}

export const parseYamlFile = (filePath: string) => {
  const file = getFile(filePath);
  if (!file) return null;

  const parsed = yaml.load(file);
  if (!parsed) return null;
  if (typeof parsed !== "object") return null;

  return camelcaseKeys(parsed as Record<string, unknown>);
}

export const parseJsonFile = (filePath: string) => {
  const file = getFile(filePath);
  if (!file) return null;

  try {
    const parsed = JSON.parse(file);
    if (!parsed) return null;

    return camelcaseKeys(parsed);
  } catch (e) {
    return null;
  }
}

export const getServerProperties = (serverDir: string) => {
  const parsed = parseIniFile(`${serverDir}/server.properties`) as any;
  if (typeof parsed === "object") {
    if (parsed?.hasOwnProperty("rconPassword")) {
      delete parsed?.rconPassword;
    }
  }
  return isServerPropertiesPartial(parsed) ? parsed : null;
}

export const getServerBukkitConfig = (serverDir: string) => {
  const parsed = getFile(`${serverDir}/bukkit.yml`);
  return isServerBukkitConfig(parsed) ? parsed : null;
}

export const getServerOps = (serverDir: string) => {
  const parsed = getFile(`${serverDir}/ops.json`);
  return isServerBukkitConfig(parsed) ? parsed : null;
}

const getFile = (filePath: string) => fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : null;

/**
 *
 * @param playerName
 */
export const getPlayerData = async (playerName: string): Promise<Player | null> => {
  playerName = playerName.trim();

  if (!playerName.match(/[0-9a-zA-Z_]{1,30}/)) {
    return null;
  }

  const player = await fetch(`https://api.mojang.com/users/profiles/minecraft/${playerName}`)
    .then(data => data.status === 200 ? data.json() : null)
    .then(data => isPlayer(data) ? data : null)

  if (!isPlayer(player)) return null;

  // 順序を変更する為 再定義
  return { id: player.id, name: player.name };
}

export const getPlayerProfile = async (uuid: string): Promise<Player | null> => {
  uuid = uuid.trim().replace('-', '').toLowerCase();

  if (!uuid.match(/[0-9a-f]{32}/)) {
    return null;
  }

  const player = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
    .then(data => data.status === 200 ? data.json() : null)
    .then(data => isPlayer(data) ? data : null)

  if (!isPlayer(player)) return null;

  return {
    id: player.id,
    name: player.name,
  };
}

export const getPlayerUUID = (playerName: string) =>
  getPlayerData(playerName).then(data => data?.id);

export const serverSideUtils = {
  isOperator: async (player: Player | ConfigPlayer | string): Promise<boolean | null> => {
    const resolvedPlayer = await resolvePlayer(player);
    if (!resolvedPlayer) {
      return null;
    }
    return null;
  }
}

const rconExec = (args: string[]) => {
  const result = spawnSync(config.dockerPath, ['compose', 'exec', 'mc', 'rcon-cli', ...args], {
    cwd: config.server.basePath,
    encoding: "utf-8"
  });
}

export const resolvePlayer = async (player?: Player | ConfigPlayer | string): Promise<Player | null> => {
  if (isPlayer(player)) {
    return player;
  }

  if (isConfigPlayer(player)) {
    return {
      id: player.uuid,
      name: player.name,
    };
  }

  if (typeof player === "string") {
    const uuid = player.trim().replace('-', '').toLowerCase();

    if (!uuid.match(/[0-9a-f]{32}/)) {
      return await getPlayerProfile(uuid);
    }

    if (!uuid.match(/[0-9a-zA-Z_]{1,30}/)) {
      return await getPlayerData(uuid);
    }
  }

  return null;
}

export type ServerInspectReturn = {
  state: DockerInspectStateStatuses;
  health: DockerInspectHealthStatuses;
}
export const getServerInspect = (): ServerInspectReturn | null => {
  try {
    const inspect =
      spawnSync(config.dockerPath, ["inspect", "--format={{.State.Status}}:{{.State.Health.Status}}", `${path.basename(config.server.basePath)}-${config.server.serviceName}-1`])
        .stdout
        .toString()
        .trim()

    // console.log(inspect);
    const [state, health] = inspect.split(":");

    if (isDockerInspectStateStatuses(state) && isDockerInspectHealthStatuses(health))
      return { state, health };
  } catch (e) {}

  return null;
}

export const execCommand = (args: string[]) => new Promise<string | null>((resolve, reject) => {
  const result = spawnSync(config.dockerPath, ['compose', 'exec', 'mc', 'rcon-cli', ...args], {
    cwd: config.server.basePath,
    encoding: 'utf-8'
  });

  if (result.status === 0) {
    const stdout = result.stdout.trim();
    return resolve(stdout !== "" ? stdout : null);
  }

  reject(result)
})
