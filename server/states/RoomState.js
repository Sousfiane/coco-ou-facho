export default class RoomState {
  constructor(room) {
    this.room = room;
  }
  onEnter() {
    console.log(`Room #${this.room.roomId}: Entering`, this.getName());
  }
  onExit() {
    console.log(`Room #${this.room.roomId}: Exiting`, this.getName());
  }
  handleStart() {
    console.log(
      `Room #${this.room.roomId}: Can't start, the game is already started`,
    );
  }
  handleJoin(socket, player) {
    console.log(
      `Room #${this.room.roomId}: ${socket.id} tried to join the room but the game already started`,
    );
  }
  handleVote(socket, vote) {
    console.log(`Room #${this.room.roomId}: Can't vote yet`);
  }
  handleDisconnect(socketId) {
    this.room.players = this.room.players.filter(
      (player) => player.id !== socketId,
    );
    if (socketId === this.room.masterId && this.room.players.length !== 0) {
      this.room.masterId = this.room.players[0].id;
      this.room.io.to(this.masterId).emit("send masterToken", this.masterId);
    }
    this.room.broadcastPlayers();
  }
  getName() {
    return this.constructor.name;
  }
}
