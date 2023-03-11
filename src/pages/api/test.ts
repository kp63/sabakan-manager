import { NextApiRequest, NextApiResponse } from "next";
import { FullQueryResponse, JavaStatusResponse, queryFull, QueryOptions, status } from "minecraft-server-util";
import { isPlayer, Player } from "@/types/Player";
import { Simulate } from "react-dom/test-utils";
import { config, getServerInspect, ServerInspectReturn } from "@/utils/serverside";
import { format } from "date-fns";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const date = new Date();
  date.setHours(date.getHours() - 9);

  res.status(200).json({
    data: format(new Date(), "yyyy-MM-dd HH:mm:ss XX"),
    date: format(date, "yyyy-MM-dd HH:mm:ss +0000"),
    test: "2023-02-15 10:58:40 +0000"
  })
}

export default handler
