import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

import fs from 'fs'
import path from 'path'
import { config } from "@/utils/serverside";

const baseDir = path.resolve(config.server.basePath);
const dataDir = path.join(baseDir, 'data');
const logsDir = path.join(dataDir, 'logs')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(403).json({
      message: 'Permission denied.',
    })
  }

  const files = fs.readdirSync(logsDir);
  files.reverse();

  res.json({
    files: files,
  })
}

export default handler
