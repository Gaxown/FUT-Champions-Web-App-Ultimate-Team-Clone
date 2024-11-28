let selectedPlayers = JSON.parse(localStorage.getItem("selectedPlayers")) || {};

async function loadPlayers() {
  try {
    const response = await fetch("players.json");
    const data = await response.json();
    const playersContainer = document.getElementById("players-dataset");

    data.players.forEach((player) => {
      const playerCard = createPlayerCard(player);
      playersContainer.appendChild(playerCard);
    });
  } catch (error) {
    console.error("Error loading players:", error);
  }
}

function createPlayerCard(player) {
  const card = document.createElement("div");
  card.className =
    "player-dataset-card relative w-[200px] h-[300px] cursor-pointer hover:transform hover:scale-105 transition-all duration-300";
  card.setAttribute("data-position", player.position);

  card.innerHTML = `
    <div class="relative w-full h-full" style="background-image: url('../src/img/badge_gold.webp'); background-size: auto; background-repeat: no-repeat; background-position: center;">
      <!-- Rating & Position -->
      <div class="absolute top-[10%] left-[12%] text-[2rem] font-bold text-black">
        ${player.rating}
      </div>
      <div class="absolute top-[22%] left-[12%] text-[1.2rem] font-bold text-black">
        ${player.position}
      </div>

      <!-- Player Image -->
      <div class="absolute top-[15%] left-1/2 transform -translate-x-1/2 w-[80%] h-[50%]">
        <img src="${player.photo}" class="w-full h-full object-contain" alt="${player.name}">
      </div>

      <!-- Player Name -->
      <div class="absolute top-[65%] left-1/2 transform -translate-x-1/2 text-center w-full">
        <span class="text-black font-bold text-[1rem]">${player.name}</span>
      </div>

      <!-- Stats -->
      <div class="absolute bottom-[14%] left-[3%] right-[3%] text-[0.8rem] text-black font-medium">
        <div class="flex justify-between">
          <span>PAC</span>
          <span>SHO</span>
          <span>PAS</span>
          <span>DRI</span>
          <span>DEF</span>
          <span>PHY</span>
        </div>
        <div class="flex justify-between font-bold">
          <span>${player.skills.pace}</span>
          <span>${player.skills.shooting}</span>
          <span>${player.skills.passing}</span>
          <span>${player.skills.dribbling}</span>
          <span>${player.skills.defending}</span>
          <span>${player.skills.physical}</span>
        </div>
      </div>

      <!-- Country & Club Icons -->
      <div class="absolute bottom-[5%] left-0 w-full flex justify-center items-center gap-2">
        <img src="${player.flag}" class="w-6 h-4 object-cover" alt="${player.nationality}">
        <img src="${player.logo}" class="w-6 h-6 object-contain" alt="${player.club}">
      </div>
    </div>
  `;

  // Add drag functionality
  card.setAttribute("draggable", true);
  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(player));
    e.target.classList.add("dragging");
  });

  card.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
  });

  card.addEventListener("click", () => showPlayerDetails(player));
  return card;
}

function showPlayerDetails(player) {
  const detailsContainer = document.getElementById("player-details");
  detailsContainer.classList.remove("hidden");

  const skillBars = Object.entries(player.skills)
    .map(
      ([skill, value]) => `
        <div class="mb-2">
            <div class="flex justify-between text-sm mb-1">
                <span class="text-white capitalize">${skill}</span>
                <span class="text-[#04bc88]">${value}</span>
            </div>
            <div class="h-2 bg-[#2a2a2a] rounded overflow-hidden">
                <div class="h-full bg-gradient-to-r from-[#04bc88] to-[#04bc88]/80" 
                     style="width: ${value}%"></div>
            </div>
        </div>
    `
    )
    .join("");

  detailsContainer.innerHTML = `
        <div class="flex justify-between items-start mb-6">
            <div class="relative">
                <div class="absolute top-0 right-0 bg-[#04bc88] text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
                    ${player.rating}
                </div>
                <div class="flex items-center gap-4">
                    <img src="${player.photo}" alt="${
    player.name
  }" class="w-24 h-24 object-contain">
                    <div>
                        <h3 class="text-white font-bold text-xl">${
                          player.name
                        }</h3>
                        <div class="flex items-center gap-2 mt-1">
                            <img src="${player.flag}" alt="${
    player.nationality
  }" class="w-6 h-4 object-cover rounded">
                            <span class="text-gray-400">${
                              player.nationality
                            }</span>
                        </div>
                        <div class="flex items-center gap-2 mt-1">
                            <img src="${player.logo}" alt="${
    player.club
  }" class="w-6 h-6 object-contain">
                            <span class="text-gray-400">${player.club}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="showEditPlayerModal(${JSON.stringify(
                  player
                ).replace(/"/g, "&quot;")})" 
                        class="bg-[#2a2a2a] hover:bg-[#333] text-white p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>
                <button onclick="confirmDeletePlayer('${player.name}')" 
                        class="bg-[#2a2a2a] hover:bg-[#333] text-red-500 p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="space-y-1">
            <h4 class="text-white font-semibold mb-3">Player Stats</h4>
            ${skillBars}
        </div>

        <div class="mt-6 p-4 bg-[#2a2a2a] rounded-lg">
            <div class="flex items-center justify-between">
                <span class="text-white font-semibold">Position</span>
                <span class="text-[#04bc88] font-bold">${player.position}</span>
            </div>
        </div>
    `;
}

// Add this to your CSS
const styles = `
.player-dataset-card {
  overflow: hidden;
  transition: all 0.3s ease;
}

.player-dataset-card:hover {
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  transform: scale(1.05);
}
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Add some additional styles
const additionalStyles = `
    .player-details-enter {
        opacity: 0;
        transform: translateY(10px);
    }
    .player-details-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.3s ease-out;
    }
`;

styleSheet.textContent += additionalStyles;

// Load players when the document is ready
document.addEventListener("DOMContentLoaded", loadPlayers);

function isValidPosition(player, targetPosition) {
  // Define position compatibility
  const positionGroups = {
    ST: ["ST", "CF"],
    LW: ["LW", "LM"],
    RW: ["RW", "RM"],
    CM: ["CM", "CAM", "CDM"],
    CDM: ["CDM", "CM"],
    LB: ["LB", "LWB"],
    RB: ["RB", "RWB"],
    CB: ["CB"],
    GK: ["GK"],
  };

  return positionGroups[targetPosition]?.includes(player.position);
}

// Update the player position storage
function updatePlayerPosition(playerId, positionId) {
  selectedPlayers[positionId] = playerId;
  localStorage.setItem("selectedPlayers", JSON.stringify(selectedPlayers));
}

function removePlayerFromPosition(positionId) {
  delete selectedPlayers[positionId];
  localStorage.setItem("selectedPlayers", JSON.stringify(selectedPlayers));
}
