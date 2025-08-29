import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import PlayerForm from "./components/PlayerForm";
import WaitingRoom from "./components/WaitingRoom";
import Countdown from "./components/Countdown";
import Game from "./components/Game";
import EndGame from "./components/EndGame";

const socket = io();

function App() {
  const [players, setPlayers] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [masterId, setMasterId] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [currentView, setCurrentView] = useState("form");
  const [citation, setCitation] = useState(null);
  const [result, setResult] = useState(null);
  const [context, setContext] = useState(false);
  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    socket.on("send roomId", (id) => setRoomId(id));
    socket.on("send masterId", (id) => setMasterId(id));
    socket.on("send players", (updatedPlayers) => setPlayers(updatedPlayers));
    socket.on("waiting players", () => setCurrentView("waiting"));
    socket.on("send countdown", () => setCurrentView("countdown"));
    socket.on("send tick", (tick) => setCountdown(tick));
    socket.on("show answer", (result) => setResult(result));
    socket.on("show context", () => setContext(true));
    socket.on("end game", () => setCurrentView("endgame"));
    socket.on("send avatars", (avatarList) => setAvatars(avatarList));
    socket.on("send citation", (citationData) => {
      setCitation(citationData);
      setResult(null);
      setContext(false);
      setCurrentView("game");
    });

    return () => {
      socket.off("send roomId");
      socket.off("send masterToken");
      socket.off("send players");
      socket.off("waiting players");
      socket.off("send countdown");
      socket.off("send tick");
      socket.off("udpate citation");
      socket.off("show answer");
      socket.off("show context");
      socket.off("end game");
      socket.off("send avatars");
    };
  }, []);

  const handleCreateRoom = (name) => {
    socket.emit("create room", name);
  };

  const handleJoinRoom = (name, room) => {
    socket.emit("join room", name, room);
  };

  const handleLaunchGame = () => {
    socket.emit("launch game", roomId);
  };

  const handleVoteLeft = () => {
    socket.emit("send vote", roomId, "gauche");
  };

  const handleVoteRight = () => {
    socket.emit("send vote", roomId, "droite");
  };

  const handleNextRound = () => {
    socket.emit("next round", roomId, "droite");
  };

  const handleRelaunchGame = () => {
    socket.emit("relaunch game", roomId);
  };

  const handlePickAvatar = (avatarPath) => {
    socket.emit("pick avatar", roomId, avatarPath);
  };

  if (currentView === "form") {
    return <PlayerForm onCreate={handleCreateRoom} onJoin={handleJoinRoom} />;
  }

  if (currentView === "waiting") {
    return (
      <WaitingRoom
        roomId={roomId}
        players={players}
        isMaster={socket.id === masterId}
        avatarList={avatars}
        onLaunch={handleLaunchGame}
        onPickAvatar={handlePickAvatar}
      />
    );
  }

  if (currentView === "countdown") {
    return <Countdown tick={countdown} />;
  }

  if (currentView === "game") {
    return (
      <Game
        citation={citation}
        players={players}
        answer={result}
        showContext={context}
        isMaster={socket.id === masterId}
        onVoteLeft={handleVoteLeft}
        onVoteRight={handleVoteRight}
        onNextRound={handleNextRound}
      />
    );
  }

  if (currentView === "endgame") {
    return (
      <EndGame
        players={players}
        isMaster={socket.id === masterId}
        onRelaunch={handleRelaunchGame}
      />
    );
  }

  return <div>Loading...</div>;
}

export default App;
