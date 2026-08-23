import { describe, it, expect } from 'vitest';
import {
  MASTERY_LEVELS,
  MAX_MASTERY_LEVEL,
  getMasteryLevelConfig,
  getXpForNextMasteryLevel,
  calculateMasteryLevelFromXp,
  getMasteryXpProgress,
  MASTERY_XP_SOURCES,
  getMasteryXpReward,
  createDefaultMasteryState,
  getMasteryRewardsForCharacter,
} from '@/game/data/characterMastery';

describe('Character Mastery System', () => {
  describe('MASTERY_LEVELS config', () => {
    it('should have 15 levels', () => {
      expect(MASTERY_LEVELS.length).toBe(15);
      expect(MAX_MASTERY_LEVEL).toBe(15);
    });

    it('should start at level 1 with 0 XP', () => {
      expect(MASTERY_LEVELS[0].level).toBe(1);
      expect(MASTERY_LEVELS[0].requiredXp).toBe(0);
    });

    it('should have increasing XP requirements', () => {
      for (let i = 1; i < MASTERY_LEVELS.length; i++) {
        expect(MASTERY_LEVELS[i].requiredXp).toBeGreaterThan(MASTERY_LEVELS[i - 1].requiredXp);
      }
    });

    it('should have rewards for key levels', () => {
      const level5 = getMasteryLevelConfig(5);
      expect(level5?.rewards.length).toBeGreaterThan(0);
      expect(level5?.rewards.some(r => r.type === 'skin' && r.characterId === 'kai')).toBe(true);
    });

    it('should give cosmetic rewards at milestones', () => {
      const cosmeticLevels = MASTERY_LEVELS.filter(l => l.rewards.some(r => r.type === 'skin'));
      expect(cosmeticLevels.map(l => l.level)).toEqual([5, 10, 15]);
    });

    it('should give titles at milestones', () => {
      const titleLevels = MASTERY_LEVELS.filter(l => l.rewards.some(r => r.type === 'title'));
      expect(titleLevels.map(l => l.level)).toEqual([3, 5, 9, 14, 15]);
    });

    it('should give lore at regular intervals', () => {
      const loreLevels = MASTERY_LEVELS.filter(l => l.rewards.some(r => r.type === 'lore'));
      expect(loreLevels.length).toBe(3); // levels 2, 6, 11
    });

    it('should give animations at higher levels', () => {
      const animLevels = MASTERY_LEVELS.filter(l => l.rewards.some(r => r.type === 'animation'));
      expect(animLevels.map(l => l.level)).toEqual([8, 13]);
    });

    it('should not give power-related rewards', () => {
      for (const level of MASTERY_LEVELS) {
        for (const reward of level.rewards) {
          expect(reward.type).not.toBe('damage_boost');
          expect(reward.type).not.toBe('hp_boost');
          expect(reward.type).not.toBe('stat_boost');
          expect(reward.type).not.toBe('power_boost');
        }
      }
    });

    it('should only give allowed reward types', () => {
      const allowedTypes = ['skin', 'title', 'portrait', 'lore', 'animation', 'banner', 'frame'];
      for (const level of MASTERY_LEVELS) {
        for (const reward of level.rewards) {
          expect(allowedTypes).toContain(reward.type);
        }
      }
    });
  });

  describe('getMasteryLevelConfig', () => {
    it('should return config for valid level', () => {
      const config = getMasteryLevelConfig(5);
      expect(config).toBeDefined();
      expect(config?.level).toBe(5);
      expect(config?.requiredXp).toBe(1800);
    });

    it('should return undefined for invalid level', () => {
      expect(getMasteryLevelConfig(0)).toBeUndefined();
      expect(getMasteryLevelConfig(16)).toBeUndefined();
      expect(getMasteryLevelConfig(-1)).toBeUndefined();
    });
  });

  describe('calculateMasteryLevelFromXp', () => {
    it('should return level 1 for 0 XP', () => {
      expect(calculateMasteryLevelFromXp(0)).toBe(1);
    });

    it('should return correct level for exact XP thresholds', () => {
      expect(calculateMasteryLevelFromXp(200)).toBe(2);
      expect(calculateMasteryLevelFromXp(500)).toBe(3);
      expect(calculateMasteryLevelFromXp(1800)).toBe(5);
      expect(calculateMasteryLevelFromXp(9200)).toBe(10);
      expect(calculateMasteryLevelFromXp(24500)).toBe(15);
    });

    it('should return correct level for XP between thresholds', () => {
      expect(calculateMasteryLevelFromXp(100)).toBe(1);
      expect(calculateMasteryLevelFromXp(300)).toBe(2);
      expect(calculateMasteryLevelFromXp(999)).toBe(3); // Just before level 4
      expect(calculateMasteryLevelFromXp(1000)).toBe(4); // Exactly level 4 threshold
      expect(calculateMasteryLevelFromXp(5000)).toBe(7);
      expect(calculateMasteryLevelFromXp(15000)).toBe(12); // Between level 12 (14000) and 13 (17000)
      expect(calculateMasteryLevelFromXp(20000)).toBe(13);
    });

    it('should cap at max level for excess XP', () => {
      expect(calculateMasteryLevelFromXp(30000)).toBe(15);
      expect(calculateMasteryLevelFromXp(50000)).toBe(15);
    });
  });

  describe('getXpForNextMasteryLevel', () => {
    it('should return XP required for next level', () => {
      expect(getXpForNextMasteryLevel(1)).toBe(200);
      expect(getXpForNextMasteryLevel(4)).toBe(1800);
      expect(getXpForNextMasteryLevel(14)).toBe(24500);
    });

    it('should return 0 for max level', () => {
      expect(getXpForNextMasteryLevel(15)).toBe(0);
      expect(getXpForNextMasteryLevel(16)).toBe(0);
    });
  });

  describe('getMasteryXpProgress', () => {
    it('should return 0% progress at level start', () => {
      const progress = getMasteryXpProgress(1, 0);
      expect(progress.current).toBe(0);
      expect(progress.required).toBe(200);
      expect(progress.percent).toBe(0);
    });

    it('should return 50% progress at halfway', () => {
      const progress = getMasteryXpProgress(1, 100);
      expect(progress.current).toBe(100);
      expect(progress.required).toBe(200);
      expect(progress.percent).toBe(50);
    });

    it('should return 100% at level threshold', () => {
      const progress = getMasteryXpProgress(1, 200);
      expect(progress.percent).toBe(100);
    });

    it('should cap at 100% for excess XP', () => {
      const progress = getMasteryXpProgress(1, 300);
      expect(progress.percent).toBe(100);
    });

    it('should work for higher levels', () => {
      const progress = getMasteryXpProgress(5, 2300); // Level 5 requires 1800, level 6 requires 2800
      expect(progress.current).toBe(500);
      expect(progress.required).toBe(1000);
      expect(progress.percent).toBe(50);
    });

    it('should return 100% for max level', () => {
      const progress = getMasteryXpProgress(15, 30000);
      expect(progress.percent).toBe(100);
    });
  });

  describe('Mastery XP Sources', () => {
    it('should have all required XP sources', () => {
      expect(MASTERY_XP_SOURCES.battle_win).toBe(100);
      expect(MASTERY_XP_SOURCES.battle_loss).toBe(25);
      expect(MASTERY_XP_SOURCES.battle_perfect_bonus).toBe(50);
      expect(MASTERY_XP_SOURCES.boss_win).toBe(300);
      expect(MASTERY_XP_SOURCES.boss_perfect_bonus).toBe(150);
      expect(MASTERY_XP_SOURCES.special_used).toBe(10);
    });

    it('getMasteryXpReward should return correct values', () => {
      expect(getMasteryXpReward('battle_win')).toBe(100);
      expect(getMasteryXpReward('boss_win')).toBe(300);
      expect(getMasteryXpReward('special_used')).toBe(10);
    });
  });

  describe('createDefaultMasteryState', () => {
    it('should create mastery state for all 8 characters', () => {
      const state = createDefaultMasteryState();
      expect(Object.keys(state)).toHaveLength(8);
      expect(state.kai).toEqual({ xp: 0, level: 1 });
      expect(state.luna).toEqual({ xp: 0, level: 1 });
      expect(state.bolt).toEqual({ xp: 0, level: 1 });
      expect(state.nova).toEqual({ xp: 0, level: 1 });
      expect(state.zephyr).toEqual({ xp: 0, level: 1 });
      expect(state.igneous).toEqual({ xp: 0, level: 1 });
      expect(state.glacis).toEqual({ xp: 0, level: 1 });
      expect(state.aeris).toEqual({ xp: 0, level: 1 });
    });
  });

  describe('getMasteryRewardsForCharacter', () => {
    it('should return character-specific rewards', () => {
      const kaiRewards = getMasteryRewardsForCharacter('kai', 15);
      const skinRewards = kaiRewards.filter(r => r.type === 'skin' && r.characterId === 'kai');
      expect(skinRewards.length).toBe(3); // veteran, master, legendary
    });

    it('should return shared rewards for all characters', () => {
      const lunaRewards = getMasteryRewardsForCharacter('luna', 15);
      const titleRewards = lunaRewards.filter(r => r.type === 'title');
      // titles at levels 3, 5, 9, 14, 15 = 5 titles
      expect(titleRewards.length).toBe(5);
    });

    it('should filter by max level', () => {
      const rewards = getMasteryRewardsForCharacter('kai', 5);
      const maxLevel = Math.max(...rewards.map(r => {
        const levelConfig = MASTERY_LEVELS.find(l => l.rewards.some(rw => rw.id === r.id));
        return levelConfig?.level || 0;
      }));
      expect(maxLevel).toBeLessThanOrEqual(5);
    });
  });
});