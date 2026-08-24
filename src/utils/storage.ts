const STORAGE_KEY = 'astra-artillery-save';
const CURRENT_VERSION = 2;

import { GameState } from '@/stores/gameStore';
import { createDefaultMasteryState } from '@/game/data/characterMastery';
import { createDefaultAchievementState } from '@/game/data/achievements';
import { createDefaultAstraCoreState } from '@/game/data/astraCores';
import { createDefaultTerrainState } from '@/game/data/terrain';
import { createDefaultMobileState } from '@/game/data/mobileValidation';
import { createDefaultTacticalInventory } from '@/game/data/tacticalItems';
import { createDefaultTrainingState } from '@/game/data/trainingMode';
import { createDefaultPrecisionState } from '@/game/data/precisionChallenge';
import { createDefaultLocalVersusState } from '@/game/data/localVersus';
import { createDefaultBossRushState } from '@/game/data/bossRush';
import { createDefaultNGPlusState } from '@/game/data/newGamePlus';
import { createDefaultRegionLoaderState } from '@/game/data/regionLoader';

export interface SaveDataV1 {
  version?: number;
  state: {
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
    };
    tutorialCompleted: boolean;
    currentLevelId: string | null;
    totalPlayTime: number;
  };
}

export type SaveDataV2 = {
  version: 2;
  state: GameStateData;
};

type GameStateData = Omit<GameState, 
  | 'selectCharacter' | 'unlockLevel' | 'completeLevel' | 'updateSettings' | 'setTutorialCompleted'
  | 'setCurrentLevel' | 'addPlayTime' | 'resetProgress' | 'earnCurrency' | 'spendCurrency' | 'canAfford'
  | 'unlockCharacter' | 'isCharacterUnlocked' | 'getUpgradeCost' | 'getUpgradeLevel' | 'getUpgradeStats'
  | 'upgradeCannon' | 'upgradeArmor' | 'upgradeMobility' | 'upgradeSpecial'
  | 'unlockCosmetic' | 'equipCosmetic' | 'unequipCosmetic' | 'isCosmeticUnlocked' | 'isCosmeticEquipped'
  | 'recordWin' | 'recordLoss' | 'recordSpecialUse'
  | 'unlockInventoryItem' | 'equipLoadoutItem' | 'getLoadout' | 'setLoadout'
  | 'getInventoryItem' | 'isItemOwned' | 'isItemEquipped' | 'getItemsByCategory'
  | 'earnXp' | 'getPlayerXp' | 'getPlayerLevel' | 'getXpForNextLevel' | 'getXpProgress' | 'checkLevelUp'
  | 'earnCharacterXp' | 'getCharacterMastery' | 'getMasteryLevel' | 'getMasteryXp' | 'getMasteryXpForNextLevel' | 'getMasteryProgress' | 'checkMasteryLevelUp'
  | 'getAvailableMissions' | 'getMissionProgress' | 'startMission' | 'updateMissionProgress' | 'completeMission' | 'claimMissionReward' | 'getCompletedMissions'
  | 'checkAchievements' | 'unlockAchievement' | 'getAchievementProgress' | 'getUnlockedAchievements' | 'getAchievementPoints'
  | 'unlockAstraCore' | 'useAstraCoreAbility' | 'getAstraCoreStatus' | 'getUnlockedAstraCores' | 'resetAstraCoreCooldowns'
  | 'migrateIfNeeded'
>;

