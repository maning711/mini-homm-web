const mapEl = document.getElementById("map");
const logEl = document.getElementById("log");

const els = {
  day: document.getElementById("day"),
  moves: document.getElementById("moves"),
  resources: document.getElementById("resources"),
  heroPos: document.getElementById("hero-pos"),
  heroAttack: document.getElementById("hero-attack"),
  heroDefense: document.getElementById("hero-defense"),
  heroPower: document.getElementById("hero-power"),
  army: document.getElementById("army"),
  castleLevel: document.getElementById("castle-level"),
  castleGrowth: document.getElementById("castle-growth"),
  recruitBtn: document.getElementById("recruit-btn"),
  endTurnBtn: document.getElementById("end-turn-btn"),
};

const TILE_TYPES = ["grass", "grass", "grass", "forest", "hill", "road", "water"];
const UNIT_COLORS = ["#e6f0ff", "#7cd2ff", "#8ff0a2", "#ffd46a", "#ff8f8f"];

const state = {
  size: 20,
  day: 1,
  weekDay: 1,
  hero: {
    x: 2,
    y: 16,
    maxMoves: 8,
    moves: 8,
    attack: 2,
    defense: 1,
    army: [
      { tier: 1, count: 14 },
      { tier: 2, count: 4 },
    ],
  },
  castle: {
    x: 2,
    y: 17,
    level: 1,
    growth: 5,
    reserve: 8,
  },
  resources: {
    gold: 1800,
    wood: 4,
    ore: 4,
    crystal: 0,
  },
  selected: { x: 2, y: 16 },
  mines: [
    { x: 4, y: 4, type: "wood", owner: "neutral" },
    { x: 14, y: 6, type: "ore", owner: "neutral" },
    { x: 16, y: 14, type: "gold", owner: "neutral" },
  ],
  pickups: [
    { x: 7, y: 15, type: "gold", amount: 300 },
    { x: 8, y: 3, type: "wood", amount: 2 },
    { x: 12, y: 11, type: "ore", amount: 2 },
    { x: 17, y: 4, type: "crystal", amount: 1 },
  ],
  enemies: [
    { x: 10, y: 14, power: 24, reward: { gold: 300 }, tier: 2 },
    { x: 14, y: 10, power: 38, reward: { gold: 450, wood: 1 }, tier: 3 },
    { x: 6, y: 6, power: 18, reward: { ore: 1, gold: 220 }, tier: 1 },
  ],
  logs: [],
};

function log(text) {
  state.logs.unshift(`第 ${state.day} 天：${text}`);
  state.logs = state.logs.slice(0, 16);
}

function randItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function buildMap() {
  mapEl.innerHTML = "";
  for (let y = 0; y < state.size; y += 1) {
    for (let x = 0; x < state.size; x += 1) {
      const tile = document.createElement("button");
      tile.className = `tile ${getTerrain(x, y)}`;
      tile.dataset.x = String(x);
      tile.dataset.y = String(y);
      tile.addEventListener("click", () => handleTileClick(x, y));
      mapEl.appendChild(tile);
    }
  }
}

function getTerrain(x, y) {
  if (x === 0 || y === 0 || x === state.size - 1 || y === state.size - 1) {
    return "water";
  }
  if ((x + y) % 9 === 0) return "forest";
  if ((x * 3 + y) % 13 === 0) return "hill";
  if (x === y || x + y === 19) return "road";
  return randItem(TILE_TYPES.slice(0, 3));
}

function inBounds(x, y) {
  return x >= 0 && y >= 0 && x < state.size && y < state.size;
}

function movementCost(x, y) {
  const terrain = getTerrain(x, y);
  if (terrain === "road") return 1;
  if (terrain === "forest" || terrain === "hill") return 2;
  if (terrain === "water") return 99;
  return 1;
}

