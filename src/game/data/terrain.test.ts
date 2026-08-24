import { describe, it, expect } from 'vitest';
import {
  TERRAIN_ABILITIES,
  getTerrainAbility,
  getAllTerrainAbilities,
  TerrainAbilityConfig,
  CraterConfig,
  FallZone,
  TerrainState,
} from '@/game/data/terrain';

describe('Terrain System', () => {
  describe('TERRAIN_ABILITIES config', () => {
    it('should have terrain abilities defined', () => {
      expect(TERRAIN_ABILITIES.length).toBeGreaterThan(0);
    });

    it('every ability should have required fields', () => {
      for (const ability of TERRAIN_ABILITIES) {
        expect(ability.id).toBeTruthy();
        expect(ability.name).toBeTruthy();
        expect(ability.description).toBeTruthy();
        expect(ability.effect).toBeTruthy();
        expect(ability.effectParams).toBeDefined();
      }
    });

    it('should have crater abilities', () => {
      const craters = TERRAIN_ABILITIES.filter(a => a.effect === 'create_crater');
      expect(craters.length).toBeGreaterThan(0);
    });

    it('should have fall zone ability', () => {
      const fallZones = TERRAIN_ABILITIES.filter(a => a.effect === 'create_fall_zone');
      expect(fallZones.length).toBeGreaterThan(0);
    });
  });

  describe('getTerrainAbility', () => {
    it('should return ability by id', () => {
      const ability = getTerrainAbility('crater_small');
      expect(ability).toBeDefined();
      expect(ability?.name).toBeTruthy();
    });

    it('should return undefined for unknown id', () => {
      expect(getTerrainAbility('nonexistent')).toBeUndefined();
    });
  });

  describe('getAllTerrainAbilities', () => {
    it('should return copy of all abilities', () => {
      const all = getAllTerrainAbilities();
      expect(all.length).toBe(TERRAIN_ABILITIES.length);
    });
  });

  describe('TerrainState', () => {
    it('should create valid default state', () => {
      const state: TerrainState = {
        craters: {},
        fallZones: {},
        totalImpacts: 0,
        permanentCraters: 0,
      };
      expect(state.totalImpacts).toBe(0);
      expect(Object.keys(state.craters).length).toBe(0);
    });

    it('should support crater data', () => {
      const crater: CraterConfig = {
        id: 'crater-1',
        radius: 50,
        depth: 20,
        createdAt: Date.now(),
        durability: 100,
        maxImpacts: 3,
        image: 'crater_small',
        color: '#4a3728',
        permanent: false,
      };
      const state: TerrainState = {
        craters: { 'crater-1': crater },
        fallZones: {},
        totalImpacts: 1,
        permanentCraters: 0,
      };
      expect(state.craters['crater-1'].radius).toBe(50);
    });

    it('should support fall zone data', () => {
      const zone: FallZone = {
        id: 'zone-1',
        x: 100,
        y: 200,
        radius: 40,
        dangerous: true,
        turnCreated: 1,
        expiresAt: 4,
      };
      const state: TerrainState = {
        craters: {},
        fallZones: { 'zone-1': zone },
        totalImpacts: 0,
        permanentCraters: 0,
      };
      expect(state.fallZones['zone-1'].dangerous).toBe(true);
    });
  });
});
