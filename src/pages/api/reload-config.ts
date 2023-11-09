import { config, reloadConfig } from "@/utils/serverside";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(403).json({
            message: 'Permission denied.',
        })
    }

    reloadConfig();

    return res.json({
        message: 'App configuration is reloaded.',
    })
}

export default handler;
