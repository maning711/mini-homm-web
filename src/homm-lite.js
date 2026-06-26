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
  heroStatus: document.getElementById("hero-status"),
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
  openCastleBtn: document.getElementById("open-castle-btn"),
  mapScreen: document.getElementById("map-screen"),
  castleView: document.getElementById("castle-view"),
  castleExitBtn: document.getElementById("castle-exit-btn"),
  castleFlavor: document.getElementById("castle-flavor"),
  castleViewLevel: document.getElementById("castle-view-level"),
  castleViewAlert: document.getElementById("castle-view-alert"),
  castleViewGrowth: document.getElementById("castle-view-growth"),
  castleViewReserve: document.getElementById("castle-view-reserve"),
  castleDistricts: document.getElementById("castle-districts"),
  districtTitle: document.getElementById("district-title"),
  districtDesc: document.getElementById("district-desc"),
  districtCost: document.getElementById("district-cost"),
  districtActionBtn: document.getElementById("district-action-btn"),
  spellList: document.getElementById("spell-list"),
  spellActions: document.getElementById("spell-actions"),
  garrisonList: document.getElementById("garrison-list"),
  endTurnBtn: document.getElementById("end-turn-btn"),
  saveBtn: document.getElementById("save-btn"),
  loadBtn: document.getElementById("load-btn"),
  restartBtn: document.getElementById("restart-btn"),
  actionInfo: document.getElementById("action-info"),
};

const TILE_TYPES = ["grass", "forest", "grass", "hill", "grass"];
const UNIT_COLORS = ["#e6f0ff", "#7cd2ff", "#8ff0a2", "#ffd46a", "#ff8f8f"];
const SAVE_KEY = "mini-homm-web-save-v2";
const WIN_TARGETS = {
  mines: 3,
  defeatedEnemies: 6,
  castleLevel: 4,
  deadline: 28,
};
const HERO_POOL = [
  { id: "hero-3", name: "罗温", maxMoves: 8, attack: 2, defense: 2, army: [{ tier: 1, count: 10 }], spells: [] },
  { id: "hero-4", name: "米拉", maxMoves: 9, attack: 1, defense: 1, army: [{ tier: 2, count: 5 }], spells: [] },
  { id: "hero-5", name: "瑟琳", maxMoves: 8, attack: 1, defense: 2, army: [{ tier: 1, count: 7 }], spells: ["护体石肤"] },
];
const SPELL_POOL = ["疾行术", "护体石肤", "火焰箭", "侦察之眼", "鼓舞术"];
const DISTRICT_ORDER = ["townHall", "barracks", "mageTower", "market", "tavern", "fort"];
const DISTRICTS = {
  townHall: {
    name: "议事厅",
    levelNames: ["帐篷", "议事厅", "市政厅", "议政宫"],
    desc: "提升每日金币产出，是城堡发展的根基。",
  },
  barracks: {
    name: "兵营",
    levelNames: ["营火", "兵营", "练兵场", "军团营地"],
    desc: "提高每周兵力增长，并解锁更强招募。",
  },
  mageTower: {
    name: "法师塔",
    levelNames: ["未建造", "学徒棚", "法师塔", "星象塔"],
    desc: "建成后可在城内学习法术，增强英雄能力。",
  },
  market: {
    name: "市场",
    levelNames: ["未建造", "小摊", "市场", "交易所"],
    desc: "提高资源流转效率，增加每日附加收入。",
  },
  tavern: {
    name: "酒馆",
    levelNames: ["火盆", "酒馆", "英雄大厅", "王侯会馆"],
    desc: "招募新英雄，并让来访英雄获得法力补给。",
  },
  fort: {
    name: "要塞墙",
    levelNames: ["未建造", "木栅", "石墙", "堡垒"],
    desc: "减少敌军突袭城堡时的损失，守住大后方。",
  },
};
const UNIT_OFFERS = [
  { tier: 1, name: "枪兵", unlock: 1, baseCost: 45, weekly: 8 },
  { tier: 2, name: "弓兵", unlock: 2, baseCost: 85, weekly: 5 },
  { tier: 3, name: "骑士侍从", unlock: 3, baseCost: 140, weekly: 3 },
];