const DEFAULT_V2_STATE: GameStateData = {
  selectedCharacterId: null,
  unlockedLevels: ['arena_1'],
  completedLevels: {},
  settings: {
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
    graphicsQuality: 'auto',
  },
  tutorialCompleted: false,
  currentLevelId: null,
  totalPlayTime: 0,
  currency: 0,
  unlockedCharacters: ['kai'],
  ownedCosmetics: [],
  equippedCosmetics: {},
  upgrades: {
    cannon: { level: 1, stats: { power: 1, precision: 1, blastRadius: 1 } },
    armor: { level: 1, stats: { hp: 1, defense: 1 } },
    mobility: { level: 1, stats: { moveDistance: 1, chargeSpeed: 1 } },
    special: { level: 1, stats: { cooldownReduction: 1, efficiency: 1 } },
  },
  statistics: {
    totalWins: 0,
    totalLosses: 0,
    totalDamageDealt: 0,
    totalDamageReceived: 0,
    specialsUsed: 0,
    perfectWins: 0,
  },
  playerXp: 0,
  playerLevel: 1,
  characterMastery: createDefaultMasteryState(),
  missions: {},
  completedMissions: [],
  achievements: createDefaultAchievementState(),
  astraCores: createDefaultAstraCoreState(),
  codex: {
    unlockedEntries: {} as Record<string, boolean>,
    unlockedCategories: {} as Record<string, boolean>,
    entryOrder: {} as Record<string, string[]>,
    categoryProgress: {} as Record<string, number>,
    totalEntries: 0,
    totalUnlocked: 0,
  },
  terrain: createDefaultTerrainState(),
  mobile: createDefaultMobileState(),
  tacticalInventory: createDefaultTacticalInventory(),
  training: createDefaultTrainingState(),
  precisionChallenge: createDefaultPrecisionState(),
  localVersus: createDefaultLocalVersusState(),
  bossRush: createDefaultBossRushState(),
  newGamePlus: createDefaultNGPlusState(),
  regionLoader: createDefaultRegionLoaderState(),
  inventory: {},
  loadout: {
    characterId: 'kai',
    cannonId: null,
    armorId: null,
    accessoryId: null,
    projectileId: 'normal',
    tacticalItemId: null,
  },
};

function isV1(data: unknown): data is SaveDataV1 {
  return (
    typeof data === 'object' &&
    data !== null &&
    'state' in data &&
    (!('version' in data) || (data as SaveDataV1).version === 1 || (data as SaveDataV1).version === undefined)
  );
}

function isV2(data: unknown): data is SaveDataV2 {
  return (
    typeof data === 'object' &&
    data !== null &&
    'version' in data &&
    (data as SaveDataV2).version === 2
  );
}

export function migrateV1toV2(v1Data: SaveDataV1): SaveDataV2 {
  const migrated: SaveDataV2 = {
    version: 2,
    state: {
      ...v1Data.state,
      currency: 0,
      unlockedCharacters: v1Data.state.selectedCharacterId ? [v1Data.state.selectedCharacterId] : ['kai'],
      ownedCosmetics: [],
      equippedCosmetics: {},
      upgrades: {
        cannon: { level: 1, stats: { power: 1, precision: 1, blastRadius: 1 } },
        armor: { level: 1, stats: { hp: 1, defense: 1 } },
        mobility: { level: 1, stats: { moveDistance: 1, chargeSpeed: 1 } },
        special: { level: 1, stats: { cooldownReduction: 1, efficiency: 1 } },
      },
      statistics: {
        totalWins: Object.values(v1Data.state.completedLevels).filter(l => l.stars > 0).length,
        totalLosses: 0,
        totalDamageDealt: 0,
        totalDamageReceived: 0,
        specialsUsed: 0,
        perfectWins: Object.values(v1Data.state.completedLevels).filter(l => l.stars === 3).length,
      },
      playerXp: 0,
      playerLevel: 1,
      characterMastery: createDefaultMasteryState(),
      missions: {},
      completedMissions: [],
      achievements: createDefaultAchievementState(),
      astraCores: createDefaultAstraCoreState(),
      codex: {
        unlockedEntries: {} as Record<string, boolean>,
        unlockedCategories: {} as Record<string, boolean>,
        entryOrder: {} as Record<string, string[]>,
        categoryProgress: {} as Record<string, number>,
        totalEntries: 0,
        totalUnlocked: 0,
      },
      terrain: createDefaultTerrainState(),
      mobile: createDefaultMobileState(),
      tacticalInventory: createDefaultTacticalInventory(),
      training: createDefaultTrainingState(),
      precisionChallenge: createDefaultPrecisionState(),
      localVersus: createDefaultLocalVersusState(),
      bossRush: createDefaultBossRushState(),
      newGamePlus: createDefaultNGPlusState(),
      regionLoader: createDefaultRegionLoaderState(),
      inventory: {},
      loadout: {
        characterId: 'kai',
        cannonId: null,
        armorId: null,
        accessoryId: null,
        projectileId: 'normal',
        tacticalItemId: null,
      },
      settings: {
        musicVolume: v1Data.state.settings?.musicVolume ?? 0.5,
        sfxVolume: v1Data.state.settings?.sfxVolume ?? 0.7,
        musicEnabled: v1Data.state.settings?.musicEnabled ?? true,
        sfxEnabled: v1Data.state.settings?.sfxEnabled ?? true,
        reduceMotion: v1Data.state.settings?.reduceMotion ?? false,
        showDamageNumbers: v1Data.state.settings?.showDamageNumbers ?? true,
        vibrationEnabled: v1Data.state.settings?.vibrationEnabled ?? true,
        screenShake: v1Data.state.settings?.screenShake ?? true,
        screenFlash: v1Data.state.settings?.screenFlash ?? true,
        particles: v1Data.state.settings?.particles ?? true,
        highContrast: v1Data.state.settings?.highContrast ?? false,
        largeText: v1Data.state.settings?.largeText ?? false,
        screenReader: v1Data.state.settings?.screenReader ?? false,
        graphicsQuality: 'auto',
      },
    },
  };
  return migrated;
}

