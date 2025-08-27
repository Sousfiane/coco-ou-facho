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
  const [isMaster, setIsMaster] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [currentView, setCurrentView] = useState("form"); // form, waiting, countdown, game
  const [citation, setCitation] = useState(null);
  const [result, setResult] = useState(null);
  const [context, setContext] = useState(false);

  useEffect(() => {
    socket.on("send roomId", (id) => setRoomId(id));
    socket.on("send masterToken", () => setIsMaster(true));
    socket.on("send players", (updatedPlayers) => setPlayers(updatedPlayers));
    socket.on("waiting players", () => setCurrentView("waiting"));
    socket.on("send countdown", (tick) => {
      setCountdown(tick);
      setCurrentView("countdown");
    });
    socket.on("send citation", (citationData) => {
      setCitation(citationData);
      setResult(null);
      setContext(false);
      setCurrentView("game");
    });
    socket.on("show answer", (result) => {
      setResult(result);
    });
    socket.on("show context", () => {
      setContext(true);
    });
    socket.on("end game", () => {
      setCurrentView("endgame");
    });

    return () => {
      socket.off("send roomId");
      socket.off("send masterToken");
      socket.off("send players");
      socket.off("waiting players");
      socket.off("send countdown");
      socket.off("udpate citation");
      socket.off("show answer");
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
    socket.emit("relaunch game", roomId); // Server should reset the game
  };

  if (currentView === "form") {
    return <PlayerForm onCreate={handleCreateRoom} onJoin={handleJoinRoom} />;
  }

  if (currentView === "waiting") {
    return (
      <WaitingRoom
        roomId={roomId}
        players={players}
        isMaster={isMaster}
        onLaunch={handleLaunchGame}
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
        isMaster={isMaster}
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
        isMaster={isMaster}
        onRelaunch={handleRelaunchGame}
      />
    );
  }

  return <div>Loading...</div>;
}

export default App;
