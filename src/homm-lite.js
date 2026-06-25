const mapEl = document.getElementById("map");
const logEl = document.getElementById("log");

const els = {
  day: document.getElementById("day"),
  moves: document.getElementById("moves"),
  resources: document.getElementById("resources"),
  heroName: document.getElementById("hero-name"),
  heroPos: document.getElementById("hero-pos"),
  heroAttack: document.getElementById("hero-attack"),
  heroDefense: document.getElementById("hero-defense"),
  heroPower: document.getElementById("hero-power"),
  heroLevel: document.getElementById("hero-level"),
  heroXp: document.getElementById("hero-xp"),
  army: document.getElementById("army"),
  objectiveMines: document.getElementById("objective-mines"),
  objectiveEnemies: document.getElementById("objective-enemies"),
  objectiveCastle: document.getElementById("objective-castle"),
  objectiveThreat: document.getElementById("objective-threat"),
  tileInfo: document.getElementById("tile-info"),
  castleLevel: document.getElementById("castle-level"),
  castleGrowth: document.getElementById("castle-growth"),
  castleBuildings: document.getElementById("castle-buildings"),
  heroList: document.getElementById("hero-list"),
  recruitBtn: document.getElementById("recruit-btn"),
  buildTownhallBtn: document.getElementById("build-townhall-btn"),
  buildBarracksBtn: document.getElementById("build-barracks-btn"),
  hireHeroBtn: document.getElementById("hire-hero-btn"),
  openCastleBtn: document.getElementById("open-castle-btn"),
  closeCastleBtn: document.getElementById("close-castle-btn"),
  castleScreen: document.getElementById("castle-screen"),
  castleAlert: document.getElementById("castle-alert"),
  castleReserve: document.getElementById("castle-reserve"),
  endTurnBtn: document.getElementById("end-turn-btn"),
  saveBtn: document.getElementById("save-btn"),
  loadBtn: document.getElementById("load-btn"),
  restartBtn: document.getElementById("restart-btn"),
  actionInfo: document.getElementById("action-info"),
};

const TILE_TYPES = ["grass", "forest", "grass", "hill", "grass"];
const UNIT_COLORS = ["#e6f0ff", "#7cd2ff", "#8ff0a2", "#ffd46a", "#ff8f8f"];
const TOWN_HALL_NAMES = ["帐篷", "议事厅", "市政厅"];
const BARRACKS_NAMES = ["营火", "兵营", "练兵场"];
const HERO_POOL = [
  { id: "hero-3", name: "罗温", maxMoves: 8, attack: 2, defense: 2, army: [{ tier: 1, count: 10 }] },
  { id: "hero-4", name: "米拉", maxMoves: 9, attack: 1, defense: 1, army: [{ tier: 2, count: 5 }] },
];
const WIN_TARGETS = {
  mines: 3,
  defeatedEnemies: 6,
  castleLevel: 3,
  deadline: 28,
};
const SAVE_KEY = "mini-homm-web-save-v1";

let state = createInitialState();

function createInitialState() {
  return {
    size: 20,
    day: 1,
    weekDay: 1,
    screen: "map",
    activeHeroId: "hero-1",
    defeatedEnemies: 0,
    castleRaids: 0,
    gameOver: false,
    result: null,
    heroes: [
      {
        id: "hero-1",
        name: "艾林",
        x: 2,
        y: 16,
        maxMoves: 8,
        moves: 8,
        attack: 2,
        defense: 1,
        level: 1,
        xp: 0,
        army: [
          { tier: 1, count: 14 },
          { tier: 2, count: 4 },
        ],
      },
      {
        id: "hero-2",
        name: "塔雅",
        x: 4,
        y: 17,
        maxMoves: 7,
        moves: 7,
        attack: 1,
        defense: 2,
        level: 1,
        xp: 0,
        army: [
          { tier: 1, count: 8 },
          { tier: 3, count: 2 },
        ],
      },
    ],
    castle: {
      x: 2,
      y: 17,
      level: 1,
      reserve: 8,
      baseGrowth: 5,
      townHallLevel: 1,
      barracksLevel: 1,
    },
    resources: {
      gold: 2200,
      wood: 5,
      ore: 5,
      crystal: 1,
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
      { x: 10, y: 8, type: "gold", amount: 260 },
    ],
    shrines: [
      { x: 5, y: 12, type: "attack", visitedBy: [] },
      { x: 13, y: 4, type: "defense", visitedBy: [] },
      { x: 15, y: 16, type: "moves", visitedBy: [] },
    ],
    enemies: [
      { id: "enemy-1", x: 10, y: 14, power: 24, reward: { gold: 300 }, tier: 2, moves: 3 },
      { id: "enemy-2", x: 14, y: 10, power: 38, reward: { gold: 450, wood: 1 }, tier: 3, moves: 3 },
      { id: "enemy-3", x: 6, y: 6, power: 18, reward: { ore: 1, gold: 220 }, tier: 1, moves: 2 },
    ],
    logs: [],
  };
}

