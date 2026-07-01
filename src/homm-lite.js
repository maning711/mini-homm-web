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
  mapOverviewCastle: document.getElementById("map-overview-castle"),
  mapOverviewMines: document.getElementById("map-overview-mines"),
  mapOverviewThreat: document.getElementById("map-overview-threat"),
  mapOverviewFront: document.getElementById("map-overview-front"),
  mapScreen: document.getElementById("map-screen"),
  battleView: document.getElementById("battle-view"),
  battleResultView: document.getElementById("battle-result-view"),
  battleFlavor: document.getElementById("battle-flavor"),
  battleTurn: document.getElementById("battle-turn"),
  battlePlayerPower: document.getElementById("battle-player-power"),
  battleEnemyPower: document.getElementById("battle-enemy-power"),
  battleRound: document.getElementById("battle-round"),
  battleOrder: document.getElementById("battle-order"),
  battleGrid: document.getElementById("battle-grid"),
  battleUnitTitle: document.getElementById("battle-unit-title"),
  battleUnitDesc: document.getElementById("battle-unit-desc"),
  battleLogline: document.getElementById("battle-logline"),
  battleLog: document.getElementById("battle-log"),
  battleEndTurnBtn: document.getElementById("battle-end-turn-btn"),
  battleRetreatBtn: document.getElementById("battle-retreat-btn"),
  battleResultTitle: document.getElementById("battle-result-title"),
  battleResultFlavor: document.getElementById("battle-result-flavor"),
  battleResultRound: document.getElementById("battle-result-round"),
  battleResultXp: document.getElementById("battle-result-xp"),
  battleResultLoot: document.getElementById("battle-result-loot"),
  battleResultLosses: document.getElementById("battle-result-losses"),
  battleResultCleanup: document.getElementById("battle-result-cleanup"),
  battleResultConfirmBtn: document.getElementById("battle-result-confirm-btn"),
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
const SAVE_VERSION = 3;
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
const RESOURCE_ICONS = {
  gold: "◈",
  wood: "▥",
  ore: "⬒",
  crystal: "✦",
};
const DISTRICT_ICONS = {
  townHall: "♛",
  barracks: "⚔",
  mageTower: "✧",
  market: "⛁",
  tavern: "☖",
  fort: "▣",
};
const SPELL_ICONS = {
  疾行术: "➹",
  护体石肤: "⬓",
  火焰箭: "✹",
  侦察之眼: "◉",
  鼓舞术: "✪",
};
const UNIT_ICONS = {
  1: "🛡",
  2: "🏹",
  3: "🐎",
};
const UNIT_PORTRAITS = {
  1: "🪖",
  2: "🧝",
  3: "🫅",
};
const ENEMY_UNIT_NAMES = {
  1: "匪徒",
  2: "弩手",
  3: "黑卫",
};
const ENEMY_UNIT_ICONS = {
  1: "☠",
  2: "⚷",
  3: "♞",
};
const ENEMY_UNIT_PORTRAITS = {
  1: "👺",
  2: "🦹",
  3: "💀",
};

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
    battle: null,
    battleResult: null,
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
      createEnemy("enemy-1", 10, 14, 2, 3, { gold: 300 }, [{ tier: 1, count: 8 }, { tier: 2, count: 3 }]),
      createEnemy("enemy-2", 14, 10, 3, 3, { gold: 450, wood: 1 }, [{ tier: 2, count: 7 }, { tier: 3, count: 2 }]),
      createEnemy("enemy-3", 6, 6, 1, 2, { ore: 1, gold: 220 }, [{ tier: 1, count: 7 }]),
    ],
    logs: [],
  };
}

function createEnemy(id, x, y, tier, moves, reward, army) {
  return {
    id,
    x,
    y,
    tier,
    moves,
    reward,
    army,
    power: getEnemyArmyPower(army),
  };
}

function getActiveHero() {
  return state.heroes.find((hero) => hero.id === state.activeHeroId) || state.heroes[0];
}

function cloneArmy(army) {
  return army.map((unit) => ({ tier: unit.tier, count: unit.count }));
}

function createSavePayload() {
  const snapshot = JSON.parse(JSON.stringify(state));
  snapshot.battle = null;
  snapshot.battleResult = null;
  snapshot.screen = "map";
  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    state: snapshot,
  };
}

function persistState({ announce = false } = {}) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(createSavePayload()));
  if (announce) {
    log("已保存当前战役进度。");
  }
}

function hydrateState(parsed) {
  const loadedState = parsed?.state || parsed;
  state = { ...createInitialState(), ...loadedState };
  state.battle = null;
  state.battleResult = null;
  if (state.screen !== "castle" && state.screen !== "map") state.screen = "map";
}

