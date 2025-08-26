export const UIManager = {
  app: document.getElementById("app"),

  showPlayerForm(onCreate, onJoin) {
    this.app.innerHTML = `
      <h2>Créer ou rejoindre une partie</h2>
      <input id="playerName" placeholder="Votre pseudo" />
      <input id="roomId" placeholder="ID de la salle" />
      <button id="createRoomBtn">Créer une salle</button>
      <button id="joinRoomBtn">Rejoindre</button>
    `;
    document.getElementById("createRoomBtn").onclick = onCreate;
    document.getElementById("joinRoomBtn").onclick = onJoin;
  },

  showWaitingRoom(roomId, players, isMaster, onLaunch) {
    this.app.innerHTML = `
      <h2>Room #${roomId}</h2>
      <ul>${players.map((p) => `<li>${p.name}</li>`).join("")}</ul>
      ${isMaster ? `<button id="launchButton">Lancer</button>` : ""}
    `;
    if (isMaster) {
      document.getElementById("launchButton").onclick = onLaunch;
    }
  },

  showGame(citation, players, onVoteLeft, onVoteRight) {
    this.app.innerHTML = `
      <div id="citationContainer">
          <h2 id="citationText">${citation.texte || "Citation..."}</h2>
      </div>
      <div class="buttons">
        <button id="leftButton">Coco</button>
        <button id="rightButton">Facho</button>
      </div>
      <h3>Joueurs</h3>
      <ul id="players">
        ${players.map((p) => `<li>${p.name} : ${p.score || 0} points</li>`).join("")}
      </ul>
    `;

    document.getElementById("leftButton").onclick = onVoteLeft;
    document.getElementById("rightButton").onclick = onVoteRight;
  },

  showContext(citation, players, isMaster, onNextRound) {
    this.app.innerHTML = `
      <div id="citationContainer">
          <h2 id="citationText">${citation.texte || "Citation..."}</h2>
          <p>${citation.auteur || Réponse}</p>
      </div>
      <h3>Scoreboard</h3>
      <ul id="players">
        ${players.map((p) => `<li>${p.name} : ${p.score || 0} points</li>`).join("")}
      </ul>
      ${isMaster ? `<button id="nextRoundButton">Round suivant</button>` : ""}
    `;
    if (isMaster) {
      document.getElementById("nextRoundButton").onclick = onNextRound;
    }
  },

  showAnswer(result) {
    let citationContainer = document.getElementById("citationContainer");
    if (result) {
      citationContainer.classList.add("correct");
    } else {
      citationContainer.classList.add("incorrect");
    }
  },
};
