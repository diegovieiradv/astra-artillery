import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import {
  grantReward,
  grantRewards,
  createGrantContext,
  Reward,
  RewardType,
  GrantContext,
  REWARD_TYPE_LABELS,
} from '@/game/data/rewards';
import { calculateLevelFromXp } from '@/game/data/playerLevels';
import { calculateMasteryLevelFromXp } from '@/game/data/characterMastery';

describe('RewardDispatcher', () => {
  let mockState: any;
  let mockGetState: Mock;
  let mockSetState: Mock;
  let context: GrantContext;

  beforeEach(() => {
    mockState = {
      currency: 1000,
      playerXp: 500,
      playerLevel: 3,
      characterMastery: {
        kai: { xp: 1000, level: 5 },
        luna: { xp: 500, level: 3 },
      },
      ownedCosmetics: ['frame_bronze', 'trail_silver'],
      ownedTitles: ['title_novice'],
      ownedBadges: ['badge_first_blast'],
      unlockedLore: ['lore_green_core'],
      unlockedCharacters: ['kai', 'luna'],
    };

    mockGetState = vi.fn(() => mockState);
    mockSetState = vi.fn((partial) => {
      mockState = { ...mockState, ...partial };
    });

    context = createGrantContext(mockGetState, mockSetState);
    context.calculateLevelFromXp = calculateLevelFromXp;
    context.calculateMasteryLevelFromXp = calculateMasteryLevelFromXp;
  });

  describe('currency rewards', () => {
    it('should add currency to player', () => {
      const reward: Reward = { type: 'currency', id: 'coins', quantity: 500 };
      grantReward(reward, context);
      
      expect(mockState.currency).toBe(1500);
      expect(mockSetState).toHaveBeenCalledWith({ currency: 1500 });
    });

    it('should handle missing quantity', () => {
      const reward: Reward = { type: 'currency', id: 'coins' };
      grantReward(reward, context);
      
      expect(mockState.currency).toBe(1000);
    });
  });

  describe('xp rewards', () => {
    it('should add XP and level up player', () => {
      const reward: Reward = { type: 'xp', id: 'player_xp', quantity: 1000 };
      grantReward(reward, context);
      
      expect(mockState.playerXp).toBe(1500);
      expect(mockState.playerLevel).toBe(6); // Level 6 requires 1400 XP
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        playerXp: 1500,
        playerLevel: 6,
      }));
    });

    it('should handle missing quantity', () => {
      const reward: Reward = { type: 'xp', id: 'player_xp' };
      grantReward(reward, context);
      
      expect(mockState.playerXp).toBe(500);
    });
  });

