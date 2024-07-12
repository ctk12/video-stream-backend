import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/next";

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {  
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === "GET") {
    const results = { msg: "Welcome" };
    // return message
    res.status(200).json(results);
  }
};
