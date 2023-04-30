import { Server } from "socket.io";
import { createServer } from "http";
import Docker from "dockerode";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const docker = new Docker({ host: 'localhost', port: 2375 });

  io.on("connection", (socket) => {
    console.log("Client connected");

    docker.getEvents((err, data) => {
      if (err) {
        console.error(err);
        socket.emit("dockerEventError", err.message);
        return;
      }

      if (data) {
        data.on("data", (chunk) => {
          const str = chunk.toString("utf8");
          const lines = str.trim().split("\n");
          for (const line of lines) {
            const evt = JSON.parse(line);
            socket.emit("dockerEvent", evt);
          }
        });

        data.on("error", (err) => {
          console.error(err);
          socket.emit("dockerEventError", err.message);
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  httpServer.listen(3001, () => {
    console.log("Socket.IO server listening on port 3001");
  });

  res.status(200).end();
}