function getActiveHero() {
  return state.heroes.find((hero) => hero.id === state.activeHeroId) || state.heroes[0];
}

function log(text) {
  state.logs.unshift(`第 ${state.day} 天：${text}`);
  state.logs = state.logs.slice(0, 18);
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
  if (x === y || x + y === 19 || y === 17) return "road";
  return TILE_TYPES[(x * 7 + y * 11) % TILE_TYPES.length];
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

function isHeroAt(x, y, ignoreHeroId = null) {
  return state.heroes.some((hero) => hero.id !== ignoreHeroId && hero.x === x && hero.y === y);
}

function getReachable(hero = getActiveHero()) {
  const result = new Set();
  const queue = [{ x: hero.x, y: hero.y, cost: 0 }];
  const seen = new Map([[`${hero.x},${hero.y}`, 0]]);
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
      const stepCost = movementCost(nx, ny);
      if (!inBounds(nx, ny) || stepCost >= 99 || isHeroAt(nx, ny, hero.id)) {
        return;
      }
      const cost = current.cost + stepCost;
      const key = `${nx},${ny}`;
      if (cost > hero.moves) return;
      if (seen.has(key) && seen.get(key) <= cost) return;
      seen.set(key, cost);
      result.add(key);
      queue.push({ x: nx, y: ny, cost });
    });
  }

  return { cells: result, costs: seen };
}

function getHeroPower(hero) {
  const armyPower = hero.army.reduce((sum, unit) => sum + unit.count * (unit.tier * 3 + 2), 0);
  return armyPower + hero.attack * 4 + hero.defense * 3 + hero.level * 4;
}

function handleTileClick(x, y) {
  if (state.gameOver) return;
  if (state.castle.x === x && state.castle.y === y) {
    openCastleScreen();
    state.selected = { x, y };
    render();
    return;
  }
  const clickedHero = state.heroes.find((hero) => hero.x === x && hero.y === y);
  if (clickedHero) {
    state.activeHeroId = clickedHero.id;
    state.selected = { x, y };
    render();
    return;
  }

  state.selected = { x, y };
  const hero = getActiveHero();
  const reachable = getReachable(hero);
  const key = `${x},${y}`;
  if (reachable.cells.has(key)) {
    const cost = reachable.costs.get(key);
    moveHero(hero, x, y, cost);
  }
  render();
}

function moveHero(hero, x, y, cost) {
  hero.x = x;
  hero.y = y;
  hero.moves -= cost;
  resolveTile(hero, x, y);
  checkObjectives();
}

function resolveTile(hero, x, y) {
  const pickupIndex = state.pickups.findIndex((item) => item.x === x && item.y === y);
  if (pickupIndex >= 0) {
    const pickup = state.pickups.splice(pickupIndex, 1)[0];
    state.resources[pickup.type] += pickup.amount;
    log(`${hero.name} 拾取了 ${pickup.amount} ${resourceLabel(pickup.type)}。`);
  }

  const mine = state.mines.find((item) => item.x === x && item.y === y);
  if (mine && mine.owner !== "player") {
    mine.owner = "player";
    log(`${hero.name} 占领了 ${resourceLabel(mine.type)} 矿点。`);
  }

  const shrine = state.shrines.find((item) => item.x === x && item.y === y);
  if (shrine && !shrine.visitedBy.includes(hero.id)) {
    shrine.visitedBy.push(hero.id);
    applyShrine(hero, shrine.type);
  }

  const enemyIndex = state.enemies.findIndex((item) => item.x === x && item.y === y);
  if (enemyIndex >= 0) {
    resolveBattle(hero, enemyIndex);
  }
}

