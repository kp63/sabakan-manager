import { config } from "@/utils/serverside";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import Config from "@/types/Config";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export type ServerConfigResponse = Omit<Config, "login"|"server">

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(403).json({
            message: 'Permission denied.',
        })
    }

    const conf: any = config;
    delete conf.login;
    delete conf.server.rconPort;
    delete conf.server.rconPassword;

    res.json(conf);
}

export default handler;
