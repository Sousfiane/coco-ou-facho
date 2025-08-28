import express from "express";
import http from "http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { createRequire } from "module";
import Room from "./Room.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const require = createRequire(import.meta.url);

app.use(express.static(path.join(__dirname, "../dist")));

server.listen(3000, () =>
  console.log("Server running on http://localhost:3000"),
);

const rooms = {};
const citations = require("../data/citations.json");

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("create room", (masterName) => {
    let newRoom = new Room(socket, masterName, io, citations);
    socket.roomId = newRoom.roomId;
    rooms[newRoom.roomId] = newRoom;
  });

  socket.on("join room", (playerName, roomId) => {
    socket.roomId = roomId;
    rooms[roomId].join(socket, playerName);
  });

  socket.on("launch game", (roomId) => {
    rooms[roomId].startGame();
  });

  socket.on("send vote", (roomId, vote) => {
    rooms[roomId].vote(socket, vote);
  });

  socket.on("next round", (roomId) => {
    rooms[roomId].next();
  });

  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
    if (socket.roomId) {
      rooms[socket.roomId].playerDisconnect(socket.id);
    }
  });
});
