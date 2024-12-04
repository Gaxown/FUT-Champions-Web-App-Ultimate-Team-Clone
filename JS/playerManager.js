function createFifaPlayerCard(player) {
  const card = document.createElement("div");
  card.className = "player-card-container relative";

  // Add responsive classes
  card.style.cssText = `
    width: clamp(140px, 25vw, 220px);
    height: clamp(175px, 30vw, 275px);
    background-image: url('../src/img/badge_gold.webp');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  `;

  card.innerHTML = `
    <div class="card-content">
      <!-- Rating -->
      <div class="absolute rating top-[20%] left-[18%] text-black font-bold" 
           style="font-size: clamp(16px, 2vw, 24px);">
        ${player.rating}
      </div>
      
      <!-- Position -->
      <div class="absolute top-[31%] left-[18%] text-black font-bold"
           style="font-size: clamp(14px, 1.8vw, 20px);">
        ${player.position}
      </div>

      <!-- Player Image -->
      <div class="absolute top-[0%] left-1/2 transform -translate-x-1/2 w-[80%] aspect-square">
        <img src="${player.photo}" class="w-full h-full object-contain" alt="${
    player.name
  }">
      </div>

      <!-- Player Name -->
      <div class="absolute top-[65%] left-1/2 transform -translate-x-1/2 text-center w-full">
        <span class="text-black font-bold" style="font-size: clamp(12px, 1.5vw, 18px);">
          ${player.name}
        </span>
      </div>

      <!-- Stats -->
      <div class="absolute bottom-[10%] left-[12%] text-black font-medium"
           style="font-size: clamp(10px, 1.2vw, 14px); width: 70%;">
        ${getPlayerStats(player)}
      </div>

      <!-- Icons -->
      <div class="absolute w-auto top-[43%] left-[14%] flex flex-col gap-2">
        <img src="${
          player.flag
        }" class="w-[clamp(16px,2vw,24px)] aspect-[4/3] object-cover" alt="${
    player.nationality
  }">
        <img src="${
          player.logo
        }" class="w-[clamp(16px,2vw,24px)] aspect-square object-contain" alt="${
    player.club
  }">
      </div>
    </div>
  `;

  return card;
}

function getPlayerStats(player) {
  if (player.position === "GK") {
    return `
            <div class=" absolute w-[90%] flex gap-1">
                <div>DIV ${player.skills.diving}</div>
                <div>HAN ${player.skills.handling}</div>
                <div>KIC ${player.skills.kicking}</div>
                <div>REF ${player.skills.reflexes}</div>
                <div>SPE ${player.skills.speed}</div>
                <div>POS ${player.skills.positioning}</div>
            </div>
        `;
  } else {
    return `
            <div class="flex gap-1">
                <div>PAC ${player.skills.pace}</div>
                <div>SHO ${player.skills.shooting}</div>
                <div>PAS ${player.skills.passing}</div>
                <div>DRI ${player.skills.dribbling}</div>
                <div>DEF ${player.skills.defending}</div>
                <div>PHY ${player.skills.physical}</div>
            </div>
        `;
  }
}

class PlayerManager {
  constructor() {
    this.players = this.loadPlayers();
  }

  loadPlayers() {
    const storedPlayers = localStorage.getItem("players");
    if (!storedPlayers) {
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
      const playerCard = createFifaPlayerCard(player);
      playersContainer.appendChild(playerCard);
    });
  }
}

export const playerManager = new PlayerManager();

