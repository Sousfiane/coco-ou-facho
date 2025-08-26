import RoundEndingState from "./RoundEndingState.js";
import RoomState from "./RoomState.js";

export default class RoundVotingState extends RoomState {
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
