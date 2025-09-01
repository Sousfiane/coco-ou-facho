import Button from "./Button";
import Scoreboard from "./Scoreboard";

const Game = ({
  citation,
  players,
  showAnswer,
  isMaster,
  showContext,
  onVoteLeft,
  onVoteRight,
  onNextRound,
}) => {
  const coco = "text-slate-50 bg-red-600 hover:bg-red-700 ";
  const facho = "text-slate-50 bg-slate-950 hover:bg-slate-700 ";
  return (
    <div className="rounded-md shadow-xl max-w-xl w-full p-4 h-full">
      <div
        className={
          "rounded-md full p-4 " +
          (!showAnswer ? "" : citation.camp === "droite" ? facho : coco)
        }
      >
        <h2 className="italic text-lg font-medium">
          "{citation?.texte || "Citation..."}"
        </h2>
        <h4 className="font-medium mt-1">
          {showAnswer && citation.auteur + " - " + citation.annee}
        </h4>
        <p className="mt-1">
          {showContext && "Contexte : " + citation.contexte}
        </p>
      </div>
      {!showContext && (
        <div className="flex gap-2 mt-4">
          <Button children={"coco"} onClick={onVoteLeft} color={coco} />
          <Button children={"facho"} onClick={onVoteRight} color={facho} />
        </div>
      )}

      <Scoreboard players={players} />
      {showContext && isMaster && (
        <Button children={"Round suivant"} onClick={onNextRound} />
      )}
    </div>
  );
};

export default Game;
