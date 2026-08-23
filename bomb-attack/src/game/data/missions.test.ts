import { describe, it, expect } from 'vitest';
import {
  MISSIONS,
  MISSION_CATEGORIES,
  getMission,
  getMissionsByCategory,
  getAllMissions,
  getAvailableMissions,
  MissionCategory,
  MissionObjectiveType,
} from '@/game/data/missions';

describe('Mission System', () => {
  describe('MISSIONS config', () => {
    it('should have missions in all 6 categories', () => {
      const categories = ['story', 'combat', 'precision', 'character', 'region', 'mastery'] as MissionCategory[];
      for (const cat of categories) {
        const missions = getMissionsByCategory(cat);
        expect(missions.length).toBeGreaterThan(0);
      }
    });

    it('should have story missions for each region boss', () => {
      const storyMissions = getMissionsByCategory('story');
      expect(storyMissions.length).toBe(7); // 1 first battle + 6 region bosses
      
      const bossMissions = storyMissions.filter(m => m.objectives.some(o => o.type === 'defeat_boss'));
      expect(bossMissions.length).toBe(6);
    });

    it('should have combat missions with win/perfect objectives', () => {
      const combatMissions = getMissionsByCategory('combat');
      const winMissions = combatMissions.filter(m => m.objectives.some(o => o.type === 'win_battle'));
      const perfectMissions = combatMissions.filter(m => m.objectives.some(o => o.type === 'perfect_win'));
      
      expect(winMissions.length).toBeGreaterThan(0);
      expect(perfectMissions.length).toBeGreaterThan(0);
    });

    it('should have precision missions', () => {
      const precisionMissions = getMissionsByCategory('precision');
      expect(precisionMissions.length).toBeGreaterThan(0);
    });

    it('should have character missions for all 8 characters', () => {
      const characterMissions = getMissionsByCategory('character');
      const characters = ['kai', 'luna', 'bolt', 'nova', 'zephyr', 'igneous', 'glacis', 'aeris'];
      
      for (const char of characters) {
        const charMissions = characterMissions.filter(m => 
          m.objectives.some(o => o.type === 'specific_character' && o.characterId === char)
        );
        expect(charMissions.length).toBeGreaterThan(0);
      }
    });

    it('should have region missions for all 6 regions', () => {
      const regionMissions = getMissionsByCategory('region');
      const regions = ['green_valley', 'crystal_desert', 'frozen_peaks', 'ember_lands', 'sky_kingdom', 'dark_citadel'];
      
      for (const region of regions) {
        const regionMission = regionMissions.find(m => 
          m.objectives.some(o => o.type === 'complete_region' && o.regionId === region)
        );
        expect(regionMission).toBeDefined();
      }
    });

    it('should have mastery missions', () => {
      const masteryMissions = getMissionsByCategory('mastery');
      expect(masteryMissions.length).toBeGreaterThan(0);
    });

    it('should have repeatable daily missions', () => {
      const dailyMissions = getAllMissions().filter(m => m.isRepeatable);
      expect(dailyMissions.length).toBeGreaterThan(0);
    });

    it('should not give power-boosting rewards', () => {
      for (const mission of MISSIONS) {
        for (const reward of mission.rewards) {
          expect(reward.type).not.toBe('damage_boost');
          expect(reward.type).not.toBe('hp_boost');
          expect(reward.type).not.toBe('stat_boost');
          expect(reward.type).not.toBe('power_boost');
        }
      }
    });

    it('should only give allowed reward types', () => {
      const allowedTypes = ['currency', 'xp', 'cosmetic', 'title', 'lore', 'skin'];
      for (const mission of MISSIONS) {
        for (const reward of mission.rewards) {
          expect(allowedTypes).toContain(reward.type);
        }
      }
    });
  });

  describe('getMission', () => {
    it('should return mission for valid ID', () => {
      const mission = getMission('story_first_battle');
      expect(mission).toBeDefined();
      expect(mission?.id).toBe('story_first_battle');
    });

    it('should return undefined for invalid ID', () => {
      expect(getMission('invalid_mission')).toBeUndefined();
    });
  });

  describe('getMissionsByCategory', () => {
    it('should return correct missions for each category', () => {
      const storyMissions = getMissionsByCategory('story');
      for (const m of storyMissions) {
        expect(m.category).toBe('story');
      }
    });
  });

  describe('getAllMissions', () => {
    it('should return all missions', () => {
      const all = getAllMissions();
      expect(all.length).toBe(MISSIONS.length);
    });
  });

  describe('getAvailableMissions', () => {
    it('should filter completed non-repeatable missions', () => {
      const available = getAvailableMissions(
        ['story_first_battle'], // completed
        1, // player level
        ['green_valley'], // unlocked regions
        createDefaultMasteryState() // character mastery
      );
      
      expect(available.find(m => m.id === 'story_first_battle')).toBeUndefined();
    });

    it('should include repeatable missions even if completed', () => {
      const available = getAvailableMissions(
        ['daily_win'], // completed
        1,
        ['green_valley'],
        createDefaultMasteryState()
      );
      
      expect(available.find(m => m.id === 'daily_win')).toBeDefined();
    });

    it('should respect level unlock requirements', () => {
      const available = getAvailableMissions(
        [],
        1, // level 1
        ['green_valley'],
        createDefaultMasteryState()
      );
      
      // story_green_valley requires level 4
      expect(available.find(m => m.id === 'story_green_valley')).toBeUndefined();
    });

    it('should respect region unlock requirements', () => {
      const available = getAvailableMissions(
        [],
        10, // high level
        ['green_valley'], // only green valley unlocked
        createDefaultMasteryState()
      );
      
      // region_crystal_desert requires crystal_desert unlocked
      expect(available.find(m => m.id === 'region_crystal_desert')).toBeUndefined();
    });

    it('should respect character mastery requirements', () => {
      const mastery = createDefaultMasteryState();
      mastery.kai = { xp: 0, level: 3 }; // only level 3
      
      const available = getAvailableMissions(
        [],
        20,
        ['green_valley', 'crystal_desert', 'frozen_peaks', 'ember_lands', 'sky_kingdom', 'dark_citadel'],
        mastery
      );
      
      // mastery_kai_10 requires level 10
      expect(available.find(m => m.id === 'mastery_kai_10')).toBeUndefined();
    });
  });

  describe('MISSION_CATEGORIES', () => {
    it('should have all 6 categories with label, icon, color', () => {
      const categories = ['story', 'combat', 'precision', 'character', 'region', 'mastery'] as MissionCategory[];
      for (const cat of categories) {
        expect(MISSION_CATEGORIES[cat]).toBeDefined();
        expect(MISSION_CATEGORIES[cat].label).toBeTruthy();
        expect(MISSION_CATEGORIES[cat].icon).toBeTruthy();
        expect(MISSION_CATEGORIES[cat].color).toBeTruthy();
      }
    });
  });

  describe('Mission Objectives', () => {
    it('should have valid objective types', () => {
      const validTypes: MissionObjectiveType[] = [
        'complete_level', 'win_battle', 'perfect_win', 'long_range_hit',
        'no_tactical_items', 'specific_character', 'defeat_boss',
        'turn_limit', 'hp_threshold', 'complete_region',
        'reach_mastery_level', 'use_special_ability', 'collect_stars'
      ];
      
      for (const mission of MISSIONS) {
        for (const obj of mission.objectives) {
          expect(validTypes).toContain(obj.type);
        }
      }
    });

    it('should have count for repeatable objectives', () => {
      for (const mission of MISSIONS) {
        for (const obj of mission.objectives) {
          if (['win_battle', 'perfect_win', 'specific_character', 'use_special_ability', 'collect_stars'].includes(obj.type)) {
            expect(obj.count).toBeDefined();
            expect(obj.count).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  function createDefaultMasteryState() {
    const characters = ['kai', 'luna', 'bolt', 'nova', 'zephyr', 'igneous', 'glacis', 'aeris'];
    const state: Record<string, { xp: number; level: number }> = {};
    for (const charId of characters) {
      state[charId] = { xp: 0, level: 1 };
    }
    return state;
  }
});