export function showAddPlayerModal() {
  const template = document.getElementById("add-player-modal");
  const modal = template.content.cloneNode(true);
  document.body.appendChild(modal);

  const form = document.getElementById("addPlayerForm");
  const positionSelect = form.querySelector('[name="position"]');
  const regularStats = document.getElementById("regular-stats");
  const gkStats = document.getElementById("gk-stats");
  const previewCard = document.getElementById("preview-card");

  function updatePreview() {
    const formData = new FormData(form);
    const player = {
      name: formData.get("name") || "Player Name",
      photo: formData.get("photo") || "https://placeholder.com/120",
      position: formData.get("position") || "ST",
      nationality: formData.get("nationality") || "Country",
      flag: formData.get("flag") || "https://placeholder.com/30",
      club: formData.get("club") || "Club Name",
      logo: formData.get("logo") || "https://placeholder.com/30",
      rating: parseInt(formData.get("rating")) || 75,
      skills:
        formData.get("position") === "GK"
          ? {
              diving: parseInt(formData.get("diving")) || 75,
              handling: parseInt(formData.get("handling")) || 75,
              kicking: parseInt(formData.get("kicking")) || 75,
              reflexes: parseInt(formData.get("reflexes")) || 75,
              speed: parseInt(formData.get("speed")) || 75,
              positioning: parseInt(formData.get("positioning")) || 75,
            }
          : {
              pace: parseInt(formData.get("pace")) || 75,
              shooting: parseInt(formData.get("shooting")) || 75,
              passing: parseInt(formData.get("passing")) || 75,
              dribbling: parseInt(formData.get("dribbling")) || 75,
              defending: parseInt(formData.get("defending")) || 75,
              physical: parseInt(formData.get("physical")) || 75,
            },
    };

    previewCard.innerHTML = "";
    const card = createFifaPlayerCard(player);
    previewCard.appendChild(card);
  }

  form.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("input", updatePreview);
  });

  // Toggle between GK and regular player stats
  positionSelect.addEventListener("change", (e) => {
    if (e.target.value === "GK") {
      regularStats.classList.add("hidden");
      gkStats.classList.remove("hidden");
    } else {
      regularStats.classList.remove("hidden");
      gkStats.classList.add("hidden");
    }
    updatePreview();
  });

  // Form validation and submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validatePlayerForm(form)) {
      return;
    }

    const formData = new FormData(form);

    const player = {
      name: formData.get("name"),
      photo: formData.get("photo"),
      position: formData.get("position"),
      nationality: formData.get("nationality"),
      flag: formData.get("flag"),
      club: formData.get("club"),
      logo: formData.get("logo"),
      rating: parseInt(formData.get("rating")),
      skills:
        formData.get("position") === "GK"
          ? {
              diving: parseInt(formData.get("diving")),
              handling: parseInt(formData.get("handling")),
              kicking: parseInt(formData.get("kicking")),
              reflexes: parseInt(formData.get("reflexes")),
              speed: parseInt(formData.get("speed")),
              positioning: parseInt(formData.get("positioning")),
            }
          : {
              pace: parseInt(formData.get("pace")),
              shooting: parseInt(formData.get("shooting")),
              passing: parseInt(formData.get("passing")),
              dribbling: parseInt(formData.get("dribbling")),
              defending: parseInt(formData.get("defending")),
              physical: parseInt(formData.get("physical")),
            },
    };

    playerManager.addPlayer(player);
    form.closest(".fixed").remove();
    renderAllPlayers();
  });

  updatePreview();
}