function tryRestoreSavedState({ announce = false } = {}) {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    hydrateState(parsed);
    if (announce) {
      const savedAt = parsed?.savedAt ? `（${new Date(parsed.savedAt).toLocaleString("zh-CN")}）` : "";
      log(`已读取战役进度${savedAt}。`);
    }
    return true;
  } catch {
    log("存档损坏，无法读取。");
    return false;
  }
}

function getUnitIcon(tier, side = "player") {
  return side === "enemy" ? ENEMY_UNIT_ICONS[tier] || "✦" : UNIT_ICONS[tier] || "★";
}

function getUnitPortrait(tier, side = "player") {
  return side === "enemy" ? ENEMY_UNIT_PORTRAITS[tier] || "👹" : UNIT_PORTRAITS[tier] || "🧙";
}

function getDistrictIcon(key) {
  return DISTRICT_ICONS[key] || "◼";
}

function getSpellIcon(spell) {
  return SPELL_ICONS[spell] || "✧";
}

function getResourceIcon(type) {
  return RESOURCE_ICONS[type] || "•";
}

function createBattleState(hero, enemy, enemyIndex) {
  return {
    round: 1,
    side: "player",
    actorId: "player-0",
    selectedUnitId: null,
    selectedCell: null,
    enemyIndex,
    heroId: hero.id,
    enemyId: enemy.id,
    logs: [`${hero.name} 遭遇了 ${formatEnemyArmy(enemy)}。`],
    playerUnits: hero.army.map((unit, index) => ({
      id: `player-${index}`,
      side: "player",
      tier: unit.tier,
      icon: getUnitIcon(unit.tier, "player"),
      portrait: getUnitPortrait(unit.tier, "player"),
      name: UNIT_OFFERS.find((item) => item.tier === unit.tier)?.name || `${unit.tier}阶兵`,
      count: unit.count,
      attack: hero.attack + unit.tier * 2,
      defense: hero.defense + unit.tier,
      hp: 6 + unit.tier * 4,
      maxHp: 6 + unit.tier * 4,
      speed: 3 + unit.tier,
      x: 0,
      y: Math.min(5, index * 2 + 1),
      acted: false,
      retaliated: false,
    })),
    enemyUnits: enemy.army.map((unit, index) => ({
      id: `enemy-${index}`,
      side: "enemy",
      tier: unit.tier,
      icon: getUnitIcon(unit.tier, "enemy"),
      portrait: getUnitPortrait(unit.tier, "enemy"),
      name: ENEMY_UNIT_NAMES[unit.tier] || `${unit.tier}阶敌军`,
      count: unit.count,
      attack: enemy.tier + unit.tier * 2,
      defense: enemy.tier + unit.tier,
      hp: 6 + unit.tier * 4,
      maxHp: 6 + unit.tier * 4,
      speed: 3 + unit.tier,
      x: 7,
      y: Math.min(5, index * 2 + 1),
      acted: false,
      retaliated: false,
    })),
  };
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

function getHeroArmyCount(hero) {
  return hero.army.reduce((sum, unit) => sum + unit.count, 0);
}

function getHeroAttackScore(hero) {
  const bonusAttack = getEffectValue(hero, "attack");
  return (
    hero.army.reduce((sum, unit) => sum + unit.count * (unit.tier * 4 + 1), 0) +
    (hero.attack + bonusAttack) * 7 +
    hero.level * 4 +
    hero.spells.length * 3
  );
}

function getHeroDefenseScore(hero) {
  const bonusDefense = getEffectValue(hero, "defense");
  return getHeroArmyCount(hero) * 2 + (hero.defense + bonusDefense) * 8 + hero.level * 3;
}

function getEnemyArmyPower(army) {
  return army.reduce((sum, unit) => sum + unit.count * (unit.tier * 4 + 2), 0);
}

function getEnemyArmyCount(enemy) {
  return enemy.army.reduce((sum, unit) => sum + unit.count, 0);
}

function formatEnemyArmy(enemy) {
  return enemy.army.map((unit) => `${ENEMY_UNIT_NAMES[unit.tier] || `${unit.tier}阶敌军`}x${unit.count}`).join(" / ");
}

function getEnemyAttackScore(enemy) {
  return enemy.army.reduce((sum, unit) => sum + unit.count * (unit.tier * 4 + 1), 0) + enemy.tier * 6;
}

function getEnemyDefenseScore(enemy) {
  return getEnemyArmyCount(enemy) * 2 + enemy.tier * 7;
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
    applyEnemyArmyLoss(target, 2 + state.castle.mageTowerLevel);
    target.power = getEnemyArmyPower(target.army);
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
  const heroArmyBefore = cloneArmy(hero.army);
  state.battle = createBattleState(hero, enemy, enemyIndex);
  state.battle.heroArmyBefore = heroArmyBefore;
  state.screen = "battle";
  render();
}

function getBattlePreview(hero, enemy) {
  const attackScore = getHeroAttackScore(hero);
  const defenseScore = getHeroDefenseScore(hero);
  const totalScore = attackScore + defenseScore;
  const enemyScore = getEnemyAttackScore(enemy) + getEnemyDefenseScore(enemy);
  const margin = totalScore - enemyScore;
  const outcome = margin >= 0 ? "win" : "retreat";
  const baseLoss =
    outcome === "win"
      ? Math.max(0, Math.ceil((enemyScore - attackScore * 0.55) / 20))
      : Math.max(1, Math.ceil((enemyScore - totalScore) / 12) + 1);
  const losses = Math.min(getHeroArmyCount(hero) - 1, Math.max(0, baseLoss));
  return {
    outcome,
    losses,
    flawless: outcome === "win" && losses === 0,
    margin,
  };
}

function getBattleUnitAt(x, y) {
  if (!state.battle) return null;
  return [...state.battle.playerUnits, ...state.battle.enemyUnits].find((unit) => unit.x === x && unit.y === y) || null;
}

function getBattleUnitById(id) {
  if (!state.battle) return null;
  return [...state.battle.playerUnits, ...state.battle.enemyUnits].find((unit) => unit.id === id) || null;
}

function getBattleUnits(side) {
  if (!state.battle) return [];
  return side === "player" ? state.battle.playerUnits : state.battle.enemyUnits;
}

function getBattleArmyPower(side) {
  return getBattleUnits(side).reduce((sum, unit) => sum + unit.count * (unit.attack + unit.defense + unit.tier * 2), 0);
}

function getBattleSelectedUnit() {
  if (!state.battle) return null;
  return getBattleUnitById(state.battle.selectedUnitId || state.battle.actorId);
}

function getNextBattleUnit(side) {
  const units = getBattleUnits(side).filter((unit) => unit.count > 0 && !unit.acted);
  return units.sort((a, b) => b.speed - a.speed || b.tier - a.tier || b.count - a.count)[0] || null;
}

function getBattleInitiativeUnit() {
  const nextPlayer = getNextBattleUnit("player");
  const nextEnemy = getNextBattleUnit("enemy");
  if (!nextPlayer) return nextEnemy;
  if (!nextEnemy) return nextPlayer;
  if (nextPlayer.speed !== nextEnemy.speed) return nextPlayer.speed > nextEnemy.speed ? nextPlayer : nextEnemy;
  if (nextPlayer.tier !== nextEnemy.tier) return nextPlayer.tier > nextEnemy.tier ? nextPlayer : nextEnemy;
  return nextPlayer.count >= nextEnemy.count ? nextPlayer : nextEnemy;
}

function getBattleInitiativeOrder() {
  if (!state.battle) return [];
  return [...state.battle.playerUnits, ...state.battle.enemyUnits]
    .filter((unit) => unit.count > 0)
    .sort((a, b) => {
      if (a.acted !== b.acted) return a.acted ? 1 : -1;
      if (a.speed !== b.speed) return b.speed - a.speed;
      if (a.tier !== b.tier) return b.tier - a.tier;
      if (a.count !== b.count) return b.count - a.count;
      return a.side === "player" ? -1 : 1;
    });
}

function resetBattleRoundFlags() {
  if (!state.battle) return;
  [...state.battle.playerUnits, ...state.battle.enemyUnits].forEach((unit) => {
    unit.acted = false;
    unit.retaliated = false;
  });
}

function getBattleReachable(unit) {
  const cells = new Set();
  for (let dx = -unit.speed; dx <= unit.speed; dx += 1) {
    for (let dy = -unit.speed; dy <= unit.speed; dy += 1) {
      const dist = Math.abs(dx) + Math.abs(dy);
      if (dist === 0 || dist > unit.speed) continue;
      const x = unit.x + dx;
      const y = unit.y + dy;
      if (x < 0 || x > 7 || y < 0 || y > 5) continue;
      if (getBattleUnitAt(x, y)) continue;
      cells.add(`${x},${y}`);
    }
  }
  return cells;
}

function getBattleAttackable(unit) {
  const cells = new Set();
  const targets = unit.side === "player" ? state.battle.enemyUnits : state.battle.playerUnits;
  targets.forEach((target) => {
    const dist = Math.abs(target.x - unit.x) + Math.abs(target.y - unit.y);
    if (dist <= 1 + Math.max(0, unit.speed - 4)) cells.add(`${target.x},${target.y}`);
  });
  return cells;
}

function handleBattleCellClick(x, y) {
  if (!state.battle || state.battle.side !== "player") return;
  const clicked = getBattleUnitAt(x, y);
  const selected = getBattleSelectedUnit();

  if (clicked?.side === "player") {
    if (clicked.acted) return;
    state.battle.selectedUnitId = clicked.id;
    render();
    return;
  }

  if (!selected || selected.side !== "player" || selected.acted) return;
  const reachable = getBattleReachable(selected);
  const attackable = getBattleAttackable(selected);
  const key = `${x},${y}`;

  if (clicked?.side === "enemy" && attackable.has(key)) {
    resolveBattleStrike(selected, clicked);
    return;
  }

  if (!clicked && reachable.has(key)) {
    selected.x = x;
    selected.y = y;
    state.battle.logs.unshift(`${selected.name} 调整了阵型。`);
    state.battle.selectedUnitId = selected.id;
    finalizeBattleRound();
  }
}

function resolveBattleStrike(attacker, defender) {
  const damage = Math.max(1, attacker.count * (attacker.attack + attacker.tier * 2) - defender.defense * Math.max(1, defender.count / 3));
  const loss = Math.max(1, Math.ceil(damage / Math.max(5, defender.hp)));
  attacker.acted = true;
  defender.count = Math.max(0, defender.count - loss);
  state.battle.logs.unshift(`${attacker.name} 攻击了 ${defender.name}，造成 ${loss} 名损失。`);
  if (defender.count <= 0) {
    state.battle.logs.unshift(`${defender.name} 被击溃。`);
    if (defender.side === "enemy") state.battle.enemyUnits = state.battle.enemyUnits.filter((unit) => unit.id !== defender.id);
    else state.battle.playerUnits = state.battle.playerUnits.filter((unit) => unit.id !== defender.id);
  } else if (!defender.retaliated) {
    resolveBattleRetaliation(defender, attacker);
  }
  finalizeBattleRound();
}

function resolveBattleRetaliation(defender, attacker) {
  if (!state.battle || defender.count <= 0 || attacker.count <= 0) return;
  const damage = Math.max(1, defender.count * (defender.attack + defender.tier) - attacker.defense * Math.max(1, attacker.count / 4));
  const loss = Math.max(1, Math.ceil(damage / Math.max(6, attacker.hp * 1.5)));
  defender.retaliated = true;
  attacker.count = Math.max(0, attacker.count - loss);
  state.battle.logs.unshift(`${defender.name} 进行了反击，${attacker.name} 损失 ${loss} 名。`);
  if (attacker.count <= 0) {
    state.battle.logs.unshift(`${attacker.name} 在反击中被击溃。`);
    if (attacker.side === "enemy") state.battle.enemyUnits = state.battle.enemyUnits.filter((unit) => unit.id !== attacker.id);
    else state.battle.playerUnits = state.battle.playerUnits.filter((unit) => unit.id !== attacker.id);
  }
}

function finalizeBattleRound() {
  if (!state.battle) return;
  state.battle.playerUnits = state.battle.playerUnits.filter((unit) => unit.count > 0);
  state.battle.enemyUnits = state.battle.enemyUnits.filter((unit) => unit.count > 0);
  if (!state.battle.enemyUnits.length) {
    finishBattle("victory");
    return;
  }
  if (!state.battle.playerUnits.length) {
    finishBattle("retreat");
    return;
  }
  let nextUnit = getBattleInitiativeUnit();
  if (!nextUnit) {
    state.battle.round += 1;
    resetBattleRoundFlags();
    nextUnit = getBattleInitiativeUnit();
  }
  if (!nextUnit) {
    render();
    return;
  }
  state.battle.side = nextUnit.side;
  state.battle.selectedUnitId = nextUnit.id;
  if (nextUnit.side === "enemy") {
    runEnemyBattleTurn();
    return;
  }
  render();
}

function getBattleStepToward(unit, target) {
  const options = [
    { x: unit.x + Math.sign(target.x - unit.x), y: unit.y },
    { x: unit.x, y: unit.y + Math.sign(target.y - unit.y) },
    { x: unit.x + Math.sign(target.x - unit.x), y: unit.y + Math.sign(target.y - unit.y) },
  ].filter((pos) => pos.x >= 0 && pos.x <= 7 && pos.y >= 0 && pos.y <= 5 && !getBattleUnitAt(pos.x, pos.y));

  return (
    options.sort((a, b) => {
      const distA = Math.abs(a.x - target.x) + Math.abs(a.y - target.y);
      const distB = Math.abs(b.x - target.x) + Math.abs(b.y - target.y);
      return distA - distB;
    })[0] || null
  );
}

function runEnemyBattleTurn() {
  if (!state.battle) return;
  const enemyUnit = getBattleUnitById(state.battle.selectedUnitId) || getNextBattleUnit("enemy");
  if (!enemyUnit) {
    finalizeBattleRound();
    return;
  }
  const target = state.battle.playerUnits
    .map((unit) => ({ unit, dist: Math.abs(unit.x - enemyUnit.x) + Math.abs(unit.y - enemyUnit.y) }))
    .sort((a, b) => a.dist - b.dist)[0]?.unit;
  if (!enemyUnit || !target) return;
  const dist = Math.abs(target.x - enemyUnit.x) + Math.abs(target.y - enemyUnit.y);
  if (dist <= 1 + Math.max(0, enemyUnit.speed - 4)) {
    resolveBattleStrike(enemyUnit, target);
    return;
  }
  const next = getBattleStepToward(enemyUnit, target);
  if (next) {
    enemyUnit.x = next.x;
    enemyUnit.y = next.y;
  }
  enemyUnit.acted = true;
  state.battle.logs.unshift(`${enemyUnit.name} 压了上来。`);
  finalizeBattleRound();
}

function finishBattle(result) {
  if (!state.battle) return;
  const hero = state.heroes.find((item) => item.id === state.battle.heroId);
  const enemyIndex = state.enemies.findIndex((item) => item.id === state.battle.enemyId);
  const enemy = state.enemies[enemyIndex];
  if (!hero || !enemy) {
    state.battle = null;
    state.screen = "map";
    render();
    return;
  }

  const heroArmyAfter = state.battle.playerUnits.map((unit) => ({ tier: unit.tier, count: unit.count })).filter((unit) => unit.count > 0);
  hero.army = heroArmyAfter;
  const lootEntries = result === "victory" ? Object.entries(enemy.reward) : [];
  const gainedXp = result === "victory" ? enemy.power : 0;
  if (result === "victory") {
    state.enemies.splice(enemyIndex, 1);
    lootEntries.forEach(([type, amount]) => {
      state.resources[type] += amount;
    });
    gainXp(hero, gainedXp);
    state.defeatedEnemies += 1;
    log(`${hero.name} 在战场上击败了敌军。`);
  } else {
    hero.moves = 0;
    retreatHero(hero);
    log(`${hero.name} 在战场上失利，只能撤退。`);
  }
  const beforeArmy = state.battle.heroArmyBefore || [];
  state.battleResult = {
    result,
    heroName: hero.name,
    round: state.battle.round,
    xp: gainedXp,
    loot: lootEntries,
    losses: beforeArmy.map((beforeUnit) => {
      const afterUnit = heroArmyAfter.find((item) => item.tier === beforeUnit.tier);
      const lost = beforeUnit.count - (afterUnit?.count || 0);
      return {
        tier: beforeUnit.tier,
        name: UNIT_OFFERS.find((item) => item.tier === beforeUnit.tier)?.name || `${beforeUnit.tier}阶兵`,
        icon: getUnitIcon(beforeUnit.tier),
        lost: Math.max(0, lost),
      };
    }).filter((item) => item.lost > 0),
    cleanup: result === "victory" ? "士兵在尸骸与辎重中收拢可用物资，旗手重新整队，准备继续推进。" : "残兵回收可携行装备，伤员被护送后撤，战场上的一切被迅速舍弃。",
  };
  state.battle = null;
  state.screen = "battle-result";
  render();
}

function confirmBattleResult() {
  if (!state.battleResult) return;
  state.battleResult = null;
  state.screen = "map";
  checkObjectives();
  render();
}

function applyArmyLoss(hero, loss) {
  if (loss <= 0) return;
  let remaining = loss;
  const mutableArmy = [...hero.army].sort((a, b) => a.tier - b.tier);
  for (const unit of mutableArmy) {
    if (remaining <= 0) break;
    const keepOne = mutableArmy.length === 1 ? 1 : 0;
    const removable = Math.max(0, unit.count - keepOne);
    const taken = Math.min(removable, remaining);
    unit.count -= taken;
    remaining -= taken;
  }
  hero.army = mutableArmy.filter((unit) => unit.count > 0);
}

function applyEnemyArmyLoss(enemy, loss) {
  if (loss <= 0) return;
  let remaining = loss;
  const mutableArmy = [...enemy.army].sort((a, b) => b.tier - a.tier);
  for (const unit of mutableArmy) {
    if (remaining <= 0) break;
    const removable = Math.max(0, unit.count);
    const taken = Math.min(removable, remaining);
    unit.count -= taken;
    remaining -= taken;
  }
  enemy.army = mutableArmy.filter((unit) => unit.count > 0).sort((a, b) => a.tier - b.tier);
  enemy.power = getEnemyArmyPower(enemy.army);
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

function retreatFromBattle() {
  if (!state.battle) return;
  finishBattle("retreat");
}

function skipBattleUnitTurn() {
  if (!state.battle || state.battle.side !== "player") return;
  const unit = getBattleSelectedUnit();
  if (!unit || unit.side !== "player" || unit.acted) return;
  unit.acted = true;
  state.battle.logs.unshift(`${unit.name} 选择按兵不动。`);
  finalizeBattleRound();
}

function resourceLabel(type) {
  return {
    gold: `${getResourceIcon("gold")} 金币`,
    wood: `${getResourceIcon("wood")} 木材`,
    ore: `${getResourceIcon("ore")} 矿石`,
    crystal: `${getResourceIcon("crystal")} 水晶`,
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
      const army =
        tier === 1
          ? [{ tier: 1, count: 6 + Math.floor(Math.random() * 4) }]
          : tier === 2
            ? [{ tier: 1, count: 4 + Math.floor(Math.random() * 3) }, { tier: 2, count: 2 + Math.floor(Math.random() * 2) }]
            : [{ tier: 2, count: 4 + Math.floor(Math.random() * 3) }, { tier: 3, count: 1 + Math.floor(Math.random() * 2) }];
      state.enemies.push(createEnemy(`enemy-${Date.now()}-${i}`, x, y, tier, 2 + (tier > 1 ? 1 : 0), { gold: 180 + tier * 120 }, army));
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
  persistState({ announce: true });
  render();
}

function loadGame() {
  if (!tryRestoreSavedState({ announce: true })) {
    if (!localStorage.getItem(SAVE_KEY)) {
      log("还没有可读取的存档。");
    }
    render();
    return;
  }
  render();
}

function restartGame() {
  state = createInitialState();
  persistState();
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
    const preview = getBattlePreview(activeHero, enemy);
    const result =
      preview.outcome === "win" ? `可战，预计损失 ${preview.losses} 名兵力` : `风险过高，预计损失 ${preview.losses} 名兵力`;
    parts.push(`${enemy.tier} 阶敌军，编队 ${formatEnemyArmy(enemy)}，战力 ${enemy.power}，${result}。`);
  }
  if (mine) parts.push(`${resourceLabel(mine.type)} 矿点，当前${mine.owner === "player" ? "已占领" : "中立"}。`);
  if (pickup) parts.push(`可拾取 ${pickup.amount} ${resourceLabel(pickup.type)}。`);
  if (shrine) parts.push(`${shrineLabel(shrine.type)}，每个英雄可访问一次。`);
  if (state.castle.x === x && state.castle.y === y) parts.push("你的城堡。");
  return parts.join(" ");
}

function getActionInfo(hero) {
  const nearCastle = Math.abs(hero.x - state.castle.x) + Math.abs(hero.y - state.castle.y) <= 1;
  if (state.screen === "battle" && state.battle) {
    return "战斗中：选择己方部队，点击高亮格移动或攻击敌军。";
  }
  if (state.screen === "castle") {
    return `已进入城堡，可升级建筑、研习法术、招募英雄和补充驻军。当前英雄：${hero.name}。`;
  }
  return nearCastle ? "靠近城堡，可进入城堡发展或补兵。" : "点击城堡格进入城堡。";
}

function getFrontStatusText() {
  const threat = getThreatLevel();
  if (state.castleRaids >= 2) return "边境告急";
  if (threat >= 180) return "敌影密布";
  if (threat >= 110) return "战云渐浓";
  if (getOwnedMineCount() >= 2) return "我军推进";
  return "谨慎扩张";
}

function renderMap() {
  const hero = getActiveHero();
  const reachable = getReachable(hero);
  els.mapOverviewCastle.textContent = `Lv.${state.castle.level}`;
  els.mapOverviewMines.textContent = `${getOwnedMineCount()} / ${state.mines.length}`;
  els.mapOverviewThreat.textContent = `${state.enemies.length} 队`;
  els.mapOverviewFront.textContent = getFrontStatusText();
  document.querySelectorAll(".tile").forEach((tile) => {
    const x = Number(tile.dataset.x);
    const y = Number(tile.dataset.y);
    tile.classList.toggle("reachable", reachable.cells.has(`${x},${y}`));
    tile.classList.toggle("selected", state.selected.x === x && state.selected.y === y);
    tile.classList.remove("castle-tile", "mine-tile", "shrine-tile", "enemy-tile");
    tile.innerHTML = "";

    if (state.castle.x === x && state.castle.y === y) {
      tile.classList.add("castle-tile");
      tile.innerHTML = `<div class="entity castle">🏰</div>`;
    }

    const mine = state.mines.find((item) => item.x === x && item.y === y);
    if (mine) {
      tile.classList.add("mine-tile");
      tile.innerHTML = `<div class="entity mine">${getResourceIcon(mine.type)}</div><div class="badge">${mine.owner === "player" ? "我" : "矿"}</div>`;
    }

    const pickup = state.pickups.find((item) => item.x === x && item.y === y);
    if (pickup) tile.innerHTML = `<div class="entity resource">${getResourceIcon(pickup.type)}</div>`;

    const shrine = state.shrines.find((item) => item.x === x && item.y === y);
    if (shrine) {
      tile.classList.add("shrine-tile");
      tile.innerHTML = `<div class="entity shrine">${shrine.type === "attack" ? "⚑" : shrine.type === "defense" ? "⛨" : "➠"}</div><div class="badge">坛</div>`;
    }

    const enemy = state.enemies.find((item) => item.x === x && item.y === y);
    if (enemy) {
      tile.classList.add("enemy-tile");
      tile.innerHTML = `<div class="entity hero-red">${getUnitIcon(enemy.tier, "enemy")}</div><div class="badge">${enemy.tier}</div>`;
    }

    const heroOnTile = state.heroes.find((item) => item.x === x && item.y === y);
    if (heroOnTile) {
      const heroIndex = state.heroes.findIndex((item) => item.id === heroOnTile.id) + 1;
      tile.innerHTML = `<div class="entity hero-blue">${heroIndex === 1 ? "♘" : "♗"}</div><div class="badge">${heroIndex}</div>`;
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
          <strong>${getDistrictIcon(key)} ${item.name}</strong>
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
    ? hero.spells.map((spell) => `<div class="spell-item"><span>${getSpellIcon(spell)} ${spell}</span><strong>法力 ${hero.mana}</strong></div>`).join("")
    : `<div class="spell-item"><span>暂无法术</span><strong>需要法师塔</strong></div>`;

  els.spellActions.innerHTML = hero.spells.length
    ? hero.spells
        .map(
          (spell) =>
            `<button class="action secondary" data-cast-spell="${spell}" ${canCastSpell(hero, spell) ? "" : "disabled"}>${getSpellIcon(spell)} 施放 ${spell}</button>`,
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
        <span>${getUnitIcon(offer.tier)} ${offer.name} ${locked ? "(未解锁)" : `可招募 ${available}`}</span>
        <button class="action secondary" data-tier="${offer.tier}" ${locked || available <= 0 ? "disabled" : ""}>招募</button>
      </div>
    `;
  }).join("");

  els.garrisonList.querySelectorAll("[data-tier]").forEach((button) => {
    button.addEventListener("click", () => recruitTier(Number(button.dataset.tier)));
  });
}

function renderBattleView() {
  if (!state.battle) return;
  if (!state.battle.selectedUnitId) {
    state.battle.selectedUnitId = getBattleInitiativeUnit()?.id || null;
  }
  const selected = getBattleSelectedUnit();
  const reachable =
    selected?.side === "player" && state.battle.side === "player" && !selected.acted ? getBattleReachable(selected) : new Set();
  const attackable =
    selected?.side === "player" && state.battle.side === "player" && !selected.acted ? getBattleAttackable(selected) : new Set();
  const hero = state.heroes.find((item) => item.id === state.battle.heroId);
  const enemy = state.enemies.find((item) => item.id === state.battle.enemyId);

  els.battleFlavor.textContent = hero && enemy ? `${hero.name} 遭遇 ${formatEnemyArmy(enemy)}。` : "遭遇战";
  els.battleTurn.textContent = selected ? `${selected.side === "player" ? "我方" : "敌军"} · ${selected.name}` : state.battle.side === "player" ? "我方行动" : "敌军行动";
  els.battlePlayerPower.textContent = String(getBattleArmyPower("player"));
  els.battleEnemyPower.textContent = String(getBattleArmyPower("enemy"));
  els.battleRound.textContent = String(state.battle.round);
  els.battleRetreatBtn.disabled = state.gameOver;
  els.battleEndTurnBtn.disabled = state.gameOver || state.battle.side !== "player";
  els.battleEndTurnBtn.textContent = "跳过当前单位";
  els.battleOrder.innerHTML = getBattleInitiativeOrder()
    .map((unit) => {
      const active = selected && unit.id === selected.id ? " active" : "";
      const acted = unit.acted ? " acted" : "";
      return `<div class="battle-order-chip ${unit.side}${active}${acted}">${unit.icon} ${unit.name} · 速${unit.speed} · x${unit.count}</div>`;
    })
    .join("");

  els.battleGrid.innerHTML = "";
  for (let y = 0; y < 6; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      const key = `${x},${y}`;
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "battle-cell";
      if (reachable.has(key)) cell.classList.add("reachable");
      if (attackable.has(key)) cell.classList.add("attackable");
      if (selected && selected.x === x && selected.y === y) cell.classList.add("selected");
      cell.addEventListener("click", () => handleBattleCellClick(x, y));

      const unit = getBattleUnitAt(x, y);
      if (unit) {
        cell.innerHTML = `<div class="battle-unit ${unit.side}" style="${unit.acted ? "opacity:0.55;" : ""}"><div class="portrait">${unit.portrait}</div><div class="name">${unit.icon} ${unit.name}</div><div class="count">x${unit.count}${unit.acted ? " · 已行动" : ""}</div></div>`;
      }
      els.battleGrid.appendChild(cell);
    }
  }

  els.battleUnitTitle.textContent = selected ? `${selected.side === "player" ? "我方" : "敌方"} · ${selected.portrait} ${selected.icon} ${selected.name}` : "未选中部队";
  els.battleUnitDesc.textContent = selected
    ? `数量 ${selected.count} · 攻 ${selected.attack} · 防 ${selected.defense} · 速 ${selected.speed} · 单体生命 ${selected.hp} · ${selected.acted ? "本轮已行动" : "本轮可行动"}`
    : "选择一支部队查看属性。";
  els.battleLogline.textContent = state.battle.logs[0] || "战斗开始。";
  els.battleLog.innerHTML = state.battle.logs
    .slice(0, 8)
    .map((entry) => `<div class="log-entry">${entry}</div>`)
    .join("");
}

function renderBattleResultView() {
  if (!state.battleResult) return;
  const resultText = state.battleResult.result === "victory" ? "战斗胜利" : "撤退整军";
  els.battleResultView.classList.toggle("defeat", state.battleResult.result !== "victory");
  els.battleResultTitle.textContent = resultText;
  els.battleResultFlavor.textContent =
    state.battleResult.result === "victory"
      ? `${state.battleResult.heroName} 赢得了遭遇战，部队正在清点战果。`
      : `${state.battleResult.heroName} 勉强脱离战场，残部正在重整旗鼓。`;
  els.battleResultRound.textContent = `${state.battleResult.round}`;
  els.battleResultXp.textContent = state.battleResult.xp ? `+${state.battleResult.xp}` : "0";
  els.battleResultLoot.textContent = state.battleResult.loot.length
    ? state.battleResult.loot.map(([type, amount]) => `${getResourceIcon(type)} ${amount}`).join(" / ")
    : "无";
  els.battleResultLosses.innerHTML = state.battleResult.losses.length
    ? state.battleResult.losses.map((item) => `<div class="row"><span>${item.icon} ${item.name}</span><strong>- ${item.lost}</strong></div>`).join("")
    : `<div class="tip">本次作战未出现编制损失。</div>`;
  els.battleResultCleanup.textContent = state.battleResult.cleanup;
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
      return `<div class="army-item"><div class="name"><span class="star" style="color:${color}">${getUnitIcon(unit.tier)}</span><span>${offer ? offer.name : `${unit.tier} 阶兵`}</span></div><strong>${unit.count}</strong></div>`;
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
  const nearCastle = Math.abs(hero.x - state.castle.x) + Math.abs(hero.y - state.castle.y) <= 1;
  els.openCastleBtn.disabled = state.gameOver || state.screen !== "map" || !nearCastle;
  els.endTurnBtn.disabled = state.gameOver;
}

function render() {
  renderMap();
  renderCastleView();
  renderBattleView();
  renderBattleResultView();
  renderSidebar();
  els.mapScreen.classList.toggle("hidden", state.screen !== "map");
  els.castleView.classList.toggle("hidden", state.screen !== "castle");
  els.battleView.classList.toggle("hidden", state.screen !== "battle");
  els.battleResultView.classList.toggle("hidden", state.screen !== "battle-result");
  persistState();
}

els.openCastleBtn.addEventListener("click", () => {
  openCastleScreen(false);
  render();
});
els.castleExitBtn.addEventListener("click", () => {
  closeCastleScreen();
  render();
});
els.battleRetreatBtn.addEventListener("click", retreatFromBattle);
els.battleEndTurnBtn.addEventListener("click", skipBattleUnitTurn);
els.battleResultConfirmBtn.addEventListener("click", confirmBattleResult);
els.endTurnBtn.addEventListener("click", endTurn);
els.saveBtn.addEventListener("click", saveGame);
els.loadBtn.addEventListener("click", loadGame);
els.restartBtn.addEventListener("click", restartGame);

buildMap();
refillWeeklyReserve();
if (!tryRestoreSavedState()) {
  log("第三版原型开始。城堡已经拥有独立经营界面。");
  persistState();
}
render();