function resolveBattle(hero, enemyIndex) {
  const enemy = state.enemies[enemyIndex];
  if (!enemy) return;
  const power = getHeroPower(hero);
  const loss = getBattleLoss(hero, enemy);
  if (power >= enemy.power) {
    state.enemies.splice(enemyIndex, 1);
    Object.entries(enemy.reward).forEach(([type, amount]) => {
      state.resources[type] += amount;
    });
    applyArmyLoss(hero, loss);
    gainXp(hero, enemy.power);
    state.defeatedEnemies += 1;
    log(`${hero.name} 击败了 ${enemy.tier} 阶敌军，战力 ${power} 对 ${enemy.power}，损失 ${loss} 名低阶兵。`);
    checkObjectives();
    return;
  }

  const retreatLoss = Math.max(loss + 1, Math.ceil((enemy.power - power) / 10));
  applyArmyLoss(hero, retreatLoss);
  hero.moves = 0;
  retreatHero(hero);
  log(`${hero.name} 被敌军压退，损失了 ${retreatLoss} 名低阶兵。`);
}

function getBattleLoss(hero, enemy) {
  const powerGap = Math.max(0, enemy.power - hero.defense * 5);
  const advantage = Math.max(0, getHeroPower(hero) - enemy.power);
  return Math.max(0, Math.ceil((powerGap - advantage * 0.35) / 22));
}

function applyArmyLoss(hero, loss) {
  if (!hero.army.length || loss <= 0) return;
  hero.army[0].count = Math.max(1, hero.army[0].count - loss);
}

function gainXp(hero, amount) {
  hero.xp += amount;
  let needed = getNextLevelXp(hero);
  while (hero.xp >= needed && hero.level < 5) {
    hero.xp -= needed;
    hero.level += 1;
    if (hero.level % 2 === 0) {
      hero.attack += 1;
    } else {
      hero.defense += 1;
    }
    log(`${hero.name} 升到 ${hero.level} 级。`);
    needed = getNextLevelXp(hero);
  }
}

function getNextLevelXp(hero) {
  return hero.level * 45;
}

function applyShrine(hero, type) {
  if (type === "attack") {
    hero.attack += 1;
    log(`${hero.name} 访问战旗神殿，攻击 +1。`);
  } else if (type === "defense") {
    hero.defense += 1;
    log(`${hero.name} 访问守护神殿，防御 +1。`);
  } else {
    hero.maxMoves += 1;
    hero.moves += 1;
    log(`${hero.name} 访问驿站神殿，移动力上限 +1。`);
  }
}