function showEditPlayerModal(player) {
  const template = document.getElementById("add-player-modal");
  const modal = template.content.cloneNode(true);
  document.body.appendChild(modal);

  const form = document.getElementById("addPlayerForm");
  const positionSelect = form.querySelector('[name="position"]');
  const regularStats = document.getElementById("regular-stats");
  const gkStats = document.getElementById("gk-stats");
  const previewCard = document.getElementById("preview-card");

  form.querySelector('[name="name"]').value = player.name;
  form.querySelector('[name="photo"]').value = player.photo;
  form.querySelector('[name="position"]').value = player.position;
  form.querySelector('[name="nationality"]').value = player.nationality;
  form.querySelector('[name="flag"]').value = player.flag;
  form.querySelector('[name="club"]').value = player.club;
  form.querySelector('[name="logo"]').value = player.logo;
  form.querySelector('[name="rating"]').value = player.rating;

  if (player.position === "GK") {
    regularStats.classList.add("hidden");
    gkStats.classList.remove("hidden");
    form.querySelector('[name="diving"]').value = player.skills.diving;
    form.querySelector('[name="handling"]').value = player.skills.handling;
    form.querySelector('[name="kicking"]').value = player.skills.kicking;
    form.querySelector('[name="reflexes"]').value = player.skills.reflexes;
    form.querySelector('[name="speed"]').value = player.skills.speed;
    form.querySelector('[name="positioning"]').value =
      player.skills.positioning;
  } else {
    regularStats.classList.remove("hidden");
    gkStats.classList.add("hidden");
    form.querySelector('[name="pace"]').value = player.skills.pace;
    form.querySelector('[name="shooting"]').value = player.skills.shooting;
    form.querySelector('[name="passing"]').value = player.skills.passing;
    form.querySelector('[name="dribbling"]').value = player.skills.dribbling;
    form.querySelector('[name="defending"]').value = player.skills.defending;
    form.querySelector('[name="physical"]').value = player.skills.physical;
  }

  function updatePreview() {
    const formData = new FormData(form);
    const previewPlayer = {
      name: formData.get("name") || "Player Name",
      photo: formData.get("photo") || "https://placeholder.com/120",
      position: formData.get("position") || "ST",
      nationality: formData.get("nationality") || "Country",
      flag: formData.get("flag") || "https://placeholder.com/30",
      club: formData.get("club") || "Club Name",
      logo: formData.get("logo") || "https://placeholder.com/30",
      rating: parseInt(formData.get("rating")) || 75,
      skills:
        formData.get("position") === "GK"
          ? {
              diving: parseInt(formData.get("diving")) || 75,
              handling: parseInt(formData.get("handling")) || 75,
              kicking: parseInt(formData.get("kicking")) || 75,
              reflexes: parseInt(formData.get("reflexes")) || 75,
              speed: parseInt(formData.get("speed")) || 75,
              positioning: parseInt(formData.get("positioning")) || 75,
            }
          : {
              pace: parseInt(formData.get("pace")) || 75,
              shooting: parseInt(formData.get("shooting")) || 75,
              passing: parseInt(formData.get("passing")) || 75,
              dribbling: parseInt(formData.get("dribbling")) || 75,
              defending: parseInt(formData.get("defending")) || 75,
              physical: parseInt(formData.get("physical")) || 75,
            },
    };

    previewCard.innerHTML = "";
    const card = createFifaPlayerCard(previewPlayer);
    previewCard.appendChild(card);
  }

  form.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("input", updatePreview);
  });

  positionSelect.addEventListener("change", (e) => {
    if (e.target.value === "GK") {
      regularStats.classList.add("hidden");
      gkStats.classList.remove("hidden");
    } else {
      regularStats.classList.remove("hidden");
      gkStats.classList.add("hidden");
    }
    updatePreview();
  });

  updatePreview();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validatePlayerForm(form)) {
      return; // Stop submission if validation fails
    }

    const formData = new FormData(form);

    const updatedPlayer = {
      name: formData.get("name"),
      photo: formData.get("photo"),
      position: formData.get("position"),
      nationality: formData.get("nationality"),
      flag: formData.get("flag"),
      club: formData.get("club"),
      logo: formData.get("logo"),
      rating: parseInt(formData.get("rating")),
      skills:
        formData.get("position") === "GK"
          ? {
              diving: parseInt(formData.get("diving")),
              handling: parseInt(formData.get("handling")),
              kicking: parseInt(formData.get("kicking")),
              reflexes: parseInt(formData.get("reflexes")),
              speed: parseInt(formData.get("speed")),
              positioning: parseInt(formData.get("positioning")),
            }
          : {
              pace: parseInt(formData.get("pace")),
              shooting: parseInt(formData.get("shooting")),
              passing: parseInt(formData.get("passing")),
              dribbling: parseInt(formData.get("dribbling")),
              defending: parseInt(formData.get("defending")),
              physical: parseInt(formData.get("physical")),
            },
    };

    let players = JSON.parse(localStorage.getItem("players")) || [];

    const index = players.findIndex((p) => p.name === player.name);
    if (index !== -1) {
      players[index] = updatedPlayer;

      localStorage.setItem("players", JSON.stringify(players));

      let selectedPlayers =
        JSON.parse(localStorage.getItem("selectedPlayers")) || {};
      let benchPlayers = JSON.parse(localStorage.getItem("benchPlayers")) || {};

      for (let position in selectedPlayers) {
        if (selectedPlayers[position] === player.name) {
          selectedPlayers[position] = updatedPlayer.name;
        }
      }

      for (let position in benchPlayers) {
        if (benchPlayers[position] === player.name) {
          benchPlayers[position] = updatedPlayer.name;
        }
      }

      localStorage.setItem("selectedPlayers", JSON.stringify(selectedPlayers));
      localStorage.setItem("benchPlayers", JSON.stringify(benchPlayers));
    }

    form.closest(".fixed").remove();
    renderAllPlayers();

    if (typeof renderPitch === "function") renderPitch();
    if (typeof renderBench === "function") renderBench();
  });
}

