import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

import fs from 'fs'
import path from 'path'
import { config } from "@/utils/serverside";
import CryptoJS from "crypto-js";

const allowedFiles = ["server.properties", "bukkit.yml", "spigot.yml", "docker-compose.yml"];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(403).json({
      message: "Permission denied.",
    })
  }

  const file = String(req.query.file);
  if (!allowedFiles.includes(file)) {
    res.status(403).json({
      message: "This file access has not allowed",
    })
  }

  try {
    const filePath = file === "docker-compose.yml"
      ? path.resolve(config.server.basePath, "docker-compose.yml")
      : path.resolve(config.server.dataPath, file);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: 'Specified file not found',
      })
    }

    const data = fs.readFileSync(filePath).toString();

    const filteredData = (() => {
      if (file === "server.properties") {
        return data.replace(/(rcon\.[a-zA-Z0-9]+|[a-zA-Z0-9]*password[a-zA-Z0-9]*)=.+/mgi, "$1=********");
      }

      if (file === "docker-compose.yml") {
        return data.replace(/^(\s*)([a-zA-Z0-9_]*_PASSWORD):(\s*).+/mgi, "$1$2:$3********")
          .replace(/\d{1,5}:25575/mg, '********:25575')
          ;
      }

      return data;
    })();

    const encrypted = CryptoJS.AES.encrypt(filteredData, 'placebo-security').toString();
    const base64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Latin1.parse(encrypted))

    if (process.env.DEBUG) {
      return res.json({
        data: base64,
        __unencrypted: filteredData.split("\n"),
      })
    }

    return res.json({ data: base64 })
  } catch (e) {
    return res.status(404).json({
      message: 'Failed to open a file.',
    })
  }
}

export default handler
