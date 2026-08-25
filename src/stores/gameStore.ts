import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Character } from '@/types/character';
import { LevelData } from '@/types/battle';
import { 
  migrateV1toV2, 
  saveData, 
  DEFAULT_V2_STATE, 
  SaveDataV2,
  getStoredData 
} from '@/utils/storage';
import { InventoryItem, LoadoutConfig, InventoryCategory } from '@/game/data/inventory';
import { 
  getPlayerLevelConfig, 
  calculateLevelFromXp, 
  getXpReward, 
  XpSource,
  MAX_PLAYER_LEVEL 
} from '@/game/data/playerLevels';
import { 
  CodexState, CodexCategory, CodexUnlockCondition, CodexEntry,
  CODEX_CATEGORIES, getCodexEntriesByCategory, getCategoryProgress, getTotalProgress
} from '@/game/data/codex';
import { 
  TerrainState, createDefaultTerrainState, TerrainAbilityConfig,
  TERRAIN_ABILITIES, getTerrainAbility, getAllTerrainAbilities,
  TerrainImpactResult
} from '@/game/data/terrain';
import { 
  MobileState, createDefaultMobileState
} from '@/game/data/mobileValidation';
import { 
  TacticalInventoryState, createDefaultTacticalInventory,
  getTacticalItem, canUseItem, isItemOnCooldown
} from '@/game/data/tacticalItems';
import { 
  TrainingState, createDefaultTrainingState, getTrainingMode
} from '@/game/data/trainingMode';
import { 
  PrecisionState, createDefaultPrecisionState, getPrecisionChallenge,
  calculatePrecisionScore
} from '@/game/data/precisionChallenge';
import { 
  LocalVersusState, createDefaultLocalVersusState, getLocalVersusMode,
  generateMatchId, calculateVersusWinner, PlayerConfig, VersusMatchState, VersusMatchResult
} from '@/game/data/localVersus';
import { 
  BossRushState, createDefaultBossRushState, getBossRushMode, getBossConfig,
  generateRushId, calculateBossHealth, calculateBossDamage, BossRushProgress, BossRushResult
} from '@/game/data/bossRush';
import { 
  NGPlusState, createDefaultNGPlusState, getNGPlusConfig, getNGPlusConfigs,
  getAvailableNGPlus, unlockNGPlus, calculateNGPlusDamage, calculateNGPlusHealth, calculateNGPlusReward,
  isNGPlusUnlocked as checkNGPlusUnlocked
} from '@/game/data/newGamePlus';
import { 
  RegionLoaderState, createDefaultRegionLoaderState, getRegionConfig, getRegions,
  getPreloadRecommendation, canLoadRegion
} from '@/game/data/regionLoader';
import { 
  MASTERY_LEVELS, 
  MAX_MASTERY_LEVEL, 
  calculateMasteryLevelFromXp, 
  getMasteryLevelConfig, 
  getMasteryXpProgress,
  getMasteryXpReward,
  MasteryXpSource,
  DEFAULT_MASTERY_STATE,
  createDefaultMasteryState
} from '@/game/data/characterMastery';
import { 
  MISSIONS, 
  getAvailableMissions, 
  MissionProgress,
  MissionCategory,
  MissionConfig
} from '@/game/data/missions';
import { 
  ACHIEVEMENTS, 
  getAllAchievements, 
  getAchievement,
  AchievementConfig,
  AchievementTriggerType,
  AchievementState,
  createDefaultAchievementState
} from '@/game/data/achievements';
import { 
  grantReward, 
  grantRewards, 
  createGrantContext,
  Reward,
  RewardType
} from '@/game/data/rewards';
import { 
  ASTRA_CORES, 
  getAllAstraCores, 
  AstraCoreId,
  AstraCoreState,
  DEFAULT_ASTRA_CORE_STATE,
  createDefaultAstraCoreState
} from '@/game/data/astraCores';

export interface GameState {
  selectedCharacterId: string | null;
  unlockedLevels: string[];
  completedLevels: Record<string, { stars: number; bestTurns: number; bestDamage: number }>;
  settings: {
    musicVolume: number;
    sfxVolume: number;
    musicEnabled: boolean;
    sfxEnabled: boolean;
    reduceMotion: boolean;
    showDamageNumbers: boolean;
    vibrationEnabled: boolean;
    screenShake: boolean;
    screenFlash: boolean;
    particles: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    graphicsQuality: 'low' | 'medium' | 'high' | 'auto';
  };
  tutorialCompleted: boolean;
  currentLevelId: string | null;
  totalPlayTime: number;
  
  // Economy & Progression
  currency: number;
  unlockedCharacters: string[];
  ownedCosmetics: string[];
  equippedCosmetics: Record<string, string>;
  upgrades: {
    cannon: { level: number; stats: Record<string, number> };
    armor: { level: number; stats: Record<string, number> };
    mobility: { level: number; stats: Record<string, number> };
    special: { level: number; stats: Record<string, number> };
  };
  statistics: {
    totalWins: number;
    totalLosses: number;
    totalDamageDealt: number;
    totalDamageReceived: number;
    specialsUsed: number;
    perfectWins: number;
  };
  
  // Player Progression
  playerXp: number;
  playerLevel: number;
  
  // Character Mastery
  characterMastery: Record<string, { xp: number; level: number }>;
  
  // Missions
  missions: Record<string, MissionProgress>;
  completedMissions: string[];
  
  // Achievements
  achievements: Record<string, AchievementState>;
  
  // Astra Cores
  astraCores: Record<AstraCoreId, AstraCoreState>;
  
  // Codex
  codex: CodexState;
  
  // Terrain
  terrain: TerrainState;
  
  // Mobile Validation
  mobile: MobileState;
  
  // Tactical Items
  tacticalInventory: TacticalInventoryState;
  
  // Training Mode
  training: TrainingState;
  
  // Precision Challenge
  precisionChallenge: PrecisionState;
  
  // Local Versus
  localVersus: LocalVersusState;
  
  // Boss Rush
  bossRush: BossRushState;
  
  // New Game+
  newGamePlus: NGPlusState;
  
  // Region Loader
  regionLoader: RegionLoaderState;
  
  // Inventory & Loadout
  inventory: Record<string, { state: 'locked' | 'owned' | 'equipped'; quantity: number }>;
  loadout: {
    characterId: string;
    cannonId: string | null;
    armorId: string | null;
    accessoryId: string | null;
    projectileId: string | null;
    tacticalItemId: string | null;
  };
  
  // Actions
  selectCharacter: (characterId: string) => void;
  unlockLevel: (levelId: string) => void;
  completeLevel: (levelId: string, data: { stars: number; turns: number; damage: number }) => void;
  updateSettings: (settings: Partial<GameState['settings']>) => void;
  setTutorialCompleted: (completed: boolean) => void;
  setCurrentLevel: (levelId: string | null) => void;
  addPlayTime: (ms: number) => void;
  resetProgress: () => void;
  
  // Economy actions
  earnCurrency: (amount: number) => void;
  spendCurrency: (amount: number) => boolean;
  canAfford: (amount: number) => boolean;
  
  // Character actions
  unlockCharacter: (characterId: string) => void;
  isCharacterUnlocked: (characterId: string) => boolean;
  
  // Upgrade actions
  upgradeCannon: () => boolean;
  upgradeArmor: () => boolean;
  upgradeMobility: () => boolean;
  upgradeSpecial: () => boolean;
  getUpgradeCost: (type: 'cannon' | 'armor' | 'mobility' | 'special') => number;
  getUpgradeLevel: (type: 'cannon' | 'armor' | 'mobility' | 'special') => number;
  getUpgradeStats: (type: 'cannon' | 'armor' | 'mobility' | 'special') => Record<string, number>;
  
  // Cosmetic actions
  unlockCosmetic: (cosmeticId: string) => void;
  equipCosmetic: (slot: string, cosmeticId: string) => void;
  unequipCosmetic: (slot: string) => void;
  isCosmeticUnlocked: (cosmeticId: string) => boolean;
  isCosmeticEquipped: (cosmeticId: string) => boolean;
  
  // Inventory actions
  unlockInventoryItem: (itemId: string) => void;
  equipLoadoutItem: (slot: string, itemId: string | null) => void;
  getLoadout: () => LoadoutConfig;
  setLoadout: (loadout: Partial<LoadoutConfig>) => void;
  getInventoryItem: (itemId: string) => { state: 'locked' | 'owned' | 'equipped'; quantity: number } | undefined;
  isItemOwned: (itemId: string) => boolean;
  isItemEquipped: (itemId: string) => boolean;
  getItemsByCategory: (category: InventoryCategory) => Array<{ id: string; state: 'locked' | 'owned' | 'equipped'; quantity: number }>;
  
