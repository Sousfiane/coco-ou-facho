import Scoreboard from "./Scoreboard";
const EndGame = ({ players, isMaster, onRelaunch }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="card">
      <h2>Game Over</h2>
      <Scoreboard players={players} />
      {isMaster && <button onClick={onRelaunch}>Relaunch Game</button>}
    </div>
  );
};

export default EndGame;