function confirmDeletePlayer(playerName) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
  modal.innerHTML = `
    <div class="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-sm">
      <h2 class="text-white text-xl font-bold mb-4">Confirm Delete</h2>
      <p class="text-white mb-4">Are you sure you want to delete ${playerName}?</p>
      <div class="flex justify-end gap-2">
        <button onclick="this.closest('.fixed').remove()" 
                class="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
        <button onclick="deletePlayer('${playerName}')" 
                class="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded">Delete</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function deletePlayer(playerName) {
  let players = JSON.parse(localStorage.getItem("players")) || [];
  players = players.filter((player) => player.name !== playerName);
  localStorage.setItem("players", JSON.stringify(players));
  document.querySelector(".fixed").remove();
  renderAllPlayers();
}

window.showEditPlayerModal = showEditPlayerModal;
window.confirmDeletePlayer = confirmDeletePlayer;
window.deletePlayer = deletePlayer;

document.addEventListener("DOMContentLoaded", () => {
  const addPlayerBtn = document.getElementById("addPlayerBtn");
  if (addPlayerBtn) {
    addPlayerBtn.addEventListener("click", showAddPlayerModal);
    renderAllPlayers();
  }
});
function renderAllPlayers() {
  const allPlayersContainer = document.getElementById("all-players-container");
  allPlayersContainer.innerHTML = "";

  const players = JSON.parse(localStorage.getItem("players")) || [];
  players.forEach((player) => {
    const card = createFifaPlayerCard(player);
    card.addEventListener("click", () => showPlayerInfoModal(player));
    allPlayersContainer.appendChild(card);
  });
}

function showPlayerInfoModal(player) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

  const getStatColor = (value) => {
    if (value >= 85) return "bg-green-500";
    if (value >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const createStatBar = (label, value) => `
        <div class="mb-2">
            <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium text-gray-300">${label}</span>
                <span class="text-sm font-medium text-gray-300">${value}</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2.5">
                <div class="${getStatColor(
                  value
                )} h-2.5 rounded-full transition-all duration-500" 
                     style="width: ${value}%"></div>
            </div>
        </div>
    `;

  const getRatingColor = (rating) => {
    if (rating >= 85) return "text-green-500";
    if (rating >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const statsHTML =
    player.position === "GK"
      ? Object.entries({
          Diving: player.skills.diving,
          Handling: player.skills.handling,
          Kicking: player.skills.kicking,
          Reflexes: player.skills.reflexes,
          Speed: player.skills.speed,
          Positioning: player.skills.positioning,
        })
          .map(([label, value]) => createStatBar(label, value))
          .join("")
      : Object.entries({
          Pace: player.skills.pace,
          Shooting: player.skills.shooting,
          Passing: player.skills.passing,
          Dribbling: player.skills.dribbling,
          Defending: player.skills.defending,
          Physical: player.skills.physical,
        })
          .map(([label, value]) => createStatBar(label, value))
          .join("");

  modal.innerHTML = `
        <div class="bg-[#1a1a1a] rounded-lg w-full max-w-2xl mx-4 overflow-hidden shadow-2xl">
            <!-- Header with close button -->
            <div class="relative h-48 bg-gradient-to-r from-[#2c3e50] to-[#3498db] overflow-hidden">
                <button onclick="this.closest('.fixed').remove()" 
                        class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                
                <!-- Player Image -->
                <div class="absolute -bottom-0 left-1/2 transform -translate-x-1/2">
                    <img src="${player.photo}" 
                         alt="${player.name}" 
                         class="w-40 h-40 rounded-full border-4 border-[#1a1a1a] object-cover shadow-xl">
                </div>
            </div>

            <!-- Content -->
            <div class="pt-24 px-8 pb-8">
                <!-- Player Name and Rating -->
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-white mb-1">${
                      player.name
                    }</h2>
                    <div class="flex items-center justify-center gap-4">
                        <span class="text-gray-400">${player.position}</span>
                        <span class="${getRatingColor(
                          player.rating
                        )} text-xl font-bold">
                            ${player.rating}
                        </span>
                    </div>
                </div>

                <!-- Club and Nationality -->
                <div class="flex justify-center items-center gap-6 mb-8">
                    <div class="flex items-center gap-2">
                        <img src="${
                          player.logo
                        }" class="w-8 h-8 object-contain" alt="${player.club}">
                        <span class="text-gray-300">${player.club}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <img src="${
                          player.flag
                        }" class="w-8 h-5 object-cover" alt="${
    player.nationality
  }">
                        <span class="text-gray-300">${player.nationality}</span>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-1 gap-6">
                    <div class="space-y-3">
                        ${statsHTML}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-3 mt-8">
                    <button onclick="showEditPlayerModal(${JSON.stringify(
                      player
                    ).replace(/"/g, "&quot;")})" 
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        Edit Player
                    </button>
                    <button onclick="confirmDeletePlayer('${player.name}')" 
                            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        Delete Player
                    </button>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(modal);
}

