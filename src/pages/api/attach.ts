import { Server } from "socket.io";
import { createServer } from "http";
import Docker from "dockerode";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    const docker = new Docker({ host: 'localhost', port: 2375 });

    const eventsStream = docker.getEvents((err, data) => {
      if (err) {
        console.error(err);
        socket.emit("dockerEventError", err.message);
        return;
      }

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
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      eventsStream.destroy();
    });
  });

  httpServer.listen(3002, () => {
    console.log("Socket.IO server listening on port 3001");
  });

  res.status(200).end();
}
