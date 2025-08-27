import RoundVotingState from "./RoundVotingState.js";
import RoomState from "./RoomState.js";

export default class PlayingState extends RoomState {
  onEnter() {
    super.onEnter();
    this.room.pickRandomCitation();
    let tick = 3;
    this.room.broadcastCountdown(tick);
    const countDown = setInterval(() => {
      tick--;
      this.room.broadcastCountdown(tick);
      if (tick === 0) {
        clearInterval(countDown);
        this.room.changeState(new RoundVotingState(this.room));
      }
    }, 1000);
  }
}
