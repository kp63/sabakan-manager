import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import path from "path";
import { SpawnSyncReturns } from "@/types/Node";
import {
  config,
  execCommand,
  getPlayerData,
  getServerInspect,
  isServerOnline,
  resolvePlayer
} from "@/utils/serverside";
import fs from "fs";
import { ConfigPlayer, Player } from "@/types/Player";
import { dashUuid } from "@/utils/utils";
import { format } from "date-fns"

const controls = [
  "op", "deop",
  "whitelist add", "whitelist remove",
  "kick",
  "ban", "pardon",
  "ban-ip", "pardon-ip"
] as const;

export type PlayerControlType = typeof controls[number];
export const isPlayerControlType = (payload: unknown): payload is PlayerControlType =>
  typeof payload === "string" && (controls as any as string[]).includes(payload);

export type PlayerControlProps = {
  type: PlayerControlType;
  uuid?: string;
  playerName?: string;
  reason?: string;
}
export type PlayerControlReturn = SpawnSyncReturns<string>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(403).json({
      message: 'Permission denied.',
    })
  }

  const control: PlayerControlType = isPlayerControlType(req.body.type) ? req.body.type : undefined;
  if (typeof control === "undefined") {
    return res.status(401).json({
      message: 'Invalid control type.',
    })
  }

  const reason: string | undefined = typeof req.body.reason === "string" ? req.body.reason.trim() : undefined;

  const playerName = String(req.body.playerName).trim();
  if (!playerName.match(/^[a-zA-Z0-9_\-.]{1,30}$/)) {
    return res.status(400).json({
      message: 'プレイヤー名が不正です',
    })
  }

  const player = await getPlayerData(playerName);
  if (!player) {
    return res.status(404).json({
      message: 'このプレイヤー名は存在しません',
    })
  }

  const inspect = getServerInspect();
  if (!inspect) {
    return res.status(500).json({
      message: "Dockerに接続できません"
    })
  }

  const { state, health } = inspect;

  if (state === "restarting" || (state === "running" && health === "starting")) {
    return res.status(409).json({
      message: "サーバーは現在起動中です"
    })
  }

  const controlArgs = control.split(" ");

  switch (control) {
    case "op":
    case "deop":
      const opsPath = path.join(config.server.dataPath, 'ops.json');

      try {
        const data = JSON.parse(fs.readFileSync(opsPath, "utf-8"));

        const index = await getPlayerIndex(data, player);

        if (control === "op" && index !== -1) {
          return res.status(409).json({
            message: "既にオペレーターです"
          })
        }

        if (control === "deop" && index === -1) {
          return res.status(409).json({
            message: "このプレイヤーはオペレーターではありません"
          })
        }

        if (await isServerOnline()) {
          return res.status(200).json({
            response: await execCommand([...controlArgs, playerName])
          })
        }

        if (control === "op") {
          data.push({
            uuid: dashUuid(player.id),
            name: player.name,
            level: 4,
            bypassesPlayerLimit: false
          })
        } else {
          data.splice(index, 1)
        }

        fs.writeFileSync(opsPath, JSON.stringify(data, null, 2));

        return res.status(200).json({
          message: "ファイル操作が完了しました"
        })
      } catch (e) {
        return res.status(500).json({
          message: "ファイルの操作に失敗しました"
        })
      }
    case "ban":
    case "pardon":
      const bannedPlayersPath = path.join(config.server.dataPath, 'banned-players.json');

      try {
        const data = JSON.parse(fs.readFileSync(bannedPlayersPath, "utf-8"));

        const index = await getPlayerIndex(data, player);

        if (control === "ban" && index !== -1) {
          return res.status(409).json({
            message: "既にBanされています"
          })
        }

        if (control === "pardon" && index === -1) {
          return res.status(409).json({
            message: "このプレイヤーはBanされていません"
          })
        }

        if (await isServerOnline()) {
          return res.status(200).json({
            response: await execCommand([...controlArgs, playerName])
          })
        }

        if (control === "ban") {
          const date = new Date();
          date.setHours(date.getHours() - 9);

          data.push({
            uuid: dashUuid(player.id),
            name: player.name,
            created: format(date, "yyyy-MM-dd HH:mm:ss") + " +0000",
            source: "Sabakan",
            expires: "forever",
            reason: reason ?? "Banned by an operator.",
          })
        } else {
          data.splice(index, 1)
        }

        fs.writeFileSync(bannedPlayersPath, JSON.stringify(data, null, 2));

        return res.status(200).json({
          message: "ファイル操作が完了しました"
        })
      } catch (e) {
        return res.status(500).json({
          message: "ファイルの操作に失敗しました"
        })
      }
    case "kick":
      if (!await isServerOnline()) {
        return res.status(204).json({
          message: "Server is offline"
        })
      }

      return res.status(200).json({
        response: await execCommand(reason ? [...controlArgs, playerName, reason] : [...controlArgs, playerName])
      })
    case "whitelist add":
    case "whitelist remove":
      const whitelistPath = path.join(config.server.dataPath, 'whitelist.json');

      try {
        const data = JSON.parse(fs.readFileSync(whitelistPath, "utf-8"));

        const index = await getPlayerIndex(data, player);

        if (control === "whitelist add" && index !== -1) {
          return res.status(409).json({
            message: "既にホワイトリストに入っています"
          })
        }

        if (control === "whitelist remove" && index === -1) {
          return res.status(409).json({
            message: "このプレイヤーはホワイトリストに居ません"
          })
        }

        if (await isServerOnline()) {
          return res.status(200).json({
            response: await execCommand([...controlArgs, playerName])
          })
        }

        if (control === "whitelist add") {
          data.push({
            uuid: dashUuid(player.id),
            name: player.name,
          })
        } else {
          data.splice(index, 1)
        }

        fs.writeFileSync(whitelistPath, JSON.stringify(data, null, 2));

        return res.status(200).json({
          message: "ファイル操作が完了しました"
        })
      } catch (e) {
        return res.status(500).json({
          message: "ファイルの操作に失敗しました"
        })
      }
  }


}

async function getPlayerIndex(arr: any[], player: Player | ConfigPlayer): Promise<number> {
  const resolvedPlayer = await resolvePlayer(player);
  if (!resolvedPlayer) return -1;

  const uuid = dashUuid(resolvedPlayer.id);
  for (let i = 0; i < arr.length; i++) {
    // if (dashUuid(typeof arr[i]["uuid"] !== "undefined" ? arr[i]["uuid"] : arr[i]["id"]) === uuid) {
    if (dashUuid(arr[i]["uuid"]) === uuid) {
      return i;
    }
  }
  return -1;
}

export default handler
