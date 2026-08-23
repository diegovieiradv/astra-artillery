import { describe, it, expect } from 'vitest';
import {
  PLAYER_LEVELS,
  MAX_PLAYER_LEVEL,
  getPlayerLevelConfig,
  getXpForNextLevel,
  calculateLevelFromXp,
  getXpProgress,
  XP_SOURCES,
  getXpReward,
} from '@/game/data/playerLevels';

describe('Player Levels System', () => {
  describe('PLAYER_LEVELS config', () => {
    it('should have 30 levels', () => {
      expect(PLAYER_LEVELS.length).toBe(30);
      expect(MAX_PLAYER_LEVEL).toBe(30);
    });

    it('should start at level 1 with 0 XP', () => {
      expect(PLAYER_LEVELS[0].level).toBe(1);
      expect(PLAYER_LEVELS[0].requiredXp).toBe(0);
    });

    it('should have increasing XP requirements', () => {
      for (let i = 1; i < PLAYER_LEVELS.length; i++) {
        expect(PLAYER_LEVELS[i].requiredXp).toBeGreaterThan(PLAYER_LEVELS[i - 1].requiredXp);
      }
    });

    it('should have rewards for key levels', () => {
      const level10 = getPlayerLevelConfig(10);
      expect(level10?.rewards.length).toBeGreaterThan(0);
      expect(level10?.rewards.some(r => r.type === 'mode' && r.id === 'training')).toBe(true);
    });

    it('should unlock modes at specific levels', () => {
      const trainingLevel = PLAYER_LEVELS.find(l => l.rewards.some(r => r.id === 'training'));
      expect(trainingLevel?.level).toBe(10);

      const precisionLevel = PLAYER_LEVELS.find(l => l.rewards.some(r => r.id === 'precision_challenge'));
      expect(precisionLevel?.level).toBe(15);

      const versusLevel = PLAYER_LEVELS.find(l => l.rewards.some(r => r.id === 'local_versus'));
      expect(versusLevel?.level).toBe(20);

      const bossRushLevel = PLAYER_LEVELS.find(l => l.rewards.some(r => r.id === 'boss_rush'));
      expect(bossRushLevel?.level).toBe(25);

      const ngPlusLevel = PLAYER_LEVELS.find(l => l.rewards.some(r => r.id === 'new_game_plus'));
      expect(ngPlusLevel?.level).toBe(30);
    });
  });

  describe('getPlayerLevelConfig', () => {
    it('should return config for valid level', () => {
      const config = getPlayerLevelConfig(5);
      expect(config).toBeDefined();
      expect(config?.level).toBe(5);
      expect(config?.requiredXp).toBe(900);
    });

    it('should return undefined for invalid level', () => {
      expect(getPlayerLevelConfig(0)).toBeUndefined();
      expect(getPlayerLevelConfig(31)).toBeUndefined();
      expect(getPlayerLevelConfig(-1)).toBeUndefined();
    });
  });

  describe('calculateLevelFromXp', () => {
    it('should return level 1 for 0 XP', () => {
      expect(calculateLevelFromXp(0)).toBe(1);
    });

    it('should return correct level for exact XP thresholds', () => {
      expect(calculateLevelFromXp(100)).toBe(2);
      expect(calculateLevelFromXp(250)).toBe(3);
      expect(calculateLevelFromXp(900)).toBe(5);
      expect(calculateLevelFromXp(4400)).toBe(10);
      expect(calculateLevelFromXp(43400)).toBe(30);
    });

it('should return correct level for XP between thresholds', () => {
      expect(calculateLevelFromXp(50)).toBe(1);
      expect(calculateLevelFromXp(150)).toBe(2);
      expect(calculateLevelFromXp(499)).toBe(3); // Just before level 4
      expect(calculateLevelFromXp(500)).toBe(4); // Exactly level 4 threshold
      expect(calculateLevelFromXp(1999)).toBe(6); // Just before level 7
      expect(calculateLevelFromXp(2000)).toBe(7); // Exactly level 7 threshold
      expect(calculateLevelFromXp(10000)).toBe(14); // Between level 14 (9000) and 15 (10400)
      expect(calculateLevelFromXp(30000)).toBe(25); // Between level 25 (29900) and 26 (32400)
    });

    it('should cap at max level for excess XP', () => {
      expect(calculateLevelFromXp(50000)).toBe(30);
      expect(calculateLevelFromXp(100000)).toBe(30);
    });
  });

  describe('getXpForNextLevel', () => {
    it('should return XP required for next level', () => {
      expect(getXpForNextLevel(1)).toBe(100);
      expect(getXpForNextLevel(9)).toBe(4400);
      expect(getXpForNextLevel(29)).toBe(43400);
    });

    it('should return 0 for max level', () => {
      expect(getXpForNextLevel(30)).toBe(0);
      expect(getXpForNextLevel(31)).toBe(0);
    });
  });

  describe('getXpProgress', () => {
    it('should return 0% progress at level start', () => {
      const progress = getXpProgress(1, 0);
      expect(progress.current).toBe(0);
      expect(progress.required).toBe(100);
      expect(progress.percent).toBe(0);
    });

    it('should return 50% progress at halfway', () => {
      const progress = getXpProgress(1, 50);
      expect(progress.current).toBe(50);
      expect(progress.required).toBe(100);
      expect(progress.percent).toBe(50);
    });

    it('should return 100% at level threshold', () => {
      const progress = getXpProgress(1, 100);
      expect(progress.percent).toBe(100);
    });

    it('should cap at 100% for excess XP', () => {
      const progress = getXpProgress(1, 150);
      expect(progress.percent).toBe(100);
    });

    it('should work for higher levels', () => {
      const progress = getXpProgress(5, 1150); // Level 5 requires 900, level 6 requires 1400
      expect(progress.current).toBe(250);
      expect(progress.required).toBe(500);
      expect(progress.percent).toBe(50);
    });

    it('should return 100% for max level', () => {
      const progress = getXpProgress(30, 50000);
      expect(progress.percent).toBe(100);
    });
  });

  describe('XP Sources', () => {
    it('should have all required XP sources', () => {
      expect(XP_SOURCES.battle_win).toBe(50);
      expect(XP_SOURCES.battle_loss).toBe(10);
      expect(XP_SOURCES.battle_perfect_bonus).toBe(25);
      expect(XP_SOURCES.boss_win).toBe(200);
      expect(XP_SOURCES.boss_perfect_bonus).toBe(100);
      expect(XP_SOURCES.star_1).toBe(10);
      expect(XP_SOURCES.star_2).toBe(20);
      expect(XP_SOURCES.star_3).toBe(30);
      expect(XP_SOURCES.mission_complete).toBe(50);
      expect(XP_SOURCES.achievement_unlock).toBe(25);
      expect(XP_SOURCES.daily_login).toBe(15);
    });

    it('getXpReward should return correct values', () => {
      expect(getXpReward('battle_win')).toBe(50);
      expect(getXpReward('boss_win')).toBe(200);
      expect(getXpReward('mission_complete')).toBe(50);
    });
  });

  describe('Level Rewards', () => {
    it('should not give power-related rewards', () => {
      for (const level of PLAYER_LEVELS) {
        for (const reward of level.rewards) {
          expect(reward.type).not.toBe('damage_boost');
          expect(reward.type).not.toBe('hp_boost');
          expect(reward.type).not.toBe('stat_boost');
        }
      }
    });

    it('should only give cosmetic, currency, title, mode, character, projectile, lore rewards', () => {
      const allowedTypes = ['currency', 'cosmetic', 'title', 'mode', 'character', 'projectile', 'lore'];
      for (const level of PLAYER_LEVELS) {
        for (const reward of level.rewards) {
          expect(allowedTypes).toContain(reward.type);
        }
      }
    });

    it('should give cosmetic rewards at regular intervals', () => {
      const cosmeticLevels = PLAYER_LEVELS.filter(l => l.rewards.some(r => r.type === 'cosmetic'));
      expect(cosmeticLevels.length).toBeGreaterThan(5);
    });

    it('should give titles at milestone levels', () => {
      const titleLevels = PLAYER_LEVELS.filter(l => l.rewards.some(r => r.type === 'title'));
      expect(titleLevels.map(l => l.level)).toEqual([5, 9, 14, 19, 24, 29]);
    });
  });
});