let state = createInitialState();

function createInitialState() {
  return {
    size: 20,
    day: 1,
    weekDay: 1,
    screen: "map",
    selectedDistrict: "townHall",
    activeHeroId: "hero-1",
    activeSpell: null,
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
        mana: 0,
        spells: [],
        effects: [],
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
        mana: 0,
        spells: [],
        effects: [],
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
      baseGrowth: 5,
      reserve: { 1: 8, 2: 0, 3: 0 },
      townHallLevel: 1,
      barracksLevel: 1,
      mageTowerLevel: 0,
      marketLevel: 0,
      tavernLevel: 1,
      fortLevel: 0,
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
  if (x === 0 || y === 0 || x === state.size - 1 || y === state.size - 1) return "water";
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

function isEnemyAt(x, y, ignoreEnemyId = null) {
  return state.enemies.some((enemy) => enemy.id !== ignoreEnemyId && enemy.x === x && enemy.y === y);
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
      if (!inBounds(nx, ny) || stepCost >= 99 || isHeroAt(nx, ny, hero.id)) return;
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
  const bonusAttack = getEffectValue(hero, "attack");
  const bonusDefense = getEffectValue(hero, "defense");
  return armyPower + (hero.attack + bonusAttack) * 4 + (hero.defense + bonusDefense) * 3 + hero.level * 4 + hero.spells.length * 2;
}

function getEffectValue(hero, stat) {
  return hero.effects
    .filter((effect) => effect.stat === stat)
    .reduce((sum, effect) => sum + effect.value, 0);
}

function getHeroMoveLimit(hero) {
  return hero.maxMoves + getEffectValue(hero, "move");
}

function applyHeroEffect(hero, effect) {
  const existing = hero.effects.find((item) => item.id === effect.id);
  if (existing) {
    existing.days = Math.max(existing.days, effect.days);
    existing.value = effect.value;
    return;
  }
  hero.effects.push({ ...effect });
}

function tickHeroEffects(hero) {
  hero.effects = hero.effects
    .map((effect) => ({ ...effect, days: effect.days - 1 }))
    .filter((effect) => effect.days > 0);
}

function formatHeroEffects(hero) {
  if (!hero.effects.length) return "无";
  return hero.effects.map((effect) => `${effect.name} ${effect.days}天`).join(" / ");
}

function tickHeroEffects(hero) {
  hero.effects = hero.effects
    .map((effect) => ({ ...effect, days: effect.days - 1 }))
    .filter((effect) => effect.days > 0);
}

function getDistrictLevel(key) {
  return {
    townHall: state.castle.townHallLevel,
    barracks: state.castle.barracksLevel,
    mageTower: state.castle.mageTowerLevel,
    market: state.castle.marketLevel,
    tavern: state.castle.tavernLevel,
    fort: state.castle.fortLevel,
  }[key];
}

function setDistrictLevel(key, value) {
  if (key === "townHall") state.castle.townHallLevel = value;
  if (key === "barracks") state.castle.barracksLevel = value;
  if (key === "mageTower") state.castle.mageTowerLevel = value;
  if (key === "market") state.castle.marketLevel = value;
  if (key === "tavern") state.castle.tavernLevel = value;
  if (key === "fort") state.castle.fortLevel = value;
  state.castle.level = Math.max(
    state.castle.townHallLevel,
    state.castle.barracksLevel,
    state.castle.mageTowerLevel,
    state.castle.marketLevel,
    state.castle.tavernLevel,
    state.castle.fortLevel,
  );
}

function getDistrictCost(key, nextLevel = getDistrictLevel(key) + 1) {
  const costTable = {
    townHall: { gold: 700 + nextLevel * 450, wood: Math.max(0, nextLevel - 1), ore: Math.max(0, nextLevel - 1) },
    barracks: { gold: 650 + nextLevel * 420, wood: nextLevel, ore: nextLevel },
    mageTower: { gold: 850 + nextLevel * 480, wood: nextLevel, crystal: Math.max(1, nextLevel - 1) },
    market: { gold: 600 + nextLevel * 350, wood: Math.max(0, nextLevel - 1), ore: 1 },
    tavern: { gold: 500 + nextLevel * 380, wood: 1, ore: Math.max(0, nextLevel - 1) },
    fort: { gold: 900 + nextLevel * 520, wood: nextLevel + 1, ore: nextLevel + 1 },
  };
  return costTable[key];
}

function getDistrictRequirement(key, nextLevel = getDistrictLevel(key) + 1) {
  const requirementTable = {
    townHall: null,
    barracks: nextLevel >= 2 ? { key: "townHall", level: 2 } : null,
    mageTower: { key: "townHall", level: 2 },
    market: { key: "townHall", level: 1 },
    tavern: { key: "market", level: 1 },
    fort: nextLevel >= 2 ? { key: "barracks", level: 2 } : { key: "townHall", level: 1 },
  };
  return requirementTable[key];
}

function getDistrictRequirementText(key, nextLevel = getDistrictLevel(key) + 1) {
  const requirement = getDistrictRequirement(key, nextLevel);
  if (!requirement) return "无前置要求";
  return `${DISTRICTS[requirement.key].name} 需要达到 Lv.${requirement.level}`;
}

function meetsDistrictRequirement(key, nextLevel = getDistrictLevel(key) + 1) {
  const requirement = getDistrictRequirement(key, nextLevel);
  if (!requirement) return true;
  return getDistrictLevel(requirement.key) >= requirement.level;
}

function canAfford(cost) {
  return Object.entries(cost).every(([key, value]) => state.resources[key] >= value);
}

function spend(cost) {
  Object.entries(cost).forEach(([key, value]) => {
    state.resources[key] -= value;
  });
}

function getTownHallIncome() {
  return 200 + state.castle.townHallLevel * 250 + state.castle.marketLevel * 120;
}

function getMineIncome(type) {
  const marketBonus = state.castle.marketLevel >= 2 ? 1 : 0;
  if (type === "gold") return 250 + state.castle.marketLevel * 60;
  return 1 + marketBonus;
}

function getWeeklyGrowthForTier(tier) {
  const offer = UNIT_OFFERS.find((item) => item.tier === tier);
  if (!offer) return 0;
  if (state.castle.barracksLevel < offer.unlock) return 0;
  return offer.weekly + Math.max(0, state.castle.barracksLevel - offer.unlock) * 2;
}

function refillWeeklyReserve() {
  UNIT_OFFERS.forEach((offer) => {
    state.castle.reserve[offer.tier] = (state.castle.reserve[offer.tier] || 0) + getWeeklyGrowthForTier(offer.tier);
  });
}

function getCastleGrowthSummary() {
  return UNIT_OFFERS.filter((offer) => getWeeklyGrowthForTier(offer.tier) > 0)
    .map((offer) => `${offer.name}+${getWeeklyGrowthForTier(offer.tier)}`)
    .join(" / ");
}

function getSpellChoices() {
  return SPELL_POOL.slice(0, state.castle.mageTowerLevel + 1);
}

function canCastSpell(hero, spell) {
  const costs = {
    疾行术: 1,
    护体石肤: 1,
    火焰箭: 2,
    侦察之眼: 1,
    鼓舞术: 2,
  };
  return hero.spells.includes(spell) && hero.mana >= (costs[spell] || 1);
}

function castSpell(spell) {
  const hero = getActiveHero();
  if (!canCastSpell(hero, spell)) {
    log(`${hero.name} 当前无法施放 ${spell}。`);
    render();
    return;
  }

  const costs = {
    疾行术: 1,
    护体石肤: 1,
    火焰箭: 2,
    侦察之眼: 1,
    鼓舞术: 2,
  };
  hero.mana -= costs[spell] || 1;

  if (spell === "疾行术") {
    applyHeroEffect(hero, { id: "haste", name: "疾行", stat: "move", value: 2, days: 2 });
    hero.moves = Math.min(getHeroMoveLimit(hero), hero.moves + 2);
    log(`${hero.name} 施放了疾行术，接下来 2 天移动力提高。`);
  } else if (spell === "护体石肤") {
    applyHeroEffect(hero, { id: "stone-skin", name: "石肤", stat: "defense", value: 1, days: 3 });
    log(`${hero.name} 施放了护体石肤，接下来 3 天防御提高。`);
  } else if (spell === "火焰箭") {
    const target = state.enemies
      .map((enemy) => ({ enemy, dist: Math.abs(enemy.x - hero.x) + Math.abs(enemy.y - hero.y) }))
      .filter((item) => item.dist <= 4)
      .sort((a, b) => a.dist - b.dist)[0]?.enemy;
    if (!target) {
      hero.mana += costs[spell] || 1;
      log("附近没有可被火焰箭命中的敌军。");
      render();
      return;
    }
    target.power = Math.max(1, target.power - 8);
    log(`${hero.name} 用火焰箭重创了附近敌军。`);
  } else if (spell === "侦察之眼") {
    applyHeroEffect(hero, { id: "scout-eye", name: "侦察", stat: "move", value: 1, days: 3 });
    hero.moves = Math.min(getHeroMoveLimit(hero), hero.moves + 1);
    log(`${hero.name} 施放侦察之眼，接下来 3 天机动性提高。`);
  } else if (spell === "鼓舞术") {
    applyHeroEffect(hero, { id: "morale", name: "鼓舞", stat: "attack", value: 1, days: 2 });
    log(`${hero.name} 施放鼓舞术，接下来 2 天攻击提高。`);
  }

  render();
}

function handleTileClick(x, y) {
  if (state.gameOver) return;
  if (state.castle.x === x && state.castle.y === y) {
    state.selected = { x, y };
    openCastleScreen(true);
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
  if (reachable.cells.has(`${x},${y}`)) {
    moveHero(hero, x, y, reachable.costs.get(`${x},${y}`));
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
  const lowest = hero.army.find((unit) => unit.count > 0);
  if (!lowest || loss <= 0) return;
  lowest.count = Math.max(1, lowest.count - loss);
}

function gainXp(hero, amount) {
  hero.xp += amount;
  while (hero.level < 5 && hero.xp >= getNextLevelXp(hero)) {
    hero.xp -= getNextLevelXp(hero);
    hero.level += 1;
    if (hero.level % 2 === 0) hero.attack += 1;
    else hero.defense += 1;
    log(`${hero.name} 升到 ${hero.level} 级。`);
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
  if (fallback) [hero.x, hero.y] = fallback;
}

function resourceLabel(type) {
  return {
    gold: "金币",
    wood: "木材",
    ore: "矿石",
    crystal: "水晶",
  }[type];
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

function endTurn() {
  if (state.gameOver) return;
  closeCastleScreen();
  state.day += 1;
  state.weekDay += 1;

  if (state.weekDay > 7) {
    state.weekDay = 1;
    refillWeeklyReserve();
    log(`新的一周开始了，城堡新增 ${getCastleGrowthSummary()}。`);
  }

  state.heroes.forEach((hero) => {
    tickHeroEffects(hero);
    hero.moves = getHeroMoveLimit(hero);
    if (state.castle.tavernLevel >= 2) hero.mana = Math.min(5 + state.castle.mageTowerLevel, hero.mana + 1);
  });

  state.resources.gold += getTownHallIncome();
  state.mines.forEach((mine) => {
    if (mine.owner === "player") state.resources[mine.type] += getMineIncome(mine.type);
  });

  enemyTurn();
  if (Math.random() < 0.45) spawnPickup();
  if (Math.random() < 0.22) spawnEnemy();

  log("一天结束，矿点和城堡经济完成结算。");
  checkObjectives();
  render();
}

function enemyTurn() {
  state.enemies.forEach((enemy) => {
    for (let step = 0; step < enemy.moves; step += 1) {
      const target = findNearestHero(enemy.x, enemy.y);
      if (!target) return;
      const next = nextStepToward(enemy.x, enemy.y, target.x, target.y);
      if (!next || movementCost(next.x, next.y) >= 99 || isEnemyAt(next.x, next.y, enemy.id)) return;
      enemy.x = next.x;
      enemy.y = next.y;

      const hero = state.heroes.find((item) => item.x === enemy.x && item.y === enemy.y);
      if (hero) {
        resolveBattle(hero, state.enemies.findIndex((item) => item.id === enemy.id));
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
  const fortShield = state.castle.fortLevel * 2;
  state.castle.reserve[1] = Math.max(0, state.castle.reserve[1] - Math.max(1, Math.ceil(enemy.power / 12) - fortShield));
  state.resources.gold = Math.max(0, state.resources.gold - Math.max(80, 320 - state.castle.fortLevel * 70));
  enemy.x = Math.min(state.size - 2, state.castle.x + 3);
  enemy.y = Math.max(1, state.castle.y - 2);
  log(`敌军突袭了城堡，损失部分金币和预备役。警戒 ${state.castleRaids} / 3。`);
  if (state.castleRaids >= 3) {
    state.gameOver = true;
    state.result = "defeat";
    log("战役失败：城堡连续遭到突袭，防线崩溃。");
  }
}

function findNearestHero(x, y) {
  return state.heroes
    .map((hero) => ({ hero, dist: Math.abs(hero.x - x) + Math.abs(hero.y - y) }))
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
    if (occupied) continue;
    const pool = [
      { type: "gold", amount: 220 },
      { type: "gold", amount: 340 },
      { type: "wood", amount: 1 },
      { type: "ore", amount: 1 },
      { type: "crystal", amount: 1 },
    ];
    state.pickups.push({ x, y, ...pool[Math.floor(Math.random() * pool.length)] });
    return;
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

function openCastleScreen(force = false) {
  const hero = getActiveHero();
  if (!hero && !force) {
    log("当前没有可进入城堡的英雄。");
    return;
  }
  state.screen = "castle";
}

function closeCastleScreen() {
  state.screen = "map";
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

function getOpenCastleSpot() {
  return [
    { x: state.castle.x, y: state.castle.y - 1 },
    { x: state.castle.x + 1, y: state.castle.y },
    { x: state.castle.x - 1, y: state.castle.y },
    { x: state.castle.x + 1, y: state.castle.y - 1 },
  ].find((spot) => inBounds(spot.x, spot.y) && movementCost(spot.x, spot.y) < 99 && !isHeroAt(spot.x, spot.y));
}

function recruitTier(tier) {
  if (state.gameOver) return;
  const offer = UNIT_OFFERS.find((item) => item.tier === tier);
  if (!offer || getDistrictLevel("barracks") < offer.unlock) {
    log("兵营等级还不够，无法招募该兵种。");
    render();
    return;
  }
  const reserve = state.castle.reserve[tier] || 0;
  if (reserve <= 0) {
    log(`${offer.name} 当前没有可招募兵力。`);
    render();
    return;
  }
  const hero = getActiveHero();
  const nearCastle = Math.abs(hero.x - state.castle.x) + Math.abs(hero.y - state.castle.y) <= 1;
  if (!nearCastle) {
    log("只有靠近城堡的英雄才能补兵。");
    render();
    return;
  }
  const cost = reserve * offer.baseCost;
  if (state.resources.gold < cost) {
    log(`${offer.name} 招募需要 ${cost} 金币。`);
    render();
    return;
  }
  state.resources.gold -= cost;
  addUnitsToHero(hero, tier, reserve);
  state.castle.reserve[tier] = 0;
  log(`${hero.name} 招募了 ${reserve} 名${offer.name}。`);
  render();
}

function addUnitsToHero(hero, tier, count) {
  const existing = hero.army.find((unit) => unit.tier === tier);
  if (existing) existing.count += count;
  else hero.army.push({ tier, count });
  hero.army.sort((a, b) => a.tier - b.tier);
}

function hireHero() {
  if (state.gameOver) return;
  if (state.castle.tavernLevel < 1) {
    log("需要先建造酒馆。");
    render();
    return;
  }
  const candidate = HERO_POOL.find((item) => !state.heroes.some((hero) => hero.id === item.id));
  if (!candidate) {
    log("酒馆里暂时没有新的英雄。");
    render();
    return;
  }
  const cost = { gold: 1200 - state.castle.tavernLevel * 80, crystal: 1 };
  if (!canAfford(cost)) {
    log("招募英雄需要金币和水晶。");
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
    mana: state.castle.mageTowerLevel,
    spells: [...candidate.spells],
    army: candidate.army.map((unit) => ({ ...unit })),
  };
  state.heroes.push(hero);
  state.activeHeroId = hero.id;
  state.selected = { x: hero.x, y: hero.y };
  log(`${hero.name} 在酒馆加入了队伍。`);
  render();
}

function learnSpell() {
  if (state.castle.mageTowerLevel <= 0) {
    log("需要先建造法师塔。");
    render();
    return;
  }
  const hero = getActiveHero();
  const candidates = getSpellChoices().filter((spell) => !hero.spells.includes(spell));
  if (!candidates.length) {
    log(`${hero.name} 已掌握当前法师塔的全部法术。`);
    render();
    return;
  }
  const spell = candidates[0];
  hero.spells.push(spell);
  hero.mana = Math.max(hero.mana, state.castle.mageTowerLevel);
  log(`${hero.name} 在法师塔学会了 ${spell}。`);
  render();
}

function upgradeDistrict(key) {
  const level = getDistrictLevel(key);
  if (level >= 3) {
    log(`${DISTRICTS[key].name} 已达到最高级。`);
    render();
    return;
  }
  const nextLevel = level + 1;
  if (!meetsDistrictRequirement(key, nextLevel)) {
    log(`${DISTRICTS[key].name} 尚未满足前置条件：${getDistrictRequirementText(key, nextLevel)}。`);
    render();
    return;
  }
  const cost = getDistrictCost(key, nextLevel);
  if (!canAfford(cost)) {
    log(`${DISTRICTS[key].name} 升级资源不足。`);
    render();
    return;
  }
  spend(cost);
  setDistrictLevel(key, nextLevel);
  if (key === "mageTower") {
    const newlyKnown = getSpellChoices().slice(0, nextLevel);
    state.heroes.forEach((hero) => {
      hero.mana = Math.max(hero.mana, nextLevel);
    });
    log(`法师塔扩建完成，可研习 ${newlyKnown[newlyKnown.length - 1]}。`);
  } else {
    log(`${DISTRICTS[key].name} 升级为 ${DISTRICTS[key].levelNames[nextLevel]}。`);
  }
  checkObjectives();
  render();
}

function getSelectedDistrictAction() {
  const key = state.selectedDistrict;
  const level = getDistrictLevel(key);
  if (key === "mageTower" && level > 0) {
    const hero = getActiveHero();
    const candidates = getSpellChoices().filter((spell) => !hero.spells.includes(spell));
    return {
      label: candidates.length ? `研习 ${candidates[0]}` : "法术已学完",
      disabled: !candidates.length,
      onClick: learnSpell,
    };
  }
  if (key === "tavern" && level > 0) {
    return {
      label: "招募英雄",
      disabled: !HERO_POOL.some((item) => !state.heroes.some((hero) => hero.id === item.id)),
      onClick: hireHero,
    };
  }
  if (level >= 3) {
    return {
      label: "已达上限",
      disabled: true,
      onClick: () => {},
    };
  }
  return {
    label: `升级到 ${DISTRICTS[key].levelNames[level + 1]}`,
    disabled: !canAfford(getDistrictCost(key, level + 1)) || !meetsDistrictRequirement(key, level + 1),
    onClick: () => upgradeDistrict(key),
  };
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

function getOwnedMineCount() {
  return state.mines.filter((mine) => mine.owner === "player").length;
}

function getThreatLevel() {
  return state.enemies.reduce((sum, enemy) => sum + enemy.power, 0);
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
    return `已进入城堡，可升级建筑、研习法术、招募英雄和补充驻军。当前英雄：${hero.name}。`;
  }
  return nearCastle ? "靠近城堡，可进入城堡发展或补兵。" : "点击城堡格进入城堡。";
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
    if (mine) tile.innerHTML = `<div class="entity mine">⬢</div><div class="badge">${mine.owner === "player" ? "我" : "矿"}</div>`;

    const pickup = state.pickups.find((item) => item.x === x && item.y === y);
    if (pickup) tile.innerHTML = `<div class="entity resource">◆</div>`;

    const shrine = state.shrines.find((item) => item.x === x && item.y === y);
    if (shrine) tile.innerHTML = `<div class="entity shrine">✦</div><div class="badge">坛</div>`;

    const enemy = state.enemies.find((item) => item.x === x && item.y === y);
    if (enemy) tile.innerHTML = `<div class="entity hero-red">★</div><div class="badge">${enemy.tier}</div>`;

    const heroOnTile = state.heroes.find((item) => item.x === x && item.y === y);
    if (heroOnTile) {
      const heroIndex = state.heroes.findIndex((item) => item.id === heroOnTile.id) + 1;
      tile.innerHTML = `<div class="entity hero-blue">★</div><div class="badge">${heroIndex}</div>`;
    }
  });
}

function renderCastleView() {
  const hero = getActiveHero();
  const district = DISTRICTS[state.selectedDistrict];
  const districtLevel = getDistrictLevel(state.selectedDistrict);
  const nextCost = districtLevel >= 3 ? null : getDistrictCost(state.selectedDistrict, districtLevel + 1);
  const action = getSelectedDistrictAction();
  const requirementText = districtLevel >= 3 ? "已满足全部前置" : getDistrictRequirementText(state.selectedDistrict, districtLevel + 1);

  els.castleFlavor.textContent = `${hero.name} 正在城内处理建设、补给与魔法事务。`;
  els.castleViewLevel.textContent = `Lv.${state.castle.level}`;
  els.castleViewAlert.textContent = `${state.castleRaids} / 3`;
  els.castleViewGrowth.textContent = getCastleGrowthSummary() || "暂无";
  els.castleViewReserve.textContent = Object.values(state.castle.reserve).reduce((sum, value) => sum + value, 0);

  els.castleDistricts.innerHTML = DISTRICT_ORDER.map((key) => {
    const item = DISTRICTS[key];
    const level = getDistrictLevel(key);
    const active = key === state.selectedDistrict ? " active" : "";
    const next = level >= 3 ? "已满级" : `下一步: ${formatCost(getDistrictCost(key, level + 1))}`;
    return `
      <div class="district${active}">
        <div class="title">
          <strong>${item.name}</strong>
          <span>Lv.${level}</span>
        </div>
        <div class="meta">${item.levelNames[level]}</div>
        <div class="cost">${next}</div>
        <button type="button" data-district="${key}">查看</button>
      </div>
    `;
  }).join("");

  els.castleDistricts.querySelectorAll("[data-district]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedDistrict = button.dataset.district;
      render();
    });
  });

  els.districtTitle.textContent = `${district.name} · ${district.levelNames[districtLevel]}`;
  els.districtDesc.textContent = district.desc;
  els.districtCost.textContent = nextCost
    ? `升级消耗: ${formatCost(nextCost)} | 前置: ${requirementText}`
    : "已经达到当前原型的最高等级。";
  els.districtActionBtn.textContent = action.label;
  els.districtActionBtn.disabled = state.gameOver || action.disabled;
  els.districtActionBtn.onclick = action.onClick;

  els.spellList.innerHTML = hero.spells.length
    ? hero.spells.map((spell) => `<div class="spell-item"><span>${spell}</span><strong>法力 ${hero.mana}</strong></div>`).join("")
    : `<div class="spell-item"><span>暂无法术</span><strong>需要法师塔</strong></div>`;

  els.spellActions.innerHTML = hero.spells.length
    ? hero.spells
        .map(
          (spell) =>
            `<button class="action secondary" data-cast-spell="${spell}" ${canCastSpell(hero, spell) ? "" : "disabled"}>施放 ${spell}</button>`,
        )
        .join("")
    : "";

  els.spellActions.querySelectorAll("[data-cast-spell]").forEach((button) => {
    button.addEventListener("click", () => castSpell(button.dataset.castSpell));
  });

  els.garrisonList.innerHTML = UNIT_OFFERS.map((offer) => {
    const available = state.castle.reserve[offer.tier] || 0;
    const locked = state.castle.barracksLevel < offer.unlock;
    return `
      <div class="garrison-item">
        <span>${offer.name} ${locked ? "(未解锁)" : `可招募 ${available}`}</span>
        <button class="action secondary" data-tier="${offer.tier}" ${locked || available <= 0 ? "disabled" : ""}>招募</button>
      </div>
    `;
  }).join("");

  els.garrisonList.querySelectorAll("[data-tier]").forEach((button) => {
    button.addEventListener("click", () => recruitTier(Number(button.dataset.tier)));
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
  els.heroStatus.textContent = formatHeroEffects(hero);
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
  els.castleGrowth.textContent = getCastleGrowthSummary() || "暂无";
  els.castleBuildings.textContent = DISTRICT_ORDER.map((key) => `${DISTRICTS[key].name} ${getDistrictLevel(key)}`).join(" / ");
  els.actionInfo.textContent = getActionInfo(hero);

  els.resources.innerHTML = Object.entries(state.resources)
    .map(([key, value]) => `<div class="row"><span>${resourceLabel(key)}</span><strong>${value}</strong></div>`)
    .join("");

  els.army.innerHTML = hero.army
    .map((unit) => {
      const offer = UNIT_OFFERS.find((item) => item.tier === unit.tier);
      const color = UNIT_COLORS[Math.min(unit.tier - 1, UNIT_COLORS.length - 1)];
      return `<div class="army-item"><div class="name"><span class="star" style="color:${color}">★</span><span>${offer ? offer.name : `${unit.tier} 阶兵`}</span></div><strong>${unit.count}</strong></div>`;
    })
    .join("");

  els.heroList.innerHTML = state.heroes
    .map((item) => {
      const active = item.id === hero.id;
      return `<button class="army-item" data-hero-id="${item.id}" style="border:${active ? "1px solid rgba(94, 167, 255, 0.8)" : "1px solid transparent"}; cursor:pointer;"><div class="name"><span class="star" style="color:#8ac1ff">★</span><span>${item.name}</span></div><strong>${item.moves} / ${item.maxMoves}</strong></button>`;
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

function formatCost(cost) {
  return Object.entries(cost)
    .map(([key, value]) => `${value}${resourceLabel(key)}`)
    .join(" ");
}

function updateActionStates(hero) {
  els.openCastleBtn.disabled = state.gameOver || state.screen === "castle";
  els.endTurnBtn.disabled = state.gameOver;
}

function render() {
  renderMap();
  renderSidebar();
  renderCastleView();
  els.mapScreen.classList.toggle("hidden", state.screen !== "map");
  els.castleView.classList.toggle("hidden", state.screen !== "castle");
}

els.openCastleBtn.addEventListener("click", () => {
  openCastleScreen(false);
  render();
});
els.castleExitBtn.addEventListener("click", () => {
  closeCastleScreen();
  render();
});
els.endTurnBtn.addEventListener("click", endTurn);
els.saveBtn.addEventListener("click", saveGame);
els.loadBtn.addEventListener("click", loadGame);
els.restartBtn.addEventListener("click", restartGame);

buildMap();
refillWeeklyReserve();
log("第三版原型开始。城堡已经拥有独立经营界面。");
render();
