let selectedPlayers = JSON.parse(localStorage.getItem("selectedPlayers")) || {};

function updatePlayerPosition(playerId, positionId) {
  selectedPlayers[positionId] = playerId;
  localStorage.setItem("selectedPlayers", JSON.stringify(selectedPlayers));
}

function removePlayerFromPosition(positionId) {
  delete selectedPlayers[positionId];
  localStorage.setItem("selectedPlayers", JSON.stringify(selectedPlayers));
}
