export type RegionId = 'green_valley' | 'crystal_desert' | 'frozen_peaks' | 'ember_lands' | 'sky_kingdom' | 'dark_citadel';

export type LevelObjective = 'defeat_enemy' | 'survive_turns' | 'hit_targets' | 'boss_battle';

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface WindConfig {
  base: number;
  variance: number;
  changePerTurn: number;
}

export interface ParallaxLayer {
  key: string;
  depth: number;
  speed: number;
  scale: number;
}

export interface EnvironmentAnimation {
  type: 'particles' | 'sprite' | 'shader';
  config: Record<string, unknown>;
}

export interface BossConfig {
  id: string;
  name: string;
  characterId: string;
  hpMultiplier: number;
  phases: BossPhase[];
  introDialogue?: string;
  victoryDialogue?: string;
  musicTrack: string;
  rewards: { currency: number; unlocks: string[] };
}

export interface BossPhase {
  hpThreshold: number;
  behavior: 'aggressive' | 'defensive' | 'tactical' | 'berserk';
  specialAttacks: string[];
  environmentChanges?: EnvironmentAnimation[];
  dialogue?: string;
}

export interface LevelRewards {
  baseCurrency: number;
  starThresholds: { turns: [number, number, number]; currency: [number, number, number] };
  firstClearBonus: number;
  perfectBonus: number;
}

export interface LevelConfig {
  id: number;
  regionId: RegionId;
  name: string;
  arenaId: string;
  difficulty: Difficulty;
  cpuCharacterId: string;
  windConfig: WindConfig;
  objective: LevelObjective;
  objectiveParams?: Record<string, unknown>;
  unlockRequirement?: number;
  rewards: LevelRewards;
  environmentAnimations: EnvironmentAnimation[];
  parallaxLayers: ParallaxLayer[];
  musicTrack: string;
  isBoss: boolean;
  bossConfig?: BossConfig;
  nodePosition: { x: number; y: number };
  pathToNext?: { x: number; y: number; controlX?: number; controlY?: number };
}

export const REGIONS: Record<RegionId, { name: string; theme: string; order: number; color: string; bgColor: string }> = {
  green_valley: { name: 'Green Valley', theme: 'nature', order: 1, color: '#4ade80', bgColor: '#0f172a' },
  crystal_desert: { name: 'Crystal Desert', theme: 'desert', order: 2, color: '#fbbf24', bgColor: '#1c1917' },
  frozen_peaks: { name: 'Frozen Peaks', theme: 'ice', order: 3, color: '#60a5fa', bgColor: '#0c1a2e' },
  ember_lands: { name: 'Ember Lands', theme: 'fire', order: 4, color: '#fb923c', bgColor: '#1c1917' },
  sky_kingdom: { name: 'Sky Kingdom', theme: 'sky', order: 5, color: '#a78bfa', bgColor: '#0c1a2e' },
  dark_citadel: { name: 'Dark Citadel', theme: 'void', order: 6, color: '#f87171', bgColor: '#0a0a0a' },
};

