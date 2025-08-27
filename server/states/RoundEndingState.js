import RoomState from "./RoomState.js";

export default class RoundEndingState extends RoomState {
  onEnter() {
    super.onEnter();
    this.room.resetPlayersVote();
    this.room.broadcastContext();
  }
}
