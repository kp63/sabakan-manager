import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

import fs from 'fs'
import path from 'path'
import * as zlib from "zlib";
import { config } from "@/utils/serverside";

const logsDir = path.join(config.server.dataPath, 'logs')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const file = String(req.query.file).toLowerCase();
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(403).json({
      message: 'Permission denied.',
    })
  }

  if (file.match(/^\./) || file.match(/[\/\\"@]/)) {
    res.status(401).json({
      message: 'Filename contains not allowed characters',
    })
  }

  try {
    const filePath = fs.realpathSync(path.resolve(logsDir, file));

    if (filePath.match(/.gz$/)) {
      zlib.gunzip(fs.readFileSync(filePath), (err, binary) => {
        let lines = binary.toString('utf-8').split(/\r\n|\n/);

        res.json({
          selected: path.basename(filePath),
          lines: lines
        })
      });
    } else {
      const lines = fs.readFileSync(filePath).toString().split(/\r\n|\n/);

      res.json({
        selected: path.basename(filePath),
        lines: lines
      })
    }
  } catch (e) {
    res.status(404).json({
      message: 'Specified log file not found',
    })
  }
}

export default handler