export function getStoredData(): SaveDataV2 | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem('astra-artillery-save');
    if (!raw) return null;
    
    const parsed = JSON.parse(raw);
    
    if (isV2(parsed)) {
      return parsed;
    }
    
    if (isV1(parsed)) {
      const migrated = migrateV1toV2(parsed);
      saveData(migrated);
      return migrated;
    }
    
    return null;
  } catch {
    return null;
  }
}

export function saveData(data: SaveDataV2): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('astra-artillery-save', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save game data:', error);
  }
}

export function backupSave(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('astra-artillery-save');
    if (!raw) return null;
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    localStorage.setItem(`astra-artillery-backup-${ts}`, raw);
    return ts;
  } catch {
    return null;
  }
}

export function validateSaveImport(json: string): { valid: boolean; error?: string; data?: SaveDataV2 } {
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed !== 'object' || parsed === null) {
      return { valid: false, error: 'Invalid format: not an object' };
    }
    if (!('version' in parsed) || !('state' in parsed)) {
      return { valid: false, error: 'Invalid format: missing version or state' };
    }
    if (parsed.version !== 2 && parsed.version !== 1) {
      return { valid: false, error: `Unsupported version: ${parsed.version}` };
    }
    const state = parsed.state;
    if (!state || typeof state !== 'object') {
      return { valid: false, error: 'Invalid state object' };
    }
    const requiredKeys = ['selectedCharacterId', 'unlockedLevels', 'completedLevels', 'settings'];
    for (const key of requiredKeys) {
      if (!(key in state)) {
        return { valid: false, error: `Missing required field: ${key}` };
      }
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid JSON' };
  }
}

export function importSave(json: string): { success: boolean; error?: string } {
  const backupTs = backupSave();
  const result = validateSaveImport(json);
  if (!result.valid) {
    return { success: false, error: result.error };
  }
  try {
    const parsed = JSON.parse(json);
    if (parsed.version === 1) {
      const migrated = migrateV1toV2(parsed);
      saveData(migrated);
    } else {
      saveData(parsed);
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to import save' };
  }
}

export function clearStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('astra-artillery-save');
}

export function getCurrentVersion(): number {
  return CURRENT_VERSION;
}

export function isSaveOutdated(): boolean {
  const data = getStoredData();
  if (!data) return false;
  return data.version < CURRENT_VERSION;
}

export { DEFAULT_V2_STATE };