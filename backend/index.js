import { createServer } from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(httpServer, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  socket.on("ping", (data) => {
    socket.emit("pong", "pong!!!");
  });
});

app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World!');
});

httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});