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
  handleJoin(socketId, player) {
    console.log(
      `Room #${this.room.roomId}: ${socketId} tried to join the room but the game already started`,
    );
  }
  handleVote(socketId, vote) {
    console.log(`Room #${this.room.roomId}: Can't vote yet`);
  }
  handleDisconnect(socketId) {
    this.room.players = this.room.players.filter(
      (player) => player.id !== socketId,
    );
    if (socketId === this.room.masterId && this.room.players.length !== 0) {
      this.room.masterId = this.room.players[0].id;
      this.room.broadcastMasterId();
    }
    this.room.broadcastPlayers();
  }
  getName() {
    return this.constructor.name;
  }
}