function getReachable() {
  const result = new Set();
  const queue = [{ x: state.hero.x, y: state.hero.y, cost: 0 }];
  const seen = new Map([[`${state.hero.x},${state.hero.y}`, 0]]);
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length) {
    const current = queue.shift();
    dirs.forEach(([dx, dy]) => {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (!inBounds(nx, ny)) return;
      const cost = current.cost + movementCost(nx, ny);
      const key = `${nx},${ny}`;
      if (cost > state.hero.moves || movementCost(nx, ny) >= 99) return;
      if (seen.has(key) && seen.get(key) <= cost) return;
      seen.set(key, cost);
      result.add(key);
      queue.push({ x: nx, y: ny, cost });
    });
  }

  return { cells: result, costs: seen };
}

function getHeroPower() {
  const armyPower = state.hero.army.reduce((sum, unit) => {
    return sum + unit.count * (unit.tier * 3 + 2);
  }, 0);
  return armyPower + state.hero.attack * 4 + state.hero.defense * 3;
}

function handleTileClick(x, y) {
  state.selected = { x, y };
  const reachable = getReachable();
  const key = `${x},${y}`;
  if (reachable.cells.has(key)) {
    const cost = reachable.costs.get(key);
    moveHero(x, y, cost);
  }
  render();
}

function moveHero(x, y, cost) {
  state.hero.x = x;
  state.hero.y = y;
  state.hero.moves -= cost;
  resolveTile(x, y);
}

function resolveTile(x, y) {
  const pickupIndex = state.pickups.findIndex((item) => item.x === x && item.y === y);
  if (pickupIndex >= 0) {
    const pickup = state.pickups.splice(pickupIndex, 1)[0];
    state.resources[pickup.type] += pickup.amount;
    log(`英雄拾取了 ${pickup.amount} ${resourceLabel(pickup.type)}。`);
  }

  const mine = state.mines.find((item) => item.x === x && item.y === y);
  if (mine && mine.owner !== "player") {
    mine.owner = "player";
    log(`你占领了 ${resourceLabel(mine.type)} 矿点。`);
  }

  const enemyIndex = state.enemies.findIndex((item) => item.x === x && item.y === y);
  if (enemyIndex >= 0) {
    const enemy = state.enemies[enemyIndex];
    const power = getHeroPower();
    if (power >= enemy.power) {
      state.enemies.splice(enemyIndex, 1);
      Object.entries(enemy.reward).forEach(([type, amount]) => {
        state.resources[type] += amount;
      });
      if (Math.random() < 0.5) {
        state.hero.army[0].count += 1;
      }
      log(`你击败了中立部队，战力 ${power} 对 ${enemy.power}，顺手拿走战利品。`);
    } else {
      const loss = Math.max(1, Math.ceil((enemy.power - power) / 12));
      state.hero.army[0].count = Math.max(1, state.hero.army[0].count - loss);
      state.hero.moves = 0;
      log(`你碰上了更强的中立部队，只能撤退，损失了 ${loss} 名低阶兵。`);
    }
  }
}

function resourceLabel(type) {
  return {
    gold: "金币",
    wood: "木材",
    ore: "矿石",
    crystal: "水晶",
  }[type];
}

function endTurn() {
  state.day += 1;
  state.weekDay += 1;
  if (state.weekDay > 7) {
    state.weekDay = 1;
    state.castle.reserve += state.castle.growth;
    log(`新的一周开始了，城堡新增了 ${state.castle.growth} 名可招募兵力。`);
  }

  state.hero.moves = state.hero.maxMoves;
  state.mines.forEach((mine) => {
    if (mine.owner === "player") {
      const payout = mine.type === "gold" ? 250 : 1;
      state.resources[mine.type] += payout;
    }
  });

  if (Math.random() < 0.35) {
    spawnPickup();
  }

  log("一天结束，矿点产出结算，地图局势稍微变了点。");
  render();
}

