import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { spawnSync } from "child_process";
import path from "path";
import { NodeSignals } from "@/types/Node";
import { config, isServerOnline } from "@/utils/serverside";

const baseDir = path.join(path.resolve(), 'servers/main');
const dataDir = path.join(baseDir, 'data');

export type SendCommandProps = {
  command: string;
}
export type SendCommandReturn = {
  status: number | null;
  signal: NodeSignals | null;
  response: string | null,
  error: string | null,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(403).json({
      message: 'Permission denied.',
    })
  }

  if (!await isServerOnline()) {
    return res.status(500).json({
      message: 'Server is offline.',
    })
  }

  const command = String(req.body.command ?? "").trim().replace(/^\/*/, '');
  if (command === "") {
    return res.status(401).json({
      message: 'Command is empty.',
    })
  }

  // const jarFilePath = path.resolve(`${basePath}/paper-1.19.2-260.jar`);
  // if (!fs.existsSync(jarFilePath)) {
  //   res.status(403).json({
  //     message: 'jar file not found.',
  //   })
  // }

  const commandArgs = command.split(" ");
  const result = spawnSync(config.dockerPath, ['compose', 'exec', 'mc', 'rcon-cli', ...commandArgs], {
    cwd: baseDir,
    encoding: 'utf-8'
  });

  const stdout = result.stdout.trim();
  const stderr = result.stderr.trim();

  return res.status(200).json({
    status: result.status,
    signal: result.signal,
    response: stdout !== "" ? stdout : null,
    error: stderr !== "" ? stderr : null,
  })
}

export default handler
