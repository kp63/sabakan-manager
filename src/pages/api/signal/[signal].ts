import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { spawnSync } from "child_process";
import path from "path";
import { config, getServerInspect } from "@/utils/serverside";

const baseDir = path.join(path.resolve(), 'servers/main');
const dataDir = path.join(baseDir, 'data');

let isServerStarting = false;

export type SignalResponse = {
  message: string;
  stderr?: string;
};

const sendSignalTypes = [
  "start", "restart", "stop"
] as const;
export type SendSignalType = typeof sendSignalTypes[number];

const handler = async (req: NextApiRequest, res: NextApiResponse<SignalResponse>) => {
  const signal = String(req.query.signal).toLowerCase();

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).json({
      message: 'Permission denied.',
    })
  }

  const inspect = getServerInspect();
  // if (!inspect) {
  //   return res.status(500).json({
  //     message: "Dockerに接続できません"
  //   })
  // }

  const { state, health } = inspect ?? {};

  if (state === "restarting" || (state === "running" && health === "starting")) {
    return res.status(409).json({
      message: "サーバーは現在起動中です"
    })
  }

  try {
    if (signal === "start") {
      if (state === "running") {
        return res.status(200).json({
          message: "サーバーは既に稼働中です"
        })
      }

      const result = spawnSync(config.dockerPath, ['compose', 'up', '-d'], {
        cwd: baseDir,
        encoding: 'utf-8'
      });

      if (result.status === 0) {
        return res.status(200).json({
          message: "サーバー起動シグナルを送信しました"
        })
      }

      return res.status(500).json({
        message: "サーバー起動シグナルの送信に失敗しました",
        stderr: result.stderr,
      })

    } else if (signal === "stop") {
      if (state !== "running") {
        return res.status(200).json({
          message: "サーバーは既に停止しています"
        })
      }

      const result = spawnSync(config.dockerPath, ['compose', 'stop'], {
        cwd: baseDir,
        encoding: 'utf-8'
      });

      if (result.status === 0) {
        return res.status(200).json({
          message: "サーバーを停止しました"
        })
      }

      return res.status(500).json({
        message: "サーバーの停止に失敗しました",
        stderr: result.stderr,
      })

    } else if (signal === "restart") {
      if (state !== "running") {
        return res.status(200).json({
          message: "サーバーは停止しています"
        })
      }

      if (health === "unhealthy") {
        return res.status(200).json({
          message: "サーバーはunhealthy状態です"
        })
      }

      const result = spawnSync(config.dockerPath, ['compose', 'restart'], {
        cwd: baseDir,
        encoding: 'utf-8'
      });

      if (result.status === 0) {
        return res.status(200).json({
          message: "サーバー再起動シグナルを送信しました"
        })
      }

      return res.status(500).json({
        message: "サーバー再起動シグナルの送信に失敗しました",
        stderr: result.stderr,
      })
    } else {
      res.status(404).json({
        message: '存在しないシグナルです',
      })
    }
  } catch (e: any) {
    res.status(500).json({
      message: "Something wrong",
      stderr: e?.message
    })
  }
  isServerStarting = false;
}

export default handler
