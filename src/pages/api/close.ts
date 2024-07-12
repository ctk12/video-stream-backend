import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/next";
import { handleSenderStream } from "@/senderStream";

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {  
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === "POST") {
    const body = req.body;

    const results = handleSenderStream("close", body.username);

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("USER_REMOVED_USERNAME", body.username);

    res.status(200).json(results);
  }
};