// Add this validation function
function validatePlayerForm(form) {
  const requiredFields = [
    { name: "name", label: "Player Name" },
    { name: "photo", label: "Photo URL" },
    { name: "position", label: "Position" },
    { name: "nationality", label: "Nationality" },
    { name: "flag", label: "Flag URL" },
    { name: "club", label: "Club" },
    { name: "logo", label: "Club Logo URL" },
    { name: "rating", label: "Rating" },
  ];

  // Clear previous error messages
  form.querySelectorAll(".error-message").forEach((error) => error.remove());
  form
    .querySelectorAll(".error-border")
    .forEach((field) => field.classList.remove("error-border"));

  let isValid = true;
  const formData = new FormData(form);

  // Validate required fields
  requiredFields.forEach((field) => {
    const value = formData.get(field.name);
    const input = form.querySelector(`[name="${field.name}"]`);

    if (!value || value === "") {
      isValid = false;
      addErrorToField(input, `${field.label} is required`);
    }
  });

  // Validate stats based on position
  const position = formData.get("position");
  const statsFields =
    position === "GK"
      ? ["diving", "handling", "kicking", "reflexes", "speed", "positioning"]
      : ["pace", "shooting", "passing", "dribbling", "defending", "physical"];

  statsFields.forEach((stat) => {
    const value = formData.get(stat);
    const input = form.querySelector(`[name="${stat}"]`);

    if (!value || isNaN(value) || value < 0 || value > 99) {
      isValid = false;
      addErrorToField(
        input,
        `${
          stat.charAt(0).toUpperCase() + stat.slice(1)
        } must be between 0 and 99`
      );
    }
  });

  return isValid;
}

// Helper function to add error messages
function addErrorToField(input, message) {
  input.classList.add("error-border");
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message text-red-500 text-sm mt-1";
  errorDiv.textContent = message;
  input.parentNode.appendChild(errorDiv);
}

// Add these styles to your CSS
const styles = document.createElement("style");
styles.textContent = `
  .error-border {
    border: 2px solid rgb(239, 68, 68) !important;
  }
  
  .error-message {
    color: rgb(239, 68, 68);
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
`;
document.head.appendChild(styles);
