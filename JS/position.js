const formationPositions = {
  "4-3-3": {
    attackers: [
      { x: "80%", y: "12%", position: "RW", role: "Winger", id: "RW_1" },
      {
        x: "50%",
        y: "1%",
        position: "ST",
        role: "Advanced Forward",
        id: "ST_1",
      },
      { x: "20%", y: "12%", position: "LW", role: "Winger", id: "LW_1" },
    ],
    midfielders: [
      { x: "70%", y: "40%", position: "CM", role: "Box-to-Box", id: "CM_1" },
      { x: "50%", y: "35%", position: "CDM", role: "Holding", id: "CDM_1" },
      { x: "30%", y: "40%", position: "CM", role: "Box-to-Box", id: "CM_2" },
    ],
    defenders: [
      { x: "85%", y: "66%", position: "RB", role: "Defender", id: "RB_1" },
      { x: "65%", y: "76%", position: "CB", role: "Defender", id: "CB_1" },
      { x: "35%", y: "76%", position: "CB", role: "Defender", id: "CB_2" },
      { x: "15%", y: "66%", position: "LB", role: "Defender", id: "LB_1" },
    ],
    goalkeeper: {
      x: "50%",
      y: "85%",
      position: "GK",
      role: "Goalkeeper",
      id: "GK_1",
    },
  },
  "4-4-2": {
    attackers: [
      {
        x: "40%",
        y: "5%",
        position: "ST",
        role: "Advanced Forward",
        id: "ST_2",
      },
      {
        x: "60%",
        y: "5%",
        position: "ST",
        role: "Advanced Forward",
        id: "ST_3",
      },
    ],
    midfielders: [
      { x: "80%", y: "35%", position: "RM", role: "Winger", id: "RM_1" },
      { x: "60%", y: "40%", position: "CM", role: "Box-to-Box", id: "CM_3" },
      { x: "40%", y: "40%", position: "CM", role: "Box-to-Box", id: "CM_4" },
      { x: "20%", y: "35%", position: "LM", role: "Winger", id: "LM_1" },
    ],
    defenders: [
      { x: "85%", y: "66%", position: "RB", role: "Defender", id: "RB_2" },
      { x: "65%", y: "76%", position: "CB", role: "Defender", id: "CB_3" },
      { x: "35%", y: "76%", position: "CB", role: "Defender", id: "CB_4" },
      { x: "15%", y: "66%", position: "LB", role: "Defender", id: "LB_2" },
    ],
    goalkeeper: {
      x: "50%",
      y: "85%",
      position: "GK",
      role: "Goalkeeper",
      id: "GK_2",
    },
  },
  "3-5-2": {
    attackers: [
      {
        x: "53%",
        y: "3%",
        position: "ST",
        role: "Advanced Forward",
        id: "ST_4",
      },
      {
        x: "31%",
        y: "3%",
        position: "ST",
        role: "Advanced Forward",
        id: "ST_5",
      },
    ],
    midfielders: [
      { x: "73%", y: "22%", position: "RM", role: "Wing Back", id: "RM_2" },
      { x: "58%", y: "28%", position: "CM", role: "Box-to-Box", id: "CM_5" },
      { x: "42%", y: "25%", position: "CDM", role: "Holding", id: "CDM_2" },
      { x: "27%", y: "28%", position: "CM", role: "Box-to-Box", id: "CM_6" },
      { x: "11%", y: "22%", position: "LM", role: "Wing Back", id: "LM_2" },
    ],
    defenders: [
      { x: "64%", y: "51%", position: "CB", role: "Defender", id: "CB_5" },
      { x: "42%", y: "49%", position: "CB", role: "Defender", id: "CB_6" },
      { x: "20%", y: "51%", position: "CB", role: "Defender", id: "CB_7" },
    ],
    goalkeeper: {
      x: "50%",
      y: "85%",
      position: "GK",
      role: "Goalkeeper",
      id: "GK_3",
    },
  },
};

function updateCardPositions() {
  const svg = document.getElementById("pitch-svg");
  const cardsContainer = document.getElementById("cards-container");
  const svgRect = svg.getBoundingClientRect();

  cardsContainer.style.width = `${svgRect.width}px`;
  cardsContainer.style.height = `${svgRect.height}px`;

  document.querySelectorAll(".player-card").forEach((card) => {
    const x = card.style.left;
    const y = card.style.top;

    card.style.left = x;
    card.style.top = y;
  });
}

