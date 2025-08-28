const Game = ({
  citation,
  players,
  answer,
  isMaster,
  showContext,
  onVoteLeft,
  onVoteRight,
  onNextRound,
}) => {
  return (
    <div className="card">
      <div
        className={`citationContainer${answer === null ? "" : answer ? " correct" : " incorrect"}`}
      >
        <h2 className="citationText">{citation?.texte || "Citation..."}</h2>
        <h4>{answer === null || citation.auteur}</h4>
        <p>{showContext ? citation.contexte : ""}</p>
      </div>
      {!showContext && (
        <div className="buttons">
          <button className="leftButton" onClick={onVoteLeft}>
            Coco
          </button>
          <button className="rightButton" onClick={onVoteRight}>
            Facho
          </button>
        </div>
      )}

      {/* Players and Scores */}
      <div>
        <h3>Joueurs</h3>
        <ul>
          {players.map((p) => (
            <li key={p.id}>
              <span>{p.name}</span>
              <span>{p.score || 0} pts</span>
            </li>
          ))}
        </ul>
      </div>

      {showContext && isMaster && (
        <div className="">
          <button onClick={onNextRound}>Round suivant</button>
        </div>
      )}
    </div>
  );
};

export default Game;
