const formationPositions = {
  "4-3-3": {
    attackers: [
      { x: 660, y: 80, position: "RW", role: "Winger" },
      { x: 380, y: 5, position: "ST", role: "Advanced Forward" },
      { x: 95, y: 80, position: "LW", role: "Winger" },
    ],
    midfielders: [
      { x: 540, y: 180, position: "CM", role: "Box-to-Box" },
      { x: 380, y: 200, position: "CDM", role: "Holding" },
      { x: 220, y: 180, position: "CM", role: "Box-to-Box" },
    ],
    defenders: [
      { x: 680, y: 300, position: "RB", role: "Defender" },
      { x: 480, y: 330, position: "CB", role: "Defender" },
      { x: 280, y: 330, position: "CB", role: "Defender" },
      { x: 60, y: 300, position: "LB", role: "Defender" },
    ],
    goalkeeper: { x: 380, y: 480, position: "GK", role: "Goalkeeper" },
  },
  "4-4-2": {
    attackers: [
      { x: 480, y: 20, position: "ST", role: "Advanced Forward" },
      { x: 280, y: 20, position: "ST", role: "Advanced Forward" },
    ],
    midfielders: [
      { x: 660, y: 140, position: "RM", role: "Winger" },
      { x: 480, y: 180, position: "CM", role: "Box-to-Box" },
      { x: 280, y: 180, position: "CM", role: "Box-to-Box" },
      { x: 95, y: 140, position: "LM", role: "Winger" },
    ],
    defenders: [
      { x: 680, y: 300, position: "RB", role: "Defender" },
      { x: 480, y: 345, position: "CB", role: "Defender" },
      { x: 280, y: 345, position: "CB", role: "Defender" },
      { x: 60, y: 300, position: "LB", role: "Defender" },
    ],
    goalkeeper: { x: 380, y: 480, position: "GK", role: "Goalkeeper" },
  },
  "3-5-2": {
    attackers: [
      { x: 480, y: 20, position: "ST", role: "Advanced Forward" },
      { x: 280, y: 20, position: "ST", role: "Advanced Forward" },
    ],
    midfielders: [
      { x: 660, y: 140, position: "RM", role: "Wing Back" },
      { x: 520, y: 180, position: "CM", role: "Box-to-Box" },
      { x: 380, y: 160, position: "CDM", role: "Holding" },
      { x: 240, y: 180, position: "CM", role: "Box-to-Box" },
      { x: 95, y: 140, position: "LM", role: "Wing Back" },
    ],
    defenders: [
      { x: 580, y: 330, position: "CB", role: "Defender" },
      { x: 380, y: 320, position: "CB", role: "Defender" },
      { x: 180, y: 330, position: "CB", role: "Defender" },
    ],
    goalkeeper: { x: 380, y: 480, position: "GK", role: "Goalkeeper" },
  },
};

document.addEventListener("DOMContentLoaded", function () {
  const formationSelect = document.getElementById("formation");
  const svg = document.querySelector("svg");

  function createCard(x, y, position, role) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const image = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    );
    image.setAttribute(
      "href",
      "https://www.futbin.com/design2/img/static/evolutions/placeholder-card-normal.webp"
    );
    image.setAttribute("x", x);
    image.setAttribute("y", y);
    image.setAttribute("width", "150");
    image.setAttribute("height", "175");

    const pillBg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    pillBg.setAttribute("x", parseInt(x) + 60);
    pillBg.setAttribute("y", parseInt(y) + 175);
    pillBg.setAttribute("width", "30");
    pillBg.setAttribute("height", "20");
    pillBg.setAttribute("rx", "10");
    pillBg.setAttribute("fill", "#1a1a1a");
    pillBg.setAttribute("opacity", "0.9");

    const posText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    posText.setAttribute("x", parseInt(x) + 75);
    posText.setAttribute("y", parseInt(y) + 190);
    posText.setAttribute("text-anchor", "middle");
    posText.setAttribute("class", "position-label");
    posText.textContent = position;

    const roleText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    roleText.setAttribute("x", parseInt(x) + 75);
    roleText.setAttribute("y", parseInt(y) + 35);
    roleText.setAttribute("text-anchor", "middle");
    roleText.setAttribute("class", "role-label");
    roleText.textContent = role;

    group.appendChild(image);
    group.appendChild(pillBg);
    group.appendChild(posText);
    group.appendChild(roleText);

    return group;
  }

  function updateFormation(formation) {
    const positions = formationPositions[formation];
    if (!positions) return;

    const existingCards = svg.querySelectorAll("g:not([stroke='#696969'])");
    existingCards.forEach((card) => card.remove());

    setTimeout(() => {
      // Goalkeeper
      svg.appendChild(
        createCard(
          positions.goalkeeper.x,
          positions.goalkeeper.y,
          positions.goalkeeper.position,
          positions.goalkeeper.role
        )
      );

      // Defenders
      positions.defenders.forEach((pos) => {
        svg.appendChild(createCard(pos.x, pos.y, pos.position, pos.role));
      });

      // Midfielders
      positions.midfielders.forEach((pos) => {
        svg.appendChild(createCard(pos.x, pos.y, pos.position, pos.role));
      });

      // Attackers
      positions.attackers.forEach((pos) => {
        svg.appendChild(createCard(pos.x, pos.y, pos.position, pos.role));
      });
    }, 50);
  }

  formationSelect.addEventListener("change", function () {
    svg.classList.add("transitioning");
    updateFormation(this.value);
    setTimeout(() => {
      svg.classList.remove("transitioning");
    }, 800);
  });

  updateFormation("4-3-3");
});
