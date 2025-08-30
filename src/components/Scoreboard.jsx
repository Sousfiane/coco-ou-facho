const Scoreboard = ({ players, waiting }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  return (
    <div>
      <ul className="">
        {sortedPlayers.map((p, index) => (
          <li key={p.id}>
            <div className="playerContainer">
              <img className="avatar" src={p.avatar}></img>
              <span>
                {waiting ? "" : index + 1 + ". "} {p.name}
              </span>
            </div>
            <span>{waiting ? "" : `${p.score} pts`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scoreboard;
