import CountdownState from "./CountdownState.js";
import RoomState from "./RoomState.js";

export default class WaitingState extends RoomState {
  handleStart() {
    super.onEnter();
    this.room.changeState(new CountdownState(this.room));
  }
  handleJoin(socketId, player) {
    console.log(`Room #${this.room.roomId}: ${socketId} joined the game`);
    const socket = this.room.io.sockets.sockets.get(socketId);
    socket.join(this.room.roomId);
    this.room.players.push(player);
    this.room.broadcastRoomId(socketId);
    this.room.broadcastMasterId();
    this.room.broadcastPlayers();
    this.room.broadcastAvatars(socketId);
    this.room.broadcastWaiting(socketId);
  }
}
