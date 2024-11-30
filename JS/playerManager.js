class PlayerManager {
  constructor() {
    this.players = this.loadPlayers();
  }

  loadPlayers() {
    const storedPlayers = localStorage.getItem("players");
    if (!storedPlayers) {
      // Initialize with data from players.json
      fetch("players.json")
        .then((response) => response.json())
        .then((data) => {
          this.players = data.players;
          this.savePlayers();
          this.renderPlayers();
        });
      return [];
    }
    return JSON.parse(storedPlayers);
  }

  savePlayers() {
    localStorage.setItem("players", JSON.stringify(this.players));
  }

  addPlayer(player) {
    this.players.push(player);
    this.savePlayers();
    this.renderPlayers();
  }

  updatePlayer(updatedPlayer) {
    const index = this.players.findIndex((p) => p.name === updatedPlayer.name);
    if (index !== -1) {
      this.players[index] = updatedPlayer;
      this.savePlayers();
      this.renderPlayers();
    }
  }

  deletePlayer(playerName) {
    this.players = this.players.filter((p) => p.name !== playerName);
    this.savePlayers();
    this.renderPlayers();
  }

  renderPlayers() {
    const playersContainer = document.getElementById("players-dataset");
    playersContainer.innerHTML = "";
    this.players.forEach((player) => {
      const playerCard = createPlayerCard(player);
      playersContainer.appendChild(playerCard);
    });
  }
}

// Modal functions
function showAddPlayerModal() {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
  modal.innerHTML = `
        <div class="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md">
            <h2 class="text-white text-xl font-bold mb-4">Add New Player</h2>
            <form id="addPlayerForm" class="space-y-4">
                <!-- Add form fields for player details -->
                <button type="submit" class="w-full bg-[#04bc88] text-white py-2 rounded">Add Player</button>
            </form>
        </div>
    `;
  document.body.appendChild(modal);
}

function showEditPlayerModal(player) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
  modal.innerHTML = `
        <div class="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md">
            <h2 class="text-white text-xl font-bold mb-4">Edit Player</h2>
            <form id="editPlayerForm" class="space-y-4">
                <!-- Add form fields pre-filled with player data -->
                <button type="submit" class="w-full bg-[#04bc88] text-white py-2 rounded">Save Changes</button>
            </form>
        </div>
    `;
  document.body.appendChild(modal);
}

function confirmDeletePlayer(playerName) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
  modal.innerHTML = `
        <div class="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md">
            <h2 class="text-white text-xl font-bold mb-4">Delete Player</h2>
            <p class="text-gray-400 mb-4">Are you sure you want to delete ${playerName}?</p>
            <div class="flex justify-end gap-2">
                <button onclick="this.closest('.fixed').remove()" 
                        class="bg-[#2a2a2a] text-white px-4 py-2 rounded">Cancel</button>
                <button onclick="playerManager.deletePlayer('${playerName}')" 
                        class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
        </div>
    `;
  document.body.appendChild(modal);
}

// Initialize PlayerManager
const playerManager = new PlayerManager();
