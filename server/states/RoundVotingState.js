import RoundEndingState from "./RoundEndingState.js";
import RoomState from "./RoomState.js";

export default class RoundVotingState extends RoomState {
  startTime = Date.now();
  onEnter() {
    super.onEnter();
    this.room.pickRandomCitation();
    this.room.broadcastCitation();
  }
  handleVote(socketId, vote) {
    console.log(`Room #${this.room.roomId}: ${socketId} has voted`);
    this.room.checkVote(socketId, vote, this.startTime);
    this.room.broadcastPlayers();
    this.ifAllVotesGoContext();
  }
  handleDisconnect(socketId) {
    super.handleDisconnect(socketId);
    this.ifAllVotesGoContext();
  }

  ifAllVotesGoContext() {
    if (this.room.everyoneVoted()) {
      this.room.currentRound++;
      setTimeout(() => {
        this.room.changeState(new RoundEndingState(this.room));
      }, 1000);
    }
  }
}
