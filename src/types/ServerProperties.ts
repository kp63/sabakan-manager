export const ServerDifficulties = ['peaceful', 'easy', 'normal', 'hard'];
export const ServerGamemodes = ['survival', 'creative', 'spectator', 'adventure'];

type SafeNumber = number | `${number}`;

export const isServerPropertiesPartial = (payload: any): payload is Partial<ServerProperties> =>
  typeof payload === "object"
  && typeof payload.motd === "string"
  && (typeof payload.gamemode === "string" || typeof payload.gamemode === "number")

export default interface ServerProperties {
  allowFlight: boolean;
  allowNether: boolean;
  broadcastConsoleToOps: boolean;
  broadcastRconToOps: boolean;
  debug: boolean;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  enableCommandBlock: boolean;
  enableJmxMonitoring: boolean;
  enableQuery: boolean;
  enableRcon: boolean;
  enableStatus: boolean;
  enforceSecureProfile: boolean;
  enforceWhitelist: boolean;
  entityBroadcastRangePercentage: SafeNumber;
  forceGamemode: boolean;
  functionPermissionLevel: SafeNumber;
  gamemode: 'survival' | 'creative' | 'spectator' | 'adventure' | SafeNumber;
  generateStructures: boolean;
  generatorSettings: string;
  hardcore: boolean;
  hideOnlinePlayers: boolean;
  levelName: string;
  levelSeed: string;
  levelType: 'minecraft:normal' | 'minecraft:flat' | 'minecraft:large_biomes' | 'minecraft:amplified' | 'minecraft:single_biome_surface' | 'buffet' | 'default_1_1' | 'customized' | string;
  maxChainedNeighborUpdates: SafeNumber;
  maxPlayers: SafeNumber;
  maxTickTime: SafeNumber;
  maxWorldSize: SafeNumber;
  motd: string;
  networkCompressionThreshold: SafeNumber;
  onlineMode: boolean;
  opPermissionLevel: SafeNumber;
  playerIdleTimeout: SafeNumber;
  preventProxyConnections: boolean;
  previewsChat: boolean;
  pvp: boolean;
  queryPort: SafeNumber;
  rateLimit: SafeNumber;
  /**
   * @deprecated パスワードはセキュリティ上の理由から表示されません
   */
  rconPassword: string;
  rconPort: SafeNumber;
  requireResourcePack: boolean;
  resourcePack: string;
  resourcePackPrompt: string;
  resourcePackSha1: string;
  serverIp: string;
  serverPort: SafeNumber;
  simulationDistance: SafeNumber;
  spawnAnimals: boolean;
  spawnMonsters: boolean;
  spawnNPCs: boolean;
  spawnProtection: SafeNumber;
  syncChunkWrites: boolean;
  textFilteringConfig: string;
  useNativeTransport: boolean;
  viewDistance: SafeNumber;
  whiteList: boolean;
  [key: string]: string | boolean | SafeNumber;
}

export const defaultServerProperties: ServerProperties = {
  allowFlight: false,
  allowNether: true,
  broadcastConsoleToOps: true,
  broadcastRconToOps: true,
  debug: false,
  difficulty: 'easy',
  enableCommandBlock: false,
  enableJmxMonitoring: false,
  enableQuery: false,
  enableRcon: false,
  enableStatus: true,
  enforceSecureProfile: true,
  enforceWhitelist: false,
  entityBroadcastRangePercentage: 100,
  forceGamemode: false,
  functionPermissionLevel: 2,
  gamemode: 'survival',
  generateStructures: true,
  generatorSettings: '{}',
  hardcore: false,
  hideOnlinePlayers: false,
  levelName: 'world',
  levelSeed: '',
  levelType: 'minecraft:normal',
  maxChainedNeighborUpdates: 1000000,
  maxPlayers: 20,
  maxTickTime: 60000,
  maxWorldSize: 29999984,
  motd: 'A Minecraft Server',
  networkCompressionThreshold: 256,
  onlineMode: true,
  opPermissionLevel: 4,
  playerIdleTimeout: 0,
  preventProxyConnections: false,
  previewsChat: false,
  pvp: true,
  queryPort: 25565,
  rateLimit: 0,
  rconPassword: '',
  rconPort: '25575',
  requireResourcePack: false,
  resourcePack: '',
  resourcePackPrompt: '',
  resourcePackSha1: '',
  serverIp: '',
  serverPort: 25565,
  simulationDistance: 10,
  spawnAnimals: true,
  spawnMonsters: true,
  spawnNPCs: true,
  spawnProtection: 16,
  syncChunkWrites: true,
  textFilteringConfig: '',
  useNativeTransport: true,
  viewDistance: 10,
  whiteList: false,
}
