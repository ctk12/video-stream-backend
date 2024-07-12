import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      cors: { origin: "*" },
      path: "/api/socketio",
    });

    io.on('connection', (socket) => {
      socket.on('USER_ADDED', (data) => {
          io.emit("USER_ADDED_USERNAME", data);
      });
  
      socket.on('USER_REMOVED', (data) => {
          io.emit("USER_REMOVED_USERNAME", data);
      });
     
      socket.on('WATCHING', (data, type, ip) => {
          io.emit("WATCHING_UPDATE", data, type, ip);
      });
    });

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};
