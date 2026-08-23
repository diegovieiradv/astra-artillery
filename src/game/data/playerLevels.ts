export type RewardType = 
  | 'currency' 
  | 'cosmetic' 
  | 'character' 
  | 'projectile' 
  | 'mode' 
  | 'title' 
  | 'lore';

export interface LevelReward {
  type: RewardType;
  id: string;
  quantity?: number;
}

export interface PlayerLevelConfig {
  level: number;
  requiredXp: number;
  rewards: LevelReward[];
}

export const PLAYER_LEVELS: PlayerLevelConfig[] = [
  { level: 1, requiredXp: 0, rewards: [] },
  { level: 2, requiredXp: 100, rewards: [{ type: 'currency', id: 'coins', quantity: 50 }] },
  { level: 3, requiredXp: 250, rewards: [{ type: 'currency', id: 'coins', quantity: 100 }] },
  { level: 4, requiredXp: 500, rewards: [{ type: 'currency', id: 'coins', quantity: 150 }, { type: 'cosmetic', id: 'frame_bronze' }] },
  { level: 5, requiredXp: 900, rewards: [{ type: 'currency', id: 'coins', quantity: 200 }, { type: 'title', id: 'novice_artillerist' }] },
  { level: 6, requiredXp: 1400, rewards: [{ type: 'currency', id: 'coins', quantity: 250 }] },
  { level: 7, requiredXp: 2000, rewards: [{ type: 'currency', id: 'coins', quantity: 300 }, { type: 'cosmetic', id: 'trail_silver' }] },
  { level: 8, requiredXp: 2700, rewards: [{ type: 'currency', id: 'coins', quantity: 350 }] },
  { level: 9, requiredXp: 3500, rewards: [{ type: 'currency', id: 'coins', quantity: 400 }, { type: 'title', id: 'skilled_shot' }] },
  { level: 10, requiredXp: 4400, rewards: [{ type: 'currency', id: 'coins', quantity: 500 }, { type: 'cosmetic', id: 'skin_kai_veteran' }, { type: 'mode', id: 'training' }] },
  { level: 11, requiredXp: 5400, rewards: [{ type: 'currency', id: 'coins', quantity: 550 }] },
  { level: 12, requiredXp: 6500, rewards: [{ type: 'currency', id: 'coins', quantity: 600 }, { type: 'cosmetic', id: 'frame_silver' }] },
  { level: 13, requiredXp: 7700, rewards: [{ type: 'currency', id: 'coins', quantity: 650 }] },
  { level: 14, requiredXp: 9000, rewards: [{ type: 'currency', id: 'coins', quantity: 700 }, { type: 'title', id: 'battle_hardened' }] },
  { level: 15, requiredXp: 10400, rewards: [{ type: 'currency', id: 'coins', quantity: 800 }, { type: 'cosmetic', id: 'trail_gold' }, { type: 'mode', id: 'precision_challenge' }] },
  { level: 16, requiredXp: 11900, rewards: [{ type: 'currency', id: 'coins', quantity: 850 }] },
  { level: 17, requiredXp: 13500, rewards: [{ type: 'currency', id: 'coins', quantity: 900 }, { type: 'cosmetic', id: 'skin_luna_veteran' }] },
  { level: 18, requiredXp: 15200, rewards: [{ type: 'currency', id: 'coins', quantity: 950 }] },
  { level: 19, requiredXp: 17000, rewards: [{ type: 'currency', id: 'coins', quantity: 1000 }, { type: 'title', id: 'master_artillerist' }] },
  { level: 20, requiredXp: 18900, rewards: [{ type: 'currency', id: 'coins', quantity: 1200 }, { type: 'cosmetic', id: 'frame_gold' }, { type: 'mode', id: 'local_versus' }] },
  { level: 21, requiredXp: 20900, rewards: [{ type: 'currency', id: 'coins', quantity: 1300 }] },
  { level: 22, requiredXp: 23000, rewards: [{ type: 'currency', id: 'coins', quantity: 1400 }, { type: 'cosmetic', id: 'skin_bolt_veteran' }] },
  { level: 23, requiredXp: 25200, rewards: [{ type: 'currency', id: 'coins', quantity: 1500 }] },
  { level: 24, requiredXp: 27500, rewards: [{ type: 'currency', id: 'coins', quantity: 1600 }, { type: 'title', id: 'astra_champion' }] },
  { level: 25, requiredXp: 29900, rewards: [{ type: 'currency', id: 'coins', quantity: 1800 }, { type: 'cosmetic', id: 'trail_astra' }, { type: 'mode', id: 'boss_rush' }] },
  { level: 26, requiredXp: 32400, rewards: [{ type: 'currency', id: 'coins', quantity: 1900 }] },
  { level: 27, requiredXp: 35000, rewards: [{ type: 'currency', id: 'coins', quantity: 2000 }, { type: 'cosmetic', id: 'skin_nova_veteran' }] },
  { level: 28, requiredXp: 37700, rewards: [{ type: 'currency', id: 'coins', quantity: 2100 }] },
  { level: 29, requiredXp: 40500, rewards: [{ type: 'currency', id: 'coins', quantity: 2200 }, { type: 'title', id: 'guardian_of_astra' }] },
  { level: 30, requiredXp: 43400, rewards: [{ type: 'currency', id: 'coins', quantity: 2500 }, { type: 'cosmetic', id: 'frame_astra' }, { type: 'mode', id: 'new_game_plus' }] },
];

export const MAX_PLAYER_LEVEL = PLAYER_LEVELS.length;

export function getPlayerLevelConfig(level: number): PlayerLevelConfig | undefined {
  return PLAYER_LEVELS.find(l => l.level === level);
}

export function getXpForNextLevel(currentLevel: number): number {
  const nextLevel = getPlayerLevelConfig(currentLevel + 1);
  return nextLevel?.requiredXp ?? 0;
}

export function calculateLevelFromXp(xp: number): number {
  for (let i = PLAYER_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= PLAYER_LEVELS[i].requiredXp) {
      return PLAYER_LEVELS[i].level;
    }
  }
  return 1;
}

export function getXpProgress(currentLevel: number, currentXp: number): { current: number; required: number; percent: number } {
  const currentConfig = getPlayerLevelConfig(currentLevel);
  const nextConfig = getPlayerLevelConfig(currentLevel + 1);
  
  if (!currentConfig || !nextConfig) {
    return { current: 0, required: 0, percent: 100 };
  }
  
  const current = currentXp - currentConfig.requiredXp;
  const required = nextConfig.requiredXp - currentConfig.requiredXp;
  const percent = Math.min(100, Math.max(0, (current / required) * 100));
  
  return { current, required, percent };
}

export const XP_SOURCES = {
  battle_win: 50,
  battle_loss: 10,
  battle_perfect_bonus: 25,
  boss_win: 200,
  boss_perfect_bonus: 100,
  star_1: 10,
  star_2: 20,
  star_3: 30,
  mission_complete: 50,
  achievement_unlock: 25,
  daily_login: 15,
} as const;

export type XpSource = keyof typeof XP_SOURCES;

export function getXpReward(source: XpSource): number {
  return XP_SOURCES[source];
}