import RoundVotingState from "./RoundVotingState.js";
import RoomState from "./RoomState.js";

export default class CountdownState extends RoomState {
  onEnter() {
    super.onEnter();
    this.sendTick();
    this.room.broadcastCountdown();
  }

  sendTick() {
    let tick = 3;
    this.room.broadcastTick(tick);
    const countDown = setInterval(() => {
      tick--;
      this.room.broadcastTick(tick);
      if (tick === 0) {
        clearInterval(countDown);
        this.room.changeState(new RoundVotingState(this.room));
      }
    }, 1000);
  }
}