describe('character_xp rewards', () => {
    it('should add mastery XP and level up character', () => {
      const reward: Reward = { type: 'character_xp', id: 'kai_xp', quantity: 2000, characterId: 'kai' };
      grantReward(reward, context);
      
      expect(mockState.characterMastery.kai.xp).toBe(3000);
      expect(mockState.characterMastery.kai.level).toBe(6); // Level 6 requires 2800 XP
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        characterMastery: expect.objectContaining({
          kai: expect.objectContaining({ xp: 3000, level: 6 }),
        }),
      }));
    });

    it('should use selectedCharacterId when characterId not provided', () => {
      mockState.selectedCharacterId = 'luna';
      const reward: Reward = { type: 'character_xp', id: 'luna_xp', quantity: 1000 };
      grantReward(reward, context);
      
      expect(mockState.characterMastery.luna.xp).toBe(1500);
      expect(mockState.characterMastery.luna.level).toBe(4); // Level 4 requires 1000 XP
    });
  });

  describe('cosmetic rewards', () => {
    it('should add cosmetic to owned list', () => {
      const reward: Reward = { type: 'cosmetic', id: 'frame_gold' };
      grantReward(reward, context);
      
      expect(mockState.ownedCosmetics).toContain('frame_gold');
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
        ownedCosmetics: expect.arrayContaining(['frame_bronze', 'trail_silver', 'frame_gold']),
      }));
    });

    it('should not duplicate cosmetics', () => {
      const reward: Reward = { type: 'cosmetic', id: 'frame_bronze' }; // Already owned
      grantReward(reward, context);
      
      expect(mockState.ownedCosmetics.filter((c: string) => c === 'frame_bronze')).toHaveLength(1);
    });

    it('should handle skin type', () => {
      const reward: Reward = { type: 'skin', id: 'skin_kai_master' };
      grantReward(reward, context);
      
      expect(mockState.ownedCosmetics).toContain('skin_kai_master');
    });

    it('should handle frame type', () => {
      const reward: Reward = { type: 'frame', id: 'frame_astra' };
      grantReward(reward, context);
      
      expect(mockState.ownedCosmetics).toContain('frame_astra');
    });

    it('should handle trail type', () => {
      const reward: Reward = { type: 'trail', id: 'trail_astra' };
      grantReward(reward, context);
      
      expect(mockState.ownedCosmetics).toContain('trail_astra');
    });

    it('should handle animation type', () => {
      const reward: Reward = { type: 'animation', id: 'anim_kai_ultimate' };
      grantReward(reward, context);
      
      expect(mockState.ownedCosmetics).toContain('anim_kai_ultimate');
    });

    it('should handle banner type', () => {
      const reward: Reward = { type: 'banner', id: 'banner_grandmaster' };
      grantReward(reward, context);
      
      expect(mockState.ownedCosmetics).toContain('banner_grandmaster');
    });

    it('should handle portrait type', () => {
      const reward: Reward = { type: 'portrait', id: 'portrait_kai_legend' };
      grantReward(reward, context);
      
      expect(mockState.ownedCosmetics).toContain('portrait_kai_legend');
    });
  });

  describe('title rewards', () => {
    it('should add title to ownedTitles', () => {
      const reward: Reward = { type: 'title', id: 'title_master' };
      grantReward(reward, context);
      
      expect(mockState.ownedTitles).toContain('title_master');
    });

    it('should not duplicate titles', () => {
      const reward: Reward = { type: 'title', id: 'title_novice' }; // Already owned
      grantReward(reward, context);
      
      expect(mockState.ownedTitles.filter((t: string) => t === 'title_novice')).toHaveLength(1);
    });

    it('should initialize ownedTitles if missing', () => {
      // Create a fresh mock state without ownedTitles
      const stateWithoutTitles: any = {
        currency: 1000,
        playerXp: 500,
        playerLevel: 3,
        characterMastery: {
          kai: { xp: 1000, level: 5 },
          luna: { xp: 500, level: 3 },
        },
        ownedCosmetics: ['frame_bronze', 'trail_silver'],
        ownedBadges: ['badge_first_blast'],
        unlockedLore: ['lore_green_core'],
        unlockedCharacters: ['kai', 'luna'],
      };
      
      const getState = vi.fn(() => stateWithoutTitles);
      const setState = vi.fn((partial) => {
        Object.assign(stateWithoutTitles, partial);
      });
      
      const ctx = createGrantContext(getState, setState);
      ctx.calculateLevelFromXp = calculateLevelFromXp;
      ctx.calculateMasteryLevelFromXp = calculateMasteryLevelFromXp;
      
      const reward: Reward = { type: 'title', id: 'title_new' };
      grantReward(reward, ctx);
      
      expect(stateWithoutTitles.ownedTitles).toContain('title_new');
    });
  });

  describe('badge rewards', () => {
    it('should add badge to ownedBadges', () => {
      const reward: Reward = { type: 'badge', id: 'badge_new' };
      grantReward(reward, context);
      
      expect(mockState.ownedBadges).toContain('badge_new');
    });

    it('should not duplicate badges', () => {
      const reward: Reward = { type: 'badge', id: 'badge_first_blast' }; // Already owned
      grantReward(reward, context);
      
      expect(mockState.ownedBadges.filter((b: string) => b === 'badge_first_blast')).toHaveLength(1);
    });
  });

  describe('lore rewards', () => {
    it('should add lore to unlockedLore', () => {
      const reward: Reward = { type: 'lore', id: 'lore_new' };
      grantReward(reward, context);
      
      expect(mockState.unlockedLore).toContain('lore_new');
    });

    it('should not duplicate lore', () => {
      const reward: Reward = { type: 'lore', id: 'lore_green_core' }; // Already owned
      grantReward(reward, context);
      
      expect(mockState.unlockedLore.filter((l: string) => l === 'lore_green_core')).toHaveLength(1);
    });
  });

  describe('grantRewards', () => {
    it('should grant multiple rewards in sequence', () => {
      const rewards: Reward[] = [
        { type: 'currency', id: 'coins', quantity: 100 },
        { type: 'xp', id: 'player_xp', quantity: 200 },
        { type: 'cosmetic', id: 'skin_new' },
        { type: 'title', id: 'title_test' },
      ];
      
      grantRewards(rewards, context);
      
      expect(mockState.currency).toBe(1100);
      expect(mockState.playerXp).toBe(700);
      expect(mockState.ownedCosmetics).toContain('skin_new');
      expect(mockState.ownedTitles).toContain('title_test');
    });
  });

  describe('REWARD_TYPE_LABELS', () => {
    it('should have labels for all reward types', () => {
      const types: RewardType[] = [
        'currency', 'xp', 'character_xp', 'cosmetic', 'skin', 
        'title', 'badge', 'lore', 'frame', 'trail', 
        'animation', 'banner', 'portrait'
      ];
      
      for (const type of types) {
        expect(typeof REWARD_TYPE_LABELS[type]).toBe('string');
        expect(REWARD_TYPE_LABELS[type].length).toBeGreaterThan(0);
      }
    });
  });

  describe('createGrantContext', () => {
    it('should create context with getState and setState', () => {
      const getState = vi.fn(() => ({ test: 1 }));
      const setState = vi.fn();
      
      const ctx = createGrantContext(getState, setState);
      
      expect(ctx.getState()).toEqual({ test: 1 });
      ctx.setState({ test: 2 });
      expect(setState).toHaveBeenCalledWith({ test: 2 });
    });
  });
});