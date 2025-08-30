import express from "express";
import http from "http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { readdirSync } from "fs";
import { Server } from "socket.io";
import Room from "./Room.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const require = createRequire(import.meta.url);

app.use(express.static(path.join(__dirname, "../dist")));

app.use("/avatars", express.static(path.join(__dirname, "../avatars")));

server.listen(3000, () =>
  console.log("Server running on http://localhost:3000"),
);

const rooms = {};
const citations = require("../data/citations.json");
const avatarDir = path.join(process.cwd(), "avatars/");
const files = readdirSync(avatarDir);
const avatars = files
  .filter((file) => file !== "placeholder.png")
  .map((file) => `/avatars/${file}`);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("create room", (masterName) => {
    let newRoom = new Room(socket.id, masterName, io, citations, avatars);
    socket.roomId = newRoom.roomId;
    rooms[newRoom.roomId] = newRoom;
  });

  socket.on("join room", (playerName, roomId) => {
    if (rooms[roomId]) {
      socket.roomId = roomId;
      rooms[roomId].join(socket.id, playerName);
    }
  });

  socket.on("launch game", (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].startGame();
    }
  });

  socket.on("send vote", (roomId, vote) => {
    if (rooms[roomId]) {
      rooms[roomId].vote(socket.id, vote);
    }
  });

  socket.on("pick avatar", (roomId, avatarPath) => {
    if (rooms[roomId]) {
      rooms[roomId].setPlayerAvatar(socket.id, avatarPath);
    }
  });

  socket.on("next round", (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].next();
    }
  });

  socket.on("relaunch game", (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].relaunchGame();
    }
  });

  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
    let roomId = socket.roomId;
    if (roomId && rooms[roomId]) {
      rooms[roomId].playerDisconnect(socket.id);
      if (rooms[roomId].isEmpty()) {
        console.log(`Room #${roomId} is Empty : Cleanup...`);
        delete rooms[roomId];
      }
    }
  });
});
