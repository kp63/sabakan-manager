import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { config } from "@/utils/serverside";
import fs from "fs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(403).json({
      message: 'Permission denied.',
    })
  }

  const files = fs.readdirSync(`${config.server.dataPath}/logs`);
  files.reverse();

  res.json({
    files: files,
  })
}

export default handler
