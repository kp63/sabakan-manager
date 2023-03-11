export type Player = {
  id: string;
  name: string;
}

export const isPlayer = (payload: any): payload is Player =>
  typeof payload === "object" && typeof payload?.id === "string" && typeof payload?.name === "string"
export const isPlayerList = (payload: any): payload is Player[] =>
  typeof payload === "object" && payload?.map((record: unknown) => isPlayer(record));


export type ConfigPlayer = {
  uuid: string;
  name: string;
}

export const isConfigPlayer = (payload: any): payload is ConfigPlayer =>
  typeof payload === "object" && typeof payload?.uuid === "string" && typeof payload?.name === "string"
export const isConfigPlayerList = (payload: any): payload is ConfigPlayer[] =>
  typeof payload === "object" && payload?.map((record: unknown) => isConfigPlayer(record));


type BannedBase = {
  created: string;
  source: "Server" | "Rcon" | string;
  expires: "forever" | string;
  reason: string;
};

export type BannedPlayer = ConfigPlayer & BannedBase
export const isBannedPlayerObject = (payload: any): payload is BannedPlayer =>
  typeof payload === "object"
  && typeof payload?.uuid === "string"
  && typeof payload?.name === "string"
  && typeof payload?.created === "string"
  && typeof payload?.source === "string"
  && typeof payload?.expires === "string"
  && typeof payload?.reason === "string"

export const isBannedPlayerObjectList = (payload: any): payload is BannedPlayer[] =>
  typeof payload === "object" && payload?.map((record: unknown) => isBannedPlayerObject(record));

export type BannedIP = {
  ip: string;
} & BannedBase

export const isBannedIPObject = (payload: any): payload is BannedIP =>
  typeof payload === "object"
  && typeof payload?.ip === "string"
  && typeof payload?.created === "string"
  && typeof payload?.source === "string"
  && typeof payload?.expires === "string"
  && typeof payload?.reason === "string"

export const isBannedIPObjectList = (payload: any): payload is BannedIP[] =>
  typeof payload === "object" && payload?.map((record: unknown) => isBannedPlayerObject(record));

export const normalizePlayerData = <T extends Player | ConfigPlayer>(player: T): Omit<T, "uuid" | "name"> & Player => {
  if (isPlayer(player)) return player;
  // if (!isConfigPlayer(player)) return null;

  const { uuid, name, ...etc } = player;
  return {
    id: uuid,
    name: name,
    ...etc
  }
}