window.addEventListener("resize", debounce(updateCardPositions, 250));

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function createCard(x, y, position, role, id) {
  const card = document.createElement("div");
  card.className = "player-card empty-card";
  card.setAttribute("data-position", position);
  card.setAttribute("data-role", role);
  card.setAttribute("data-position-id", id);

  card.style.left = x;
  card.style.top = y;

  card.innerHTML = `
    <div class="position-label">${position}</div>
    <div class="role-label">${role}</div>
  `;

  card.addEventListener("click", () =>
    showPlayerSelectionModal(position, role, id)
  );
  card.addEventListener("dragover", handleDragOver);
  card.addEventListener("dragleave", handleDragLeave);
  card.addEventListener("drop", handleDrop);

  return card;
}

function updateCardWithPlayer(card, player, position, role) {
  const isGoalkeeper = position === "GK";

  card.setAttribute("draggable", true);
  card.addEventListener("dragstart", handleDragStart);
  card.addEventListener("dragend", handleDragEnd);
  card.addEventListener("dragover", handleDragOver);
  card.addEventListener("drop", handleDrop);

  card.innerHTML = `
    <div class="card-content">
      <!-- Rating -->
      <div class="absolute top-[20%] left-[18%] text-[2.4vh] font-bold text-black z-10">
        ${player.rating}
      </div>
      
      <!-- Position -->
      <div class="position-label">${position}</div>
      
      <!-- Player Image -->
      <div class="absolute top-[12%] left-1/2 transform -translate-x-1/2 w-[80%] h-[52%] z-10">
        <img src="${player.photo}" class="w-full h-full object-contain" alt="${
    player.name
  }">
      </div>
      
      <!-- Player Name -->
      <div class="absolute top-[63%] left-1/2 transform -translate-x-1/2 text-center w-full z-10">
        <span class="text-black font-bold text-[1.7vh]">${player.name}</span>
      </div>

      <!-- Stats in single line -->
      <div class="absolute top-[74%] left-1/2 transform -translate-x-1/2 w-[66%] z-10">
        <div class="flex justify-between text-black">
          ${
            isGoalkeeper
              ? `
            <div class="flex flex-col items-center">
              <span class="text-[0.8vh] font-light">DIV</span>
              <span class="text-[1.2vh] font-bold">${player.skills.diving}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-[0.8vh] font-light">HAN</span>
              <span class="text-[1.2vh] font-bold">${player.skills.handling}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-[0.8vh] font-light">KIC</span>
              <span class="text-[1.2vh] font-bold">${player.skills.kicking}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-[0.8vh] font-light">REF</span>
              <span class="text-[1.2vh] font-bold">${player.skills.reflexes}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-[0.8vh] font-light">SPE</span>
              <span class="text-[1.2vh] font-bold">${player.skills.speed}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-[0.8vh] font-light">POS</span>
              <span class="text-[1.2vh] font-bold">${player.skills.positioning}</span>
            </div>
          `
              : `
            <div class="flex flex-col items-center">
              <span class="text-[0.8vh] font-light">PAC</span>
              <span class="text-[1.2vh] font-bold">${player.skills.pace}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-[0.8vh] font-light">SHO</span>
              <span class="text-[1.2vh] font-bold">${player.skills.shooting}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-[0.8vh] font-light">PAS</span>
              <span class="text-[1.2vh] font-bold">${player.skills.passing}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-[0.8vh] font-light">DRI</span>
              <span class="text-[1.2vh] font-bold">${player.skills.dribbling}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-[0.8vh] font-light">DEF</span>
              <span class="text-[1.2vh] font-bold">${player.skills.defending}</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-[0.8vh] font-light">PHY</span>
              <span class="text-[1.2vh] font-bold">${player.skills.physical}</span>
            </div>
          `
          }
        </div>
      </div>
      
      <!-- Country & Club Icons -->
      <div class="absolute top-[34%] left-[18%] flex flex-col justify-center items-center gap-2 z-10">
        <img src="${player.flag}" class="w-[2vh] h-[1.5vh] object-cover" alt="${
    player.nationality
  }">
        <img src="${player.logo}" class="w-[2vh] h-[2vh] object-contain" alt="${
    player.club
  }">
      </div>
      
      <!-- Background Card -->
      <div class="absolute inset-0 z-0" style="background-image: url('../src/img/badge_gold.webp'); background-size: cover; background-repeat: no-repeat; background-position: center;"></div>
    </div>
  `;

  card.classList.remove("empty-card");
  card.classList.add("filled-card");
}

