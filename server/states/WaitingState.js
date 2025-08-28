import PlayingState from "./PlayingState.js";
import RoomState from "./RoomState.js";

export default class WaitingState extends RoomState {
  handleStart() {
    super.onEnter();
    this.room.changeState(new PlayingState(this.room));
  }
  handleJoin(socket, player) {
    console.log(`Room #${this.room.roomId}: ${socket.id} joined the game`);
    socket.join(this.room.roomId);
    this.room.players.push(player);
    this.room.broadcastRoomId(socket);
    this.room.broadcastMasterToken(socket);
    this.room.broadcastPlayers();
    this.room.broadcastWaiting(socket);
  }
}
