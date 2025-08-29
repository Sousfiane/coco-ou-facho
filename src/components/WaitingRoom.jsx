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
      <ul>
        {players.map((p) => (
          <li key={p.id}>
            <div>
              <img src={p.avatar || "null"}></img>
              <span>{p.name}</span>
            </div>
          </li>
        ))}
      </ul>

      <div>
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
