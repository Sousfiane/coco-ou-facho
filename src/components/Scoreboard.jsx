const Scoreboard = ({ players, waiting }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  return (
    <div>
      <ul>
        {sortedPlayers.map((p, index) => (
          <li
            className="flex justify-between items-center bg-gray-100 border border-slate-300 rounded-md p-1 mt-2"
            key={p.id}
          >
            <div className="flex items-center">
              <img className="rounded-md w-10 mr-2" src={p.avatar}></img>
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
