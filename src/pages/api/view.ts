import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/next";
import { handleSenderStream } from "@/senderStream";

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {  
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === "POST") {
    const body = req.body;

    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    const desc = new RTCSessionDescription(body.sdp);
    const myStream = handleSenderStream(body.username);
    await peer.setRemoteDescription(desc);
    if (myStream) {
      myStream.getTracks().forEach(track => peer.addTrack(track, myStream));
    }
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.status(200).json(payload);
  }
};
