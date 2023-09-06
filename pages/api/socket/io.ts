import { Server as httpServer } from "http";
import { NextApiRequest } from "next";
import { Server as socketServer } from "socket.io";
import { NextApiResponseSocketServer } from "@/lib/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

// NextApiResponseSocketServer
const ioHandler = async (
  req: NextApiRequest,
  res: NextApiResponseSocketServer,
) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io",
      httpserver: httpServer = res.socket.server as any,
      io = new socketServer(httpserver, {
        path: path,
        //@ts-ignore
        addTrailingSlash: false,
      });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
