import PlayingState from "./PlayingState.js";
import RoomState from "./RoomState.js";

export default class WaitingState extends RoomState {
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