function retreatHero(hero) {
  const fallback = [
    [state.castle.x, state.castle.y - 1],
    [state.castle.x + 1, state.castle.y],
    [state.castle.x + 2, state.castle.y],
  ].find(([x, y]) => inBounds(x, y) && !isHeroAt(x, y, hero.id));
  if (fallback) {
    [hero.x, hero.y] = fallback;
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

function getMineIncome(type) {
  if (type === "gold") return 250;
  return 1;
}

function getTownHallIncome() {
  return state.castle.townHallLevel * 250;
}

function getCastleGrowth() {
  return state.castle.baseGrowth + (state.castle.barracksLevel - 1) * 3;
}

function endTurn() {
  if (state.gameOver) return;
  closeCastleScreen();
  state.day += 1;
  state.weekDay += 1;

  if (state.weekDay > 7) {
    state.weekDay = 1;
    state.castle.reserve += getCastleGrowth();
    log(`新的一周开始了，城堡新增 ${getCastleGrowth()} 名可招募兵力。`);
  }

  state.heroes.forEach((hero) => {
    hero.moves = hero.maxMoves;
  });

  state.resources.gold += getTownHallIncome();
  state.mines.forEach((mine) => {
    if (mine.owner === "player") {
      state.resources[mine.type] += getMineIncome(mine.type);
    }
  });

  enemyTurn();

  if (Math.random() < 0.45) {
    spawnPickup();
  }
  if (Math.random() < 0.22) {
    spawnEnemy();
  }

  log("一天结束，矿点和议事厅完成产出。");
  checkObjectives();
  render();
}

function enemyTurn() {
  state.enemies.forEach((enemy) => {
    for (let step = 0; step < enemy.moves; step += 1) {
      const target = findNearestHero(enemy.x, enemy.y);
      if (!target) return;
      const next = nextStepToward(enemy.x, enemy.y, target.x, target.y);
      if (!next || movementCost(next.x, next.y) >= 99 || isEnemyAt(next.x, next.y, enemy.id)) {
        return;
      }
      enemy.x = next.x;
      enemy.y = next.y;
      const hero = state.heroes.find((item) => item.x === enemy.x && item.y === enemy.y);
      if (hero) {
        const idx = state.enemies.findIndex((item) => item.id === enemy.id);
        resolveBattle(hero, idx);
        return;
      }
      const mine = state.mines.find((item) => item.x === enemy.x && item.y === enemy.y && item.owner === "player");
      if (mine) {
        mine.owner = "neutral";
        log(`敌军骚扰了 ${resourceLabel(mine.type)} 矿点，它重新变成中立。`);
        return;
      }
      if (enemy.x === state.castle.x && enemy.y === state.castle.y) {
        raidCastle(enemy);
        return;
      }
    }
  });
}

function raidCastle(enemy) {
  state.castleRaids += 1;
  state.castle.reserve = Math.max(0, state.castle.reserve - Math.ceil(enemy.power / 10));
  state.resources.gold = Math.max(0, state.resources.gold - 300);
  enemy.x = Math.min(state.size - 2, state.castle.x + 3);
  enemy.y = Math.max(1, state.castle.y - 2);
  log(`敌军突袭了城堡，损失部分金币和驻军。警戒 ${state.castleRaids} / 3。`);
  if (state.castleRaids >= 3) {
    state.gameOver = true;
    state.result = "defeat";
    log("战役失败：城堡连续遭到突袭，防线崩溃。");
  }
}

function findNearestHero(x, y) {
  return state.heroes
    .map((hero) => ({
      hero,
      dist: Math.abs(hero.x - x) + Math.abs(hero.y - y),
    }))
    .sort((a, b) => a.dist - b.dist)[0]?.hero;
}

function nextStepToward(fromX, fromY, toX, toY) {
  const options = [
    { x: fromX + Math.sign(toX - fromX), y: fromY },
    { x: fromX, y: fromY + Math.sign(toY - fromY) },
    { x: fromX + Math.sign(toX - fromX), y: fromY + Math.sign(toY - fromY) },
  ].filter((pos) => inBounds(pos.x, pos.y) && (pos.x !== fromX || pos.y !== fromY));

  return (
    options.sort((a, b) => {
      const distA = Math.abs(a.x - toX) + Math.abs(a.y - toY);
      const distB = Math.abs(b.x - toX) + Math.abs(b.y - toY);
      return distA - distB || movementCost(a.x, a.y) - movementCost(b.x, b.y);
    })[0] || null
  );
}

function isEnemyAt(x, y, ignoreEnemyId = null) {
  return state.enemies.some((enemy) => enemy.id !== ignoreEnemyId && enemy.x === x && enemy.y === y);
}

function spawnPickup() {
  for (let i = 0; i < 20; i += 1) {
    const x = 2 + Math.floor(Math.random() * 16);
    const y = 2 + Math.floor(Math.random() * 16);
    const occupied =
      state.pickups.some((p) => p.x === x && p.y === y) ||
      state.mines.some((m) => m.x === x && m.y === y) ||
      state.enemies.some((e) => e.x === x && e.y === y) ||
      isHeroAt(x, y) ||
      (state.castle.x === x && state.castle.y === y);
    if (!occupied) {
      const pool = [
        { type: "gold", amount: 220 },
        { type: "gold", amount: 340 },
        { type: "wood", amount: 1 },
        { type: "ore", amount: 1 },
        { type: "crystal", amount: 1 },
      ];
      state.pickups.push({ x, y, ...randItem(pool) });
      return;
    }
  }
}

function spawnEnemy() {
  for (let i = 0; i < 18; i += 1) {
    const x = 10 + Math.floor(Math.random() * 8);
    const y = 2 + Math.floor(Math.random() * 14);
    if (
      !isEnemyAt(x, y) &&
      !isHeroAt(x, y) &&
      !state.pickups.some((pickup) => pickup.x === x && pickup.y === y) &&
      !state.shrines.some((shrine) => shrine.x === x && shrine.y === y) &&
      !state.mines.some((mine) => mine.x === x && mine.y === y) &&
      !(state.castle.x === x && state.castle.y === y) &&
      movementCost(x, y) < 99
    ) {
      const tier = 1 + Math.floor(Math.random() * 3);
      state.enemies.push({
        id: `enemy-${Date.now()}-${i}`,
        x,
        y,
        tier,
        moves: 2 + (tier > 1 ? 1 : 0),
        power: 16 + tier * 10 + Math.floor(Math.random() * 8),
        reward: { gold: 180 + tier * 120 },
      });
      log("北侧出现了一支新的中立敌军。");
      return;
    }
  }
}

function recruit() {
  if (state.gameOver) return;
  const hero = getActiveHero();
  const nearCastle = Math.abs(hero.x - state.castle.x) + Math.abs(hero.y - state.castle.y) <= 1;
  if (!nearCastle) {
    log("只有靠近城堡的英雄才能补兵。");
    render();
    return;
  }
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
  hero.army[0].count += state.castle.reserve;
  log(`${hero.name} 花了 ${cost} 金币，招募了 ${state.castle.reserve} 名低阶兵。`);
  state.castle.reserve = 0;
  render();
}

function buildTownHall() {
  if (state.gameOver) return;
  const nextLevel = state.castle.townHallLevel + 1;
  if (nextLevel > 3) {
    log("议事厅已经升到顶了。");
    render();
    return;
  }
  const cost = {
    gold: 800 + nextLevel * 400,
    wood: nextLevel,
    ore: nextLevel,
  };
  if (!canAfford(cost)) {
    log("资源不够，暂时还升不起议事厅。");
    render();
    return;
  }
  spend(cost);
  state.castle.townHallLevel = nextLevel;
  state.castle.level = Math.max(state.castle.level, nextLevel);
  log(`城堡把议事厅升级为 ${TOWN_HALL_NAMES[nextLevel - 1]}，每日金币产出提高了。`);
  checkObjectives();
  render();
}

function buildBarracks() {
  if (state.gameOver) return;
  const nextLevel = state.castle.barracksLevel + 1;
  if (nextLevel > 3) {
    log("兵营已经扩建到顶了。");
    render();
    return;
  }
  const cost = {
    gold: 700 + nextLevel * 450,
    wood: nextLevel + 1,
    ore: nextLevel + 1,
  };
  if (!canAfford(cost)) {
    log("资源不够，兵营扩建失败。");
    render();
    return;
  }
  spend(cost);
  state.castle.barracksLevel = nextLevel;
  state.castle.level = Math.max(state.castle.level, nextLevel);
  log(`兵营升级为 ${BARRACKS_NAMES[nextLevel - 1]}，每周兵力增长提高了。`);
  checkObjectives();
  render();
}

function hireHero() {
  if (state.gameOver) return;
  const candidate = HERO_POOL.find((item) => !state.heroes.some((hero) => hero.id === item.id));
  if (!candidate) {
    log("酒馆里暂时没有新的英雄。");
    render();
    return;
  }
  const cost = { gold: 1200, crystal: 1 };
  if (!canAfford(cost)) {
    log("招募英雄需要 1200 金币和 1 水晶。");
    render();
    return;
  }
  const spot = getOpenCastleSpot();
  if (!spot) {
    log("城堡周围没有空地，无法让新英雄加入。");
    render();
    return;
  }
  spend(cost);
  const hero = {
    ...candidate,
    x: spot.x,
    y: spot.y,
    moves: candidate.maxMoves,
    level: 1,
    xp: 0,
    army: candidate.army.map((unit) => ({ ...unit })),
  };
  state.heroes.push(hero);
  state.activeHeroId = hero.id;
  state.selected = { x: hero.x, y: hero.y };
  log(`${hero.name} 加入了队伍。`);
  render();
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  log("已保存当前战役进度。");
  render();
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    log("还没有可读取的存档。");
    render();
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    state = { ...createInitialState(), ...parsed };
    log("已读取战役进度。");
  } catch {
    log("存档损坏，无法读取。");
  }
  render();
}

function restartGame() {
  state = createInitialState();
  log("新的战役开始了。");
  render();
}

function openCastleScreen() {
  const hero = getActiveHero();
  const nearCastle = Math.abs(hero.x - state.castle.x) + Math.abs(hero.y - state.castle.y) <= 1;
  if (!nearCastle && !(state.selected.x === state.castle.x && state.selected.y === state.castle.y)) {
    log("英雄需要先靠近城堡，或者直接点击城堡格进入。");
    return;
  }
  state.screen = "castle";
}

function closeCastleScreen() {
  state.screen = "map";
}

function getOpenCastleSpot() {
  return [
    { x: state.castle.x, y: state.castle.y - 1 },
    { x: state.castle.x + 1, y: state.castle.y },
    { x: state.castle.x - 1, y: state.castle.y },
    { x: state.castle.x + 1, y: state.castle.y - 1 },
  ].find((spot) => inBounds(spot.x, spot.y) && movementCost(spot.x, spot.y) < 99 && !isHeroAt(spot.x, spot.y));
}

function canAfford(cost) {
  return Object.entries(cost).every(([key, value]) => state.resources[key] >= value);
}

function spend(cost) {
  Object.entries(cost).forEach(([key, value]) => {
    state.resources[key] -= value;
  });
}

function getOwnedMineCount() {
  return state.mines.filter((mine) => mine.owner === "player").length;
}

function getThreatLevel() {
  return state.enemies.reduce((sum, enemy) => sum + enemy.power, 0);
}

function checkObjectives() {
  if (state.gameOver) return;
  const hasWon =
    getOwnedMineCount() >= WIN_TARGETS.mines &&
    state.defeatedEnemies >= WIN_TARGETS.defeatedEnemies &&
    state.castle.level >= WIN_TARGETS.castleLevel;
  if (hasWon) {
    state.gameOver = true;
    state.result = "victory";
    log("战役胜利：矿点、军力和城堡建设目标全部完成。");
    return;
  }

  const totalArmy = state.heroes.reduce((sum, hero) => sum + getHeroPower(hero), 0);
  if (state.day > WIN_TARGETS.deadline || (state.enemies.length >= 9 && getThreatLevel() > totalArmy * 1.8)) {
    state.gameOver = true;
    state.result = "defeat";
    log("战役失败：敌军威胁失控，北境防线被迫撤退。");
  }
}

function getSelectedTileInfo() {
  const { x, y } = state.selected;
  const parts = [`坐标 ${x}, ${y}，${terrainLabel(getTerrain(x, y))}`];
  const hero = state.heroes.find((item) => item.x === x && item.y === y);
  const enemy = state.enemies.find((item) => item.x === x && item.y === y);
  const mine = state.mines.find((item) => item.x === x && item.y === y);
  const pickup = state.pickups.find((item) => item.x === x && item.y === y);
  const shrine = state.shrines.find((item) => item.x === x && item.y === y);

  if (hero) parts.push(`${hero.name}，战力 ${getHeroPower(hero)}。`);
  if (enemy) {
    const activeHero = getActiveHero();
    const loss = getBattleLoss(activeHero, enemy);
    const result = getHeroPower(activeHero) >= enemy.power ? `可战，预计损失 ${loss} 名低阶兵` : "风险过高，可能撤退";
    parts.push(`${enemy.tier} 阶敌军，战力 ${enemy.power}，${result}。`);
  }
  if (mine) parts.push(`${resourceLabel(mine.type)} 矿点，当前${mine.owner === "player" ? "已占领" : "中立"}。`);
  if (pickup) parts.push(`可拾取 ${pickup.amount} ${resourceLabel(pickup.type)}。`);
  if (shrine) parts.push(`${shrineLabel(shrine.type)}，每个英雄可访问一次。`);
  if (state.castle.x === x && state.castle.y === y) parts.push("你的城堡。");
  return parts.join(" ");
}

function getActionInfo(hero) {
  const nearCastle = Math.abs(hero.x - state.castle.x) + Math.abs(hero.y - state.castle.y) <= 1;
  if (state.screen === "castle") {
    return [
      `议事厅升级: ${formatCost({ gold: 1600, wood: 2, ore: 2 }, state.castle.townHallLevel >= 2)}`,
      `兵营升级: ${formatCost({ gold: 1600, wood: 3, ore: 3 }, state.castle.barracksLevel >= 2)}`,
      `招募英雄: ${formatCost({ gold: 1200, crystal: 1 }, false)}`,
    ].join(" | ");
  }
  return nearCastle ? "靠近城堡，可补兵或进入城堡发展。" : "点击城堡格或“进入城堡”按钮，切到城堡发展界面。";
}

function formatCost(cost, built) {
  if (built) return "已升级";
  return Object.entries(cost)
    .map(([key, value]) => `${value}${resourceLabel(key)}`)
    .join(" ");
}

function terrainLabel(type) {
  return {
    grass: "草地",
    forest: "森林",
    hill: "丘陵",
    water: "水域",
    road: "道路",
  }[type];
}

function shrineLabel(type) {
  return {
    attack: "战旗神殿",
    defense: "守护神殿",
    moves: "驿站神殿",
  }[type];
}

function renderMap() {
  const hero = getActiveHero();
  const reachable = getReachable(hero);
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

    const shrine = state.shrines.find((item) => item.x === x && item.y === y);
    if (shrine) {
      tile.innerHTML = `<div class="entity shrine">✦</div><div class="badge">坛</div>`;
    }

    const enemy = state.enemies.find((item) => item.x === x && item.y === y);
    if (enemy) {
      tile.innerHTML = `<div class="entity hero-red">★</div><div class="badge">${enemy.tier}</div>`;
    }

    const heroOnTile = state.heroes.find((item) => item.x === x && item.y === y);
    if (heroOnTile) {
      const heroIndex = state.heroes.findIndex((item) => item.id === heroOnTile.id) + 1;
      tile.innerHTML = `<div class="entity hero-blue">★</div><div class="badge">${heroIndex}</div>`;
    }
  });
}

