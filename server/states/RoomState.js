export default class RoomState {
  constructor(room) {
    this.room = room;
  }
  onEnter() {
    throw new Error("Methode not implemented");
  }
  onExit() {
    throw new Error("Methode not implemented");
  }
  handleStart() {
    throw new Error("Methode not implemented");
  }
  handleJoin(socket, player) {
    throw new Error("Methode not implemented");
  }
  handleVote(socket, vote) {
    throw new Error("Methode not implemented");
  }
  getName() {
    return this.constructor.name;
  }
}
