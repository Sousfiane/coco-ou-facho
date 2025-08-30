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
    <div className="card">
      <h2>Room #{roomId}</h2>
      <Scoreboard players={players} waiting={true} />
      <div className="avatarPicker">
        {avatarList.map((avatarPath) => (
          <img
            onClick={() => handlePickAvatar(avatarPath)}
            key={avatarPath}
            src={avatarPath}
          ></img>
        ))}
      </div>

      {isMaster && <button onClick={onLaunch}>Launch Game</button>}
    </div>
  );
};

export default WaitingRoom;