function isValidPosition(player, targetPosition) {
  if (!player || !player.position) return false;

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

let currentFormation = localStorage.getItem("currentFormation") || "4-3-3";

const positionMappings = {
  "4-3-3_to_4-4-2": {
    RW: "RM",
    LW: "LM",
    ST: "ST",
    CDM: "CM",
  },
  "4-4-2_to_4-3-3": {
    RM: "RW",
    LM: "LW",
  },
  "4-3-3_to_3-5-2": {
    RW: "RM",
    LW: "LM",
    RB: "RM",
    LB: "LM",
  },
};

function handleDrop(e) {
  e.preventDefault();
  const targetCard = e.target.closest(".player-card");
  if (!targetCard) return;

  const sourceData = JSON.parse(e.dataTransfer.getData("text/plain"));
  const sourcePositionId = sourceData.positionId;
  const targetPositionId = targetCard.getAttribute("data-position-id");

  if (
    !sourcePositionId ||
    !targetPositionId ||
    sourcePositionId === targetPositionId
  )
    return;

  const sourceCard = document.querySelector(
    `[data-position-id="${sourcePositionId}"]`
  );
  if (!sourceCard) return;

  const sourceName = selectedPlayers[sourcePositionId];
  const targetName = selectedPlayers[targetPositionId];
  const players = JSON.parse(localStorage.getItem("players") || "[]");

  if (sourceName) {
    const sourcePlayer = players.find((p) => p.name === sourceName);
    if (sourcePlayer) {
      updateCardWithPlayer(targetCard, sourcePlayer, targetPositionId);
      updatePlayerPosition(sourceName, targetPositionId);
    }
  }

  if (targetName) {
    const targetPlayer = players.find((p) => p.name === targetName);
    if (targetPlayer) {
      updateCardWithPlayer(sourceCard, targetPlayer, sourcePositionId);
      updatePlayerPosition(targetName, sourcePositionId);
    }
  } else {
    resetToEmptyCard(sourceCard);
    removePlayerFromPosition(sourcePositionId);
  }
}

function updateFormation(newFormation) {
  const oldFormation = currentFormation;
  currentFormation = newFormation;
  localStorage.setItem("currentFormation", newFormation);

  const oldPositions = { ...selectedPlayers };

  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = "";
  updateCardPositions();

  Object.entries(formationPositions[newFormation]).forEach(
    ([group, positions]) => {
      const positionsArray = Array.isArray(positions) ? positions : [positions];
      positionsArray.forEach((posData) => {
        const card = createCard(
          posData.x,
          posData.y,
          posData.position,
          posData.role,
          posData.id
        );
        cardsContainer.appendChild(card);
      });
    }
  );

  const mappingKey = `${oldFormation}_to_${newFormation}`;
  const positionMapping = positionMappings[mappingKey] || {};

  Object.entries(oldPositions).forEach(([oldPos, playerName]) => {
    const newPos = positionMapping[oldPos] || oldPos;
    const newCard = document.querySelector(`[data-position="${newPos}"]`);

    if (newCard) {
      const player = playerManager.players.find((p) => p.name === playerName);
      if (player) {
        updateCardWithPlayer(
          newCard,
          player,
          newPos,
          newCard.getAttribute("data-role")
        );
        updatePlayerPosition(playerName, newPos);
      }
    } else {
      removePlayerFromPosition(oldPos);
    }
  });
}

document.getElementById("formation").addEventListener("change", function (e) {
  updateFormation(e.target.value);
});

document.addEventListener("DOMContentLoaded", function () {
  const formationSelect = document.getElementById("formation");
  formationSelect.value = currentFormation;
  updateFormation(currentFormation);
});

function showPlayerSelectionModal(position, role) {
  const players = JSON.parse(localStorage.getItem("players") || "[]");
  const isGoalkeeper = position === "GK";

  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

  modal.innerHTML = `
    <div class="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-[90vw] max-h-[90vh] overflow-y-auto modal-content">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-white text-xl font-bold">Select Player for ${position}</h2>
          <p class="text-gray-400 text-sm">Role: ${role}</p>
        </div>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        ${players
          .map(
            (player) => `
          <div class="player-dataset-card relative w-[200px] h-[300px] cursor-pointer ${
            !isValidPosition(player, position) ? "opacity-50" : ""
          }"
               onclick="selectPlayerForPosition('${
                 player.name
               }', '${position}', '${role}')">
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
                <img src="${
                  player.photo
                }" class="w-full h-full object-contain" alt="${player.name}">
              </div>

              <!-- Player Name -->
              <div class="absolute top-[65%] left-1/2 transform -translate-x-1/2 text-center w-full">
                <span class="text-black font-bold text-[1rem]">${
                  player.name
                }</span>
              </div>

              <!-- Stats -->
              <div class="absolute bottom-[14%] left-[3%] right-[3%] text-[0.8rem] text-black font-medium">
                ${
                  isGoalkeeper
                    ? `
                  <div class="flex justify-between">
                    <span>DIV</span>
                    <span>HAN</span>
                    <span>KIC</span>
                    <span>REF</span>
                    <span>SPE</span>
                    <span>POS</span>
                  </div>
                  <div class="flex justify-between font-bold">
                    <span>${player.skills.diving}</span>
                    <span>${player.skills.handling}</span>
                    <span>${player.skills.kicking}</span>
                    <span>${player.skills.reflexes}</span>
                    <span>${player.skills.speed}</span>
                    <span>${player.skills.positioning}</span>
                  </div>
                `
                    : `
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
                `
                }
              </div>

              <!-- Country & Club Icons -->
              <div class="absolute bottom-[5%] left-0 w-full flex justify-center items-center gap-2">
                <img src="${player.flag}" class="w-6 h-4 object-cover" alt="${
              player.nationality
            }">
                <img src="${player.logo}" class="w-6 h-6 object-contain" alt="${
              player.club
            }">
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function selectPlayerForPosition(playerName, position, role) {
  const players = JSON.parse(localStorage.getItem("players") || "[]");
  const player = players.find((p) => p.name === playerName);
  const card = document.querySelector(`[data-position="${position}"]`);

  if (player && card) {
    updateCardWithPlayer(card, player, position, role);
    updatePlayerPosition(player.name, position);
  }

  document.querySelector(".fixed").remove();
}

