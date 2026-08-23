export interface BossConfig {
  id: string;
  name: string;
  description: string;
  health: number;
  damage: number;
  speed: number;
  abilities: string[];
  weakness: string;
  rewards: BossReward[];
  unlockRequirement: number;
}

export interface BossReward {
  type: 'xp' | 'currency' | 'badge' | 'title' | 'unlock';
  value: number | string;
}

export interface BossWave {
  bossId: string;
  difficulty: 'normal' | 'hard' | 'nightmare';
  healthMultiplier: number;
  damageMultiplier: number;
  timeLimit: number;
  bonusReward: BossReward | null;
}

export interface BossRushConfig {
  id: string;
  name: string;
  description: string;
  waves: BossWave[];
  totalRewards: BossReward[];
}

export interface BossRushState {
  currentRush: BossRushProgress | null;
  rushHistory: BossRushResult[];
  stats: BossRushStats;
}

export interface BossRushProgress {
  rushId: string;
  configId: string;
  currentWave: number;
  bossesDefeated: string[];
  currentBossHealth: number;
  score: number;
  startTime: number;
  isActive: boolean;
}

export interface BossRushResult {
  rushId: string;
  configId: string;
  wavesCompleted: number;
  bossesDefeated: string[];
  score: number;
  duration: number;
  completedAt: number;
}

export interface BossRushStats {
  totalRushes: number;
  totalBossesDefeated: number;
  bestScore: number;
  bestWave: number;
  averageScore: number;
  totalPlayTime: number;
}

export const DEFAULT_BOSS_RUSH_STATE: BossRushState = {
  currentRush: null,
  rushHistory: [],
  stats: {
    totalRushes: 0,
    totalBossesDefeated: 0,
    bestScore: 0,
    bestWave: 0,
    averageScore: 0,
    totalPlayTime: 0,
  },
};

export function createDefaultBossRushState(): BossRushState {
  return JSON.parse(JSON.stringify(DEFAULT_BOSS_RUSH_STATE));
}

export const BOSSES: BossConfig[] = [
  {
    id: 'guardian_earth',
    name: 'Guardiao da Terra',
    description: 'Um golem antigo que protege as cavernas.',
    health: 500,
    damage: 30,
    speed: 20,
    abilities: ['rock_throw', 'earthquake'],
    weakness: 'water',
    rewards: [{ type: 'xp', value: 200 }, { type: 'currency', value: 300 }],
    unlockRequirement: 0,
  },
  {
    id: 'storm_lord',
    name: 'Senhor das Tempestades',
    description: 'Controla raios e trovoes.',
    health: 700,
    damage: 45,
    speed: 35,
    abilities: ['lightning_bolt', 'storm_shield'],
    weakness: 'earth',
    rewards: [{ type: 'xp', value: 350 }, { type: 'currency', value: 500 }, { type: 'badge', value: 'badge_storm_slayer' }],
    unlockRequirement: 3,
  },
  {
    id: 'fire_dragon',
    name: 'Dragao de Fogo',
    description: 'Um dragao que cospe fogo devastador.',
    health: 1000,
    damage: 60,
    speed: 25,
    abilities: ['fire_breath', 'wing_gust'],
    weakness: 'ice',
    rewards: [{ type: 'xp', value: 500 }, { type: 'currency', value: 750 }, { type: 'title', value: 'title_dragon_slayer' }],
    unlockRequirement: 6,
  },
  {
    id: 'shadow_king',
    name: 'Rei das Sombras',
    description: 'Mestre das trevas e ilusoes.',
    health: 1200,
    damage: 55,
    speed: 40,
    abilities: ['shadow_strike', 'dark_barrier'],
    weakness: 'light',
    rewards: [{ type: 'xp', value: 700 }, { type: 'currency', value: 1000 }, { type: 'badge', value: 'badge_shadow_hunter' }],
    unlockRequirement: 9,
  },
  {
    id: 'void_emperor',
    name: 'Imperador do Vazio',
    description: 'A entidade mais poderosa do universo.',
    health: 2000,
    damage: 80,
    speed: 50,
    abilities: ['void_beam', 'reality_warp', 'summon_minions'],
    weakness: 'none',
    rewards: [{ type: 'xp', value: 1500 }, { type: 'currency', value: 2500 }, { type: 'badge', value: 'badge_void_master' }, { type: 'title', value: 'title_emperor_slayer' }],
    unlockRequirement: 12,
  },
];