function spawnPickup() {
  for (let i = 0; i < 20; i += 1) {
    const x = 2 + Math.floor(Math.random() * 16);
    const y = 2 + Math.floor(Math.random() * 16);
    const occupied =
      state.pickups.some((p) => p.x === x && p.y === y) ||
      state.mines.some((m) => m.x === x && m.y === y) ||
      state.enemies.some((e) => e.x === x && e.y === y) ||
      (state.castle.x === x && state.castle.y === y);
    if (!occupied) {
      const pool = [
        { type: "gold", amount: 220 },
        { type: "wood", amount: 1 },
        { type: "ore", amount: 1 },
        { type: "crystal", amount: 1 },
      ];
      state.pickups.push({ x, y, ...randItem(pool) });
      return;
    }
  }
}

function recruit() {
  if (state.castle.reserve <= 0) {
    log("城堡当前没有可招募兵力。");
    render();
    return;
  }
  const cost = state.castle.reserve * 45;
  if (state.resources.gold < cost) {
    log(`招募需要 ${cost} 金币，但你现在还不够。`);
    render();
    return;
  }
  state.resources.gold -= cost;
  state.hero.army[0].count += state.castle.reserve;
  log(`你花了 ${cost} 金币，招募了 ${state.castle.reserve} 名低阶兵。`);
  state.castle.reserve = 0;
  render();
}

function renderMap() {
  const reachable = getReachable();
  document.querySelectorAll(".tile").forEach((tile) => {
    const x = Number(tile.dataset.x);
    const y = Number(tile.dataset.y);
    tile.classList.toggle("reachable", reachable.cells.has(`${x},${y}`));
    tile.classList.toggle("selected", state.selected.x === x && state.selected.y === y);
    tile.innerHTML = "";

    if (state.castle.x === x && state.castle.y === y) {
      tile.innerHTML = `<div class="entity castle">♜</div>`;
    }

    const mine = state.mines.find((item) => item.x === x && item.y === y);
    if (mine) {
      tile.innerHTML = `<div class="entity mine">⬢</div><div class="badge">${mine.owner === "player" ? "我" : "矿"}</div>`;
    }

    const pickup = state.pickups.find((item) => item.x === x && item.y === y);
    if (pickup) {
      tile.innerHTML = `<div class="entity resource">◆</div>`;
    }

    const enemy = state.enemies.find((item) => item.x === x && item.y === y);
    if (enemy) {
      tile.innerHTML = `<div class="entity hero-red">★</div><div class="badge">${enemy.tier}</div>`;
    }

    if (state.hero.x === x && state.hero.y === y) {
      tile.innerHTML = `<div class="entity hero-blue">★</div><div class="badge">我</div>`;
    }
  });
}

function renderSidebar() {
  els.day.textContent = `${state.day} / 周内第 ${state.weekDay} 天`;
  els.moves.textContent = `${state.hero.moves} / ${state.hero.maxMoves}`;
  els.heroPos.textContent = `${state.hero.x}, ${state.hero.y}`;
  els.heroAttack.textContent = String(state.hero.attack);
  els.heroDefense.textContent = String(state.hero.defense);
  els.heroPower.textContent = String(getHeroPower());
  els.castleLevel.textContent = `Lv.${state.castle.level}`;
  els.castleGrowth.textContent = `${state.castle.reserve} / 周增长 ${state.castle.growth}`;

  els.resources.innerHTML = Object.entries(state.resources)
    .map(([key, value]) => `<div class="row"><span>${resourceLabel(key)}</span><strong>${value}</strong></div>`)
    .join("");

  els.army.innerHTML = state.hero.army
    .map((unit) => {
      const color = UNIT_COLORS[Math.min(unit.tier - 1, UNIT_COLORS.length - 1)];
      return `
        <div class="army-item">
          <div class="name"><span class="star" style="color:${color}">★</span><span>${unit.tier} 阶兵</span></div>
          <strong>${unit.count}</strong>
        </div>
      `;
    })
    .join("");

  logEl.innerHTML = state.logs.map((item) => `<div class="log-entry">${item}</div>`).join("");
}

function render() {
  renderMap();
  renderSidebar();
}

els.endTurnBtn.addEventListener("click", endTurn);
els.recruitBtn.addEventListener("click", recruit);

buildMap();
log("原型开始。先试着占矿、拾资源、打掉红色中立部队。");
render();
