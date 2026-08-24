import { describe, it, expect } from 'vitest';
import {
  TRAINING_MODES,
  getTrainingMode,
  getTrainingModesByCategory,
  getTrainingModesByDifficulty,
  isTrainingCompleted,
  calculateTrainingAccuracy,
  getUnlockedTrainingModes,
  TrainingModeConfig,
  TrainingState,
} from '@/game/data/trainingMode';

describe('Training Mode System', () => {
  describe('TRAINING_MODES config', () => {
    it('should have at least 6 training modes', () => {
      expect(TRAINING_MODES.length).toBeGreaterThanOrEqual(6);
    });

    it('every mode should have required fields', () => {
      for (const mode of TRAINING_MODES) {
        expect(mode.id).toBeTruthy();
        expect(mode.name).toBeTruthy();
        expect(mode.description).toBeTruthy();
        expect(mode.category).toBeTruthy();
        expect(mode.difficulty).toBeTruthy();
        expect(mode.duration).toBeGreaterThan(0);
        expect(mode.objectives.length).toBeGreaterThan(0);
        expect(mode.rewards.length).toBeGreaterThan(0);
      }
    });

    it('should have modes across all categories', () => {
      const categories = new Set(TRAINING_MODES.map(m => m.category));
      expect(categories.size).toBeGreaterThanOrEqual(4);
    });

    it('should have modes across all difficulties', () => {
      const difficulties = new Set(TRAINING_MODES.map(m => m.difficulty));
      expect(difficulties.size).toBe(3);
    });
  });

  describe('getTrainingMode', () => {
    it('should return mode by id', () => {
      const mode = getTrainingMode('angle_basics');
      expect(mode).toBeDefined();
      expect(mode?.category).toBe('angle');
    });

    it('should return undefined for unknown id', () => {
      expect(getTrainingMode('nonexistent')).toBeUndefined();
    });
  });

  describe('getTrainingModesByCategory', () => {
    it('should filter by category', () => {
      const angleModes = getTrainingModesByCategory('angle');
      expect(angleModes.length).toBeGreaterThan(0);
      for (const mode of angleModes) {
        expect(mode.category).toBe('angle');
      }
    });
  });

  describe('getTrainingModesByDifficulty', () => {
    it('should filter by difficulty', () => {
      const beginnerModes = getTrainingModesByDifficulty('beginner');
      expect(beginnerModes.length).toBeGreaterThan(0);
      for (const mode of beginnerModes) {
        expect(mode.difficulty).toBe('beginner');
      }
    });
  });

  describe('isTrainingCompleted', () => {
    it('should return true for completed mode', () => {
      const state: TrainingState = {
        completedModes: ['angle_basics', 'power_control'],
        currentMode: null,
        isActive: false,
        startedAt: null,
        tutorialProgress: {},
        stats: { totalSessions: 0, totalTime: 0, totalShots: 0, averageAccuracy: 0, bestAccuracy: 0, totalDamage: 0 },
      };
      expect(isTrainingCompleted(state, 'angle_basics')).toBe(true);
    });

    it('should return false for incomplete mode', () => {
      const state: TrainingState = {
        completedModes: [],
        currentMode: null,
        isActive: false,
        startedAt: null,
        tutorialProgress: {},
        stats: { totalSessions: 0, totalTime: 0, totalShots: 0, averageAccuracy: 0, bestAccuracy: 0, totalDamage: 0 },
      };
      expect(isTrainingCompleted(state, 'angle_basics')).toBe(false);
    });
  });

  describe('calculateTrainingAccuracy', () => {
    it('should calculate accuracy correctly', () => {
      expect(calculateTrainingAccuracy(8, 10)).toBe(80);
      expect(calculateTrainingAccuracy(0, 10)).toBe(0);
      expect(calculateTrainingAccuracy(10, 10)).toBe(100);
    });

    it('should return 0 for 0 shots', () => {
      expect(calculateTrainingAccuracy(0, 0)).toBe(0);
    });
  });

  describe('getUnlockedTrainingModes', () => {
    const state: TrainingState = {
      completedModes: [],
      currentMode: null,
      isActive: false,
      startedAt: null,
      tutorialProgress: {},
      stats: { totalSessions: 0, totalTime: 0, totalShots: 0, averageAccuracy: 0, bestAccuracy: 0, totalDamage: 0 },
    };

    it('should return all modes when level is high enough', () => {
      const unlocked = getUnlockedTrainingModes(state, 30);
      expect(unlocked.length).toBe(TRAINING_MODES.length);
    });

    it('should return fewer modes at low level', () => {
      const unlocked = getUnlockedTrainingModes(state, 1);
      expect(unlocked.length).toBeLessThanOrEqual(TRAINING_MODES.length);
    });

    it('should include modes without requirements', () => {
      const unlocked = getUnlockedTrainingModes(state, 1);
      const noReq = TRAINING_MODES.filter(m => !m.unlockRequirement);
      expect(unlocked.length).toBeGreaterThanOrEqual(noReq.length);
    });
  });
});
