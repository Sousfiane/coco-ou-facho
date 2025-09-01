import Button from "./Button";
import Title from "./Title";
import Scoreboard from "./Scoreboard";

const WaitingRoom = ({
  roomId,
  players,
  avatarList,
  isMaster,
  onLaunch,
  onPickAvatar,
}) => {
  const handlePickAvatar = (avatarPath) => {
    onPickAvatar(avatarPath);
  };
  return (
    <div className="rounded-md shadow-xl max-w-xl w-full p-4 h-full">
      <Title children={`Room #${roomId}`} />
      <Scoreboard players={players} waiting={true} />
      <div className="grid grid-cols-6 place-items-center gap-2 mt-2">
        {avatarList.map((avatarPath) => (
          <img
            className="rounded-lg border-2 border-transparent hover:border-blue-500 hover:scale-105 transition-transform duration-200"
            onClick={() => handlePickAvatar(avatarPath)}
            key={avatarPath}
            src={avatarPath}
          ></img>
        ))}
      </div>

      {isMaster && <Button children={"Lancer un partie"} onClick={onLaunch} />}
    </div>
  );
};

export default WaitingRoom;
