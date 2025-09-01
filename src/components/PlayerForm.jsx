import { useState } from "react";
import DOMPurify from "dompurify";
import Button from "./Button";
import Input from "./Input";
import Title from "./Title";

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
    <div className="rounded-md shadow-xl max-w-xl w-full p-4 h-full">
      <Title children={"Créer ou rejoindre une partie"} />
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Votre pseudo"
      />

      <Input
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="ID de la salle"
      />

      <div className="flex gap-2 mt-4">
        <Button onClick={handleCreate}>Créer une Salle</Button>
        <Button onClick={handleJoin}>Rejoindre une Salle</Button>
      </div>
    </div>
  );
};

export default PlayerForm;
