import Title from "./Title";
import Button from "./Button";
import Scoreboard from "./Scoreboard";

const EndGame = ({ players, isMaster, onRelaunch }) => {
  return (
    <div className="rounded-md shadow-xl max-w-xl w-full p-4 h-full">
      <Title children={"Scoreboard"} />
      <Scoreboard players={players} />
      {isMaster && <Button children={"Rejouer"} onClick={onRelaunch} />}
    </div>
  );
};

export default EndGame;
