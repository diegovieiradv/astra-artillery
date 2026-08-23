import { describe, it, expect, vi } from 'vitest';
import { calculateTrajectory, calculateDamage, generateInitialWind, calculateWindChange } from '@/game/physics/Ballistics';
import { DEFAULT_BATTLE_CONFIG } from '@/types/battle';

describe('Ballistics Physics', () => {
  const mockParams = {
    angle: 45,
    power: 50,
    wind: 0,
    gravity: 980,
    startX: 100,
    startY: 900,
  };

  describe('calculateTrajectory', () => {
    it('returns array of trajectory points', () => {
      const trajectory = calculateTrajectory(mockParams);
      expect(Array.isArray(trajectory)).toBe(true);
      expect(trajectory.length).toBeGreaterThan(0);
    });

    it('each point has required properties', () => {
      const trajectory = calculateTrajectory(mockParams);
      trajectory.forEach(point => {
        expect(point).toHaveProperty('x');
        expect(point).toHaveProperty('y');
        expect(point).toHaveProperty('vx');
        expect(point).toHaveProperty('vy');
        expect(point).toHaveProperty('t');
        expect(typeof point.x).toBe('number');
        expect(typeof point.y).toBe('number');
      });
    });

    it('starts at initial position', () => {
      const trajectory = calculateTrajectory(mockParams);
      expect(trajectory[0].x).toBeCloseTo(mockParams.startX, 1);
      expect(trajectory[0].y).toBeCloseTo(mockParams.startY, 1);
    });

    it('applies gravity (y increases over time)', () => {
      const trajectory = calculateTrajectory({ ...mockParams, angle: 90 });
      expect(trajectory[trajectory.length - 1].y).toBeGreaterThan(trajectory[0].y);
    });

    it('wind affects horizontal velocity', () => {
      const noWind = calculateTrajectory({ ...mockParams, wind: 0 });
      const withWind = calculateTrajectory({ ...mockParams, wind: 5 });
      const lastNoWind = noWind[noWind.length - 1];
      const lastWithWind = withWind[withWind.length - 1];
      expect(lastWithWind.x).toBeGreaterThan(lastNoWind.x);
    });

    it('higher power reaches further', () => {
      const lowPower = calculateTrajectory({ ...mockParams, power: 30 });
      const highPower = calculateTrajectory({ ...mockParams, power: 80 });
      expect(highPower[highPower.length - 1].x).toBeGreaterThan(lowPower[lowPower.length - 1].x);
    });
  });

  describe('calculateDamage', () => {
    it('returns 0 when outside explosion radius', () => {
      const damage = calculateDamage(200, 100, 50, 1.0, 1.0);
      expect(damage).toBe(0);
    });

    it('returns max damage at center', () => {
      const damage = calculateDamage(0, 100, 50, 1.0, 1.0);
      expect(damage).toBeGreaterThan(0);
    });

    it('damage decreases with distance', () => {
      const centerDamage = calculateDamage(0, 100, 50, 1.0, 1.0);
      const edgeDamage = calculateDamage(90, 100, 50, 1.0, 1.0);
      expect(edgeDamage).toBeLessThan(centerDamage);
    });

    it('higher attack increases damage', () => {
      const normalAttack = calculateDamage(50, 100, 50, 1.0, 1.0);
      const highAttack = calculateDamage(50, 100, 50, 1.5, 1.0);
      expect(highAttack).toBeGreaterThan(normalAttack);
    });

    it('higher defense reduces damage', () => {
      const normalDefense = calculateDamage(50, 100, 50, 1.0, 10.0);
      const highDefense = calculateDamage(50, 100, 50, 1.0, 50.0);
      expect(highDefense).toBeLessThan(normalDefense);
    });

    it('minimum damage is 1 when in range', () => {
      const damage = calculateDamage(99, 100, 50, 0.1, 10.0);
      expect(damage).toBeGreaterThanOrEqual(1);
    });
  });

  describe('generateInitialWind', () => {
    it('generates wind within configured range', () => {
      for (let i = 0; i < 100; i++) {
        const wind = generateInitialWind(DEFAULT_BATTLE_CONFIG);
        expect(wind).toBeGreaterThanOrEqual(DEFAULT_BATTLE_CONFIG.windRange.min * 0.5);
        expect(wind).toBeLessThanOrEqual(DEFAULT_BATTLE_CONFIG.windRange.max * 0.5);
      }
    });
  });

  describe('calculateWindChange', () => {
    it('keeps wind within bounds', () => {
      for (let i = 0; i < 100; i++) {
        const newWind = calculateWindChange(0, DEFAULT_BATTLE_CONFIG);
        expect(newWind).toBeGreaterThanOrEqual(DEFAULT_BATTLE_CONFIG.windRange.min);
        expect(newWind).toBeLessThanOrEqual(DEFAULT_BATTLE_CONFIG.windRange.max);
      }
    });

    it('respects min bound', () => {
      const wind = calculateWindChange(DEFAULT_BATTLE_CONFIG.windRange.min, DEFAULT_BATTLE_CONFIG);
      expect(wind).toBeGreaterThanOrEqual(DEFAULT_BATTLE_CONFIG.windRange.min);
    });

    it('respects max bound', () => {
      const wind = calculateWindChange(DEFAULT_BATTLE_CONFIG.windRange.max, DEFAULT_BATTLE_CONFIG);
      expect(wind).toBeLessThanOrEqual(DEFAULT_BATTLE_CONFIG.windRange.max);
    });
  });
});