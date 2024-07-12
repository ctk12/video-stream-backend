import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/next";
import { handleTrackEvent } from "@/senderStream";

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {  
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === "POST") {
    const body = req.body;

    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
              },
        ]
    });
    peer.ontrack = (e) => handleTrackEvent(e, peer, body.username);
    const desc = new RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("USER_ADDED_USERNAME", body.username);

    res.status(200).json(payload);
  }
};
