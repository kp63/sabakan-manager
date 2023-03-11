import { NextApiRequest, NextApiResponse } from "next";
import { config, reloadConfig } from "@/utils/serverside";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  reloadConfig();
  const conf: any = config;
  delete conf.login;
  delete conf.server.rconPort;
  delete conf.server.rconPassword;

  return res.status(200).json(conf)
}

export default handler