export const REGION_ORDER: RegionId[] = [
  'green_valley',
  'crystal_desert',
  'frozen_peaks',
  'ember_lands',
  'sky_kingdom',
  'dark_citadel',
];

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    regionId: 'green_valley',
    name: 'Planícies de Aether',
    arenaId: 'arena_1',
    difficulty: 'easy',
    cpuCharacterId: 'luna',
    windConfig: { base: 0, variance: 1.5, changePerTurn: 0.5 },
    objective: 'defeat_enemy',
    rewards: {
      baseCurrency: 50,
      starThresholds: { turns: [5, 8, 12], currency: [100, 75, 50] },
      firstClearBonus: 100,
      perfectBonus: 100,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'leaves', count: 20, color: '#4ade80', speed: 0.5 } },
      { type: 'particles', config: { type: 'grass_sway', count: 15, color: '#22c55e', speed: 0.3 } },
    ],
    parallaxLayers: [
      { key: 'bg_sky', depth: -100, speed: 0.1, scale: 1.2 },
      { key: 'bg_mountains', depth: -50, speed: 0.3, scale: 1.1 },
      { key: 'bg_trees', depth: -10, speed: 0.6, scale: 1.0 },
    ],
    musicTrack: 'bgm_green_valley',
    isBoss: false,
    nodePosition: { x: 200, y: 500 },
    pathToNext: { x: 400, y: 450, controlX: 300, controlY: 400 },
  },
  {
    id: 2,
    regionId: 'green_valley',
    name: 'Floresta Sussurrante',
    arenaId: 'arena_2',
    difficulty: 'easy',
    cpuCharacterId: 'nova',
    windConfig: { base: 0.5, variance: 2, changePerTurn: 0.8 },
    objective: 'defeat_enemy',
    unlockRequirement: 1,
    rewards: {
      baseCurrency: 60,
      starThresholds: { turns: [6, 9, 13], currency: [120, 80, 60] },
      firstClearBonus: 120,
      perfectBonus: 120,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'leaves', count: 25, color: '#22c55e', speed: 0.6 } },
      { type: 'particles', config: { type: 'fireflies', count: 12, color: '#fbbf24', speed: 0.4 } },
      { type: 'sprite', config: { type: 'tree_sway', frames: 4, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_sky', depth: -100, speed: 0.1, scale: 1.2 },
      { key: 'bg_mountains', depth: -50, speed: 0.3, scale: 1.1 },
      { key: 'bg_trees_dense', depth: -10, speed: 0.6, scale: 1.0 },
    ],
    musicTrack: 'bgm_green_valley',
    isBoss: false,
    nodePosition: { x: 400, y: 450 },
    pathToNext: { x: 600, y: 400, controlX: 500, controlY: 350 },
  },
  {
    id: 3,
    regionId: 'green_valley',
    name: 'Colinas Ventosas',
    arenaId: 'arena_3',
    difficulty: 'normal',
    cpuCharacterId: 'bolt',
    windConfig: { base: 1.5, variance: 3, changePerTurn: 1.2 },
    objective: 'defeat_enemy',
    unlockRequirement: 2,
    rewards: {
      baseCurrency: 75,
      starThresholds: { turns: [7, 10, 14], currency: [150, 100, 75] },
      firstClearBonus: 150,
      perfectBonus: 150,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'wind_gusts', count: 18, color: '#94a3b8', speed: 1.0 } },
      { type: 'particles', config: { type: 'dust', count: 20, color: '#cbd5e1', speed: 0.8 } },
      { type: 'sprite', config: { type: 'grass_sway', frames: 6, speed: 1.5 } },
    ],
    parallaxLayers: [
      { key: 'bg_sky_cloudy', depth: -100, speed: 0.15, scale: 1.2 },
      { key: 'bg_hills', depth: -50, speed: 0.4, scale: 1.1 },
      { key: 'bg_wind_turbines', depth: -5, speed: 0.8, scale: 1.0 },
    ],
    musicTrack: 'bgm_green_valley',
    isBoss: false,
    nodePosition: { x: 600, y: 400 },
    pathToNext: { x: 800, y: 380, controlX: 700, controlY: 350 },
  },
  {
    id: 4,
    regionId: 'green_valley',
    name: 'Vale dos Cristais',
    arenaId: 'arena_4',
    difficulty: 'normal',
    cpuCharacterId: 'kai',
    windConfig: { base: 0.8, variance: 2.5, changePerTurn: 1.0 },
    objective: 'defeat_enemy',
    unlockRequirement: 3,
    rewards: {
      baseCurrency: 100,
      starThresholds: { turns: [6, 9, 13], currency: [200, 150, 100] },
      firstClearBonus: 200,
      perfectBonus: 200,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'crystal_shimmer', count: 30, color: '#4ade80', speed: 0.3 } },
      { type: 'particles', config: { type: 'floating_motes', count: 15, color: '#a7f3d0', speed: 0.2 } },
      { type: 'sprite', config: { type: 'crystal_pulse', frames: 8, speed: 3 } },
    ],
    parallaxLayers: [
      { key: 'bg_sky_dawn', depth: -100, speed: 0.1, scale: 1.2 },
      { key: 'bg_crystal_formations', depth: -50, speed: 0.35, scale: 1.1 },
      { key: 'bg_glowing_plants', depth: -5, speed: 0.7, scale: 1.0 },
    ],
    musicTrack: 'bgm_green_valley',
    isBoss: false,
    nodePosition: { x: 800, y: 380 },
    pathToNext: { x: 950, y: 420, controlX: 880, controlY: 350 },
  },
  {
    id: 5,
    regionId: 'green_valley',
    name: 'Guardião Verdante',
    arenaId: 'boss_1',
    difficulty: 'hard',
    cpuCharacterId: 'boss_verdant_guardian',
    windConfig: { base: 1.0, variance: 3.5, changePerTurn: 1.5 },
    objective: 'boss_battle',
    unlockRequirement: 4,
    rewards: {
      baseCurrency: 500,
      starThresholds: { turns: [8, 12, 18], currency: [500, 300, 200] },
      firstClearBonus: 500,
      perfectBonus: 500,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'vines_growth', count: 20, color: '#22c55e', speed: 0.5 } },
      { type: 'particles', config: { type: 'spores', count: 25, color: '#86efac', speed: 0.4 } },
      { type: 'sprite', config: { type: 'boss_arena_glow', frames: 12, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_sky_stormy', depth: -100, speed: 0.2, scale: 1.2 },
      { key: 'bg_ancient_tree', depth: -50, speed: 0.4, scale: 1.15 },
      { key: 'bg_vines', depth: -5, speed: 0.8, scale: 1.0 },
    ],
    musicTrack: 'bgm_boss',
    isBoss: true,
    bossConfig: {
      id: 'verdant_guardian',
      name: 'Verdant Guardian',
      characterId: 'boss_verdant_guardian',
      hpMultiplier: 3.0,
      phases: [
        { hpThreshold: 1.0, behavior: 'tactical', specialAttacks: ['vine_slash', 'seed_bomb'] },
        { hpThreshold: 0.6, behavior: 'aggressive', specialAttacks: ['vine_slash', 'seed_bomb', 'root_grasp'], environmentChanges: [{ type: 'particles', config: { type: 'vines_spread', count: 30, color: '#22c55e', speed: 0.8 } }] },
        { hpThreshold: 0.3, behavior: 'berserk', specialAttacks: ['vine_slash', 'seed_bomb', 'root_grasp', 'nature_wrath'], environmentChanges: [{ type: 'shader', config: { type: 'screen_shake', intensity: 0.5 } }] },
      ],
      introDialogue: 'A floresta protege seus segredos... Vocês não passarão!',
      victoryDialogue: 'A natureza reconhece sua força. O caminho está aberto.',
      musicTrack: 'bgm_boss',
      rewards: { currency: 500, unlocks: ['crystal_desert'] },
    },
    nodePosition: { x: 950, y: 420 },
  },
  {
    id: 6,
    regionId: 'crystal_desert',
    name: 'Dunas Iniciais',
    arenaId: 'arena_5',
    difficulty: 'easy',
    cpuCharacterId: 'kai',
    windConfig: { base: 2.0, variance: 4, changePerTurn: 1.5 },
    objective: 'defeat_enemy',
    unlockRequirement: 5,
    rewards: {
      baseCurrency: 150,
      starThresholds: { turns: [7, 10, 14], currency: [250, 180, 120] },
      firstClearBonus: 250,
      perfectBonus: 250,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'sand_drift', count: 25, color: '#fbbf24', speed: 0.8 } },
      { type: 'particles', config: { type: 'heat_haze', count: 10, color: '#fde68a', speed: 0.3 } },
    ],
    parallaxLayers: [
      { key: 'bg_desert_sky', depth: -100, speed: 0.1, scale: 1.2 },
      { key: 'bg_dunes_far', depth: -50, speed: 0.25, scale: 1.1 },
      { key: 'bg_dunes_near', depth: -10, speed: 0.5, scale: 1.0 },
    ],
    musicTrack: 'bgm_crystal_desert',
    isBoss: false,
    nodePosition: { x: 1150, y: 450 },
    pathToNext: { x: 1350, y: 400, controlX: 1250, controlY: 350 },
  },
  {
    id: 7,
    regionId: 'crystal_desert',
    name: 'Oásis Escondido',
    arenaId: 'arena_6',
    difficulty: 'normal',
    cpuCharacterId: 'luna',
    windConfig: { base: 1.5, variance: 5, changePerTurn: 2.0 },
    objective: 'defeat_enemy',
    unlockRequirement: 6,
    rewards: {
      baseCurrency: 200,
      starThresholds: { turns: [8, 11, 15], currency: [300, 200, 150] },
      firstClearBonus: 300,
      perfectBonus: 300,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'sand_drift', count: 30, color: '#fbbf24', speed: 1.0 } },
      { type: 'particles', config: { type: 'water_shimmer', count: 15, color: '#60a5fa', speed: 0.4 } },
      { type: 'sprite', config: { type: 'palm_sway', frames: 4, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_desert_sky', depth: -100, speed: 0.1, scale: 1.2 },
      { key: 'bg_dunes_far', depth: -50, speed: 0.25, scale: 1.1 },
      { key: 'bg_oasis', depth: -10, speed: 0.5, scale: 1.0 },
    ],
    musicTrack: 'bgm_crystal_desert',
    isBoss: false,
    nodePosition: { x: 1350, y: 400 },
    pathToNext: { x: 1550, y: 380, controlX: 1450, controlY: 330 },
  },
  {
    id: 8,
    regionId: 'crystal_desert',
    name: 'Campos de Cristais',
    arenaId: 'arena_7',
    difficulty: 'normal',
    cpuCharacterId: 'nova',
    windConfig: { base: 0.5, variance: 3, changePerTurn: 1.5 },
    objective: 'defeat_enemy',
    unlockRequirement: 7,
    rewards: {
      baseCurrency: 250,
      starThresholds: { turns: [7, 10, 14], currency: [350, 250, 180] },
      firstClearBonus: 350,
      perfectBonus: 350,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'crystal_refract', count: 35, color: '#a7f3d0', speed: 0.3 } },
      { type: 'particles', config: { type: 'crystal_dust', count: 20, color: '#fbbf24', speed: 0.6 } },
      { type: 'sprite', config: { type: 'crystal_pulse', frames: 8, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_desert_sky_day', depth: -100, speed: 0.1, scale: 1.2 },
      { key: 'bg_crystal_fields', depth: -50, speed: 0.3, scale: 1.1 },
      { key: 'bg_crystal_spires', depth: -10, speed: 0.6, scale: 1.0 },
    ],
    musicTrack: 'bgm_crystal_desert',
    isBoss: false,
    nodePosition: { x: 1550, y: 380 },
    pathToNext: { x: 1750, y: 420, controlX: 1650, controlY: 380 },
  },
  {
    id: 9,
    regionId: 'crystal_desert',
    name: 'Tempestade de Areia',
    arenaId: 'arena_8',
    difficulty: 'hard',
    cpuCharacterId: 'bolt',
    windConfig: { base: 3.0, variance: 6, changePerTurn: 2.5 },
    objective: 'defeat_enemy',
    unlockRequirement: 8,
    rewards: {
      baseCurrency: 350,
      starThresholds: { turns: [9, 13, 18], currency: [400, 300, 220] },
      firstClearBonus: 400,
      perfectBonus: 400,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'sandstorm', count: 50, color: '#fde68a', speed: 2.0 } },
      { type: 'particles', config: { type: 'lightning', count: 5, color: '#fbbf24', speed: 0.5 } },
    ],
    parallaxLayers: [
      { key: 'bg_desert_storm_sky', depth: -100, speed: 0.2, scale: 1.2 },
      { key: 'bg_dunes_storm', depth: -50, speed: 0.4, scale: 1.1 },
      { key: 'bg_flying_debris', depth: -10, speed: 0.8, scale: 1.0 },
    ],
    musicTrack: 'bgm_crystal_desert',
    isBoss: false,
    nodePosition: { x: 1750, y: 420 },
    pathToNext: { x: 1900, y: 450, controlX: 1820, controlY: 400 },
  },
  {
    id: 10,
    regionId: 'crystal_desert',
    name: 'Titã de Cristal',
    arenaId: 'boss_2',
    difficulty: 'hard',
    cpuCharacterId: 'boss_crystal_titan',
    windConfig: { base: 2.0, variance: 5, changePerTurn: 2.0 },
    objective: 'boss_battle',
    unlockRequirement: 9,
    rewards: {
      baseCurrency: 750,
      starThresholds: { turns: [10, 14, 20], currency: [750, 500, 350] },
      firstClearBonus: 750,
      perfectBonus: 750,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'crystal_shards', count: 40, color: '#a7f3d0', speed: 0.6 } },
      { type: 'particles', config: { type: 'reflection_glare', count: 20, color: '#fbbf24', speed: 0.4 } },
      { type: 'sprite', config: { type: 'boss_crystal_glow', frames: 12, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_desert_boss_sky', depth: -100, speed: 0.15, scale: 1.2 },
      { key: 'bg_giant_crystal', depth: -50, speed: 0.35, scale: 1.15 },
      { key: 'bg_crystal_fragments', depth: -5, speed: 0.7, scale: 1.0 },
    ],
    musicTrack: 'bgm_boss',
    isBoss: true,
    bossConfig: {
      id: 'crystal_titan',
      name: 'Crystal Titan',
      characterId: 'boss_crystal_titan',
      hpMultiplier: 3.5,
      phases: [
        { hpThreshold: 1.0, behavior: 'defensive', specialAttacks: ['crystal_reflect', 'shard_volley'], dialogue: 'Meus cristais refletem sua tolice!' },
        { hpThreshold: 0.5, behavior: 'aggressive', specialAttacks: ['crystal_reflect', 'shard_volley', 'prism_beam'], environmentChanges: [{ type: 'particles', config: { type: 'crystal_shards', count: 50, color: '#a7f3d0', speed: 1.0 } }], dialogue: 'A luz revela todas as fraquezas!' },
        { hpThreshold: 0.2, behavior: 'berserk', specialAttacks: ['crystal_reflect', 'shard_volley', 'prism_beam', 'crystal_rain'], environmentChanges: [{ type: 'shader', config: { type: 'screen_shake', intensity: 0.6 } }], dialogue: 'O deserto engole todos!' },
      ],
      introDialogue: 'Meus cristais refletem sua tolice!',
      victoryDialogue: 'Sua luz... brilha mais que a minha.',
      musicTrack: 'bgm_boss',
      rewards: { currency: 750, unlocks: ['frozen_peaks'] },
    },
    nodePosition: { x: 1900, y: 450 },
  },
  {
    id: 11,
    regionId: 'frozen_peaks',
    name: 'Encosta Congelada',
    arenaId: 'arena_9',
    difficulty: 'normal',
    cpuCharacterId: 'zephyr',
    windConfig: { base: 0.5, variance: 2.5, changePerTurn: 1.0 },
    objective: 'defeat_enemy',
    unlockRequirement: 10,
    rewards: {
      baseCurrency: 500,
      starThresholds: { turns: [8, 11, 15], currency: [600, 400, 300] },
      firstClearBonus: 600,
      perfectBonus: 600,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'snowfall', count: 40, color: '#e0e7ff', speed: 0.8 } },
      { type: 'particles', config: { type: 'ice_crystals', count: 20, color: '#60a5fa', speed: 0.4 } },
    ],
    parallaxLayers: [
      { key: 'bg_frozen_sky', depth: -100, speed: 0.08, scale: 1.2 },
      { key: 'bg_mountains_snow', depth: -50, speed: 0.2, scale: 1.1 },
      { key: 'bg_pine_trees', depth: -10, speed: 0.5, scale: 1.0 },
    ],
    musicTrack: 'bgm_frozen_peaks',
    isBoss: false,
    nodePosition: { x: 2100, y: 480 },
    pathToNext: { x: 2300, y: 440, controlX: 2200, controlY: 400 },
  },
  {
    id: 12,
    regionId: 'frozen_peaks',
    name: 'Vale dos Ventos Gelados',
    arenaId: 'arena_10',
    difficulty: 'normal',
    cpuCharacterId: 'luna',
    windConfig: { base: 2.0, variance: 4, changePerTurn: 1.5 },
    objective: 'defeat_enemy',
    unlockRequirement: 11,
    rewards: {
      baseCurrency: 600,
      starThresholds: { turns: [9, 12, 16], currency: [700, 500, 350] },
      firstClearBonus: 700,
      perfectBonus: 700,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'snowfall', count: 50, color: '#e0e7ff', speed: 1.2 } },
      { type: 'particles', config: { type: 'wind_gusts_ice', count: 25, color: '#93c5fd', speed: 1.5 } },
      { type: 'sprite', config: { type: 'frozen_trees_sway', frames: 4, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_frozen_sky', depth: -100, speed: 0.08, scale: 1.2 },
      { key: 'bg_mountains_snow', depth: -50, speed: 0.2, scale: 1.1 },
      { key: 'bg_ice_formations', depth: -10, speed: 0.5, scale: 1.0 },
    ],
    musicTrack: 'bgm_frozen_peaks',
    isBoss: false,
    nodePosition: { x: 2300, y: 440 },
    pathToNext: { x: 2500, y: 480, controlX: 2400, controlY: 520 },
  },
  {
    id: 13,
    regionId: 'frozen_peaks',
    name: 'Caverna de Cristal',
    arenaId: 'arena_11',
    difficulty: 'hard',
    cpuCharacterId: 'nova',
    windConfig: { base: 1.0, variance: 3, changePerTurn: 1.2 },
    objective: 'defeat_enemy',
    unlockRequirement: 12,
    rewards: {
      baseCurrency: 750,
      starThresholds: { turns: [8, 11, 15], currency: [800, 550, 400] },
      firstClearBonus: 800,
      perfectBonus: 800,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'crystal_refract_ice', count: 35, color: '#a5f3fc', speed: 0.4 } },
      { type: 'particles', config: { type: 'frost_motes', count: 20, color: '#dbeafe', speed: 0.3 } },
      { type: 'sprite', config: { type: 'crystal_pulse', frames: 8, speed: 3 } },
    ],
    parallaxLayers: [
      { key: 'bg_cave_sky', depth: -100, speed: 0.05, scale: 1.2 },
      { key: 'bg_ice_walls', depth: -50, speed: 0.25, scale: 1.1 },
      { key: 'bg_crystals_glow', depth: -10, speed: 0.6, scale: 1.0 },
    ],
    musicTrack: 'bgm_frozen_peaks',
    isBoss: false,
    nodePosition: { x: 2500, y: 480 },
    pathToNext: { x: 2700, y: 420, controlX: 2600, controlY: 380 },
  },
  {
    id: 14,
    regionId: 'frozen_peaks',
    name: 'Pico da Aurora',
    arenaId: 'arena_12',
    difficulty: 'hard',
    cpuCharacterId: 'torn',
    windConfig: { base: 1.5, variance: 4.5, changePerTurn: 2.0 },
    objective: 'defeat_enemy',
    unlockRequirement: 13,
    rewards: {
      baseCurrency: 900,
      starThresholds: { turns: [10, 14, 18], currency: [950, 650, 450] },
      firstClearBonus: 950,
      perfectBonus: 950,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'aurora', count: 15, color: '#a78bfa', speed: 0.2 } },
      { type: 'particles', config: { type: 'snowfall', count: 30, color: '#e0e7ff', speed: 1.0 } },
      { type: 'sprite', config: { type: 'aurora_wave', frames: 12, speed: 4 } },
    ],
    parallaxLayers: [
      { key: 'bg_aurora_sky', depth: -100, speed: 0.05, scale: 1.3 },
      { key: 'bg_peak_ridges', depth: -50, speed: 0.3, scale: 1.15 },
      { key: 'bg_snow_drifts', depth: -10, speed: 0.7, scale: 1.0 },
    ],
    musicTrack: 'bgm_frozen_peaks',
    isBoss: false,
    nodePosition: { x: 2700, y: 420 },
    pathToNext: { x: 2850, y: 460, controlX: 2780, controlY: 400 },
  },
  {
    id: 15,
    regionId: 'frozen_peaks',
    name: 'Dragão de Gelo Eterno',
    arenaId: 'boss_3',
    difficulty: 'hard',
    cpuCharacterId: 'boss_frost_wyrm',
    windConfig: { base: 2.5, variance: 5, changePerTurn: 2.5 },
    objective: 'boss_battle',
    unlockRequirement: 14,
    rewards: {
      baseCurrency: 1200,
      starThresholds: { turns: [12, 16, 22], currency: [1200, 800, 550] },
      firstClearBonus: 1200,
      perfectBonus: 1200,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'blizzard', count: 60, color: '#e0e7ff', speed: 2.0 } },
      { type: 'particles', config: { type: 'ice_shards', count: 30, color: '#60a5fa', speed: 1.5 } },
      { type: 'sprite', config: { type: 'boss_ice_glow', frames: 12, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_frozen_boss_sky', depth: -100, speed: 0.1, scale: 1.2 },
      { key: 'bg_frost_wyrm_lair', depth: -50, speed: 0.35, scale: 1.15 },
      { key: 'bg_ice_pillars', depth: -10, speed: 0.7, scale: 1.0 },
    ],
    musicTrack: 'bgm_boss',
    isBoss: true,
    bossConfig: {
      id: 'frost_wyrm',
      name: 'Frost Wyrm',
      characterId: 'boss_frost_wyrm',
      hpMultiplier: 4.0,
      phases: [
        { hpThreshold: 1.0, behavior: 'tactical', specialAttacks: ['ice_breath', 'frost_nova'], dialogue: 'O frio eterno vos aguarda...' },
        { hpThreshold: 0.5, behavior: 'aggressive', specialAttacks: ['ice_breath', 'frost_nova', 'blizzard_storm'], environmentChanges: [{ type: 'particles', config: { type: 'blizzard_intense', count: 80, color: '#e0e7ff', speed: 2.5 } }], dialogue: 'A tempestade cresce!' },
        { hpThreshold: 0.2, behavior: 'berserk', specialAttacks: ['ice_breath', 'frost_nova', 'blizzard_storm', 'absolute_zero'], environmentChanges: [{ type: 'shader', config: { type: 'screen_freeze', intensity: 0.7 } }], dialogue: 'Zero absoluto... para todos!' },
      ],
      introDialogue: 'O frio eterno vos aguarda...',
      victoryDialogue: 'Vossa chama... aquece o gelo.',
      musicTrack: 'bgm_boss',
      rewards: { currency: 1200, unlocks: ['ember_lands'] },
    },
    nodePosition: { x: 2850, y: 460 },
  },
  {
    id: 16,
    regionId: 'ember_lands',
    name: 'Planícies de Cinza',
    arenaId: 'arena_13',
    difficulty: 'normal',
    cpuCharacterId: 'bolt',
    windConfig: { base: 1.0, variance: 3, changePerTurn: 1.2 },
    objective: 'defeat_enemy',
    unlockRequirement: 15,
    rewards: {
      baseCurrency: 1000,
      starThresholds: { turns: [8, 12, 16], currency: [1000, 700, 500] },
      firstClearBonus: 1000,
      perfectBonus: 1000,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'ash_fall', count: 35, color: '#78716c', speed: 0.6 } },
      { type: 'particles', config: { type: 'ember_drift', count: 20, color: '#fb923c', speed: 0.4 } },
    ],
    parallaxLayers: [
      { key: 'bg_ember_sky', depth: -100, speed: 0.1, scale: 1.2 },
      { key: 'bg_volcano_far', depth: -50, speed: 0.25, scale: 1.1 },
      { key: 'bg_ash_dunes', depth: -10, speed: 0.5, scale: 1.0 },
    ],
    musicTrack: 'bgm_ember_lands',
    isBoss: false,
    nodePosition: { x: 3050, y: 500 },
    pathToNext: { x: 3250, y: 460, controlX: 3150, controlY: 420 },
  },
  {
    id: 17,
    regionId: 'ember_lands',
    name: 'Rio de Lava',
    arenaId: 'arena_14',
    difficulty: 'hard',
    cpuCharacterId: 'torn',
    windConfig: { base: 0.5, variance: 2.5, changePerTurn: 1.0 },
    objective: 'defeat_enemy',
    unlockRequirement: 16,
    rewards: {
      baseCurrency: 1200,
      starThresholds: { turns: [9, 13, 17], currency: [1200, 850, 600] },
      firstClearBonus: 1200,
      perfectBonus: 1200,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'lava_flow', count: 25, color: '#ef4444', speed: 0.8 } },
      { type: 'particles', config: { type: 'magma_bubbles', count: 15, color: '#fb923c', speed: 0.5 } },
      { type: 'sprite', config: { type: 'lava_ripple', frames: 6, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_ember_sky', depth: -100, speed: 0.1, scale: 1.2 },
      { key: 'bg_lava_river', depth: -50, speed: 0.3, scale: 1.1 },
      { key: 'bg_obsidian_rocks', depth: -10, speed: 0.6, scale: 1.0 },
    ],
    musicTrack: 'bgm_ember_lands',
    isBoss: false,
    nodePosition: { x: 3250, y: 460 },
    pathToNext: { x: 3450, y: 500, controlX: 3350, controlY: 540 },
  },
  {
    id: 18,
    regionId: 'ember_lands',
    name: 'Fortaleza Vulcânica',
    arenaId: 'arena_15',
    difficulty: 'hard',
    cpuCharacterId: 'kai',
    windConfig: { base: 1.5, variance: 4, changePerTurn: 1.5 },
    objective: 'defeat_enemy',
    unlockRequirement: 17,
    rewards: {
      baseCurrency: 1400,
      starThresholds: { turns: [8, 12, 16], currency: [1400, 950, 650] },
      firstClearBonus: 1400,
      perfectBonus: 1400,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'volcanic_ash', count: 40, color: '#78716c', speed: 1.0 } },
      { type: 'particles', config: { type: 'fire_sparks', count: 25, color: '#fbbf24', speed: 1.2 } },
      { type: 'sprite', config: { type: 'vent_steam', frames: 8, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_volcano_sky', depth: -100, speed: 0.15, scale: 1.2 },
      { key: 'bg_fortress_walls', depth: -50, speed: 0.35, scale: 1.1 },
      { key: 'bg_magma_pools', depth: -10, speed: 0.7, scale: 1.0 },
    ],
    musicTrack: 'bgm_ember_lands',
    isBoss: false,
    nodePosition: { x: 3450, y: 500 },
    pathToNext: { x: 3650, y: 440, controlX: 3550, controlY: 400 },
  },
  {
    id: 19,
    regionId: 'ember_lands',
    name: 'Coração do Vulcão',
    arenaId: 'arena_16',
    difficulty: 'hard',
    cpuCharacterId: 'zephyr',
    windConfig: { base: 2.0, variance: 5, changePerTurn: 2.0 },
    objective: 'defeat_enemy',
    unlockRequirement: 18,
    rewards: {
      baseCurrency: 1600,
      starThresholds: { turns: [10, 14, 18], currency: [1600, 1100, 750] },
      firstClearBonus: 1600,
      perfectBonus: 1600,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'magma_surge', count: 30, color: '#ef4444', speed: 1.5 } },
      { type: 'particles', config: { type: 'heat_wave', count: 20, color: '#fbbf24', speed: 0.8 } },
      { type: 'sprite', config: { type: 'magma_burst', frames: 10, speed: 3 } },
    ],
    parallaxLayers: [
      { key: 'bg_magma_sky', depth: -100, speed: 0.2, scale: 1.2 },
      { key: 'bg_volcano_interior', depth: -50, speed: 0.4, scale: 1.15 },
      { key: 'bg_obsidian_columns', depth: -10, speed: 0.8, scale: 1.0 },
    ],
    musicTrack: 'bgm_ember_lands',
    isBoss: false,
    nodePosition: { x: 3650, y: 440 },
    pathToNext: { x: 3800, y: 480, controlX: 3720, controlY: 420 },
  },
  {
    id: 20,
    regionId: 'ember_lands',
    name: 'Senhor do Magma',
    arenaId: 'boss_4',
    difficulty: 'hard',
    cpuCharacterId: 'boss_magma_lord',
    windConfig: { base: 2.0, variance: 5, changePerTurn: 2.5 },
    objective: 'boss_battle',
    unlockRequirement: 19,
    rewards: {
      baseCurrency: 2000,
      starThresholds: { turns: [14, 18, 24], currency: [2000, 1400, 950] },
      firstClearBonus: 2000,
      perfectBonus: 2000,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'eruption', count: 50, color: '#ef4444', speed: 2.0 } },
      { type: 'particles', config: { type: 'pyroclast', count: 25, color: '#fb923c', speed: 1.5 } },
      { type: 'sprite', config: { type: 'boss_magma_glow', frames: 12, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_ember_boss_sky', depth: -100, speed: 0.15, scale: 1.2 },
      { key: 'bg_magma_chamber', depth: -50, speed: 0.4, scale: 1.15 },
      { key: 'bg_lava_falls', depth: -10, speed: 0.8, scale: 1.0 },
    ],
    musicTrack: 'bgm_boss',
    isBoss: true,
    bossConfig: {
      id: 'magma_lord',
      name: 'Magma Lord',
      characterId: 'boss_magma_lord',
      hpMultiplier: 4.5,
      phases: [
        { hpThreshold: 1.0, behavior: 'defensive', specialAttacks: ['magma_shield', 'lava_pool'], dialogue: 'O fogo purifica tudo!' },
        { hpThreshold: 0.5, behavior: 'aggressive', specialAttacks: ['magma_shield', 'lava_pool', 'meteor_rain'], environmentChanges: [{ type: 'particles', config: { type: 'meteor_shower', count: 40, color: '#fbbf24', speed: 2.0 } }], dialogue: 'O céu cai em chamas!' },
        { hpThreshold: 0.2, behavior: 'berserk', specialAttacks: ['magma_shield', 'lava_pool', 'meteor_rain', 'supernova'], environmentChanges: [{ type: 'shader', config: { type: 'screen_burn', intensity: 0.8 } }], dialogue: 'A supernova vos consumirá!' },
      ],
      introDialogue: 'O fogo purifica tudo!',
      victoryDialogue: 'Vossa cinza... alimenta a chama.',
      musicTrack: 'bgm_boss',
      rewards: { currency: 2000, unlocks: ['sky_kingdom'] },
    },
    nodePosition: { x: 3800, y: 480 },
  },
  {
    id: 21,
    regionId: 'sky_kingdom',
    name: 'Ilhas Flutuantes',
    arenaId: 'arena_17',
    difficulty: 'normal',
    cpuCharacterId: 'mira',
    windConfig: { base: -0.5, variance: 2, changePerTurn: 1.0 },
    objective: 'defeat_enemy',
    unlockRequirement: 20,
    rewards: {
      baseCurrency: 2500,
      starThresholds: { turns: [8, 11, 15], currency: [2500, 1800, 1200] },
      firstClearBonus: 2500,
      perfectBonus: 2500,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'cloud_drift', count: 25, color: '#f1f5f9', speed: 0.5 } },
      { type: 'particles', config: { type: 'wind_gusts', count: 15, color: '#93c5fd', speed: 1.0 } },
    ],
    parallaxLayers: [
      { key: 'bg_sky_sky', depth: -100, speed: 0.05, scale: 1.3 },
      { key: 'bg_floating_islands', depth: -50, speed: 0.2, scale: 1.2 },
      { key: 'bg_clouds', depth: -10, speed: 0.5, scale: 1.0 },
    ],
    musicTrack: 'bgm_sky_kingdom',
    isBoss: false,
    nodePosition: { x: 4000, y: 520 },
    pathToNext: { x: 4200, y: 480, controlX: 4100, controlY: 440 },
  },
  {
    id: 22,
    regionId: 'sky_kingdom',
    name: 'Tempestade Perpétua',
    arenaId: 'arena_18',
    difficulty: 'hard',
    cpuCharacterId: 'pyra',
    windConfig: { base: 3.0, variance: 5, changePerTurn: 2.0 },
    objective: 'defeat_enemy',
    unlockRequirement: 21,
    rewards: {
      baseCurrency: 3000,
      starThresholds: { turns: [9, 13, 17], currency: [3000, 2000, 1400] },
      firstClearBonus: 3000,
      perfectBonus: 3000,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'lightning', count: 10, color: '#fbbf24', speed: 0.8 } },
      { type: 'particles', config: { type: 'rain', count: 40, color: '#93c5fd', speed: 2.0 } },
      { type: 'sprite', config: { type: 'storm_clouds', frames: 8, speed: 3 } },
    ],
    parallaxLayers: [
      { key: 'bg_storm_sky', depth: -100, speed: 0.1, scale: 1.3 },
      { key: 'bg_lightning', depth: -50, speed: 0.3, scale: 1.2 },
      { key: 'bg_rain', depth: -10, speed: 0.6, scale: 1.0 },
    ],
    musicTrack: 'bgm_sky_kingdom',
    isBoss: false,
    nodePosition: { x: 4200, y: 480 },
    pathToNext: { x: 4400, y: 520, controlX: 4300, controlY: 560 },
  },
  {
    id: 23,
    regionId: 'sky_kingdom',
    name: 'Cidadela das Nuvens',
    arenaId: 'arena_19',
    difficulty: 'hard',
    cpuCharacterId: 'nova',
    windConfig: { base: 1.0, variance: 3, changePerTurn: 1.5 },
    objective: 'defeat_enemy',
    unlockRequirement: 22,
    rewards: {
      baseCurrency: 3500,
      starThresholds: { turns: [8, 12, 16], currency: [3500, 2400, 1600] },
      firstClearBonus: 3500,
      perfectBonus: 3500,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'cloud_particles', count: 30, color: '#f1f5f9', speed: 0.4 } },
      { type: 'particles', config: { type: 'feather_drift', count: 20, color: '#c4b5fd', speed: 0.6 } },
      { type: 'sprite', config: { type: 'banner_flutter', frames: 6, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_citadel_sky', depth: -100, speed: 0.08, scale: 1.3 },
      { key: 'bg_cloud_towers', depth: -50, speed: 0.25, scale: 1.2 },
      { key: 'bg_floating_platforms', depth: -10, speed: 0.6, scale: 1.0 },
    ],
    musicTrack: 'bgm_sky_kingdom',
    isBoss: false,
    nodePosition: { x: 4400, y: 520 },
    pathToNext: { x: 4600, y: 460, controlX: 4500, controlY: 420 },
  },
  {
    id: 24,
    regionId: 'sky_kingdom',
    name: 'Trono dos Ventos',
    arenaId: 'arena_20',
    difficulty: 'hard',
    cpuCharacterId: 'zephyr',
    windConfig: { base: 2.0, variance: 4, changePerTurn: 2.0 },
    objective: 'defeat_enemy',
    unlockRequirement: 23,
    rewards: {
      baseCurrency: 4000,
      starThresholds: { turns: [10, 14, 18], currency: [4000, 2800, 1900] },
      firstClearBonus: 4000,
      perfectBonus: 4000,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'wind_shear', count: 35, color: '#93c5fd', speed: 1.5 } },
      { type: 'particles', config: { type: 'tornado', count: 5, color: '#60a5fa', speed: 0.8 } },
      { type: 'sprite', config: { type: 'wind_turbine_spin', frames: 12, speed: 4 } },
    ],
    parallaxLayers: [
      { key: 'bg_throne_sky', depth: -100, speed: 0.1, scale: 1.3 },
      { key: 'bg_wind_temples', depth: -50, speed: 0.35, scale: 1.15 },
      { key: 'bg_wind_streams', depth: -10, speed: 0.7, scale: 1.0 },
    ],
    musicTrack: 'bgm_sky_kingdom',
    isBoss: false,
    nodePosition: { x: 4600, y: 460 },
    pathToNext: { x: 4750, y: 500, controlX: 4680, controlY: 440 },
  },
  {
    id: 25,
    regionId: 'sky_kingdom',
    name: 'Soberano da Tempestade',
    arenaId: 'boss_5',
    difficulty: 'hard',
    cpuCharacterId: 'boss_storm_sovereign',
    windConfig: { base: 4.0, variance: 6, changePerTurn: 3.0 },
    objective: 'boss_battle',
    unlockRequirement: 24,
    rewards: {
      baseCurrency: 5000,
      starThresholds: { turns: [15, 20, 26], currency: [5000, 3500, 2400] },
      firstClearBonus: 5000,
      perfectBonus: 5000,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'lightning_storm', count: 20, color: '#fbbf24', speed: 1.0 } },
      { type: 'particles', config: { type: 'storm_debris', count: 30, color: '#93c5fd', speed: 1.5 } },
      { type: 'sprite', config: { type: 'boss_storm_glow', frames: 12, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_sky_boss_sky', depth: -100, speed: 0.15, scale: 1.3 },
      { key: 'bg_storm_throne', depth: -50, speed: 0.4, scale: 1.2 },
      { key: 'bg_lightning_field', depth: -10, speed: 0.8, scale: 1.0 },
    ],
    musicTrack: 'bgm_boss',
    isBoss: true,
    bossConfig: {
      id: 'storm_sovereign',
      name: 'Storm Sovereign',
      characterId: 'boss_storm_sovereign',
      hpMultiplier: 5.0,
      phases: [
        { hpThreshold: 1.0, behavior: 'tactical', specialAttacks: ['lightning_strike', 'wind_shear'], dialogue: 'Os ventos obedecem à minha vontade!' },
        { hpThreshold: 0.5, behavior: 'aggressive', specialAttacks: ['lightning_strike', 'wind_shear', 'tornado_barrage'], environmentChanges: [{ type: 'particles', config: { type: 'tornado_field', count: 15, color: '#60a5fa', speed: 2.0 } }], dialogue: 'A tempestade se intensifica!' },
        { hpThreshold: 0.2, behavior: 'berserk', specialAttacks: ['lightning_strike', 'wind_shear', 'tornado_barrage', 'cataclysm'], environmentChanges: [{ type: 'shader', config: { type: 'screen_shake', intensity: 0.8 } }], dialogue: 'O cataclismo vos aguarda!' },
      ],
      introDialogue: 'Os ventos obedecem à minha vontade!',
      victoryDialogue: 'Vossos ventos... encontram paz.',
      musicTrack: 'bgm_boss',
      rewards: { currency: 5000, unlocks: ['dark_citadel'] },
    },
    nodePosition: { x: 4750, y: 500 },
  },
  {
    id: 26,
    regionId: 'dark_citadel',
    name: 'Entrada Proibida',
    arenaId: 'arena_21',
    difficulty: 'normal',
    cpuCharacterId: 'mira',
    windConfig: { base: 0, variance: 1, changePerTurn: 0.5 },
    objective: 'defeat_enemy',
    unlockRequirement: 25,
    rewards: {
      baseCurrency: 6000,
      starThresholds: { turns: [8, 12, 16], currency: [6000, 4200, 2800] },
      firstClearBonus: 6000,
      perfectBonus: 6000,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'void_dust', count: 25, color: '#3f3f46', speed: 0.3 } },
      { type: 'particles', config: { type: 'corruption', count: 15, color: '#f87171', speed: 0.5 } },
    ],
    parallaxLayers: [
      { key: 'bg_void_sky', depth: -100, speed: 0.02, scale: 1.5 },
      { key: 'bg_citadel_walls', depth: -50, speed: 0.15, scale: 1.1 },
      { key: 'bg_void_energy', depth: -10, speed: 0.4, scale: 1.0 },
    ],
    musicTrack: 'bgm_dark_citadel',
    isBoss: false,
    nodePosition: { x: 4950, y: 540 },
    pathToNext: { x: 5150, y: 500, controlX: 5050, controlY: 460 },
  },
  {
    id: 27,
    regionId: 'dark_citadel',
    name: 'Corredores da Corrupção',
    arenaId: 'arena_22',
    difficulty: 'hard',
    cpuCharacterId: 'pyra',
    windConfig: { base: 0.5, variance: 2, changePerTurn: 1.0 },
    objective: 'defeat_enemy',
    unlockRequirement: 26,
    rewards: {
      baseCurrency: 7000,
      starThresholds: { turns: [9, 13, 17], currency: [7000, 4900, 3300] },
      firstClearBonus: 7000,
      perfectBonus: 7000,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'corruption_spread', count: 30, color: '#f87171', speed: 0.6 } },
      { type: 'particles', config: { type: 'void_particles', count: 20, color: '#3f3f46', speed: 0.4 } },
      { type: 'sprite', config: { type: 'corrupted_walls', frames: 6, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_void_sky', depth: -100, speed: 0.02, scale: 1.5 },
      { key: 'bg_corrupted_halls', depth: -50, speed: 0.2, scale: 1.1 },
      { key: 'bg_void_tendrils', depth: -10, speed: 0.5, scale: 1.0 },
    ],
    musicTrack: 'bgm_dark_citadel',
    isBoss: false,
    nodePosition: { x: 5150, y: 500 },
    pathToNext: { x: 5350, y: 540, controlX: 5250, controlY: 580 },
  },
  {
    id: 28,
    regionId: 'dark_citadel',
    name: 'Sala dos Máquinas',
    arenaId: 'arena_23',
    difficulty: 'hard',
    cpuCharacterId: 'torn',
    windConfig: { base: 0, variance: 1.5, changePerTurn: 0.8 },
    objective: 'defeat_enemy',
    unlockRequirement: 27,
    rewards: {
      baseCurrency: 8000,
      starThresholds: { turns: [8, 11, 15], currency: [8000, 5600, 3800] },
      firstClearBonus: 8000,
      perfectBonus: 8000,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'machine_sparks', count: 25, color: '#fbbf24', speed: 0.8 } },
      { type: 'particles', config: { type: 'steam_vents', count: 15, color: '#9ca3af', speed: 0.5 } },
      { type: 'sprite', config: { type: 'gear_rotation', frames: 8, speed: 3 } },
    ],
    parallaxLayers: [
      { key: 'bg_void_sky', depth: -100, speed: 0.02, scale: 1.5 },
      { key: 'bg_machinery', depth: -50, speed: 0.25, scale: 1.1 },
      { key: 'bg_pipes', depth: -10, speed: 0.6, scale: 1.0 },
    ],
    musicTrack: 'bgm_dark_citadel',
    isBoss: false,
    nodePosition: { x: 5350, y: 540 },
    pathToNext: { x: 5550, y: 480, controlX: 5450, controlY: 440 },
  },
  {
    id: 29,
    regionId: 'dark_citadel',
    name: 'Núcleo Corrompido',
    arenaId: 'arena_24',
    difficulty: 'hard',
    cpuCharacterId: 'mira',
    windConfig: { base: 0, variance: 2, changePerTurn: 1.0 },
    objective: 'defeat_enemy',
    unlockRequirement: 28,
    rewards: {
      baseCurrency: 9000,
      starThresholds: { turns: [10, 14, 18], currency: [9000, 6300, 4200] },
      firstClearBonus: 9000,
      perfectBonus: 9000,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'energy_pulse', count: 20, color: '#f87171', speed: 1.0 } },
      { type: 'particles', config: { type: 'void_rift', count: 10, color: '#18181b', speed: 0.3 } },
      { type: 'sprite', config: { type: 'core_rotation', frames: 10, speed: 4 } },
    ],
    parallaxLayers: [
      { key: 'bg_void_sky', depth: -100, speed: 0.02, scale: 1.5 },
      { key: 'bg_core_chamber', depth: -50, speed: 0.3, scale: 1.15 },
      { key: 'bg_energy_conduits', depth: -10, speed: 0.7, scale: 1.0 },
    ],
    musicTrack: 'bgm_dark_citadel',
    isBoss: false,
    nodePosition: { x: 5550, y: 480 },
    pathToNext: { x: 5700, y: 520, controlX: 5620, controlY: 480 },
  },
  {
    id: 30,
    regionId: 'dark_citadel',
    name: 'Arconte do Vazio',
    arenaId: 'boss_6',
    difficulty: 'hard',
    cpuCharacterId: 'boss_void_archon',
    windConfig: { base: 0, variance: 3, changePerTurn: 1.5 },
    objective: 'boss_battle',
    unlockRequirement: 29,
    rewards: {
      baseCurrency: 15000,
      starThresholds: { turns: [18, 24, 30], currency: [15000, 10000, 6500] },
      firstClearBonus: 15000,
      perfectBonus: 15000,
    },
    environmentAnimations: [
      { type: 'particles', config: { type: 'void_explosion', count: 30, color: '#f87171', speed: 1.0 } },
      { type: 'particles', config: { type: 'reality_tear', count: 15, color: '#3f3f46', speed: 0.5 } },
      { type: 'sprite', config: { type: 'boss_void_glow', frames: 12, speed: 2 } },
    ],
    parallaxLayers: [
      { key: 'bg_void_boss_sky', depth: -100, speed: 0.05, scale: 1.5 },
      { key: 'bg_void_throne', depth: -50, speed: 0.4, scale: 1.2 },
      { key: 'bg_reality_fracture', depth: -10, speed: 0.9, scale: 1.0 },
    ],
    musicTrack: 'bgm_boss',
    isBoss: true,
    bossConfig: {
      id: 'void_archon',
      name: 'Void Archon',
      characterId: 'boss_void_archon',
      hpMultiplier: 6.0,
      phases: [
        { hpThreshold: 1.0, behavior: 'tactical', specialAttacks: ['void_bolt', 'reality_rift'], dialogue: 'A realidade se curva diante de mim!' },
        { hpThreshold: 0.5, behavior: 'aggressive', specialAttacks: ['void_bolt', 'reality_rift', 'corruption_wave'], environmentChanges: [{ type: 'particles', config: { type: 'corruption_spread', count: 40, color: '#f87171', speed: 1.5 } }], dialogue: 'A corrupção se espalha!' },
        { hpThreshold: 0.2, behavior: 'berserk', specialAttacks: ['void_bolt', 'reality_rift', 'corruption_wave', 'entropy'], environmentChanges: [{ type: 'shader', config: { type: 'screen_void', intensity: 1.0 } }], dialogue: 'O fim de todas as coisas!' },
      ],
      introDialogue: 'A realidade se curva diante de mim!',
      victoryDialogue: 'A luz... retorna ao vazio.',
      musicTrack: 'bgm_boss',
      rewards: { currency: 15000, unlocks: [] },
    },
    nodePosition: { x: 5700, y: 520 },
  },
];

export function getLevel(id: number): LevelConfig | undefined {
  return LEVELS.find(l => l.id === id);
}

export function getLevelsByRegion(regionId: RegionId): LevelConfig[] {
  return LEVELS.filter(l => l.regionId === regionId).sort((a, b) => a.id - b.id);
}

export function getNextLevel(currentLevelId: number): LevelConfig | undefined {
  const current = getLevel(currentLevelId);
  if (!current) return undefined;
  return getLevel(current.id + 1);
}

export function getRegionLevels(regionId: RegionId): LevelConfig[] {
  return LEVELS.filter(l => l.regionId === regionId).sort((a, b) => a.id - b.id);
}

export function getBossLevels(): LevelConfig[] {
  return LEVELS.filter(l => l.isBoss);
}

export function getFirstLevelOfRegion(regionId: RegionId): LevelConfig | undefined {
  return getRegionLevels(regionId)[0];
}

export function getLastLevelOfRegion(regionId: RegionId): LevelConfig | undefined {
  const levels = getRegionLevels(regionId);
  return levels[levels.length - 1];
}