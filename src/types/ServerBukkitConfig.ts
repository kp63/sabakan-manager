import ServerProperties from "@/types/ServerProperties";

export const isServerBukkitConfig = (payload: any): payload is ServerBukkitConfig =>
  typeof payload === "object"
  && typeof payload?.settings === "object"
  && typeof payload?.settings?.shutdownMessage === "string"

export default interface ServerBukkitConfig {
  settings: {
    allowEnd: boolean;
    warnOnOverload: boolean;
    permissionsFile: string;
    updateFolder: string;
    connectionThrottle: number;
    queryPlugins: boolean;
    deprecatedVerbose: string;
    shutdownMessage: string;
    minimumApi: string;
    useMapColorCache: boolean;
  }
  spawnLimits: {
    monsters: number;
    animals: number;
    waterAnimals: number;
    waterAmbient: number;
    waterUndergroundCreature: number;
    axolotls: number;
    ambient: number;
  }
  chunkGc: {
    periodInTicks: number;
  }
  ticksPer: {
    animalSpawns: number;
    monsterSpawns: number;
    waterSpawns: number;
    waterAmbientSpawns: number;
    waterUndergroundCreatureSpawns: number;
    axolotlSpawns: number;
    ambientSpawns: number;
    autosave: number;
  }
  aliases: string;
}
