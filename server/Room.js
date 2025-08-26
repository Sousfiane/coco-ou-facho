import WaitingState from "./states/WaitingState.js";
import PlayingState from "./states/PlayingState.js";
import FinishedState from "./states/FinishedState.js";

export default class Room {
  constructor(masterSocket, masterName, ioInstance, citations) {
    this.io = ioInstance;
    this.currentState = new WaitingState(this);
    this.roomId = Math.random().toString(36).substr(2, 6);
    this.masterId = masterSocket.id;
    this.players = [];
    this.currentRound = 0;
    this.currentRoundVotes = 0;
    this.currentCitation = null;
    this.maxRound = 20;
    this.citations = citations;
    this.join(masterSocket, masterName);
    this.currentState.onEnter();
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

  vote(socket, vote) {
    this.currentState.handleVote(socket, vote);
  }

  join(socket, playerName) {
    let player = { id: socket.id, name: playerName, score: 0, hasVoted: false };
    this.currentState.handleJoin(socket, player);
  }

  next() {
    if (this.currentRound < this.maxRound) {
      this.changeState(new PlayingState(this));
    } else {
      this.changeState(new FinishedState(this));
    }
  }

  checkVote(socket, vote, startTime) {
    const player = this.players.find((e) => e.id === socket.id);
    if (!player || player.hasVoted) return;
    const result = vote === this.currentCitation.camp;
    if (result) {
      const timeTaken = (Date.now() - startTime) / 1000;
      const scoreEarned = Math.max(1, Math.round(10 - timeTaken));
      player.score += scoreEarned;
    }
    player.hasVoted = true;
    socket.emit("show answer", result);
  }

  everyoneVoted() {
    return this.players.every((player) => player.hasVoted);
  }

  resetPlayersVote() {
    this.players.every((players) => (players.hasVoted = false));
  }

  waitingPlayers() {
    this.io.to(this.roomId).emit("waiting players");
  }

  roundOn() {
    this.io.to(this.roomId).emit("round on");
  }

  broadcastCitation() {
    this.io.to(this.roomId).emit("update citation", this.currentCitation);
  }

  broadcastPlayers() {
    this.io.to(this.roomId).emit("send players", this.players);
  }

  broadcastContext() {
    this.io.to(this.roomId).emit("show context");
  }

  broadcastRoomId(socket) {
    socket.emit("send roomId", this.roomId);
  }

  broadcastMasterToken(socket) {
    if (this.masterId == socket.id) {
      socket.emit("send masterToken", this.masterId);
    }
  }
}
