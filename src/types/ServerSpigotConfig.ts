export const isServerSpigotConfig = (payload: any): payload is ServerSpigotConfig =>
  typeof payload === "object"
  && typeof payload.settings === "object"
  && typeof payload.settings.shutdownMessage === "string"

export default interface ServerSpigotConfig {
  settings: {
    debug: boolean;
    "moved-too-quickly-multiplier": number;
    "save-user-cache-on-stop-only": boolean;
    "moved-wrongly-threshold": number;
    "timeout-time": number;
    "restart-on-crash": boolean;
    "restart-script": string;
    "player-shuffle": number;
    bungeecord: boolean;
    "sample-count": number;
    "user-cache-size": number;
    "netty-threads": number;
    attribute: {
      maxHealth: number;
      max: number;
    }
    movementSpeed: {
      max: number;
    }
    attackDamage: {
      max: number;
    }
    "log-villager-deaths": boolean;
    "log-named-deaths": boolean;
  }
  players: {
    "disable-saving": boolean;
  }
  commands: {
    "silent-commandblock-console": boolean;
    "replace-commands": string[];
    "spam-exclusions": string[];
    log: boolean;
    "tab-complete": number;
    "send-namespaced": true;
  },
  messages: {
    whitelist: string;
    "unknown-command": string;
    "server-full": string;
    "outdated-client": string;
    "outdated-server": string;
    restart: string;
  }
  [key: string]: any;
}