export const BOSS_RUSH_MODES: BossRushConfig[] = [
  {
    id: 'easy_rush',
    name: 'Furia Facil',
    description: '3 boss faceis para comecar.',
    waves: [
      { bossId: 'guardian_earth', difficulty: 'normal', healthMultiplier: 1.0, damageMultiplier: 1.0, timeLimit: 120, bonusReward: null },
      { bossId: 'storm_lord', difficulty: 'normal', healthMultiplier: 1.0, damageMultiplier: 1.0, timeLimit: 120, bonusReward: null },
      { bossId: 'fire_dragon', difficulty: 'normal', healthMultiplier: 1.0, damageMultiplier: 1.0, timeLimit: 120, bonusReward: { type: 'xp', value: 100 } },
    ],
    totalRewards: [{ type: 'xp', value: 300 }, { type: 'currency', value: 400 }],
  },
  {
    id: 'medium_rush',
    name: 'Furia Media',
    description: '5 boss com dificuldade media.',
    waves: [
      { bossId: 'guardian_earth', difficulty: 'hard', healthMultiplier: 1.2, damageMultiplier: 1.2, timeLimit: 100, bonusReward: null },
      { bossId: 'storm_lord', difficulty: 'hard', healthMultiplier: 1.2, damageMultiplier: 1.2, timeLimit: 100, bonusReward: null },
      { bossId: 'fire_dragon', difficulty: 'hard', healthMultiplier: 1.2, damageMultiplier: 1.2, timeLimit: 100, bonusReward: null },
      { bossId: 'shadow_king', difficulty: 'hard', healthMultiplier: 1.2, damageMultiplier: 1.2, timeLimit: 100, bonusReward: null },
      { bossId: 'void_emperor', difficulty: 'hard', healthMultiplier: 1.2, damageMultiplier: 1.2, timeLimit: 100, bonusReward: { type: 'xp', value: 200 } },
    ],
    totalRewards: [{ type: 'xp', value: 600 }, { type: 'currency', value: 800 }, { type: 'badge', value: 'badge_rush_medium' }],
  },
  {
    id: 'hard_rush',
    name: 'Furia Difícil',
    description: '5 boss em modo pesadelo.',
    waves: [
      { bossId: 'guardian_earth', difficulty: 'nightmare', healthMultiplier: 1.5, damageMultiplier: 1.5, timeLimit: 80, bonusReward: null },
      { bossId: 'storm_lord', difficulty: 'nightmare', healthMultiplier: 1.5, damageMultiplier: 1.5, timeLimit: 80, bonusReward: null },
      { bossId: 'fire_dragon', difficulty: 'nightmare', healthMultiplier: 1.5, damageMultiplier: 1.5, timeLimit: 80, bonusReward: null },
      { bossId: 'shadow_king', difficulty: 'nightmare', healthMultiplier: 1.5, damageMultiplier: 1.5, timeLimit: 80, bonusReward: null },
      { bossId: 'void_emperor', difficulty: 'nightmare', healthMultiplier: 1.5, damageMultiplier: 1.5, timeLimit: 80, bonusReward: { type: 'xp', value: 500 } },
    ],
    totalRewards: [{ type: 'xp', value: 1000 }, { type: 'currency', value: 1500 }, { type: 'badge', value: 'badge_rush_hard' }, { type: 'title', value: 'title_boss_hunter' }],
  },
];

export function getBossConfig(id: string): BossConfig | undefined {
  return BOSSES.find(boss => boss.id === id);
}

export function getBossRushMode(id: string): BossRushConfig | undefined {
  return BOSS_RUSH_MODES.find(mode => mode.id === id);
}

export function getBossRushModes(): BossRushConfig[] {
  return [...BOSS_RUSH_MODES];
}

export function calculateBossHealth(base: number, multiplier: number): number {
  return Math.round(base * multiplier);
}

export function calculateBossDamage(base: number, multiplier: number): number {
  return Math.round(base * multiplier);
}

export function generateRushId(): string {
  return `rush_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function isRushComplete(state: BossRushState): boolean {
  if (!state.currentRush) return false;
  
  const mode = getBossRushMode(state.currentRush.configId);
  if (!mode) return false;
  
  return state.currentRush.currentWave >= mode.waves.length;
}

export function getCurrentWave(state: BossRushState): BossWave | null {
  if (!state.currentRush) return null;
  
  const mode = getBossRushMode(state.currentRush.configId);
  if (!mode) return null;
  
  return mode.waves[state.currentRush.currentWave] || null;
}
