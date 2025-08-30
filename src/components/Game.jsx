import Scoreboard from "./Scoreboard";
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
        <h2 className="citationText">"{citation?.texte || "Citation..."}"</h2>
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

      <Scoreboard players={players} />
      {showContext && isMaster && (
        <div className="">
          <button onClick={onNextRound}>Round suivant</button>
        </div>
      )}
    </div>
  );
};

export default Game;