  // Statistics actions
  recordWin: (perfect: boolean, damageDealt: number, damageReceived: number) => void;
  recordLoss: (damageDealt: number, damageReceived: number) => void;
  recordSpecialUse: () => void;
  
  // Player Progression actions
  earnXp: (amount: number, source?: XpSource) => void;
  getPlayerXp: () => number;
  getPlayerLevel: () => number;
  getXpForNextLevel: () => number;
  getXpProgress: () => { current: number; required: number; percent: number };
  checkLevelUp: () => { leveledUp: boolean; newLevel: number; rewards: any[] };
  
  // Character Mastery actions
  earnCharacterXp: (characterId: string, amount: number, source?: MasteryXpSource) => void;
  getCharacterMastery: (characterId: string) => { xp: number; level: number };
  getMasteryLevel: (characterId: string) => number;
  getMasteryXp: (characterId: string) => number;
  getMasteryXpForNextLevel: (characterId: string) => number;
  getMasteryProgress: (characterId: string) => { current: number; required: number; percent: number };
  checkMasteryLevelUp: (characterId: string) => { leveledUp: boolean; newLevel: number; rewards: any[] };
  
  // Mission actions
  getAvailableMissions: () => MissionConfig[];
  getMissionProgress: (missionId: string) => MissionProgress | undefined;
  startMission: (missionId: string) => void;
  updateMissionProgress: (missionId: string, progress: Record<string, number>) => void;
  completeMission: (missionId: string) => void;
  claimMissionReward: (missionId: string) => void;
  getCompletedMissions: () => string[];
  
  // Achievement actions
  checkAchievements: (triggerType: AchievementTriggerType, data?: Record<string, any>) => void;
  unlockAchievement: (achievementId: string) => void;
  getAchievementProgress: (achievementId: string) => AchievementState | undefined;
  getUnlockedAchievements: () => string[];
  getAchievementPoints: () => number;
  
  // Astra Core actions
  unlockAstraCore: (coreId: AstraCoreId) => void;
  useAstraCoreAbility: (coreId: AstraCoreId) => { success: boolean; effect?: any; reason?: string };
  getAstraCoreStatus: (coreId: AstraCoreId) => AstraCoreState | undefined;
  getUnlockedAstraCores: () => AstraCoreId[];
  resetAstraCoreCooldowns: () => void;
  
  // Migration
  migrateIfNeeded: () => void;
}

const DEFAULT_SETTINGS = {
  musicVolume: 0.5,
  sfxVolume: 0.7,
  musicEnabled: true,
  sfxEnabled: true,
  reduceMotion: false,
  showDamageNumbers: true,
  vibrationEnabled: true,
  screenShake: true,
  screenFlash: true,
  particles: true,
  highContrast: false,
  largeText: false,
  screenReader: false,
  graphicsQuality: 'auto' as const,
};

const INITIAL_UNLOCKED = ['arena_1'];

const UPGRADE_COSTS: Record<string, number[]> = {
  cannon: [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000],
  armor: [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000],
  mobility: [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000],
  special: [0, 150, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400],
};

const MAX_UPGRADE_LEVEL = 10;

function getUpgradeStatIncrease(type: string, level: number): Record<string, number> {
  const baseStats: Record<string, Record<string, number>> = {
    cannon: { power: 0.15, precision: 0.1, blastRadius: 0.1 },
    armor: { hp: 10, defense: 0.05 },
    mobility: { moveDistance: 10, chargeSpeed: 0.05 },
    special: { cooldownReduction: 0.05, efficiency: 0.05 },
  };
  
  const base = baseStats[type] || {};
  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(base)) {
    result[key] = Math.round(value * level * 100) / 100;
  }
  return result;
}