function renderSidebar() {
  const hero = getActiveHero();
  els.day.textContent = `${state.day} / 周内第 ${state.weekDay} 天`;
  els.moves.textContent = `${hero.moves} / ${hero.maxMoves}`;
  els.heroName.textContent = hero.name;
  els.heroPos.textContent = `${hero.x}, ${hero.y}`;
  els.heroAttack.textContent = String(hero.attack);
  els.heroDefense.textContent = String(hero.defense);
  els.heroPower.textContent = String(getHeroPower(hero));
  els.heroLevel.textContent = `Lv.${hero.level}`;
  els.heroXp.textContent = hero.level >= 5 ? "满级" : `${hero.xp} / ${getNextLevelXp(hero)}`;
  els.objectiveMines.textContent = `${getOwnedMineCount()} / ${WIN_TARGETS.mines}`;
  els.objectiveEnemies.textContent = `${state.defeatedEnemies} / ${WIN_TARGETS.defeatedEnemies}`;
  els.objectiveCastle.textContent = `Lv.${state.castle.level} / Lv.${WIN_TARGETS.castleLevel}`;
  els.objectiveThreat.textContent = state.gameOver
    ? state.result === "victory"
      ? "胜利"
      : "失败"
    : `${state.enemies.length} 队 / ${WIN_TARGETS.deadline - state.day + 1} 天`;
  els.tileInfo.textContent = getSelectedTileInfo();
  els.castleLevel.textContent = `Lv.${state.castle.level}`;
  els.castleGrowth.textContent = `${state.castle.reserve} / 周增长 ${getCastleGrowth()}`;
  els.castleBuildings.textContent =
    `${TOWN_HALL_NAMES[state.castle.townHallLevel - 1]} / ${BARRACKS_NAMES[state.castle.barracksLevel - 1]}`;
  els.castleAlert.textContent = `${state.castleRaids} / 3`;
  els.castleReserve.textContent = `${state.castle.reserve}`;
  els.actionInfo.textContent = getActionInfo(hero);
  els.castleScreen.classList.toggle("hidden", state.screen !== "castle");
  els.openCastleBtn.textContent = state.screen === "castle" ? "城堡中" : "进入城堡";
  els.openCastleBtn.disabled = state.gameOver || state.screen === "castle";

  els.resources.innerHTML = Object.entries(state.resources)
    .map(([key, value]) => `<div class="row"><span>${resourceLabel(key)}</span><strong>${value}</strong></div>`)
    .join("");

  els.army.innerHTML = hero.army
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

  els.heroList.innerHTML = state.heroes
    .map((item) => {
      const active = item.id === hero.id;
      return `
        <button class="army-item" data-hero-id="${item.id}" style="border:${active ? "1px solid rgba(94, 167, 255, 0.8)" : "1px solid transparent"}; cursor:pointer;">
          <div class="name"><span class="star" style="color:#8ac1ff">★</span><span>${item.name}</span></div>
          <strong>${item.moves} / ${item.maxMoves}</strong>
        </button>
      `;
    })
    .join("");

  els.heroList.querySelectorAll("[data-hero-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextHero = state.heroes.find((item) => item.id === button.dataset.heroId);
      if (!nextHero) return;
      state.activeHeroId = nextHero.id;
      state.selected = { x: nextHero.x, y: nextHero.y };
      render();
    });
  });

  logEl.innerHTML = state.logs.map((item) => `<div class="log-entry">${item}</div>`).join("");
  updateActionStates(hero);
}

