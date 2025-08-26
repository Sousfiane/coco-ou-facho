class RoomState {
  constructor(room) {
    this.room = room;
  }
  onEnter() {
    throw new Error("Methode not implemented");
  }
  onExit() {
    throw new Error("Methode not implemented");
  }
  handleStart() {
    throw new Error("Methode not implemented");
  }
  handleJoin(socket, player) {
    throw new Error("Methode not implemented");
  }
  handleVote(socket, vote) {
    throw new Error("Methode not implemented");
  }
  getName() {
    return this.constructor.name;
  }
}

class WaitingState extends RoomState {
  onEnter() {
    console.log("Entering", this.getName());
  }
  onExit() {
    console.log("Exiting ", this.getName());
  }
  handleStart() {
    console.log("Starting game");
    this.room.changeState(new PlayingState(this.room));
  }
  handleJoin(socket, player) {
    console.log(`${socket.id} joined the room #${this.room.roomId}`);
    socket.join(this.room.roomId);
    this.room.players.push(player);
    this.room.broadcastRoomId(socket);
    this.room.broadcastMasterToken(socket);
    this.room.broadcastPlayers();
    this.room.waitingPlayers();
  }
  handleVote(player, vote) {
    console.log("The game hasn't started yet");
  }
}

class PlayingState extends RoomState {
  onEnter() {
    console.log("Entering", this.getName());
    this.room.pickRandomCitation();
    this.room.broadcastCitation();
    this.room.changeState(new RoundVotingState(this.room));
  }
  onExit() {
    console.log("Exiting ", this.getName());
  }
  handleStart() {
    console.log("The Game has already started");
  }
  handleJoin(socket, player) {
    console.log(
      `${player.name} tried to join the room #${this.room.roomId} but the game already started`,
    );
  }
  handleVote(socket, vote) {
    console.log("Can't vote yet");
  }
}

class RoundVotingState extends RoomState {
  startTime = Date.now();
  onEnter() {
    console.log("Entering ", this.getName());
    this.room.roundOn();
  }
  onExit() {
    console.log("Exiting ", this.getName());
  }
  handleStart() {
    console.log("The Game has already started");
  }
  handleJoin(player) {
    console.log(
      `${player.name} tried to join the room #${this.room.roomId} but the game already started`,
    );
  }
  handleVote(socket, vote) {
    console.log(`${socket.id} has voted in room #${this.room.roomId}`);
    this.room.checkVote(socket, vote, this.startTime);
    this.room.broadcastPlayers();
    if (this.room.everyoneVoted()) {
      this.room.currentRound++;
      this.room.changeState(new RoundEndingState(this.room));
    }
  }
}

class RoundEndingState extends RoomState {
  onEnter() {
    console.log("Entering", this.getName());
    this.room.resetPlayersVote();
    this.room.broadcastContext();
  }
  onExit() {
    console.log("Exiting ", this.getName());
  }
  handleStart() {
    console.log("The Game has already started");
  }
  handleJoin(socket, player) {
    console.log(
      `${player.name} tried to join the room #${this.room.roomId} but the game already started`,
    );
  }
  handleVote(socket, vote) {
    console.log("Can't vote yet");
  }
}

class FinishedState extends RoomState {}

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
