import RoundVotingState from "./RoundVotingState.js";
import RoomState from "./RoomState.js";

export default class PlayingState extends RoomState {
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