const DEFAULT_UPGRADES = {
  cannon: { level: 1, stats: getUpgradeStatIncrease('cannon', 1) },
  armor: { level: 1, stats: getUpgradeStatIncrease('armor', 1) },
  mobility: { level: 1, stats: getUpgradeStatIncrease('mobility', 1) },
  special: { level: 1, stats: getUpgradeStatIncrease('special', 1) },
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_V2_STATE,
      inventory: DEFAULT_V2_STATE.inventory,
      loadout: DEFAULT_V2_STATE.loadout,
      
      selectCharacter: (characterId: string) => set({ selectedCharacterId: characterId }),
      
      unlockLevel: (levelId: string) => set((state) => ({
        unlockedLevels: [...new Set([...state.unlockedLevels, levelId])],
      })),
      
      completeLevel: (levelId: string, data) => set((state) => {
        const existing = state.completedLevels[levelId];
        const stars = existing ? Math.max(existing.stars, data.stars) : data.stars;
        const bestTurns = existing ? Math.min(existing.bestTurns, data.turns) : data.turns;
        const bestDamage = existing ? Math.max(existing.bestDamage, data.damage) : data.damage;
        
        return {
          completedLevels: {
            ...state.completedLevels,
            [levelId]: { stars, bestTurns, bestDamage },
          },
        };
      }),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
      
      setTutorialCompleted: (completed: boolean) => set({ tutorialCompleted: completed }),
      
      setCurrentLevel: (levelId: string | null) => set({ currentLevelId: levelId }),
      
      addPlayTime: (ms: number) => set((state) => ({
        totalPlayTime: state.totalPlayTime + ms,
      })),
      
      // Economy actions
      earnCurrency: (amount: number) => set((state) => ({
        currency: state.currency + amount,
      })),
      
      spendCurrency: (amount: number) => {
        const state = get();
        if (state.currency >= amount) {
          set({ currency: state.currency - amount });
          return true;
        }
        return false;
      },
      
      canAfford: (amount: number) => {
        return get().currency >= amount;
      },
      
      // Character actions
      unlockCharacter: (characterId: string) => set((state) => ({
        unlockedCharacters: [...new Set([...state.unlockedCharacters, characterId])],
      })),
      
      isCharacterUnlocked: (characterId: string) => {
        return get().unlockedCharacters.includes(characterId);
      },
      
      // Upgrade actions
      getUpgradeCost: (type: 'cannon' | 'armor' | 'mobility' | 'special') => {
        const level = get().upgrades[type].level;
        if (level >= MAX_UPGRADE_LEVEL) return 0;
        return UPGRADE_COSTS[type][level] || 0;
      },
      
      getUpgradeLevel: (type: 'cannon' | 'armor' | 'mobility' | 'special') => {
        return get().upgrades[type].level;
      },
      
      getUpgradeStats: (type: 'cannon' | 'armor' | 'mobility' | 'special') => {
        return get().upgrades[type].stats;
      },
      
      upgradeCannon: () => {
        const cost = get().getUpgradeCost('cannon');
        if (!get().canAfford(cost)) return false;
        get().spendCurrency(cost);
        set((state) => {
          const newLevel = state.upgrades.cannon.level + 1;
          return {
            upgrades: {
              ...state.upgrades,
              cannon: {
                level: newLevel,
                stats: getUpgradeStatIncrease('cannon', newLevel),
              },
            },
          };
        });
        return true;
      },
      
      upgradeArmor: () => {
        const cost = get().getUpgradeCost('armor');
        if (!get().canAfford(cost)) return false;
        get().spendCurrency(cost);
        set((state) => {
          const newLevel = state.upgrades.armor.level + 1;
          return {
            upgrades: {
              ...state.upgrades,
              armor: {
                level: newLevel,
                stats: getUpgradeStatIncrease('armor', newLevel),
              },
            },
          };
        });
        return true;
      },
      
      upgradeMobility: () => {
        const cost = get().getUpgradeCost('mobility');
        if (!get().canAfford(cost)) return false;
        get().spendCurrency(cost);
        set((state) => {
          const newLevel = state.upgrades.mobility.level + 1;
          return {
            upgrades: {
              ...state.upgrades,
              mobility: {
                level: newLevel,
                stats: getUpgradeStatIncrease('mobility', newLevel),
              },
            },
          };
        });
        return true;
      },
      
      upgradeSpecial: () => {
        const cost = get().getUpgradeCost('special');
        if (!get().canAfford(cost)) return false;
        get().spendCurrency(cost);
        set((state) => {
          const newLevel = state.upgrades.special.level + 1;
          return {
            upgrades: {
              ...state.upgrades,
              special: {
                level: newLevel,
                stats: getUpgradeStatIncrease('special', newLevel),
              },
            },
          };
        });
        return true;
      },
      
      // Cosmetic actions
      unlockCosmetic: (cosmeticId: string) => set((state) => ({
        ownedCosmetics: [...new Set([...state.ownedCosmetics, cosmeticId])],
      })),
      
      equipCosmetic: (slot: string, cosmeticId: string) => set((state) => {
        if (!state.ownedCosmetics.includes(cosmeticId)) return state;
        return {
          equippedCosmetics: { ...state.equippedCosmetics, [slot]: cosmeticId },
        };
      }),
      
      unequipCosmetic: (slot: string) => set((state) => {
        const { [slot]: _, ...rest } = state.equippedCosmetics;
        return { equippedCosmetics: rest };
      }),
      
      isCosmeticUnlocked: (cosmeticId: string) => {
        return get().ownedCosmetics.includes(cosmeticId);
      },
      
      isCosmeticEquipped: (cosmeticId: string) => {
        return Object.values(get().equippedCosmetics).includes(cosmeticId);
      },
      
      // Statistics actions
      recordWin: (perfect: boolean, damageDealt: number, damageReceived: number) => set((state) => ({
        statistics: {
          totalWins: state.statistics.totalWins + 1,
          totalLosses: state.statistics.totalLosses,
          totalDamageDealt: state.statistics.totalDamageDealt + damageDealt,
          totalDamageReceived: state.statistics.totalDamageReceived + damageReceived,
          specialsUsed: state.statistics.specialsUsed,
          perfectWins: state.statistics.perfectWins + (perfect ? 1 : 0),
        },
      })),
      
      recordLoss: (damageDealt: number, damageReceived: number) => set((state) => ({
        statistics: {
          totalWins: state.statistics.totalWins,
          totalLosses: state.statistics.totalLosses + 1,
          totalDamageDealt: state.statistics.totalDamageDealt + damageDealt,
          totalDamageReceived: state.statistics.totalDamageReceived + damageReceived,
          specialsUsed: state.statistics.specialsUsed,
          perfectWins: state.statistics.perfectWins,
        },
      })),
      
      recordSpecialUse: () => set((state) => ({
        statistics: {
          ...state.statistics,
          specialsUsed: state.statistics.specialsUsed + 1,
        },
      })),
      
      // Inventory actions
      unlockInventoryItem: (itemId: string) => set((state) => ({
        inventory: {
          ...state.inventory,
          [itemId]: { state: 'owned' as const, quantity: 1 },
        },
      })),
      
      equipLoadoutItem: (slot: string, itemId: string | null) => set((state) => {
        const newLoadout = { ...state.loadout };
        if (itemId === null) {
          // @ts-ignore - dynamic key access
          newLoadout[slot] = null;
        } else {
          // @ts-ignore - dynamic key access
          newLoadout[slot] = itemId;
        }
        return { loadout: newLoadout };
      }),
      
      getLoadout: () => {
        const state = get();
        return {
          characterId: state.loadout.characterId,
          cannonId: state.loadout.cannonId,
          armorId: state.loadout.armorId,
          accessoryId: state.loadout.accessoryId,
          projectileId: state.loadout.projectileId,
          tacticalItemId: state.loadout.tacticalItemId,
        };
      },
      
      setLoadout: (loadout: Partial<LoadoutConfig>) => set((state) => ({
        loadout: { ...state.loadout, ...loadout },
      })),
      
      getInventoryItem: (itemId: string) => {
        const state = get();
        return state.inventory[itemId];
      },
      
      isItemOwned: (itemId: string) => {
        const state = get();
        return state.inventory[itemId]?.state === 'owned' || state.inventory[itemId]?.state === 'equipped';
      },
      
      isItemEquipped: (itemId: string) => {
        const state = get();
        return state.inventory[itemId]?.state === 'equipped';
      },
      
      getItemsByCategory: (category: InventoryCategory) => {
        const state = get();
        return Object.entries(state.inventory)
          .filter(([id, item]) => {
            // This would need a registry to check category
            // For now return all items
            return true;
          })
          .map(([id, item]) => ({ id, ...item }));
      },
      
      // Migration
      migrateIfNeeded: () => {
        const stored = getStoredData();
        if (stored && stored.version < 2) {
          // Migration handled by storage layer
        }
      },
      
      // Player Progression actions
      earnXp: (amount: number, source?: XpSource) => set((state) => {
        const newXp = state.playerXp + amount;
        const newLevel = calculateLevelFromXp(newXp);
        const leveledUp = newLevel > state.playerLevel;
        
        let rewards: Reward[] = [];
        if (leveledUp) {
          for (let l = state.playerLevel + 1; l <= newLevel; l++) {
            const levelConfig = getPlayerLevelConfig(l);
            if (levelConfig) {
              for (const r of levelConfig.rewards) {
                rewards.push({
                  type: r.type === 'character' ? 'cosmetic' : r.type as RewardType,
                  id: r.id,
                  quantity: r.quantity,
                });
              }
            }
          }
        }
        
        // Grant rewards via dispatcher
        const context = createGrantContext(get, set);
        grantRewards(rewards, context);
        
        return { playerXp: newXp, playerLevel: newLevel };
      }),
      
      getPlayerXp: () => get().playerXp,
      
      getPlayerLevel: () => get().playerLevel,
      
      getXpForNextLevel: () => {
        const state = get();
        const nextLevelConfig = getPlayerLevelConfig(state.playerLevel + 1);
        return nextLevelConfig?.requiredXp || 0;
      },
      
      getXpProgress: () => {
        const state = get();
        const currentConfig = getPlayerLevelConfig(state.playerLevel);
        const nextConfig = getPlayerLevelConfig(state.playerLevel + 1);
        
        if (!currentConfig || !nextConfig) {
          return { current: 0, required: 0, percent: 100 };
        }
        
        const current = state.playerXp - currentConfig.requiredXp;
        const required = nextConfig.requiredXp - currentConfig.requiredXp;
        const percent = Math.min(100, Math.max(0, (current / required) * 100));
        
        return { current, required, percent };
      },
      
      checkLevelUp: () => {
        const state = get();
        const currentLevel = state.playerLevel;
        const calculatedLevel = calculateLevelFromXp(state.playerXp);
        const leveledUp = calculatedLevel > currentLevel;
        
        let rewards: any[] = [];
        if (leveledUp) {
          for (let l = currentLevel + 1; l <= calculatedLevel; l++) {
            const levelConfig = getPlayerLevelConfig(l);
            if (levelConfig) {
              rewards.push(...levelConfig.rewards);
            }
          }
        }
        
        return { leveledUp, newLevel: calculatedLevel, rewards };
      },
      
      // Character Mastery actions
      earnCharacterXp: (characterId: string, amount: number, source?: MasteryXpSource) => set((state) => {
        const mastery = state.characterMastery[characterId] || { xp: 0, level: 1 };
        const newXp = mastery.xp + amount;
        const newLevel = calculateMasteryLevelFromXp(newXp);
        const leveledUp = newLevel > mastery.level;
        
        let rewards: Reward[] = [];
        if (leveledUp) {
          for (let l = mastery.level + 1; l <= newLevel; l++) {
            const levelConfig = getMasteryLevelConfig(l);
            if (levelConfig) {
              for (const r of levelConfig.rewards) {
                rewards.push({
                  type: r.type as RewardType,
                  id: r.id,
                  characterId: r.characterId,
                });
              }
            }
          }
        }
        
        // Grant rewards via dispatcher
        const context = createGrantContext(get, set);
        grantRewards(rewards, context);
        
        return {
          characterMastery: {
            ...state.characterMastery,
            [characterId]: { xp: newXp, level: newLevel },
          },
        };
      }),
      
      getCharacterMastery: (characterId: string) => {
        const state = get();
        return state.characterMastery[characterId] || { xp: 0, level: 1 };
      },
      
      getMasteryLevel: (characterId: string) => {
        const state = get();
        return state.characterMastery[characterId]?.level || 1;
      },
      
      getMasteryXp: (characterId: string) => {
        const state = get();
        return state.characterMastery[characterId]?.xp || 0;
      },
      
      getMasteryXpForNextLevel: (characterId: string) => {
        const state = get();
        const mastery = state.characterMastery[characterId] || { xp: 0, level: 1 };
        const nextLevelConfig = getMasteryLevelConfig(mastery.level + 1);
        return nextLevelConfig?.requiredXp || 0;
      },
      
      getMasteryProgress: (characterId: string) => {
        const state = get();
        const mastery = state.characterMastery[characterId] || { xp: 0, level: 1 };
        return getMasteryXpProgress(mastery.level, mastery.xp);
      },
      
      checkMasteryLevelUp: (characterId: string) => {
        const state = get();
        const mastery = state.characterMastery[characterId] || { xp: 0, level: 1 };
        const currentLevel = mastery.level;
        const calculatedLevel = calculateMasteryLevelFromXp(mastery.xp);
        const leveledUp = calculatedLevel > currentLevel;
        
        let rewards: any[] = [];
        if (leveledUp) {
          for (let l = currentLevel + 1; l <= calculatedLevel; l++) {
            const levelConfig = getMasteryLevelConfig(l);
            if (levelConfig) {
              rewards.push(...levelConfig.rewards);
            }
          }
        }
        
        return { leveledUp, newLevel: calculatedLevel, rewards };
      },
      
      // Mission actions
      getAvailableMissions: () => {
        const state = get();
        return getAvailableMissions(
          state.completedMissions,
          state.playerLevel,
          state.unlockedLevels.map(l => l.replace('arena_', '').replace('boss_', '')).filter(l => !isNaN(Number(l))).map(l => {
            const levelNum = parseInt(l);
            if (levelNum <= 5) return 'green_valley';
            if (levelNum <= 10) return 'crystal_desert';
            if (levelNum <= 15) return 'frozen_peaks';
            if (levelNum <= 20) return 'ember_lands';
            if (levelNum <= 25) return 'sky_kingdom';
            return 'dark_citadel';
          }),
          state.characterMastery
        );
      },
      
      getMissionProgress: (missionId: string) => {
        const state = get();
        return state.missions[missionId];
      },
      
      startMission: (missionId: string) => set((state) => {
        const mission = MISSIONS.find(m => m.id === missionId);
        if (!mission) return state;
        
        const initialProgress: Record<string, number> = {};
        for (const obj of mission.objectives) {
          initialProgress[obj.type] = 0;
        }
        
        return {
          missions: {
            ...state.missions,
            [missionId]: {
              missionId,
              currentProgress: initialProgress,
              completed: false,
              claimed: false,
              startedAt: Date.now(),
            },
          },
        };
      }),
      
      updateMissionProgress: (missionId: string, progress: Record<string, number>) => set((state) => {
        const missionProgress = state.missions[missionId];
        if (!missionProgress || missionProgress.completed) return state;
        
        const mission = MISSIONS.find(m => m.id === missionId);
        if (!mission) return state;
        
        const newProgress = { ...missionProgress.currentProgress };
        let allComplete = true;
        
        for (const [objType, value] of Object.entries(progress)) {
          newProgress[objType] = Math.max(newProgress[objType] || 0, value);
        }
        
        for (const obj of mission.objectives) {
          const current = newProgress[obj.type] || 0;
          const target = obj.count || 1;
          if (current < target) {
            allComplete = false;
            break;
          }
        }
        
        return {
          missions: {
            ...state.missions,
            [missionId]: {
              ...missionProgress,
              currentProgress: newProgress,
              completed: allComplete,
            },
          },
        };
      }),
      
      completeMission: (missionId: string) => set((state) => {
        const missionProgress = state.missions[missionId];
        if (!missionProgress) return state;
        
        return {
          missions: {
            ...state.missions,
            [missionId]: {
              ...missionProgress,
              completed: true,
            },
          },
          completedMissions: [...new Set([...state.completedMissions, missionId])],
        };
      }),
      
      claimMissionReward: (missionId: string) => set((state) => {
        const missionProgress = state.missions[missionId];
        const mission = MISSIONS.find(m => m.id === missionId);
        if (!missionProgress || !missionProgress.completed || missionProgress.claimed || !mission) return state;
        
        // Grant rewards via dispatcher
        const rewards: Reward[] = mission.rewards.map(r => ({
          type: r.type === 'xp' ? 'xp' : r.type as RewardType,
          id: r.id,
          quantity: r.quantity,
        }));
        const context = createGrantContext(get, set);
        grantRewards(rewards, context);
        
        return {
          missions: {
            ...state.missions,
            [missionId]: {
              ...missionProgress,
              claimed: true,
            },
          },
        };
      }),
      
      getCompletedMissions: () => {
        const state = get();
        return state.completedMissions;
      },
      
      // Achievement actions
      checkAchievements: (triggerType: AchievementTriggerType, data?: Record<string, any>) => set((state) => {
        const achievements = getAllAchievements();
        const newAchievements = { ...state.achievements };
        let hasChanges = false;
        
        for (const achievement of achievements) {
          const achState = newAchievements[achievement.id] || { unlocked: false, progress: {} };
          if (achState.unlocked) continue;
          
          for (const trigger of achievement.triggers) {
            if (trigger.type === triggerType) {
              let shouldUnlock = false;
              let newProgress = { ...achState.progress };
              
              switch (triggerType) {
                case 'first_battle':
                case 'boss_defeated':
                case 'campaign_completed':
                case 'new_game_plus':
                case 'cosmetic_unlocked':
                case 'special_ability_used':
                case 'tactical_item_used':
                  newProgress[triggerType] = (newProgress[triggerType] || 0) + 1;
                  shouldUnlock = newProgress[triggerType] >= (trigger.count || 1);
                  break;
                case 'battle_win':
                case 'battle_loss':
                case 'perfect_win':
                case 'level_completed':
                case 'mission_completed':
                  newProgress[triggerType] = (newProgress[triggerType] || 0) + 1;
                  shouldUnlock = newProgress[triggerType] >= (trigger.count || 1);
                  break;
                case 'region_completed':
                  newProgress[triggerType] = (newProgress[triggerType] || 0) + 1;
                  if (trigger.regionId) {
                    shouldUnlock = trigger.regionId === data?.regionId;
                  } else {
                    shouldUnlock = newProgress[triggerType] >= (trigger.count || 1);
                  }
                  break;
                case 'stars_collected':
                  newProgress[triggerType] = (newProgress[triggerType] || 0) + (data?.stars || 0);
                  shouldUnlock = newProgress[triggerType] >= (trigger.count || 1);
                  break;
                case 'long_range_hit':
                  const distance = data?.distance || 0;
                  if (distance >= (trigger.target || 0)) {
                    newProgress[triggerType] = (newProgress[triggerType] || 0) + 1;
                    shouldUnlock = true;
                  }
                  break;
                case 'accuracy_threshold':
                  const accuracy = data?.accuracy || 0;
                  const accTarget = typeof trigger.target === 'number' ? trigger.target : parseInt(String(trigger.target)) || 0;
                  const accCount = typeof trigger.count === 'number' ? trigger.count : parseInt(String(trigger.count)) || 1;
                  if (accuracy >= accTarget) {
                    newProgress[triggerType] = (newProgress[triggerType] || 0) + 1;
                    shouldUnlock = newProgress[triggerType] >= accCount;
                  }
                  break;
                case 'character_mastery_level':
                  const charMastery = state.characterMastery[trigger.characterId || ''];
                  const masteryTarget = typeof trigger.target === 'number' ? trigger.target : parseInt(String(trigger.target)) || 0;
                  if (charMastery && charMastery.level >= masteryTarget) {
                    shouldUnlock = true;
                  }
                  break;
                case 'all_characters_mastery':
                  const allMasteryTarget = typeof trigger.target === 'number' ? trigger.target : parseInt(String(trigger.target)) || 0;
                  const allAtLevel = Object.values(state.characterMastery).every(m => m.level >= allMasteryTarget);
                  shouldUnlock = allAtLevel;
                  break;
                case 'player_level':
                  const levelTarget = typeof trigger.target === 'number' ? trigger.target : parseInt(String(trigger.target)) || 0;
                  if (state.playerLevel >= levelTarget) {
                    shouldUnlock = true;
                  }
                  break;
                case 'all_cosmetics_category':
                  // This would need a registry of cosmetics by category
                  // For now, simplified check
                  break;
              }
              
              if (shouldUnlock) {
                achState.unlocked = true;
                achState.unlockedAt = Date.now();
                hasChanges = true;
                
                // Grant rewards via dispatcher
                const rewards: Reward[] = achievement.rewards.map(r => ({
                  type: r.type as RewardType,
                  id: r.id,
                  quantity: r.quantity,
                }));
                const context = createGrantContext(get, set);
                grantRewards(rewards, context);
              }
              
              newAchievements[achievement.id] = { ...achState, progress: newProgress };
            }
          }
        }
        
        return hasChanges ? { achievements: newAchievements } : state;
      }),
      
      unlockAchievement: (achievementId: string) => set((state) => {
        const achievement = getAchievement(achievementId);
        if (!achievement) return state;
        
        const achState = state.achievements[achievementId] || { unlocked: false, progress: {} };
        if (achState.unlocked) return state;
        
        achState.unlocked = true;
        achState.unlockedAt = Date.now();
        
        // Grant rewards via dispatcher
        const rewards: Reward[] = achievement.rewards.map(r => ({
          type: r.type as RewardType,
          id: r.id,
          quantity: r.quantity,
        }));
        const context = createGrantContext(get, set);
        grantRewards(rewards, context);
        
        return {
          achievements: {
            ...state.achievements,
            [achievementId]: achState,
          },
        };
      }),
      
      getAchievementProgress: (achievementId: string) => {
        const state = get();
        return state.achievements[achievementId];
      },
      
      getUnlockedAchievements: () => {
        const state = get();
        return Object.entries(state.achievements)
          .filter(([, ach]) => ach.unlocked)
          .map(([id]) => id);
      },
      
      getAchievementPoints: () => {
        const state = get();
        return Object.entries(state.achievements)
          .filter(([, ach]) => ach.unlocked)
          .reduce((sum, [id]) => {
            const ach = getAchievement(id);
            return sum + (ach?.points || 0);
          }, 0);
      },
      
      // Astra Core actions
      unlockAstraCore: (coreId: AstraCoreId) => set((state) => {
        const core = ASTRA_CORES[coreId];
        if (!core) return state;
        
        const coreState = state.astraCores[coreId];
        if (coreState.unlocked) return state;
        
        return {
          astraCores: {
            ...state.astraCores,
            [coreId]: {
              ...coreState,
              unlocked: true,
              currentCharges: core.ability.maxCharges,
              cooldownRemaining: 0,
            },
          },
        };
      }),
      
      useAstraCoreAbility: (coreId: AstraCoreId) => {
        const state = get();
        const core = ASTRA_CORES[coreId];
        if (!core) return { success: false, reason: 'Core not found' };
        
        const coreState = state.astraCores[coreId];
        if (!coreState || !coreState.unlocked) {
          return { success: false, reason: 'Core not unlocked' };
        }
        
        if (coreState.currentCharges <= 0) {
          return { success: false, reason: 'No charges available' };
        }
        
        if (coreState.cooldownRemaining > 0) {
          return { success: false, reason: 'Ability on cooldown' };
        }
        
        // Apply the effect
        const effect = core.ability.effect;
        
        // Consume charge and set cooldown
        set((state) => ({
          astraCores: {
            ...state.astraCores,
            [coreId]: {
              ...state.astraCores[coreId],
              currentCharges: state.astraCores[coreId].currentCharges - 1,
              cooldownRemaining: core.ability.cooldown,
              lastUsedTurn: state.totalPlayTime,
            },
          },
        }));
        
        return { success: true, effect };
      },
      
      getAstraCoreStatus: (coreId: AstraCoreId) => {
        const state = get();
        return state.astraCores[coreId];
      },
      
      getUnlockedAstraCores: () => {
        const state = get();
        return Object.entries(state.astraCores)
          .filter(([, core]) => core.unlocked)
          .map(([id]) => id as AstraCoreId);
      },
      
      resetAstraCoreCooldowns: () => set((state) => {
        const newCores: Record<string, AstraCoreState> = {};
        for (const [id, core] of Object.entries(state.astraCores)) {
          const coreConfig = ASTRA_CORES[id as AstraCoreId];
          newCores[id] = {
            ...core,
            cooldownRemaining: 0,
            currentCharges: coreConfig?.ability.maxCharges ?? core.currentCharges,
          };
        }
        return { astraCores: newCores };
      }),
      
      // Codex actions
      unlockCodexEntry: (entryId: string, categoryId: string) => set((state) => {
        const newUnlockedEntries = { ...state.codex.unlockedEntries };
        newUnlockedEntries[entryId] = true;
        
        // Update category progress
        const category = CODEX_CATEGORIES.find(c => c.id === categoryId);
        const newProgress = category ? getCategoryProgress(state.codex, category) : 0;
        
        const newUnlockedCategories = { ...state.codex.unlockedCategories };
        if (category && getTotalProgress(state.codex) >= 100) {
          newUnlockedCategories[categoryId] = true;
        }
        
        // Update entry order if needed
        const newEntryOrder = { ...state.codex.entryOrder };
        if (!newEntryOrder[categoryId]) {
          newEntryOrder[categoryId] = [];
        }
        if (!newEntryOrder[categoryId].includes(entryId)) {
          newEntryOrder[categoryId] = [...newEntryOrder[categoryId], entryId];
        }
        
        return {
          codex: {
            ...state.codex,
            unlockedEntries: newUnlockedEntries,
            categoryProgress: {
              ...state.codex.categoryProgress,
              [categoryId]: newProgress,
            },
            totalUnlocked: Object.values(state.codex.unlockedEntries).filter(v => v).length + 1,
            entryOrder: newEntryOrder,
          },
        };
      }),
      
      getCodexEntries: (categoryId: string) => {
        return getCodexEntriesByCategory(CODEX_CATEGORIES, categoryId);
      },
      
      getCodexCategoryProgress: (categoryId: string) => {
        const state = get();
        const category = CODEX_CATEGORIES.find(c => c.id === categoryId);
        if (!category) return 0;
        return getCategoryProgress(state.codex, category);
      },
      
      getTotalCodexProgress: () => {
        const state = get();
        return getTotalProgress(state.codex);
      },
      
resetCodexProgress: () => set({
        codex: {
          unlockedEntries: {} as Record<string, boolean>,
          unlockedCategories: {} as Record<string, boolean>,
          entryOrder: {} as Record<string, string[]>,
          categoryProgress: {} as Record<string, number>,
          totalEntries: 0,
          totalUnlocked: 0,
        },
      }),
      
      // Terrain actions
      createCrater: (x: number, y: number, permanent: boolean = false, radius?: number, depth?: number) => set((state) => {
        const newCraters = { ...state.terrain.craters };
        const craterId = `crater_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const craterRadius = radius || 50;
        const craterDepth = depth || 20;
        
        newCraters[craterId] = {
          id: craterId,
          radius: craterRadius,
          depth: craterDepth,
          createdAt: Date.now(),
          durability: 100,
          maxImpacts: permanent ? 999 : 3,
          image: 'crater_' + (craterRadius > 60 ? 'large' : craterRadius > 30 ? 'medium' : 'small'),
          color: '#555555',
          permanent,
        };
        
        // Add fall zone if not permanent
        if (!permanent) {
          const fallZoneId = `fallzone_${craterId}`;
          state.terrain.fallZones[fallZoneId] = {
            id: fallZoneId,
            x: x,
            y: y,
            radius: craterRadius * 1.5,
            dangerous: true,
            turnCreated: Date.now(),
            expiresAt: Date.now() + 3 * 60 * 1000, // 3 minutes
          };
        }
        
        return {
          terrain: {
            ...state.terrain,
            craters: newCraters,
            totalImpacts: state.terrain.totalImpacts + 1,
          },
        };
      }),
      
      checkFallZone: (x: number, y: number) => set((state) => {
        const fallZones = state.terrain.fallZones;
        const now = Date.now();
        
        for (const [zoneId, zone] of Object.entries(fallZones)) {
          const distance = Math.sqrt((zone.x - x) ** 2 + (zone.y - y) ** 2);
          if (distance <= zone.radius && now < (zone.expiresAt || Infinity)) {
            // Remove expired fall zone
            const newFallZones = { ...fallZones };
            delete newFallZones[zoneId];
            
            return {
              terrain: {
                ...state.terrain,
                fallZones: newFallZones,
              },
              dangerous: true,
            };
          }
        }
        
        return {
          terrain: {
            ...state.terrain,
          },
          dangerous: false,
        };
      }),
      
      getCraterStatus: (craterId: string) => {
        const state = get();
        return state.terrain.craters[craterId] || null;
      },
      
      getAllCraters: () => {
        const state = get();
        return state.terrain.craters;
      },
      
      getAllFallZones: () => {
        const state = get();
        return state.terrain.fallZones;
      },
      
      getTerrainStatus: () => {
        const state = get();
        return {
          totalCraters: Object.keys(state.terrain.craters).length,
          permanentCraters: Object.values(state.terrain.craters).filter(c => c.permanent).length,
          totalImpacts: state.terrain.totalImpacts,
          activeFallZones: Object.keys(state.terrain.fallZones).length,
        };
      },
      
      // Mobile Validation actions
      setMobileDevice: (device: { id: string; width: number; height: number }) => set((state) => ({
        mobile: {
          ...state.mobile,
          currentDevice: {
            ...state.mobile.currentDevice,
            id: device.id,
            width: device.width,
            height: device.height,
          },
          viewport: {
            ...state.mobile.viewport,
            width: device.width,
            height: device.height,
          },
        },
      })),
      
      setTouchEnabled: (enabled: boolean) => set((state) => ({
        mobile: {
          ...state.mobile,
          touchEnabled: enabled,
        },
      })),
      
      setTouchSensitivity: (sensitivity: 'low' | 'medium' | 'high') => set((state) => ({
        mobile: {
          ...state.mobile,
          viewport: {
            ...state.mobile.viewport,
          },
        },
      })),
      
      getMobileStatus: () => {
        const state = get();
        return {
          currentDevice: state.mobile.currentDevice,
          touchEnabled: state.mobile.touchEnabled,
          viewport: state.mobile.viewport,
          sessionDuration: Date.now() - state.mobile.sessionStart,
        };
      },
      
      // Tactical Items actions
      unlockTacticalItem: (itemId: string) => set((state) => {
        const itemConfig = getTacticalItem(itemId);
        if (!itemConfig) return {};
        
        const newItems = { ...state.tacticalInventory.items };
        newItems[itemId] = {
          unlocked: true,
          currentCharges: itemConfig.maxCharges,
          totalUses: 0,
        };
        
        return {
          tacticalInventory: {
            ...state.tacticalInventory,
            items: newItems,
          },
        };
      }),
      
      useTacticalItem: (itemId: string) => set((state) => {
        const itemConfig = getTacticalItem(itemId);
        const itemState = state.tacticalInventory.items[itemId];
        
        if (!itemConfig || !itemState || !canUseItem(itemConfig, itemState)) {
          return {};
        }
        
        const newItems = { ...state.tacticalInventory.items };
        newItems[itemId] = {
          ...itemState,
          currentCharges: itemState.currentCharges - 1,
          lastUsed: Date.now(),
          totalUses: itemState.totalUses + 1,
        };
        
        return {
          tacticalInventory: {
            ...state.tacticalInventory,
            items: newItems,
            totalItemsUsed: state.tacticalInventory.totalItemsUsed + 1,
          },
        };
      }),
      
      equipTacticalItem: (itemId: string) => set((state) => {
        const itemState = state.tacticalInventory.items[itemId];
        if (!itemState || !itemState.unlocked) return {};
        
        return {
          tacticalInventory: {
            ...state.tacticalInventory,
            equippedItem: itemId,
          },
        };
      }),
      
      unequipTacticalItem: () => set((state) => ({
        tacticalInventory: {
          ...state.tacticalInventory,
          equippedItem: null,
        },
      })),
      
      getTacticalItemStatus: (itemId: string) => {
        const state = get();
        return state.tacticalInventory.items[itemId] || null;
      },
      
      getAllTacticalItems: () => {
        const state = get();
        return state.tacticalInventory.items;
      },
      
      getEquippedTacticalItem: () => {
        const state = get();
        return state.tacticalInventory.equippedItem;
      },
      
      isTacticalItemOnCooldown: (itemId: string) => {
        const state = get();
        const itemConfig = getTacticalItem(itemId);
        const itemState = state.tacticalInventory.items[itemId];
        if (!itemConfig || !itemState) return false;
        return isItemOnCooldown(itemConfig, itemState);
      },
      
      // Training Mode actions
      startTraining: (modeId: string) => set((state) => {
        const modeConfig = getTrainingMode(modeId);
        if (!modeConfig) return {};
        
        return {
          training: {
            ...state.training,
            currentMode: modeId,
            isActive: true,
            startedAt: Date.now(),
          },
        };
      }),
      
      completeTraining: (modeId: string, stats: { shots: number; hits: number; damage: number; time: number }) => set((state) => {
        const newCompletedModes = [...state.training.completedModes];
        if (!newCompletedModes.includes(modeId)) {
          newCompletedModes.push(modeId);
        }
        
        const accuracy = stats.shots > 0 ? Math.round((stats.hits / stats.shots) * 100) : 0;
        const newStats = {
          totalSessions: state.training.stats.totalSessions + 1,
          totalTime: state.training.stats.totalTime + stats.time,
          totalShots: state.training.stats.totalShots + stats.shots,
          averageAccuracy: Math.round((state.training.stats.averageAccuracy * state.training.stats.totalSessions + accuracy) / (state.training.stats.totalSessions + 1)),
          bestAccuracy: Math.max(state.training.stats.bestAccuracy, accuracy),
          totalDamage: state.training.stats.totalDamage + stats.damage,
        };
        
        return {
          training: {
            ...state.training,
            currentMode: null,
            isActive: false,
            startedAt: null,
            completedModes: newCompletedModes,
            stats: newStats,
          },
        };
      }),
      
      cancelTraining: () => set((state) => ({
        training: {
          ...state.training,
          currentMode: null,
          isActive: false,
          startedAt: null,
        },
      })),
      
      getTrainingStatus: () => {
        const state = get();
        return {
          currentMode: state.training.currentMode,
          isActive: state.training.isActive,
          completedModes: state.training.completedModes,
          stats: state.training.stats,
        };
      },
      
      isTrainingCompleted: (modeId: string) => {
        const state = get();
        return state.training.completedModes.includes(modeId);
      },
      
      completeTutorial: (tutorialId: string) => set((state) => ({
        training: {
          ...state.training,
          tutorialProgress: {
            ...state.training.tutorialProgress,
            [tutorialId]: true,
          },
        },
      })),
      
      isTutorialCompleted: (tutorialId: string) => {
        const state = get();
        return state.training.tutorialProgress[tutorialId] === true;
      },
      
      // Precision Challenge actions
      startPrecisionChallenge: (challengeId: string) => set((state) => {
        const challengeConfig = getPrecisionChallenge(challengeId);
        if (!challengeConfig) return {};
        
        return {
          precisionChallenge: {
            ...state.precisionChallenge,
            currentChallenge: challengeId,
            isActive: true,
            startedAt: Date.now(),
            shotsRemaining: challengeConfig.maxShots,
            currentScore: 0,
          },
        };
      }),
      
      recordPrecisionShot: (hit: boolean, points: number) => set((state) => {
        if (!state.precisionChallenge.isActive || state.precisionChallenge.shotsRemaining <= 0) {
          return {};
        }
        
        const newShotsRemaining = state.precisionChallenge.shotsRemaining - 1;
        const newScore = state.precisionChallenge.currentScore + points;
        
        return {
          precisionChallenge: {
            ...state.precisionChallenge,
            shotsRemaining: newShotsRemaining,
            currentScore: newScore,
          },
        };
      }),
      
      completePrecisionChallenge: (challengeId: string, stats: { shots: number; hits: number; time: number }) => set((state) => {
        const score = calculatePrecisionScore(stats.hits, stats.shots, 0);
        const accuracy = stats.shots > 0 ? Math.round((stats.hits / stats.shots) * 100) : 0;
        
        const newCompletedChallenges = [...state.precisionChallenge.completedChallenges];
        if (!newCompletedChallenges.includes(challengeId)) {
          newCompletedChallenges.push(challengeId);
        }
        
        const newBestScores = { ...state.precisionChallenge.bestScores };
        if (!newBestScores[challengeId] || score > newBestScores[challengeId].score) {
          newBestScores[challengeId] = {
            challengeId,
            score,
            shotsUsed: stats.shots,
            accuracy,
            time: stats.time,
            completedAt: Date.now(),
          };
        }
        
        const newStats = {
          totalChallenges: state.precisionChallenge.stats.totalChallenges + 1,
          totalShots: state.precisionChallenge.stats.totalShots + stats.shots,
          totalHits: state.precisionChallenge.stats.totalHits + stats.hits,
          averageAccuracy: Math.round((state.precisionChallenge.stats.averageAccuracy * state.precisionChallenge.stats.totalChallenges + accuracy) / (state.precisionChallenge.stats.totalChallenges + 1)),
          bestAccuracy: Math.max(state.precisionChallenge.stats.bestAccuracy, accuracy),
          totalScore: state.precisionChallenge.stats.totalScore + score,
          averageScore: Math.round((state.precisionChallenge.stats.averageScore * state.precisionChallenge.stats.totalChallenges + score) / (state.precisionChallenge.stats.totalChallenges + 1)),
        };
        
        return {
          precisionChallenge: {
            ...state.precisionChallenge,
            currentChallenge: null,
            isActive: false,
            startedAt: null,
            shotsRemaining: 0,
            currentScore: 0,
            completedChallenges: newCompletedChallenges,
            bestScores: newBestScores,
            stats: newStats,
          },
        };
      }),
      
      cancelPrecisionChallenge: () => set((state) => ({
        precisionChallenge: {
          ...state.precisionChallenge,
          currentChallenge: null,
          isActive: false,
          startedAt: null,
          shotsRemaining: 0,
          currentScore: 0,
        },
      })),
      
      getPrecisionChallengeStatus: () => {
        const state = get();
        return {
          currentChallenge: state.precisionChallenge.currentChallenge,
          isActive: state.precisionChallenge.isActive,
          shotsRemaining: state.precisionChallenge.shotsRemaining,
          currentScore: state.precisionChallenge.currentScore,
          completedChallenges: state.precisionChallenge.completedChallenges,
          bestScores: state.precisionChallenge.bestScores,
          stats: state.precisionChallenge.stats,
        };
      },
      
      isPrecisionChallengeCompleted: (challengeId: string) => {
        const state = get();
        return state.precisionChallenge.completedChallenges.includes(challengeId);
      },
      
      getPrecisionChallengeScore: (challengeId: string) => {
        const state = get();
        return state.precisionChallenge.bestScores[challengeId] || null;
      },
      
      // Local Versus actions
      startLocalVersusMatch: (modeId: string, players: PlayerConfig[]) => set((state) => {
        const modeConfig = getLocalVersusMode(modeId);
        if (!modeConfig) return {};
        
        const scores: Record<string, number> = {};
        players.forEach(p => { scores[p.id] = 0; });
        
        const match: VersusMatchState = {
          matchId: generateMatchId(),
          config: modeConfig,
          players,
          currentTurn: 0,
          turnCount: 0,
          scores,
          winner: null,
          isActive: true,
          startedAt: Date.now(),
          turnStartedAt: Date.now(),
          status: 'playing',
        };
        
        return {
          localVersus: {
            ...state.localVersus,
            currentMatch: match,
          },
        };
      }),
      
      switchVersusTurn: () => set((state) => {
        if (!state.localVersus.currentMatch) return {};
        
        const match = state.localVersus.currentMatch;
        const nextTurn = (match.currentTurn + 1) % match.players.length;
        
        return {
          localVersus: {
            ...state.localVersus,
            currentMatch: {
              ...match,
              currentTurn: nextTurn,
              turnCount: match.turnCount + 1,
              turnStartedAt: Date.now(),
            },
          },
        };
      }),
      
      recordVersusScore: (playerId: string, points: number) => set((state) => {
        if (!state.localVersus.currentMatch) return {};
        
        const match = state.localVersus.currentMatch;
        const newScores = { ...match.scores };
        newScores[playerId] = (newScores[playerId] || 0) + points;
        
        return {
          localVersus: {
            ...state.localVersus,
            currentMatch: {
              ...match,
              scores: newScores,
            },
          },
        };
      }),
      
      endLocalVersusMatch: (winnerId: string) => set((state) => {
        if (!state.localVersus.currentMatch) return {};
        
        const match = state.localVersus.currentMatch;
        const duration = Date.now() - match.startedAt;
        
        const result: VersusMatchResult = {
          matchId: match.matchId,
          configId: match.config.id,
          players: match.players,
          winner: winnerId,
          scores: match.scores,
          turns: match.turnCount,
          duration,
          completedAt: Date.now(),
        };
        
        const newHistory = [...state.localVersus.matchHistory, result];
        const newStats = {
          ...state.localVersus.stats,
          totalMatches: state.localVersus.stats.totalMatches + 1,
          totalWins: state.localVersus.stats.totalWins + (winnerId === 'player1' ? 1 : 0),
          totalLosses: state.localVersus.stats.totalLosses + (winnerId !== 'player1' ? 1 : 0),
          winStreak: winnerId === 'player1' ? state.localVersus.stats.winStreak + 1 : 0,
          bestWinStreak: Math.max(state.localVersus.stats.bestWinStreak, winnerId === 'player1' ? state.localVersus.stats.winStreak + 1 : 0),
          totalTurns: state.localVersus.stats.totalTurns + match.turnCount,
        };
        
        return {
          localVersus: {
            ...state.localVersus,
            currentMatch: null,
            matchHistory: newHistory,
            stats: newStats,
          },
        };
      }),
      
      cancelLocalVersusMatch: () => set((state) => ({
        localVersus: {
          ...state.localVersus,
          currentMatch: null,
        },
      })),
      
      getLocalVersusStatus: () => {
        const state = get();
        return {
          currentMatch: state.localVersus.currentMatch,
          matchHistory: state.localVersus.matchHistory,
          stats: state.localVersus.stats,
        };
      },
      
      isLocalVersusActive: () => {
        const state = get();
        return state.localVersus.currentMatch !== null && state.localVersus.currentMatch.isActive;
      },
      
      // Boss Rush actions
      startBossRush: (rushId: string) => set((state) => {
        const modeConfig = getBossRushMode(rushId);
        if (!modeConfig) return {};
        
        const firstWave = modeConfig.waves[0];
        const bossConfig = getBossConfig(firstWave.bossId);
        if (!bossConfig) return {};
        
        const bossHealth = calculateBossHealth(bossConfig.health, firstWave.healthMultiplier);
        
        const progress: BossRushProgress = {
          rushId: generateRushId(),
          configId: rushId,
          currentWave: 0,
          bossesDefeated: [],
          currentBossHealth: bossHealth,
          score: 0,
          startTime: Date.now(),
          isActive: true,
        };
        
        return {
          bossRush: {
            ...state.bossRush,
            currentRush: progress,
          },
        };
      }),
      
      damageBoss: (damage: number) => set((state) => {
        if (!state.bossRush.currentRush) return {};
        
        const newHealth = Math.max(0, state.bossRush.currentRush.currentBossHealth - damage);
        const scoreBonus = damage * 10;
        
        return {
          bossRush: {
            ...state.bossRush,
            currentRush: {
              ...state.bossRush.currentRush,
              currentBossHealth: newHealth,
              score: state.bossRush.currentRush.score + scoreBonus,
            },
          },
        };
      }),
      
      defeatBoss: () => set((state) => {
        if (!state.bossRush.currentRush) return {};
        
        const modeConfig = getBossRushMode(state.bossRush.currentRush.configId);
        if (!modeConfig) return {};
        
        const currentWave = modeConfig.waves[state.bossRush.currentRush.currentWave];
        const scoreBonus = 500 + (state.bossRush.currentRush.currentWave * 200);
        
        const newBossesDefeated = [...state.bossRush.currentRush.bossesDefeated, currentWave.bossId];
        
        return {
          bossRush: {
            ...state.bossRush,
            currentRush: {
              ...state.bossRush.currentRush,
              bossesDefeated: newBossesDefeated,
              score: state.bossRush.currentRush.score + scoreBonus,
            },
          },
        };
      }),
      
      nextBossRushWave: () => set((state) => {
        if (!state.bossRush.currentRush) return {};
        
        const modeConfig = getBossRushMode(state.bossRush.currentRush.configId);
        if (!modeConfig) return {};
        
        const nextWaveIndex = state.bossRush.currentRush.currentWave + 1;
        if (nextWaveIndex >= modeConfig.waves.length) {
          return {
            bossRush: {
              ...state.bossRush,
              currentRush: null,
            },
          };
        }
        
        const nextWave = modeConfig.waves[nextWaveIndex];
        const bossConfig = getBossConfig(nextWave.bossId);
        if (!bossConfig) return {};
        
        const bossHealth = calculateBossHealth(bossConfig.health, nextWave.healthMultiplier);
        
        return {
          bossRush: {
            ...state.bossRush,
            currentRush: {
              ...state.bossRush.currentRush,
              currentWave: nextWaveIndex,
              currentBossHealth: bossHealth,
            },
          },
        };
      }),
      
      completeBossRush: () => set((state) => {
        if (!state.bossRush.currentRush) return {};
        
        const modeConfig = getBossRushMode(state.bossRush.currentRush.configId);
        if (!modeConfig) return {};
        
        const duration = Date.now() - state.bossRush.currentRush.startTime;
        const bonusScore = state.bossRush.currentRush.currentWave * 300;
        
        const result: BossRushResult = {
          rushId: state.bossRush.currentRush.rushId,
          configId: state.bossRush.currentRush.configId,
          wavesCompleted: state.bossRush.currentRush.currentWave,
          bossesDefeated: state.bossRush.currentRush.bossesDefeated,
          score: state.bossRush.currentRush.score + bonusScore,
          duration,
          completedAt: Date.now(),
        };
        
        const newHistory = [...state.bossRush.rushHistory, result];
        const totalBossesDefeated = state.bossRush.stats.totalBossesDefeated + state.bossRush.currentRush.bossesDefeated.length;
        
        const newStats = {
          totalRushes: state.bossRush.stats.totalRushes + 1,
          totalBossesDefeated,
          bestScore: Math.max(state.bossRush.stats.bestScore, result.score),
          bestWave: Math.max(state.bossRush.stats.bestWave, result.wavesCompleted),
          averageScore: Math.round((state.bossRush.stats.averageScore * state.bossRush.stats.totalRushes + result.score) / (state.bossRush.stats.totalRushes + 1)),
          totalPlayTime: state.bossRush.stats.totalPlayTime + duration,
        };
        
        return {
          bossRush: {
            ...state.bossRush,
            currentRush: null,
            rushHistory: newHistory,
            stats: newStats,
          },
        };
      }),
      
      cancelBossRush: () => set((state) => ({
        bossRush: {
          ...state.bossRush,
          currentRush: null,
        },
      })),
      
      getBossRushStatus: () => {
        const state = get();
        return {
          currentRush: state.bossRush.currentRush,
          rushHistory: state.bossRush.rushHistory,
          stats: state.bossRush.stats,
        };
      },
      
      isBossRushActive: () => {
        const state = get();
        return state.bossRush.currentRush !== null && state.bossRush.currentRush.isActive;
      },
      
      // New Game+ actions
      startNewGamePlus: (cycleId: string) => set((state) => {
        const cycleConfig = getNGPlusConfig(cycleId);
        if (!cycleConfig) return {};
        
        const cycleNumber = parseInt(cycleId.replace('ng', ''));
        
        const newState = unlockNGPlus(state.newGamePlus, cycleNumber + 1);
        
        return {
          newGamePlus: {
            ...newState,
            currentCycle: cycleNumber,
            modifiers: cycleConfig.modifiers.map(m => m.id),
          },
        };
      }),
      
      completeNewGamePlus: (cycleId: string, stats: { kills: number; damage: number; time: number }) => set((state) => {
        const cycleNumber = parseInt(cycleId.replace('ng', ''));
        const newUnlocked = unlockNGPlus(state.newGamePlus, cycleNumber + 1);
        
        const newStats = {
          totalCycles: state.newGamePlus.stats.totalCycles + 1,
          totalTime: state.newGamePlus.stats.totalTime + stats.time,
          totalKills: state.newGamePlus.stats.totalKills + stats.kills,
          totalDamage: state.newGamePlus.stats.totalDamage + stats.damage,
          bestCycle: Math.max(state.newGamePlus.stats.bestCycle, cycleNumber),
          averageTime: Math.round((state.newGamePlus.stats.averageTime * state.newGamePlus.stats.totalCycles + stats.time) / (state.newGamePlus.stats.totalCycles + 1)),
        };
        
        return {
          newGamePlus: {
            ...newUnlocked,
            currentCycle: state.newGamePlus.currentCycle,
            stats: newStats,
          },
        };
      }),
      
      getNGPlusStatus: () => {
        const state = get();
        return {
          currentCycle: state.newGamePlus.currentCycle,
          unlockedCycles: state.newGamePlus.unlockedCycles,
          modifiers: state.newGamePlus.modifiers,
          stats: state.newGamePlus.stats,
          availableCycles: getAvailableNGPlus(state.newGamePlus),
        };
      },
      
      isNGPlusUnlocked: (cycle: number) => {
        const state = get();
        return checkNGPlusUnlocked(state.newGamePlus, cycle);
      },
      
      getNGPlusMultiplier: () => {
        const state = get();
        const config = getNGPlusConfig(`ng${state.newGamePlus.currentCycle}`);
        return config ? config.difficultyMultiplier : 1;
      },
      
      // Region Loader actions
      loadRegion: (regionId: string) => set((state) => {
        if (!canLoadRegion(state.regionLoader, regionId)) return {};
        
        return {
          regionLoader: {
            ...state.regionLoader,
            loadingRegions: [...state.regionLoader.loadingRegions, regionId],
          },
        };
      }),
      
      regionLoaded: (regionId: string, loadTime: number) => set((state) => {
        const newLoading = state.regionLoader.loadingRegions.filter(id => id !== regionId);
        const newLoaded = [...state.regionLoader.loadedRegions, regionId];
        const region = getRegionConfig(regionId);
        const regionSize = region ? region.estimatedSize : 0;
        
        const newLoadTimes = { ...state.regionLoader.stats.loadTimes };
        newLoadTimes[regionId] = loadTime;
        
        return {
          regionLoader: {
            ...state.regionLoader,
            loadingRegions: newLoading,
            loadedRegions: newLoaded,
            stats: {
              ...state.regionLoader.stats,
              totalLoaded: state.regionLoader.stats.totalLoaded + 1,
              totalSize: state.regionLoader.stats.totalSize + regionSize,
              loadTimes: newLoadTimes,
            },
          },
        };
      }),
      
      regionError: (regionId: string, error: string) => set((state) => {
        const newLoading = state.regionLoader.loadingRegions.filter(id => id !== regionId);
        const newErrors = [...state.regionLoader.stats.errors, error];
        
        return {
          regionLoader: {
            ...state.regionLoader,
            loadingRegions: newLoading,
            stats: {
              ...state.regionLoader.stats,
              errors: newErrors,
            },
          },
        };
      }),
      
      setCurrentRegion: (regionId: string | null) => set((state) => ({
        regionLoader: {
          ...state.regionLoader,
          currentRegion: regionId,
        },
      })),
      
      addPreloadRegion: (regionId: string) => set((state) => {
        if (state.regionLoader.preloadRegions.includes(regionId)) return {};
        
        return {
          regionLoader: {
            ...state.regionLoader,
            preloadRegions: [...state.regionLoader.preloadRegions, regionId],
          },
        };
      }),
      
      removePreloadRegion: (regionId: string) => set((state) => ({
        regionLoader: {
          ...state.regionLoader,
          preloadRegions: state.regionLoader.preloadRegions.filter(id => id !== regionId),
        },
      })),
      
      clearRegionCache: () => set((state) => ({
        regionLoader: {
          ...state.regionLoader,
          loadedRegions: [],
          loadingRegions: [],
          currentRegion: null,
          preloadRegions: [],
          stats: {
            totalLoaded: 0,
            totalSize: 0,
            loadTimes: {},
            errors: [],
          },
        },
      })),
      
      getRegionLoaderStatus: () => {
        const state = get();
        return {
          loadedRegions: state.regionLoader.loadedRegions,
          loadingRegions: state.regionLoader.loadingRegions,
          currentRegion: state.regionLoader.currentRegion,
          preloadRegions: state.regionLoader.preloadRegions,
          stats: state.regionLoader.stats,
        };
      },
      
      getPreloadRecommendationForCurrent: () => {
        const state = get();
        if (!state.regionLoader.currentRegion) return [];
        return getPreloadRecommendation(state.regionLoader.currentRegion);
      },
      
      resetProgress: () => set({
        ...DEFAULT_V2_STATE,
        selectedCharacterId: null,
        unlockedLevels: INITIAL_UNLOCKED,
        completedLevels: {},
        tutorialCompleted: false,
        currentLevelId: null,
        totalPlayTime: 0,
      }),
    }),
    {
      name: 'astra-artillery-save',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 1) {
          // Migration from v1 to v2 handled by storage layer
          return persistedState;
        }
        return persistedState as SaveDataV2;
      },
    }
  )
);

// Expose store globally for test access
if (typeof window !== 'undefined') {
  (window as any).__ZUSTAND_STORES__ = (window as any).__ZUSTAND_STORES__ || {};
  (window as any).__ZUSTAND_STORES__.gameStore = useGameStore;
}

interface BattleState {
  playerCharacter: Character | null;
  cpuCharacter: Character | null;
  levelId: string | null;
  difficulty: 'easy' | 'normal' | 'hard';
  battleResult: 'playing' | 'player_win' | 'cpu_win' | 'draw' | null;
  turnsPlayed: number;
  playerDamageDealt: number;
  cpuDamageDealt: number;
  weather: 'clear' | 'windy' | 'rain' | 'storm' | 'fog' | 'sandstorm' | 'snow';
  
  setBattleConfig: (config: { playerCharacter: Character; cpuCharacter: Character; levelId: string; difficulty: 'easy' | 'normal' | 'hard' }) => void;
  setWeather: (weather: BattleState['weather']) => void;
  recordDamage: (isPlayer: boolean, damage: number) => void;
  incrementTurns: () => void;
  setBattleResult: (result: BattleState['battleResult']) => void;
  resetBattle: () => void;
}

export const useBattleStore = create<BattleState>((set) => ({
  playerCharacter: null,
  cpuCharacter: null,
  levelId: null,
  difficulty: 'normal',
  battleResult: 'playing',
  turnsPlayed: 0,
  playerDamageDealt: 0,
  cpuDamageDealt: 0,
  weather: 'clear',
  
  setBattleConfig: (config) => set(config),
  
  setWeather: (weather) => set({ weather }),
  
  recordDamage: (isPlayer, damage) => set((state) => ({
    playerDamageDealt: isPlayer ? state.playerDamageDealt + damage : state.playerDamageDealt,
    cpuDamageDealt: !isPlayer ? state.cpuDamageDealt + damage : state.cpuDamageDealt,
  })),
  
  incrementTurns: () => set((state) => ({ turnsPlayed: state.turnsPlayed + 1 })),
  
  setBattleResult: (result) => set({ battleResult: result }),
  
  resetBattle: () => set({
    playerCharacter: null,
    cpuCharacter: null,
    levelId: null,
    difficulty: 'normal',
    battleResult: 'playing',
    turnsPlayed: 0,
    playerDamageDealt: 0,
    cpuDamageDealt: 0,
    weather: 'clear',
  }),
}));