const EndGame = ({ players, isMaster, onRelaunch }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="card">
      <h2>Game Over</h2>

      <ul className="">
        {sortedPlayers.map((p, index) => (
          <li key={p.id}>
            <span>
              {index + 1}. {p.name}
            </span>
            <span>{p.score} pts</span>
          </li>
        ))}
      </ul>

      {isMaster && <button onClick={onRelaunch}>Relaunch Game</button>}
    </div>
  );
};

export default EndGame;
