import RoomState from "./RoomState.js";

export default class FinishedState extends RoomState {
  onEnter() {
    super.onEnter();
    this.room.broadcastEndgame();
  }
}
