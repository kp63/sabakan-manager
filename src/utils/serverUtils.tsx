import toast, { Renderable, ValueOrFunction } from "react-hot-toast";
import post from "@/utils/post";
import { mutate } from "swr";
import { PlayerControlProps, PlayerControlReturn, PlayerControlType } from "@/pages/api/action/player-control";
import { isPlayer, Player } from "@/types/Player";
import { SendCommandProps, SendCommandReturn } from "@/pages/api/action/send-command";
import Ansi from "@/components/Ansi";

type ControlTypeMsgs = {
  [key in PlayerControlType]: {
    loading?: Renderable;
    success: ValueOrFunction<Renderable, any>;
    error?: ValueOrFunction<Renderable, any>;
  }
}

const controlTypeMsgs: ControlTypeMsgs = {
  op: {
    loading: "OP権限を付与中…",
    success: (data) => data?.status === "success" ? "OP権限を付与しました" : data?.message ?? "",
  },
  deop: {
    loading: "OP権限を剥奪中…",
    success: "OP権限を剥奪しました",
  },
  "whitelist add": {
    loading: "ホワイトリストに追加中…",
    success: "ホワイトリストに追加しました",
  },
  "whitelist remove": {
    loading: "ホワイトリストから削除中…",
    success: "ホワイトリストから削除しました",
  },
  kick: {
    loading: "プレイヤーをキック中…",
    success: "プレイヤーをキックしました",
  },
  ban: {
    loading: "ブラックリストに追加中…",
    success: "プレイヤーをBanしました",
  },
  pardon: {
    loading: "Banを解除中…",
    success: "Banを解除しました",
  },
  "ban-ip": {
    loading: "IP-Ban中…",
    success: "IP-Banしました",
  },
  "pardon-ip": {
    loading: "IP-Banを解除中…",
    success: "IP-Banを解除しました",
  },
}

const playerControl = async (player: Player | string, type: PlayerControlType, reason?: string) => {
  if (typeof player === "string" && !player.match(/^[a-zA-Z0-9_\-.]{1,30}$/)) {
    // throw Error("Invalid player name")
    return false;
  }

  try {
    console.log(reason, typeof player === "string" ? {
      type: type,
      playerName: player,
      reason,
    } : {
      type: type,
      uuid: player.id,
      playerName: player.name,
      reason,
    });
    const res = await toast.promise(
      new Promise(async (resolve, reject) => {
        const res = await fetch("/api/action/player-control", {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              typeof player === "string" ? {
                type: type,
                playerName: player,
                reason,
              } : {
                type: type,
                uuid: player.id,
                playerName: player.name,
                reason,
              }
            ),
          });

        const data = await res.json();

        if (res.ok) {
          resolve(data);
        }
        reject(data.message);
      }), {
        loading: controlTypeMsgs[type].loading ?? '操作を実行中…',
        success: (res: any) => res?.response ? <Ansi>{res.response}</Ansi> : res?.message ?? controlTypeMsgs[type].success,
        error: (error) => error ?? controlTypeMsgs[type].error ?? '操作に失敗しました',
      })

    await mutate("/api/info");

    return res;
  } catch (e) {}
}

const sendCommand = async (cmd: string | string[]) => {
  const command = typeof cmd === "string"
    ? cmd.replace(/^\/+/, '').trim()
    : cmd.join(" ").replace(/^\/+/, '').trim();

  if (command === "") {
    return;
  }

  const res = await toast.promise(
    new Promise<SendCommandReturn>(async (resolve, reject) => {
      const res = await post<SendCommandProps, SendCommandReturn>(
        "/api/action/send-command",
        {
          command,
        }
      )

      console.log(res);
      resolve(res);
    }), {
      loading: "コマンドを送信中…",
      success: (res) => res.response ? <Ansi>{res.response}</Ansi> : <span>コマンドが実行されました <span className="text-sm text-gray-500 dark:text-gray-300">(返り値なし)</span></span>,
      error: "操作に失敗しました",
    })

  await mutate("/api/info");
  await mutate("/api/log");

  return res;
}

const serverUtils = {
  sendCommand,
  playerControl,
  op: (player: Player | string) => playerControl(player, "op"),
  deop: (player: Player | string) => playerControl(player, "deop"),
  whitelistAdd: (player: Player | string) => playerControl(player, "whitelist add"),
  whitelistRemove: (player: Player | string) => playerControl(player, "whitelist remove"),
  kick: (player: Player | string, reason?: string) => playerControl(player, "kick", reason),
  ban: (player: Player | string, reason?: string) => playerControl(player, "ban", reason),
  pardon: (player: Player | string) => playerControl(player, "pardon"),
  // banIp: (player: Player | string) => playerControl(player, "ban-ip"),
  // pardonIp: (player: Player | string) => playerControl(player, "pardon-ip"),
}

export default serverUtils;
