import { useState } from "react";
import DOMPurify from "dompurify";

const PlayerForm = ({ onCreate, onJoin }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const handleCreate = () => {
    const sanitizedName = DOMPurify.sanitize(name);
    if (!sanitizedName) return alert("Enter a username");
    onCreate(sanitizedName);
  };

  const handleJoin = () => {
    const sanitizedName = DOMPurify.sanitize(name);
    const sanitizedRoom = DOMPurify.sanitize(room);
    if (!sanitizedName) return alert("Enter a username");
    if (!sanitizedRoom) return alert("Enter a Room");
    onJoin(sanitizedName, sanitizedRoom);
  };

  return (
    <div className="card">
      <h2>Créer ou rejoindre une partie</h2>
      <input
        placeholder="Votre pseudo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="ID de la salle"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <div className="buttons">
        <button onClick={handleCreate}>Créer une salle</button>
        <button onClick={handleJoin}>Rejoindre</button>
      </div>
    </div>
  );
};

export default PlayerForm;
