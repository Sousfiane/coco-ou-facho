import { UIManager } from "./uiManager.js";

const socket = io();

let state = {
  playerName: null,
  players: [],
  roomId: null,
  isMaster: false,
  citation: null,
};

UIManager.showPlayerForm(
  // Create
  () => {
    const name = document.getElementById("playerName").value;
    if (!name) return console.log("The player needs a username");
    state.playerName = name;
    socket.emit("create room", name);
  },
  // Join
  () => {
    const name = document.getElementById("playerName").value;
    const roomId = document.getElementById("roomId").value;
    if (!name) return console.log("The player needs a username");
    state.playerName = name;
    socket.emit("join room", name, roomId);
  },
);

socket.on("send roomId", (roomId) => {
  state.roomId = roomId;
});

socket.on("send masterToken", () => {
  state.isMaster = true;
});

socket.on("waiting players", () => {
  UIManager.showWaitingRoom(state.roomId, state.players, state.isMaster, () => {
    socket.emit("launch game", state.roomId);
  });
});

socket.on("send players", (players) => {
  state.players = players;
});

socket.on("update citation", (citation) => {
  state.citation = citation;
});

socket.on("show answer", (result) => {
  UIManager.showAnswer(result);
});

socket.on("show context", () => {
  UIManager.showContext(state.citation, state.players, state.isMaster, () => {
    socket.emit("next round", state.roomId);
  });
});

socket.on("round on", () => {
  UIManager.showGame(
    state.citation,
    state.players,
    () => socket.emit("send vote", state.roomId, "gauche"),
    () => socket.emit("send vote", state.roomId, "droite"),
  );
});
