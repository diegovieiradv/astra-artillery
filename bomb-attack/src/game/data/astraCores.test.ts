import { describe, it, expect } from 'vitest';
import {
  ASTRA_CORES,
  getAstraCore,
  getAllAstraCores,
  getAstraCoresByRegion,
  CORE_REGION_ORDER,
  DEFAULT_ASTRA_CORE_STATE,
  createDefaultAstraCoreState,
  AstraCoreId,
  AstraCoreConfig,
} from '@/game/data/astraCores';

describe('Astra Core System', () => {
  describe('ASTRA_CORES config', () => {
    it('should have 6 cores', () => {
      const cores = getAllAstraCores();
      expect(cores.length).toBe(6);
      expect(CORE_REGION_ORDER.length).toBe(6);
    });

    it('should have unique IDs for each core', () => {
      const cores = getAllAstraCores();
      const ids = cores.map(c => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should have all 6 expected core IDs', () => {
      const expectedIds: AstraCoreId[] = [
        'green_core',
        'desert_core',
        'frost_core',
        'ember_core',
        'sky_core',
        'final_core',
      ];
      const cores = getAllAstraCores();
      const ids = cores.map(c => c.id).sort();
      expect(ids).toEqual(expectedIds.sort());
    });

    it('should have unique region associations', () => {
      const cores = getAllAstraCores();
      const regions = cores.map(c => c.regionId);
      expect(new Set(regions).size).toBe(regions.length);
    });

    it('should have all 6 regions covered', () => {
      const cores = getAllAstraCores();
      const regions = cores.map(c => c.regionId).sort();
      expect(regions).toEqual([
        'crystal_desert',
        'dark_citadel',
        'ember_lands',
        'frozen_peaks',
        'green_valley',
        'sky_kingdom',
      ].sort());
    });

    it('should have abilities with correct types', () => {
      const cores = getAllAstraCores();
      const abilityTypes = cores.map(c => c.ability.type).sort();
      expect(abilityTypes).toEqual([
        'explosion_boost',
        'freeze_enemy',
        'heal',
        'precision_boost',
        'reality_shift',
        'wind_control',
      ].sort());
    });

    it('should have cooldowns defined', () => {
      const cores = getAllAstraCores();
      for (const core of cores) {
        expect(core.ability.cooldown).toBeGreaterThan(0);
        expect(core.ability.maxCharges).toBeGreaterThan(0);
      }
    });

    it('should have effect definitions for each ability', () => {
      const cores = getAllAstraCores();
      for (const core of cores) {
        expect(core.ability.effect).toBeDefined();
        expect(Object.keys(core.ability.effect).length).toBeGreaterThan(0);
      }
    });

    it('should have lore for each core', () => {
      const cores = getAllAstraCores();
      for (const core of cores) {
        expect(core.lore).toBeTruthy();
        expect(core.lore.length).toBeGreaterThan(10);
      }
    });
  });

  describe('getAstraCore', () => {
    it('should return core for valid ID', () => {
      const core = getAstraCore('green_core');
      expect(core).toBeDefined();
      expect(core?.id).toBe('green_core');
    });

    it('should return undefined for invalid ID', () => {
      expect(getAstraCore('invalid_core' as AstraCoreId)).toBeUndefined();
    });
  });

  describe('getAstraCoresByRegion', () => {
    it('should return cores for valid region', () => {
      const cores = getAstraCoresByRegion('green_valley');
      expect(cores.length).toBe(1);
      expect(cores[0].id).toBe('green_core');
    });

    it('should return empty array for invalid region', () => {
      expect(getAstraCoresByRegion('invalid_region')).toEqual([]);
    });
  });

  describe('CORE_REGION_ORDER', () => {
    it('should match progression order', () => {
      expect(CORE_REGION_ORDER[0]).toBe('green_core');
      expect(CORE_REGION_ORDER[1]).toBe('desert_core');
      expect(CORE_REGION_ORDER[2]).toBe('frost_core');
      expect(CORE_REGION_ORDER[3]).toBe('ember_core');
      expect(CORE_REGION_ORDER[4]).toBe('sky_core');
      expect(CORE_REGION_ORDER[5]).toBe('final_core');
    });
  });

  describe('DEFAULT_ASTRA_CORE_STATE', () => {
    it('should have all 6 cores initialized', () => {
      expect(Object.keys(DEFAULT_ASTRA_CORE_STATE)).toHaveLength(6);
    });

    it('should initialize all cores as locked', () => {
      for (const state of Object.values(DEFAULT_ASTRA_CORE_STATE)) {
        expect(state.unlocked).toBe(false);
      }
    });

    it('should initialize with correct max charges', () => {
      expect(DEFAULT_ASTRA_CORE_STATE.green_core.currentCharges).toBe(2);
      expect(DEFAULT_ASTRA_CORE_STATE.desert_core.currentCharges).toBe(1);
      expect(DEFAULT_ASTRA_CORE_STATE.frost_core.currentCharges).toBe(1);
      expect(DEFAULT_ASTRA_CORE_STATE.ember_core.currentCharges).toBe(1);
      expect(DEFAULT_ASTRA_CORE_STATE.sky_core.currentCharges).toBe(2);
      expect(DEFAULT_ASTRA_CORE_STATE.final_core.currentCharges).toBe(1);
    });

    it('should initialize cooldown to 0', () => {
      for (const state of Object.values(DEFAULT_ASTRA_CORE_STATE)) {
        expect(state.cooldownRemaining).toBe(0);
      }
    });
  });

  describe('createDefaultAstraCoreState', () => {
    it('should create independent state object', () => {
      const state1 = createDefaultAstraCoreState();
      const state2 = createDefaultAstraCoreState();
      
      expect(state1).not.toBe(state2);
      // The spread creates shallow copies, so nested objects are new but have same values
      expect(state1.green_core).toEqual(state2.green_core);
      // Mutating one should not affect the other
      state1.green_core.unlocked = true;
      expect(state2.green_core.unlocked).toBe(false);
    });

    it('should have same values as DEFAULT_ASTRA_CORE_STATE', () => {
      const state = createDefaultAstraCoreState();
      for (const id of Object.keys(DEFAULT_ASTRA_CORE_STATE) as AstraCoreId[]) {
        expect(state[id]).toEqual(DEFAULT_ASTRA_CORE_STATE[id]);
      }
    });
  });

  describe('Core Ability Validation', () => {
    it('green_core should have heal ability', () => {
      const core = getAstraCore('green_core');
      expect(core?.ability.type).toBe('heal');
      expect(core?.ability.effect.healAmount).toBe(0.3);
      expect(core?.ability.cooldown).toBe(4);
      expect(core?.ability.maxCharges).toBe(2);
    });

    it('desert_core should have precision boost ability', () => {
      const core = getAstraCore('desert_core');
      expect(core?.ability.type).toBe('precision_boost');
      expect(core?.ability.effect.precisionBonus).toBe(1.0);
      expect(core?.ability.cooldown).toBe(3);
      expect(core?.ability.maxCharges).toBe(1);
    });

    it('frost_core should have freeze enemy ability', () => {
      const core = getAstraCore('frost_core');
      expect(core?.ability.type).toBe('freeze_enemy');
      expect(core?.ability.effect.freezeDuration).toBe(2);
      expect(core?.ability.cooldown).toBe(5);
      expect(core?.ability.maxCharges).toBe(1);
    });

    it('ember_core should have explosion boost ability', () => {
      const core = getAstraCore('ember_core');
      expect(core?.ability.type).toBe('explosion_boost');
      expect(core?.ability.effect.damageMultiplier).toBe(2.0);
      expect(core?.ability.effect.blastRadiusMultiplier).toBe(1.5);
      expect(core?.ability.cooldown).toBe(6);
      expect(core?.ability.maxCharges).toBe(1);
    });

    it('sky_core should have wind control ability', () => {
      const core = getAstraCore('sky_core');
      expect(core?.ability.type).toBe('wind_control');
      expect(core?.ability.effect.windOverride).toBe(5);
      expect(core?.ability.cooldown).toBe(4);
      expect(core?.ability.maxCharges).toBe(2);
    });

    it('final_core should have reality shift ability', () => {
      const core = getAstraCore('final_core');
      expect(core?.ability.type).toBe('reality_shift');
      expect(core?.ability.effect.realityEffect).toBe('random_supreme');
      expect(core?.ability.cooldown).toBe(8);
      expect(core?.ability.maxCharges).toBe(1);
    });
  });

  describe('No Power Creep Validation', () => {
    it('should have cooldowns preventing spam', () => {
      const cores = getAllAstraCores();
      for (const core of cores) {
        expect(core.ability.cooldown).toBeGreaterThanOrEqual(3);
      }
    });

    it('should have limited charges', () => {
      const cores = getAllAstraCores();
      for (const core of cores) {
        expect(core.ability.maxCharges).toBeLessThanOrEqual(2);
      }
    });

    it('should have conditional/temporary effects only', () => {
      const cores = getAllAstraCores();
      for (const core of cores) {
        const effect = core.ability.effect;
        // Check only properties that exist on this specific core
        if (effect.healAmount !== undefined) {
          expect(effect.healAmount).toBeLessThanOrEqual(1);
        }
        if (effect.precisionBonus !== undefined) {
          expect(effect.precisionBonus).toBeLessThanOrEqual(1);
        }
        if (effect.damageMultiplier !== undefined) {
          expect(effect.damageMultiplier).toBeLessThanOrEqual(3);
        }
        if (effect.blastRadiusMultiplier !== undefined) {
          expect(effect.blastRadiusMultiplier).toBeLessThanOrEqual(2);
        }
        if (effect.freezeDuration !== undefined) {
          expect(effect.freezeDuration).toBeLessThanOrEqual(3);
        }
        if (effect.windOverride !== undefined) {
          expect(effect.windOverride).toBeLessThanOrEqual(10);
        }
      }
    });
  });
});