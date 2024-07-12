import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/next";
import { handleSenderStream } from "@/senderStream";

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {  
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === "POST") {
    const body = req.body;

    const results = handleSenderStream("validate", body.username);
    // return message
    res.status(200).json(results);
  }
};
