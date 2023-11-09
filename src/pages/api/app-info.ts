import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import os from "os";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(403).json({
            message: 'Permission denied.',
        })
    }

    res.json({
        runner: os.userInfo().username
    });
}

export default handler;
