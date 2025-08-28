import RoundEndingState from "./RoundEndingState.js";
import RoomState from "./RoomState.js";

export default class RoundVotingState extends RoomState {
  startTime = Date.now();
  onEnter() {
    super.onEnter();
    this.room.broadcastCitation();
  }
  handleVote(socket, vote) {
    console.log(`Room #${this.room.roomId}: ${socket.id} has voted`);
    this.room.checkVote(socket, vote, this.startTime);
    this.room.broadcastPlayers();
    if (this.room.everyoneVoted()) {
      this.room.currentRound++;
      setTimeout(() => {
        this.room.changeState(new RoundEndingState(this.room));
      }, 1000);
    }
  }
  handleDisconnect(socketId) {
    super.handleDisconnect(socketId);
    if (this.room.everyoneVoted()) {
      this.room.currentRound++;
      setTimeout(() => {
        this.room.changeState(new RoundEndingState(this.room));
      }, 1000);
    }
  }
}
