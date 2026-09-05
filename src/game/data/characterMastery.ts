export type MasteryRewardType = 
  | 'skin' 
  | 'title' 
  | 'portrait' 
  | 'lore' 
  | 'animation' 
  | 'banner' 
  | 'frame';

export interface MasteryReward {
  type: MasteryRewardType;
  id: string;
  characterId?: string;
}

export interface CharacterMasteryConfig {
  level: number;
  requiredXp: number;
  rewards: MasteryReward[];
}

export const MASTERY_XP_PER_BATTLE = {
  win: 100,
  loss: 25,
  perfect_win_bonus: 50,
  boss_win: 300,
  boss_perfect_bonus: 150,
  special_used: 10,
} as const;

export const MASTERY_XP_SOURCES = {
  battle_win: 100,
  battle_loss: 25,
  battle_perfect_bonus: 50,
  boss_win: 300,
  boss_perfect_bonus: 150,
  special_used: 10,
} as const;

export type MasteryXpSource = keyof typeof MASTERY_XP_SOURCES;

export function getMasteryXpReward(source: MasteryXpSource): number {
  return MASTERY_XP_SOURCES[source];
}

export const MAX_MASTERY_LEVEL = 15;

export const MASTERY_LEVELS: CharacterMasteryConfig[] = [
  { level: 1, requiredXp: 0, rewards: [] },
  { level: 2, requiredXp: 200, rewards: [{ type: 'lore', id: 'lore_kai_origin' }] },
  { level: 3, requiredXp: 500, rewards: [{ type: 'title', id: 'title_apprentice' }] },
  { level: 4, requiredXp: 1000, rewards: [{ type: 'portrait', id: 'portrait_kai_determined' }] },
  { level: 5, requiredXp: 1800, rewards: [{ type: 'skin', id: 'skin_kai_veteran', characterId: 'kai' }, { type: 'title', id: 'title_veteran' }] },
  { level: 6, requiredXp: 2800, rewards: [{ type: 'lore', id: 'lore_kai_training' }] },
  { level: 7, requiredXp: 4000, rewards: [{ type: 'portrait', id: 'portrait_kai_mastery' }] },
  { level: 8, requiredXp: 5500, rewards: [{ type: 'animation', id: 'anim_kai_victory_pose' }] },
  { level: 9, requiredXp: 7200, rewards: [{ type: 'title', id: 'title_expert' }] },
  { level: 10, requiredXp: 9200, rewards: [{ type: 'skin', id: 'skin_kai_master', characterId: 'kai' }, { type: 'frame', id: 'frame_master' }] },
  { level: 11, requiredXp: 11500, rewards: [{ type: 'lore', id: 'lore_kai_legacy' }] },
  { level: 12, requiredXp: 14000, rewards: [{ type: 'portrait', id: 'portrait_kai_legend' }] },
  { level: 13, requiredXp: 17000, rewards: [{ type: 'animation', id: 'anim_kai_ultimate' }] },
  { level: 14, requiredXp: 20500, rewards: [{ type: 'title', id: 'title_grandmaster' }] },
  { level: 15, requiredXp: 24500, rewards: [{ type: 'skin', id: 'skin_kai_legendary', characterId: 'kai' }, { type: 'banner', id: 'banner_grandmaster' }, { type: 'title', id: 'title_legend' }] },
];

export function getMasteryLevelConfig(level: number): CharacterMasteryConfig | undefined {
  return MASTERY_LEVELS.find(l => l.level === level);
}

export function getXpForNextMasteryLevel(currentLevel: number): number {
  const nextLevel = getMasteryLevelConfig(currentLevel + 1);
  return nextLevel?.requiredXp ?? 0;
}

export function calculateMasteryLevelFromXp(xp: number): number {
  for (let i = MASTERY_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= MASTERY_LEVELS[i].requiredXp) {
      return MASTERY_LEVELS[i].level;
    }
  }
  return 1;
}

export function getMasteryXpProgress(currentLevel: number, currentXp: number): { current: number; required: number; percent: number } {
  const currentConfig = getMasteryLevelConfig(currentLevel);
  const nextConfig = getMasteryLevelConfig(currentLevel + 1);
  
  if (!currentConfig || !nextConfig) {
    return { current: 0, required: 0, percent: 100 };
  }
  
  const current = currentXp - currentConfig.requiredXp;
  const required = nextConfig.requiredXp - currentConfig.requiredXp;
  const percent = Math.min(100, Math.max(0, (current / required) * 100));
  
  return { current, required, percent };
}

export interface CharacterMasteryState {
  xp: number;
  level: number;
}

export const DEFAULT_MASTERY_STATE: CharacterMasteryState = {
  xp: 0,
  level: 1,
};

export function createDefaultMasteryState(): Record<string, CharacterMasteryState> {
  const characters = ['kai', 'luna', 'bolt', 'nova', 'zephyr', 'torn', 'pyra', 'mira', 'rook', 'drax'];
  const state: Record<string, CharacterMasteryState> = {};
  for (const charId of characters) {
    state[charId] = { ...DEFAULT_MASTERY_STATE };
  }
  return state;
}

export function getMasteryRewardsForCharacter(characterId: string, upToLevel: number): MasteryReward[] {
  const rewards: MasteryReward[] = [];
  for (const levelConfig of MASTERY_LEVELS) {
    if (levelConfig.level <= upToLevel) {
      for (const reward of levelConfig.rewards) {
        if (!reward.characterId || reward.characterId === characterId) {
          rewards.push(reward);
        }
      }
    }
  }
  return rewards;
}