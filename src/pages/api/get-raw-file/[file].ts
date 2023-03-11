import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

import fs from 'fs'
import path from 'path'
import * as zlib from "zlib";
import { config } from "@/utils/serverside";
import AES from "crypto-js/aes";

const allowedFiles = ["server.properties", "bukkit.yml", "spigot.yml", "docker-compose.yml"];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const file = String(req.query.file).toLowerCase();
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(403).json({
      message: "Permission denied.",
    })
  }

  if (!allowedFiles.includes(file)) {
    res.status(403).json({
      message: "This file access has not allowed",
    })
  }

  try {
    const filePath = file === "docker-compose.yml"
      ? fs.realpathSync(path.resolve(config.server.basePath, "docker-compose.yml"))
      : fs.realpathSync(path.resolve(config.server.dataPath, file));

    const data = fs.readFileSync(filePath).toString();

    const filteredData = data.replace(/(rcon\.[a-zA-Z0-9]+|[a-zA-Z0-9]*password[a-zA-Z0-9]*)=.+/g, "$1=********");

    res.setHeader("Content-Type", "text/plain");
    return res.send(AES.encrypt(filteredData, 'placebo-security').toString());
  } catch (e) {
    res.status(404).json({
      message: 'Specified file not found',
    })
  }
}

export default handler