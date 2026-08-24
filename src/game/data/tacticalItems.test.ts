import { describe, it, expect } from 'vitest';
import {
  TACTICAL_ITEMS,
  getTacticalItem,
  getTacticalItemsByType,
  getTacticalItemsByRarity,
  calculateTotalCharges,
  isItemOnCooldown,
  canUseItem,
  TacticalItemConfig,
  TacticalItemState,
  TacticalInventoryState,
} from '@/game/data/tacticalItems';

describe('Tactical Items System', () => {
  describe('TACTICAL_ITEMS config', () => {
    it('should have at least 5 items', () => {
      expect(TACTICAL_ITEMS.length).toBeGreaterThanOrEqual(5);
    });

    it('every item should have required fields', () => {
      for (const item of TACTICAL_ITEMS) {
        expect(item.id).toBeTruthy();
        expect(item.name).toBeTruthy();
        expect(item.description).toBeTruthy();
        expect(item.type).toBeTruthy();
        expect(item.rarity).toBeTruthy();
        expect(item.cost).toBeGreaterThan(0);
        expect(item.maxCharges).toBeGreaterThan(0);
        expect(item.effects.length).toBeGreaterThan(0);
      }
    });

    it('should have items across different rarities', () => {
      const rarities = new Set(TACTICAL_ITEMS.map(i => i.rarity));
      expect(rarities.size).toBeGreaterThan(1);
    });
  });

  describe('getTacticalItem', () => {
    it('should return item by id', () => {
      const item = getTacticalItem('health_potion');
      expect(item).toBeDefined();
      expect(item?.name).toBeTruthy();
    });

    it('should return undefined for unknown id', () => {
      expect(getTacticalItem('nonexistent')).toBeUndefined();
    });
  });

  describe('getTacticalItemsByType', () => {
    it('should filter by type', () => {
      const consumables = getTacticalItemsByType('consumable');
      expect(consumables.length).toBeGreaterThan(0);
      for (const item of consumables) {
        expect(item.type).toBe('consumable');
      }
    });
  });

  describe('getTacticalItemsByRarity', () => {
    it('should filter by rarity', () => {
      const commons = getTacticalItemsByRarity('common');
      expect(commons.length).toBeGreaterThan(0);
      for (const item of commons) {
        expect(item.rarity).toBe('common');
      }
    });
  });

  describe('calculateTotalCharges', () => {
    it('should sum all charges', () => {
      const state: TacticalInventoryState = {
        items: {
          health_potion: { currentCharges: 3, lastUsed: 0, unlocked: true, totalUses: 5 },
          shield: { currentCharges: 1, lastUsed: 0, unlocked: true, totalUses: 2 },
        },
        equippedItem: null,
        totalItemsUsed: 7,
      };
      expect(calculateTotalCharges(state)).toBe(4);
    });

    it('should return 0 for empty inventory', () => {
      const state: TacticalInventoryState = { items: {}, equippedItem: null, totalItemsUsed: 0 };
      expect(calculateTotalCharges(state)).toBe(0);
    });
  });

  describe('canUseItem', () => {
    const item: TacticalItemConfig = {
      id: 'test',
      name: 'Test',
      description: 'Test item',
      type: 'consumable',
      rarity: 'common',
      cost: 100,
      icon: '🧪',
      effects: [{ type: 'heal', value: 0.3, target: 'self' }],
      cooldown: 0,
      maxCharges: 3,
    };

    it('should allow use when unlocked and has charges', () => {
      const state: TacticalItemState = { currentCharges: 2, lastUsed: 0, unlocked: true, totalUses: 0 };
      expect(canUseItem(item, state)).toBe(true);
    });

    it('should deny use when locked', () => {
      const state: TacticalItemState = { currentCharges: 2, lastUsed: 0, unlocked: false, totalUses: 0 };
      expect(canUseItem(item, state)).toBe(false);
    });

    it('should deny use when no charges', () => {
      const state: TacticalItemState = { currentCharges: 0, lastUsed: 0, unlocked: true, totalUses: 0 };
      expect(canUseItem(item, state)).toBe(false);
    });
  });
});