function updateActionStates(hero) {
  const nearCastle = Math.abs(hero.x - state.castle.x) + Math.abs(hero.y - state.castle.y) <= 1;
  els.recruitBtn.disabled = state.gameOver || !nearCastle || state.castle.reserve <= 0;
  els.buildTownhallBtn.disabled = state.gameOver || state.castle.townHallLevel >= 3;
  els.buildBarracksBtn.disabled = state.gameOver || state.castle.barracksLevel >= 3;
  els.hireHeroBtn.disabled = state.gameOver || !HERO_POOL.some((item) => !state.heroes.some((heroItem) => heroItem.id === item.id));
  els.endTurnBtn.disabled = state.gameOver;
  els.openCastleBtn.disabled = state.gameOver || state.screen === "castle" || !nearCastle;
  els.saveBtn.disabled = false;
  els.loadBtn.disabled = false;
  els.restartBtn.disabled = false;
  els.closeCastleBtn.disabled = state.screen !== "castle";
}

function render() {
  renderMap();
  renderSidebar();
}

els.endTurnBtn.addEventListener("click", endTurn);
els.recruitBtn.addEventListener("click", recruit);
els.buildTownhallBtn.addEventListener("click", buildTownHall);
els.buildBarracksBtn.addEventListener("click", buildBarracks);
els.hireHeroBtn.addEventListener("click", hireHero);
els.openCastleBtn.addEventListener("click", () => {
  openCastleScreen();
  render();
});
els.closeCastleBtn.addEventListener("click", () => {
  closeCastleScreen();
  render();
});
els.saveBtn.addEventListener("click", saveGame);
els.loadBtn.addEventListener("click", loadGame);
els.restartBtn.addEventListener("click", restartGame);

buildMap();
log("第二版原型开始。双英雄、城堡建筑和敌军游荡已经接入。");
render();
