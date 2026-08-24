import { describe, it, expect } from 'vitest';
import {
  PROJECTILE_TYPES,
  getProjectileType,
  getAllProjectileTypes,
  getDefaultProjectileType,
  getAvailableProjectileTypes,
  getProjectilePhysicsConfig,
  isProjectileUnlocked,
  ProjectileTypeId,
} from '@/game/data/projectiles';

describe('Projectile System', () => {
  describe('PROJECTILE_TYPES config', () => {
    it('should have 10 projectile types', () => {
      const all = getAllProjectileTypes();
      expect(all.length).toBe(10);
    });

    it('should have normal as default', () => {
      const def = getDefaultProjectileType();
      expect(def.id).toBe('normal');
      expect(def.isDefault).toBe(true);
    });

    it('every projectile should have required fields', () => {
      const all = getAllProjectileTypes();
      for (const p of all) {
        expect(p.id).toBeTruthy();
        expect(p.name).toBeTruthy();
        expect(p.description).toBeTruthy();
        expect(p.behavior).toBeTruthy();
        expect(p.physics).toBeDefined();
        expect(p.visual).toBeDefined();
        expect(p.audio).toBeDefined();
      }
    });
  });

  describe('getProjectileType', () => {
    it('should return correct projectile by id', () => {
      const heavy = getProjectileType('heavy_bomb');
      expect(heavy.id).toBe('heavy_bomb');
      expect(heavy.behavior).toBe('heavy');
      expect(heavy.physics.damageMultiplier).toBeGreaterThan(1);
    });

    it('should have unique physics for each type', () => {
      const ids = Object.keys(PROJECTILE_TYPES) as ProjectileTypeId[];
      const damages = ids.map(id => getProjectileType(id).physics.damageMultiplier);
      const unique = new Set(damages);
      expect(unique.size).toBeGreaterThan(1);
    });
  });

  describe('getAvailableProjectileTypes', () => {
    it('should always include default projectile', () => {
      const available = getAvailableProjectileTypes([]);
      expect(available.some(p => p.isDefault)).toBe(true);
    });

    it('should include unlocked projectiles', () => {
      const available = getAvailableProjectileTypes(['heavy_bomb', 'fire_shot']);
      expect(available.some(p => p.id === 'heavy_bomb')).toBe(true);
      expect(available.some(p => p.id === 'fire_shot')).toBe(true);
    });

    it('should not include locked projectiles', () => {
      const available = getAvailableProjectileTypes(['heavy_bomb']);
      expect(available.some(p => p.id === 'cluster_shot')).toBe(false);
    });
  });

  describe('isProjectileUnlocked', () => {
    it('should always return true for default projectile', () => {
      expect(isProjectileUnlocked('normal', [])).toBe(true);
    });

    it('should return true for unlocked projectile', () => {
      expect(isProjectileUnlocked('heavy_bomb', ['heavy_bomb'])).toBe(true);
    });

    it('should return false for locked projectile', () => {
      expect(isProjectileUnlocked('heavy_bomb', [])).toBe(false);
    });
  });

  describe('getProjectilePhysicsConfig', () => {
    it('should return normal physics for unknown id', () => {
      const physics = getProjectilePhysicsConfig('unknown' as ProjectileTypeId);
      expect(physics).toEqual(getProjectileType('normal').physics);
    });

    it('should return correct physics for valid id', () => {
      const physics = getProjectilePhysicsConfig('piercing_shot');
      expect(physics.windModifier).toBeLessThan(1);
      expect(physics.speedModifier).toBeGreaterThan(1);
    });
  });
});
