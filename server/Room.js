import WaitingState from "./states/WaitingState.js";
import CountdownState from "./states/CountdownState.js";
import FinishedState from "./states/FinishedState.js";

export default class Room {
  constructor(masterId, masterName, ioInstance, citations, avatars) {
    this.io = ioInstance;
    this.currentState = new WaitingState(this);
    this.roomId = Math.random().toString(36).substr(2, 6);
    this.masterId = masterId;
    this.players = [];
    this.currentRound = 0;
    this.currentCitation = null;
    this.maxRound = 5;
    this.maxPlayer = 5;
    this.citations = citations;
    this.currentState.onEnter();
    this.avatars = avatars;
    this.join(masterId, masterName);
  }

  isEmpty() {
    return this.players.length === 0;
  }

  changeState(newState) {
    this.currentState.onExit();
    this.currentState = newState;
    this.currentState.onEnter();
  }

  startGame() {
    this.currentState.handleStart();
  }

  pickRandomCitation() {
    let currentCitation =
      this.citations[Math.floor(Math.random() * this.citations.length)];
    this.currentCitation = currentCitation;
  }

  vote(socketId, vote) {
    this.currentState.handleVote(socketId, vote);
  }

  join(socketId, playerName) {
    if (this.maxPlayer > this.players.length) {
      let player = {
        id: socketId,
        avatar: "/avatars/placeholder.png",
        name: playerName,
        score: 0,
        hasVoted: false,
      };
      this.currentState.handleJoin(socketId, player);
    }
  }

  next() {
    if (this.currentRound < this.maxRound) {
      this.changeState(new CountdownState(this));
    } else {
      this.changeState(new FinishedState(this));
    }
  }

  checkVote(socketId, vote, startTime) {
    const player = this.players.find((player) => player.id === socketId);
    if (!player || player.hasVoted) return;
    const result = vote === this.currentCitation.camp;
    if (result) {
      const timeTaken = (Date.now() - startTime) / 1000;
      const scoreEarned = Math.max(1, Math.round(10 - timeTaken));
      player.score += scoreEarned;
    }
    player.hasVoted = true;
    this.io.to(socketId).emit("show answer");
  }

  relaunchGame() {
    this.currentRound = 0;
    this.players.forEach((player) => (player.score = 0));
    this.broadcastPlayers();
    this.changeState(new CountdownState(this));
  }

  everyoneVoted() {
    return this.players.every((player) => player.hasVoted);
  }

  resetPlayersVote() {
    this.players.forEach((players) => (players.hasVoted = false));
  }

  playerDisconnect(socketId) {
    this.currentState.handleDisconnect(socketId);
  }

  setPlayerAvatar(socketId, avatarPath) {
    const player = this.players.find((player) => player.id === socketId);
    if (player) {
      player.avatar = avatarPath;
      this.broadcastPlayers();
    }
  }

  broadcastWaiting(socketId) {
    this.io.to(socketId).emit("waiting players");
  }

  broadcastRoomId(socketId) {
    this.io.to(socketId).emit("send roomId", this.roomId);
  }

  broadcastAvatars(socketId) {
    this.io.to(socketId).emit("send avatars", this.avatars);
  }

  broadcastMasterId() {
    this.io.to(this.roomId).emit("send masterId", this.masterId);
  }

  broadcastCitation() {
    this.io.to(this.roomId).emit("send citation", this.currentCitation);
  }

  broadcastCountdown() {
    this.io.to(this.roomId).emit("send countdown");
  }

  broadcastTick(tick) {
    this.io.to(this.roomId).emit("send tick", tick);
  }

  broadcastPlayers() {
    this.io.to(this.roomId).emit("send players", this.players);
  }

  broadcastContext() {
    this.io.to(this.roomId).emit("show context");
  }

  broadcastEndgame() {
    this.io.to(this.roomId).emit("end game");
  }
}