function handleDragStart(e) {
  const card = e.target.closest(".player-card");
  if (!card || !card.classList.contains("filled-card")) return;

  card.classList.add("dragging");
  e.dataTransfer.setData(
    "text/plain",
    JSON.stringify({
      position: card.getAttribute("data-position"),
      role: card.getAttribute("data-role"),
      positionId: card.getAttribute("data-position-id"),
    })
  );
}

function handleDragEnd(e) {
  document.querySelectorAll(".player-card").forEach((card) => {
    card.classList.remove("drag-over");
    card.classList.remove("dragging");
  });
}

function resetToEmptyCard(card, position, role) {
  const newCard = card.cloneNode(false);
  newCard.className = "player-card empty-card";
  newCard.setAttribute("data-position", position);
  newCard.setAttribute("data-role", role);

  newCard.innerHTML = `
    <div class="position-label">${position}</div>
    <div class="role-label">${role}</div>
  `;

  newCard.addEventListener("click", () => {
    showPlayerSelectionModal(position, role);
  });

  card.parentNode.replaceChild(newCard, card);
}

function handleDragOver(e) {
  e.preventDefault();
  const targetCard = e.target.closest(".player-card");
  if (targetCard) {
    e.dataTransfer.dropEffect = "move";
    targetCard.classList.add("drag-over");
  }
}

function handleDragLeave(e) {
  const targetCard = e.target.closest(".player-card");
  if (targetCard) {
    targetCard.classList.remove("drag-over");
  }
}
