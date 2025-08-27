const WaitingRoom = ({ roomId, players, isMaster, onLaunch }) => {
  return (
    <div className="card">
      <h2>Room #{roomId}</h2>
      <ul>
        {players.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>

      {isMaster && <button onClick={onLaunch}>Launch Game</button>}
    </div>
  );
};

export default WaitingRoom;
