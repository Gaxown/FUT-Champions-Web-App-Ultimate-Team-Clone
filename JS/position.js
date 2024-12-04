let selectedPlayers = JSON.parse(localStorage.getItem("selectedPlayers")) || {};
let benchPlayers = JSON.parse(localStorage.getItem("benchPlayers")) || {};

const formationPositions = {
  "4-3-3": {
    attackers: [
      { x: "80%", y: "12%", position: "RW", role: "Winger", id: "RW_1" },
      {
        x: "50%",
        y: "0%",
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

function createCard(x, y, position, role, id) {
  const card = document.createElement("div");
  card.className = "player-card empty-card";
  card.setAttribute("data-position", position);
  card.setAttribute("data-role", role);
  card.setAttribute("data-position-id", id);

  card.setAttribute("draggable", true);

  card.style.left = x;
  card.style.top = y;

  card.innerHTML = `
    <div class="position-label">${position}</div>
    <div class="role-label">${role}</div>
  `;

  card.addEventListener("click", () => {
    if (card.classList.contains("empty-card")) {
      showPlayerSelectionModal(position, role, id);
    }
  });

  card.addEventListener("dragstart", handleDragStart);
  card.addEventListener("dragend", handleDragEnd);
  card.addEventListener("dragover", handleDragOver);
  card.addEventListener("dragleave", handleDragLeave);
  card.addEventListener("drop", handleDrop);

  return card;
}

function handleDragStart(e) {
  if (!e.target.classList.contains("filled-card")) return;
  e.target.classList.add("dragging");
  const positionId = e.target.getAttribute("data-position-id");
  const playerName = selectedPlayers[positionId] || benchPlayers[positionId];
  e.dataTransfer.setData(
    "text/plain",
    JSON.stringify({
      positionId: positionId,
      playerName: playerName,
    })
  );
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging");
  document.querySelectorAll(".player-card").forEach((card) => {
    card.classList.remove("drag-over", "valid-position", "invalid-position");
  });
}

function handleDragOver(e) {
  e.preventDefault();
  const dropTarget = e.target.closest(".player-card");
  if (!dropTarget) return;

  const draggedCard = document.querySelector(".dragging");
  if (!draggedCard) return;

  const draggedPlayerId = draggedCard.getAttribute("data-position-id");
  const draggedPlayerName =
    selectedPlayers[draggedPlayerId] || benchPlayers[draggedPlayerId];
  const player = playerManager.players.find(
    (p) => p.name === draggedPlayerName
  );

  // is position  valid
  const targetPosition = dropTarget.getAttribute("data-position");
  const isValidPos = isValidPosition(player, targetPosition);
  dropTarget.classList.add("drag-over");
  dropTarget.classList.toggle("valid-position", isValidPos);
  dropTarget.classList.toggle("invalid-position", !isValidPos);
}

function handleDragLeave(e) {
  const card = e.target.closest(".player-card");
  if (card) {
    card.classList.remove("drag-over", "valid-position", "invalid-position");
  }
}

function handleDrop(e) {
  e.preventDefault();
  const dropTarget = e.target.closest(".player-card");
  if (!dropTarget) return;

  document.querySelectorAll(".player-card").forEach((card) => {
    card.classList.remove("drag-over", "valid-position", "invalid-position");
  });

  const dragData = JSON.parse(e.dataTransfer.getData("text/plain"));
  const oldPositionId = dragData.positionId;
  const newPositionId = dropTarget.getAttribute("data-position-id");
  const playerName = dragData.playerName;

  const isBenchSource = oldPositionId.startsWith("bench_");
  const isBenchTarget = newPositionId.startsWith("bench_");

  const player = playerManager.players.find((p) => p.name === playerName);
  if (!player) return;

  const newPosition = dropTarget.getAttribute("data-position") || "BENCH";
  const isValidPos = isBenchTarget
    ? true
    : isValidPosition(player, newPosition);

  const targetPlayerName = isBenchTarget
    ? benchPlayers[newPositionId]
    : selectedPlayers[newPositionId];
  const targetPlayer = targetPlayerName
    ? playerManager.players.find((p) => p.name === targetPlayerName)
    : null;

  // Bench to Bench
  if (isBenchSource && isBenchTarget) {
    if (targetPlayer) {
      benchPlayers[newPositionId] = playerName;
      benchPlayers[oldPositionId] = targetPlayerName;
    } else {
      delete benchPlayers[oldPositionId];
      benchPlayers[newPositionId] = playerName;
    }
  }

  // Pitch to Pitch
  else if (!isBenchSource && !isBenchTarget) {
    if (targetPlayer) {
      selectedPlayers[newPositionId] = playerName;
      selectedPlayers[oldPositionId] = targetPlayerName;
    } else {
      delete selectedPlayers[oldPositionId];
      selectedPlayers[newPositionId] = playerName;
    }
  }

  // Bench to Pitch
  else if (isBenchSource && !isBenchTarget) {
    if (targetPlayer) {
      const benchPlayer = playerName;
      const pitchPlayer = targetPlayerName;

      delete benchPlayers[oldPositionId];
      delete selectedPlayers[newPositionId];

      selectedPlayers[newPositionId] = benchPlayer;
      benchPlayers[oldPositionId] = pitchPlayer;
    } else {
      delete benchPlayers[oldPositionId];
      selectedPlayers[newPositionId] = playerName;
    }
  }

  // Pitch to Bench
  else if (!isBenchSource && isBenchTarget) {
    if (targetPlayer) {
      delete selectedPlayers[oldPositionId];
      benchPlayers[newPositionId] = playerName;
      selectedPlayers[oldPositionId] = targetPlayerName;
      delete benchPlayers[newPositionId];
    } else {
      delete selectedPlayers[oldPositionId];
      benchPlayers[newPositionId] = playerName;
    }
  }

  localStorage.setItem("selectedPlayers", JSON.stringify(selectedPlayers));
  localStorage.setItem("benchPlayers", JSON.stringify(benchPlayers));

  // Update UI cards
  const oldCard = document.querySelector(
    `[data-position-id="${oldPositionId}"]`
  );
  if (targetPlayer) {
    updateCardWithPlayer(
      oldCard,
      targetPlayer,
      isBenchSource ? "BENCH" : oldCard.getAttribute("data-position"),
      isBenchSource ? "Substitute" : oldCard.getAttribute("data-role")
    );
  } else {
    // Reset old card to empty
    oldCard.className = `player-card empty-card${
      isBenchSource ? " bench-card" : ""
    }`;
    oldCard.innerHTML = isBenchSource
      ? `<div class="position-label">BENCH</div>`
      : `<div class="position-label">${oldCard.getAttribute(
          "data-position"
        )}</div>
               <div class="role-label">${oldCard.getAttribute(
                 "data-role"
               )}</div>`;
  }

  updateCardWithPlayer(
    dropTarget,
    player,
    isBenchTarget ? "BENCH" : newPosition,
    isBenchTarget ? "Substitute" : dropTarget.getAttribute("data-role")
  );
}

function updateCardWithPlayer(card, player, position, role) {
  const isValidPos = isValidPosition(player, position);
  const isBench = card.closest("#bench-container") !== null;

  card.className = `player-card filled-card${isBench ? " bench-card" : ""}`;

  card.innerHTML = `
    <div class="card-content">
      <!-- Rating -->
      <div class="absolute rating top-[20%] left-[18%] text-[2.4vh] font-bold text-black z-10">
        ${player.rating}
      </div>
      
      <!-- Position -->
      <div class="position-label">
        ${isBench ? "BANCH" : position}
        ${!isBench && !isValidPos ? '<span class="text-red-500">!</span>' : ""}
      </div>
      
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

      <!-- Stats -->
      <div class="absolute top-[73%] left-1/2 transform -translate-x-1/2 w-[80%] z-10">
        ${getPlayerStats(player)}
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
    ST: "ST_4",
    RW: "ST_5",
    CDM: "CM_5",
    CM: "CM_6",
  },
  "4-4-2_to_4-3-3": {
    RM: "RW",
    LM: "LW",
    ST_4: "ST",
    ST_5: "RW",
    CM_5: "CDM",
    CM_6: "CM",
  },
  "4-3-3_to_3-5-2": {
    RW: "ST_4",
    LW: "ST_5",
    ST: "ST_4",
    RB: "RM_2",
    LB: "LM_2",
    CB: "CDM",
    CDM: "CM",
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .formation-transition {
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .formation-transition.fade-out {
    opacity: 0;
    transform: scale(0.95);
  }

  .formation-transition.fade-in {
    opacity: 1;
    transform: scale(1);
  }

  .player-card {
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .transitioning .player-card {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }

  .transitioning .player-card.show {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;
document.head.appendChild(styleSheet);

function updateFormation(formation) {
  const positions = formationPositions[formation];
  if (!positions) return;

  const oldFormation = localStorage.getItem("currentFormation") || "4-3-3";
  const mappingKey = `${oldFormation}_to_${formation}`;
  const reverseKey = `${formation}_to_${oldFormation}`;
  const positionMap =
    positionMappings[mappingKey] || positionMappings[reverseKey] || {};

  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.classList.add("formation-transition", "fade-out");

  setTimeout(() => {
    cardsContainer.innerHTML = "";
    let remainingPlayers = { ...selectedPlayers };
    let usedPositions = new Set();

    function createPositionCards(positionArray, delay = 0) {
      positionArray.forEach((pos, index) => {
        const card = createCard(pos.x, pos.y, pos.position, pos.role, pos.id);
        card.classList.add("formation-transition");
        cardsContainer.appendChild(card);

        let playerPlaced = false;
        Object.entries(remainingPlayers).forEach(([oldPosId, playerName]) => {
          if (playerPlaced || usedPositions.has(pos.id)) return;

          const player = playerManager.players.find(
            (p) => p.name === playerName
          );
          if (!player) return;

          const oldPosition = document
            .querySelector(`[data-position-id="${oldPosId}"]`)
            ?.getAttribute("data-position");

          // Check if this position is a valid mapping for the player
          if (
            positionMap[oldPosition] === pos.position ||
            positionMap[oldPosId] === pos.id
          ) {
            updateCardWithPlayer(card, player, pos.position, pos.role);
            delete remainingPlayers[oldPosId];
            usedPositions.add(pos.id);
            selectedPlayers[pos.id] = playerName;
            playerPlaced = true;
          }
        });

        if (!playerPlaced && selectedPlayers[pos.id]) {
          const playerName = selectedPlayers[pos.id];
          const player = playerManager.players.find(
            (p) => p.name === playerName
          );
          if (player) {
            updateCardWithPlayer(card, player, pos.position, pos.role);
            delete remainingPlayers[pos.id];
            usedPositions.add(pos.id);
          }
        }

        setTimeout(() => {
          card.classList.add("show");
        }, delay + index * 50);
      });
    }

    if (positions.goalkeeper) createPositionCards([positions.goalkeeper], 0);
    if (positions.defenders) createPositionCards(positions.defenders, 100);
    if (positions.midfielders) createPositionCards(positions.midfielders, 200);
    if (positions.attackers) createPositionCards(positions.attackers, 300);

    const allPositions = [
      ...(positions.defenders || []),
      ...(positions.midfielders || []),
      ...(positions.attackers || []),
    ];

    Object.entries(remainingPlayers).forEach(([oldPosId, playerName]) => {
      const player = playerManager.players.find((p) => p.name === playerName);
      if (!player) return;

      const emptyPosition = allPositions.find(
        (pos) =>
          !usedPositions.has(pos.id) && isValidPosition(player, pos.position)
      );

      if (emptyPosition) {
        const card = document.querySelector(
          `[data-position-id="${emptyPosition.id}"]`
        );
        if (card) {
          updateCardWithPlayer(
            card,
            player,
            emptyPosition.position,
            emptyPosition.role
          );
          selectedPlayers[emptyPosition.id] = playerName;
          usedPositions.add(emptyPosition.id);
        }
      }

      delete selectedPlayers[oldPosId];
    });

    localStorage.setItem("selectedPlayers", JSON.stringify(selectedPlayers));
    localStorage.setItem("currentFormation", formation);

    cardsContainer.classList.remove("fade-out");
    cardsContainer.classList.add("fade-in");
  }, 400);
}

document.getElementById("formation").addEventListener("change", function (e) {
  updateFormation(e.target.value);
});

const benchPositions = [
  { x: "5%", y: "10px", id: "bench_1" },
  { x: "20%", y: "10px", id: "bench_2" },
  { x: "35%", y: "10px", id: "bench_3" },
  { x: "50%", y: "10px", id: "bench_4" },
  { x: "65%", y: "10px", id: "bench_5" },
  { x: "80%", y: "10px", id: "bench_6" },
];

function createBenchCard(id) {
  const card = document.createElement("div");
  card.className = "player-card empty-card bench-card";
  card.setAttribute("data-position-id", id);
  card.setAttribute("draggable", true);

  card.innerHTML = `<div class="position-label">BENCH</div>`;

  card.addEventListener("click", () => {
    if (card.classList.contains("empty-card")) {
      showPlayerSelectionModal("BENCH", "Substitute", id);
    }
  });

  card.addEventListener("dragstart", handleDragStart);
  card.addEventListener("dragend", handleDragEnd);
  card.addEventListener("dragover", handleDragOver);
  card.addEventListener("dragleave", handleDragLeave);
  card.addEventListener("drop", handleDrop);

  return card;
}

function initializeBench() {
  const benchContainer = document.getElementById("bench-container");
  if (!benchContainer) return;

  // Create 7 bench slots
  for (let i = 1; i <= 7; i++) {
    const benchId = `bench_${i}`;
    const benchCard = createBenchCard(benchId);
    benchContainer.appendChild(benchCard);

    const playerName = benchPlayers[benchId];
    if (playerName) {
      const player = playerManager.players.find((p) => p.name === playerName);
      if (player) {
        updateCardWithPlayer(benchCard, player, "BENCH", "Substitute");
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Load players data
    const response = await fetch("players.json");
    const data = await response.json();
    playerManager.players = data.players;

    const formationSelect = document.getElementById("formation");
    const savedFormation = localStorage.getItem("currentFormation") || "4-3-3";
    formationSelect.value = savedFormation;

    updateFormation(savedFormation);

    initializeBench();
  } catch (error) {
    console.error("Error initializing formation:", error);
  }
});

function showPlayerSelectionModal(position, role, positionId) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

  const players = playerManager.players;

  // <!-- Position Indicator -->
  // <div class="absolute -top-2 -right-2 z-10 ${
  //   isValidPos ? "bg-green-500" : "bg-red-500"
  // } rounded-full w-4 h-4"></div>
  modal.innerHTML = `
    <div class="bg-[#1a1a1a] p-6 rounded-lg w-[90%] max-w-5xl max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-white text-xl font-bold">Select Player for ${position}</h2>
        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="flex jsutify-center flex-wrap gap-1">
        ${players
          .map((player) => {
            const isValidPos = isValidPosition(player, position);
            return `
            <div class="cursor-pointer relative" onclick="selectPlayerForPosition('${
              player.name
            }', '${position}', '${role}', '${positionId}')">
              
              <!-- Player card HTML -->
              <div class="relative min-w-[14vw] min-h-[34vh] ${
                isValidPos ? "" : "opacity-75"
              }" 
                   style="background-image: url('../src/img/badge_gold.webp'); background-size: contain; background-repeat: no-repeat; background-position: center;">
                <!-- Rating & Position -->
                <div class="absolute top-[20%] left-[18%] text-[2rem] font-bold text-black">
                  ${player.rating}
                </div>
                <div class="absolute top-[31%] left-[18%] text-[1.2rem] font-bold text-black">
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
                <div class="absolute bottom-[15%] left-[17%] text-[0.8rem] text-black font-medium">
                  ${getPlayerStats(player)}
                </div>

                <!-- Country & Club Icons -->
                <div class="absolute w-auto top-[43%] left-[18%] w-full flex flex-col justify-center items-center gap-2">
                  <img src="${player.flag}" class="w-6 h-4 object-cover" alt="${
              player.nationality
            }">
                  <img src="${
                    player.logo
                  }" class="w-6 h-6 object-contain" alt="${player.club}">
                </div>
              </div>
            </div>
          `;
          })
          .join("")}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function getPlayerStats(player) {
  const isGoalkeeper = player.position === "GK";

  if (isGoalkeeper) {
    return `
      <div class="flex justify-between">
        <span>DIV</span>
        <span>HAN</span>
        <span>KIC</span>
        <span>REF</span>
        <span>SPE</span>
        <span>POS</span>
      </div>
      <div class="flex justify-between font-bold gap-1">
        <span>${player.skills.diving}</span>
        <span>${player.skills.handling}</span>
        <span>${player.skills.kicking}</span>
        <span>${player.skills.reflexes}</span>
        <span>${player.skills.speed}</span>
        <span>${player.skills.positioning}</span>
      </div>
    `;
  }

  return `
    <div class="flex justify-between gap-1 text-xs">
      <span>PAC</span>
      <span>SHO</span>
      <span>PAS</span>
      <span>DRI</span>
      <span>DEF</span>
      <span>PHY</span>
    </div>
    <div class="flex justify-between font-bold gap-1">
      <span>${player.skills.pace}</span>
      <span>${player.skills.shooting}</span>
      <span>${player.skills.passing}</span>
      <span>${player.skills.dribbling}</span>
      <span>${player.skills.defending}</span>
      <span>${player.skills.physical}</span>
    </div>
  `;
}

function selectPlayerForPosition(playerName, position, role, positionId) {
  const player = playerManager.players.find((p) => p.name === playerName);
  const card = document.querySelector(`[data-position-id="${positionId}"]`);

  if (player && card) {
    updateCardWithPlayer(card, player, position, role);

    if (positionId.startsWith("bench_")) {
      updateBenchPlayer(player.name, positionId);
    } else {
      updatePlayerPosition(player.name, positionId);
    }
  }

  document.querySelector(".fixed").remove();
}

window.selectPlayerForPosition = selectPlayerForPosition;

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

function updatePlayerPosition(playerName, positionId) {
  selectedPlayers[positionId] = playerName;
  localStorage.setItem("selectedPlayers", JSON.stringify(selectedPlayers));
}

function removePlayerFromPosition(positionId) {
  delete selectedPlayers[positionId];
  localStorage.setItem("selectedPlayers", JSON.stringify(selectedPlayers));
}

function updateBenchPlayer(playerName, benchId) {
  benchPlayers[benchId] = playerName;
  localStorage.setItem("benchPlayers", JSON.stringify(benchPlayers));
}

function removeFromBench(benchId) {
  delete benchPlayers[benchId];
  localStorage.setItem("benchPlayers", JSON.stringify(benchPlayers));
}

const playerManager = {
  players: [],
};
