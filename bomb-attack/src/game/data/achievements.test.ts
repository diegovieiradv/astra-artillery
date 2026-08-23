import { describe, it, expect } from 'vitest';
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  getAchievement,
  getAchievementsByCategory,
  getAllAchievements,
  getVisibleAchievements,
  getTotalAchievementPoints,
  createDefaultAchievementState,
  AchievementCategory,
  AchievementTriggerType,
} from '@/game/data/achievements';

describe('Achievement System', () => {
  describe('ACHIEVEMENTS config', () => {
    it('should have achievements in all 7 categories', () => {
      const categories = ['progression', 'combat', 'precision', 'exploration', 'mastery', 'collection', 'special'] as AchievementCategory[];
      for (const cat of categories) {
        const achievements = getAchievementsByCategory(cat);
        expect(achievements.length).toBeGreaterThan(0);
      }
    });

    it('should have progression achievements', () => {
      const progression = getAchievementsByCategory('progression');
      expect(progression.length).toBeGreaterThan(0);
      
      const firstBlast = getAchievement('first_blast');
      expect(firstBlast).toBeDefined();
      expect(firstBlast?.triggers[0].type).toBe('first_battle');
    });

    it('should have combat achievements', () => {
      const combat = getAchievementsByCategory('combat');
      expect(combat.length).toBeGreaterThan(0);
      
      const bossBreaker = getAchievement('boss_breaker');
      expect(bossBreaker).toBeDefined();
      expect(bossBreaker?.triggers[0].type).toBe('boss_defeated');
    });

    it('should have precision achievements', () => {
      const precision = getAchievementsByCategory('precision');
      expect(precision.length).toBeGreaterThan(0);
      
      const starHunter = getAchievement('star_hunter');
      expect(starHunter).toBeDefined();
      expect(starHunter?.triggers[0].type).toBe('stars_collected');
    });

    it('should have exploration achievements for all 6 regions', () => {
      const exploration = getAchievementsByCategory('exploration');
      const regions = ['green_valley', 'crystal_desert', 'frozen_peaks', 'ember_lands', 'sky_kingdom', 'dark_citadel'];
      
      for (const region of regions) {
        const ach = exploration.find(a => a.triggers.some(t => t.type === 'region_completed' && t.regionId === region));
        expect(ach).toBeDefined();
      }
    });

    it('should have mastery achievements', () => {
      const mastery = getAchievementsByCategory('mastery');
      expect(mastery.length).toBeGreaterThan(0);
      
      const kaiMaster = getAchievement('kai_master');
      expect(kaiMaster).toBeDefined();
      expect(kaiMaster?.triggers[0].type).toBe('character_mastery_level');
    });

    it('should have collection achievements', () => {
      const collection = getAchievementsByCategory('collection');
      expect(collection.length).toBeGreaterThan(0);
    });

    it('should have special achievements', () => {
      const special = getAchievementsByCategory('special');
      expect(special.length).toBeGreaterThan(0);
      
      const campaignComplete = getAchievement('campaign_complete');
      expect(campaignComplete).toBeDefined();
      expect(campaignComplete?.triggers[0].type).toBe('campaign_completed');
    });

    it('should not give power-boosting rewards', () => {
      for (const achievement of ACHIEVEMENTS) {
        for (const reward of achievement.rewards) {
          expect(reward.type).not.toBe('damage_boost');
          expect(reward.type).not.toBe('hp_boost');
          expect(reward.type).not.toBe('stat_boost');
          expect(reward.type).not.toBe('power_boost');
        }
      }
    });

    it('should only give allowed reward types', () => {
      const allowedTypes = ['currency', 'cosmetic', 'title', 'badge', 'lore'];
      for (const achievement of ACHIEVEMENTS) {
        for (const reward of achievement.rewards) {
          expect(allowedTypes).toContain(reward.type);
        }
      }
    });

    it('should have points for all achievements', () => {
      for (const achievement of ACHIEVEMENTS) {
        expect(achievement.points).toBeGreaterThan(0);
      }
    });
  });

  describe('getAchievement', () => {
    it('should return achievement for valid ID', () => {
      const ach = getAchievement('first_blast');
      expect(ach).toBeDefined();
      expect(ach?.id).toBe('first_blast');
    });

    it('should return undefined for invalid ID', () => {
      expect(getAchievement('invalid_achievement')).toBeUndefined();
    });
  });

  describe('getAchievementsByCategory', () => {
    it('should return correct achievements for each category', () => {
      const progression = getAchievementsByCategory('progression');
      for (const a of progression) {
        expect(a.category).toBe('progression');
      }
    });
  });

  describe('getAllAchievements', () => {
    it('should return all achievements', () => {
      const all = getAllAchievements();
      expect(all.length).toBe(ACHIEVEMENTS.length);
    });
  });

  describe('getVisibleAchievements', () => {
    it('should return only non-hidden achievements', () => {
      const visible = getVisibleAchievements();
      for (const a of visible) {
        expect(a.isHidden).toBe(false);
      }
    });

    it('should exclude hidden achievements', () => {
      const visible = getVisibleAchievements();
      const hiddenIds = ACHIEVEMENTS.filter(a => a.isHidden).map(a => a.id);
      for (const id of hiddenIds) {
        expect(visible.find(a => a.id === id)).toBeUndefined();
      }
    });
  });

  describe('getTotalAchievementPoints', () => {
    it('should sum all achievement points', () => {
      const total = getTotalAchievementPoints();
      const expected = ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0);
      expect(total).toBe(expected);
    });
  });

  describe('ACHIEVEMENT_CATEGORIES', () => {
    it('should have all 7 categories with label, icon, color', () => {
      const categories = ['progression', 'combat', 'precision', 'exploration', 'mastery', 'collection', 'special'] as AchievementCategory[];
      for (const cat of categories) {
        expect(ACHIEVEMENT_CATEGORIES[cat]).toBeDefined();
        expect(ACHIEVEMENT_CATEGORIES[cat].label).toBeTruthy();
        expect(ACHIEVEMENT_CATEGORIES[cat].icon).toBeTruthy();
        expect(ACHIEVEMENT_CATEGORIES[cat].color).toBeTruthy();
      }
    });
  });

  describe('Achievement Triggers', () => {
    it('should have valid trigger types', () => {
      const validTypes: AchievementTriggerType[] = [
        'first_battle', 'battle_win', 'battle_loss', 'perfect_win',
        'boss_defeated', 'level_completed', 'region_completed',
        'stars_collected', 'long_range_hit', 'accuracy_threshold',
        'character_mastery_level', 'all_characters_mastery', 'player_level',
        'cosmetic_unlocked', 'all_cosmetics_category', 'mission_completed',
        'all_missions_category', 'campaign_completed', 'new_game_plus',
        'special_ability_used', 'tactical_item_used'
      ];
      
      for (const achievement of ACHIEVEMENTS) {
        for (const trigger of achievement.triggers) {
          expect(validTypes).toContain(trigger.type);
        }
      }
    });

    it('should have count for repeatable triggers', () => {
      for (const achievement of ACHIEVEMENTS) {
        for (const trigger of achievement.triggers) {
          if (['battle_win', 'battle_loss', 'perfect_win', 'boss_defeated', 'stars_collected', 
               'mission_completed', 'special_ability_used', 'tactical_item_used'].includes(trigger.type)) {
            if (!trigger.count) {
              console.log('Missing count:', achievement.id, trigger);
            }
            expect(trigger.count).toBeDefined();
            expect(typeof trigger.count).toBe('number');
            expect(trigger.count).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  describe('createDefaultAchievementState', () => {
    it('should create state for all achievements', () => {
      const state = createDefaultAchievementState();
      expect(Object.keys(state)).toHaveLength(ACHIEVEMENTS.length);
    });

    it('should initialize all achievements as locked', () => {
      const state = createDefaultAchievementState();
      for (const ach of Object.values(state)) {
        expect(ach.unlocked).toBe(false);
        expect(ach.unlockedAt).toBeUndefined();
      }
    });

    it('should initialize progress for all triggers', () => {
      const state = createDefaultAchievementState();
      for (const achievement of ACHIEVEMENTS) {
        const achState = state[achievement.id];
        for (const trigger of achievement.triggers) {
          expect(achState.progress[trigger.type]).toBeDefined();
          expect(achState.progress[trigger.type]).toBe(0);
        }
      }
    });
  });
});