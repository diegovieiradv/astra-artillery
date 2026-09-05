export type MissionCategory = 
  | 'story' 
  | 'combat' 
  | 'precision' 
  | 'character' 
  | 'region' 
  | 'mastery';

export type MissionObjectiveType = 
  | 'complete_level' 
  | 'win_battle' 
  | 'perfect_win' 
  | 'long_range_hit' 
  | 'no_tactical_items' 
  | 'specific_character' 
  | 'defeat_boss' 
  | 'turn_limit' 
  | 'hp_threshold' 
  | 'complete_region' 
  | 'reach_mastery_level' 
  | 'use_special_ability' 
  | 'collect_stars';

export interface MissionObjective {
  type: MissionObjectiveType;
  target?: string | number;
  count?: number;
  levelId?: number;
  regionId?: string;
  characterId?: string;
}

export interface MissionReward {
  type: 'currency' | 'xp' | 'cosmetic' | 'title' | 'lore' | 'skin';
  id: string;
  quantity?: number;
}

export interface MissionConfig {
  id: string;
  name: string;
  description: string;
  category: MissionCategory;
  objectives: MissionObjective[];
  rewards: MissionReward[];
  isRepeatable: boolean;
  unlockRequirement?: {
    type: 'level' | 'region' | 'character_mastery' | 'mission';
    value: string | number;
  };
}

export const MISSION_CATEGORIES: Record<MissionCategory, { label: string; icon: string; color: string }> = {
  story: { label: 'História', icon: '📖', color: '#60a5fa' },
  combat: { label: 'Combate', icon: '⚔️', color: '#f87171' },
  precision: { label: 'Precisão', icon: '🎯', color: '#a78bfa' },
  character: { label: 'Personagem', icon: '👤', color: '#34d399' },
  region: { label: 'Região', icon: '🌍', color: '#fbbf24' },
  mastery: { label: 'Maestria', icon: '🏆', color: '#f472b6' },
};

export const MISSIONS: MissionConfig[] = [
  // STORY MISSIONS
  {
    id: 'story_first_battle',
    name: 'Primeiro Disparo',
    description: 'Complete sua primeira batalha.',
    category: 'story',
    objectives: [{ type: 'complete_level', levelId: 1 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 100 }, { type: 'xp', id: 'player_xp', quantity: 50 }],
    isRepeatable: false,
  },
  {
    id: 'story_green_valley',
    name: 'Guardião do Vale',
    description: 'Derrote o Guardião Verdante e recupere o Núcleo Verde.',
    category: 'story',
    objectives: [{ type: 'defeat_boss', levelId: 5 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 500 }, { type: 'xp', id: 'player_xp', quantity: 200 }, { type: 'lore', id: 'lore_green_core' }],
    isRepeatable: false,
    unlockRequirement: { type: 'level', value: 4 },
  },
  {
    id: 'story_crystal_desert',
    name: 'Titã de Cristal',
    description: 'Derrote o Titã de Cristal no Deserto.',
    category: 'story',
    objectives: [{ type: 'defeat_boss', levelId: 10 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 750 }, { type: 'xp', id: 'player_xp', quantity: 300 }, { type: 'lore', id: 'lore_desert_core' }],
    isRepeatable: false,
    unlockRequirement: { type: 'level', value: 9 },
  },
  {
    id: 'story_frozen_peaks',
    name: 'Dragão de Gelo',
    description: 'Derrote o Frost Wyrm nos Picos Congelados.',
    category: 'story',
    objectives: [{ type: 'defeat_boss', levelId: 15 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 1200 }, { type: 'xp', id: 'player_xp', quantity: 400 }, { type: 'lore', id: 'lore_frost_core' }],
    isRepeatable: false,
    unlockRequirement: { type: 'level', value: 14 },
  },
  {
    id: 'story_ember_lands',
    name: 'Senhor do Magma',
    description: 'Derrote o Magma Lord nas Terras de Brasa.',
    category: 'story',
    objectives: [{ type: 'defeat_boss', levelId: 20 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 2000 }, { type: 'xp', id: 'player_xp', quantity: 500 }, { type: 'lore', id: 'lore_ember_core' }],
    isRepeatable: false,
    unlockRequirement: { type: 'level', value: 19 },
  },
  {
    id: 'story_sky_kingdom',
    name: 'Soberano da Tempestade',
    description: 'Derrote o Storm Sovereign no Reino Celestial.',
    category: 'story',
    objectives: [{ type: 'defeat_boss', levelId: 25 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 5000 }, { type: 'xp', id: 'player_xp', quantity: 600 }, { type: 'lore', id: 'lore_sky_core' }],
    isRepeatable: false,
    unlockRequirement: { type: 'level', value: 24 },
  },
  {
    id: 'story_dark_citadel',
    name: 'Arconte do Vazio',
    description: 'Derrote o Void Archon e complete a campanha.',
    category: 'story',
    objectives: [{ type: 'defeat_boss', levelId: 30 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 15000 }, { type: 'xp', id: 'player_xp', quantity: 1000 }, { type: 'title', id: 'title_campaign_complete' }, { type: 'lore', id: 'lore_final_core' }],
    isRepeatable: false,
    unlockRequirement: { type: 'level', value: 29 },
  },

  // COMBAT MISSIONS
  {
    id: 'combat_10_wins',
    name: 'Vitorioso',
    description: 'Vença 10 batalhas.',
    category: 'combat',
    objectives: [{ type: 'win_battle', count: 10 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 300 }, { type: 'xp', id: 'player_xp', quantity: 100 }],
    isRepeatable: false,
  },
  {
    id: 'combat_50_wins',
    name: 'Veterano de Guerra',
    description: 'Vença 50 batalhas.',
    category: 'combat',
    objectives: [{ type: 'win_battle', count: 50 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 1000 }, { type: 'xp', id: 'player_xp', quantity: 300 }, { type: 'title', id: 'title_war_veteran' }],
    isRepeatable: false,
  },
  {
    id: 'combat_5_perfect',
    name: 'Perfeição',
    description: 'Vença 5 batalhas sem receber dano.',
    category: 'combat',
    objectives: [{ type: 'perfect_win', count: 5 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 500 }, { type: 'xp', id: 'player_xp', quantity: 200 }],
    isRepeatable: false,
  },
  {
    id: 'combat_no_items',
    name: 'Puro Talento',
    description: 'Vença uma batalha sem usar itens táticos.',
    category: 'combat',
    objectives: [{ type: 'no_tactical_items', count: 1 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 200 }, { type: 'xp', id: 'player_xp', quantity: 100 }],
    isRepeatable: true,
  },

  // PRECISION MISSIONS
  {
    id: 'precision_long_range',
    name: 'Olho de Falcão',
    description: 'Acerte um disparo a mais de 1000 unidades de distância.',
    category: 'precision',
    objectives: [{ type: 'long_range_hit', target: 1000 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 300 }, { type: 'xp', id: 'player_xp', quantity: 150 }],
    isRepeatable: false,
  },
  {
    id: 'precision_3_stars',
    name: 'Caçador de Estrelas',
    description: 'Conquiste 3 estrelas em 5 fases diferentes.',
    category: 'precision',
    objectives: [{ type: 'collect_stars', count: 15 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 500 }, { type: 'xp', id: 'player_xp', quantity: 200 }, { type: 'title', id: 'title_star_hunter' }],
    isRepeatable: false,
  },

  // CHARACTER MISSIONS
  {
    id: 'character_kai_10',
    name: 'Mestre Kai',
    description: 'Vença 10 batalhas com Kai.',
    category: 'character',
    objectives: [{ type: 'specific_character', characterId: 'kai', count: 10 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 300 }, { type: 'xp', id: 'player_xp', quantity: 100 }],
    isRepeatable: false,
  },
  {
    id: 'character_luna_10',
    name: 'Precisão Cirúrgica',
    description: 'Vença 10 batalhas com Luna.',
    category: 'character',
    objectives: [{ type: 'specific_character', characterId: 'luna', count: 10 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 300 }, { type: 'xp', id: 'player_xp', quantity: 100 }],
    isRepeatable: false,
  },
  {
    id: 'character_bolt_10',
    name: 'Força Bruta',
    description: 'Vença 10 batalhas com Bolt.',
    category: 'character',
    objectives: [{ type: 'specific_character', characterId: 'bolt', count: 10 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 300 }, { type: 'xp', id: 'player_xp', quantity: 100 }],
    isRepeatable: false,
  },
  {
    id: 'character_nova_10',
    name: 'Estrategista',
    description: 'Vença 10 batalhas com Nova.',
    category: 'character',
    objectives: [{ type: 'specific_character', characterId: 'nova', count: 10 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 300 }, { type: 'xp', id: 'player_xp', quantity: 100 }],
    isRepeatable: false,
  },
  {
    id: 'character_all_5',
    name: 'Time Completo',
    description: 'Vença 5 batalhas com cada personagem.',
    category: 'character',
    objectives: [
      { type: 'specific_character', characterId: 'kai', count: 5 },
      { type: 'specific_character', characterId: 'luna', count: 5 },
      { type: 'specific_character', characterId: 'bolt', count: 5 },
      { type: 'specific_character', characterId: 'nova', count: 5 },
      { type: 'specific_character', characterId: 'zephyr', count: 5 },
      { type: 'specific_character', characterId: 'torn', count: 5 },
      { type: 'specific_character', characterId: 'pyra', count: 5 },
      { type: 'specific_character', characterId: 'mira', count: 5 },
      { type: 'specific_character', characterId: 'rook', count: 5 },
      { type: 'specific_character', characterId: 'drax', count: 5 },
    ],
    rewards: [{ type: 'currency', id: 'coins', quantity: 2000 }, { type: 'xp', id: 'player_xp', quantity: 500 }, { type: 'title', id: 'title_versatile' }],
    isRepeatable: false,
  },

  // REGION MISSIONS
  {
    id: 'region_green_valley',
    name: 'Explorador do Vale',
    description: 'Complete todas as fases do Vale Verde.',
    category: 'region',
    objectives: [{ type: 'complete_region', regionId: 'green_valley' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 500 }, { type: 'xp', id: 'player_xp', quantity: 200 }, { type: 'cosmetic', id: 'frame_green_valley' }],
    isRepeatable: false,
  },
  {
    id: 'region_crystal_desert',
    name: 'Navegador do Deserto',
    description: 'Complete todas as fases do Deserto de Cristal.',
    category: 'region',
    objectives: [{ type: 'complete_region', regionId: 'crystal_desert' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 750 }, { type: 'xp', id: 'player_xp', quantity: 300 }, { type: 'cosmetic', id: 'frame_crystal_desert' }],
    isRepeatable: false,
    unlockRequirement: { type: 'region', value: 'crystal_desert' },
  },
  {
    id: 'region_frozen_peaks',
    name: 'Conquistador dos Picos',
    description: 'Complete todas as fases dos Picos Congelados.',
    category: 'region',
    objectives: [{ type: 'complete_region', regionId: 'frozen_peaks' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 1200 }, { type: 'xp', id: 'player_xp', quantity: 400 }, { type: 'cosmetic', id: 'frame_frozen_peaks' }],
    isRepeatable: false,
    unlockRequirement: { type: 'region', value: 'frozen_peaks' },
  },
  {
    id: 'region_ember_lands',
    name: 'Senhor das Chamas',
    description: 'Complete todas as fases das Terras de Brasa.',
    category: 'region',
    objectives: [{ type: 'complete_region', regionId: 'ember_lands' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 2000 }, { type: 'xp', id: 'player_xp', quantity: 500 }, { type: 'cosmetic', id: 'frame_ember_lands' }],
    isRepeatable: false,
    unlockRequirement: { type: 'region', value: 'ember_lands' },
  },
  {
    id: 'region_sky_kingdom',
    name: 'Mestre dos Ventos',
    description: 'Complete todas as fases do Reino Celestial.',
    category: 'region',
    objectives: [{ type: 'complete_region', regionId: 'sky_kingdom' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 5000 }, { type: 'xp', id: 'player_xp', quantity: 600 }, { type: 'cosmetic', id: 'frame_sky_kingdom' }],
    isRepeatable: false,
    unlockRequirement: { type: 'region', value: 'sky_kingdom' },
  },
  {
    id: 'region_dark_citadel',
    name: 'Libertação Total',
    description: 'Complete todas as fases da Cidadela Sombria.',
    category: 'region',
    objectives: [{ type: 'complete_region', regionId: 'dark_citadel' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 15000 }, { type: 'xp', id: 'player_xp', quantity: 1000 }, { type: 'title', id: 'title_astra_liberator' }, { type: 'cosmetic', id: 'frame_dark_citadel' }],
    isRepeatable: false,
    unlockRequirement: { type: 'region', value: 'dark_citadel' },
  },

  // MASTERY MISSIONS
  {
    id: 'mastery_kai_10',
    name: 'Maestria Kai',
    description: 'Alcance o nível 10 de maestria com Kai.',
    category: 'mastery',
    objectives: [{ type: 'reach_mastery_level', characterId: 'kai', target: 10 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 1000 }, { type: 'xp', id: 'player_xp', quantity: 300 }, { type: 'skin', id: 'skin_kai_master' }],
    isRepeatable: false,
    unlockRequirement: { type: 'character_mastery', value: 'kai:5' },
  },
  {
    id: 'mastery_all_5',
    name: 'Poliglota de Artilharia',
    description: 'Alcance nível 5 de maestria com todos os personagens.',
    category: 'mastery',
    objectives: [
      { type: 'reach_mastery_level', characterId: 'kai', target: 5 },
      { type: 'reach_mastery_level', characterId: 'luna', target: 5 },
      { type: 'reach_mastery_level', characterId: 'bolt', target: 5 },
      { type: 'reach_mastery_level', characterId: 'nova', target: 5 },
      { type: 'reach_mastery_level', characterId: 'zephyr', target: 5 },
      { type: 'reach_mastery_level', characterId: 'torn', target: 5 },
      { type: 'reach_mastery_level', characterId: 'pyra', target: 5 },
      { type: 'reach_mastery_level', characterId: 'mira', target: 5 },
      { type: 'reach_mastery_level', characterId: 'rook', target: 5 },
      { type: 'reach_mastery_level', characterId: 'drax', target: 5 },
    ],
    rewards: [{ type: 'currency', id: 'coins', quantity: 5000 }, { type: 'xp', id: 'player_xp', quantity: 1000 }, { type: 'title', id: 'title_master_of_all' }],
    isRepeatable: false,
    unlockRequirement: { type: 'character_mastery', value: 'kai:5' },
  },

  // DAILY / REPEATABLE
  {
    id: 'daily_win',
    name: 'Vitória Diária',
    description: 'Vença uma batalha hoje.',
    category: 'combat',
    objectives: [{ type: 'win_battle', count: 1 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 50 }, { type: 'xp', id: 'player_xp', quantity: 25 }],
    isRepeatable: true,
  },
  {
    id: 'daily_special',
    name: 'Especialista',
    description: 'Use uma habilidade especial em batalha.',
    category: 'combat',
    objectives: [{ type: 'use_special_ability', count: 1 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 30 }, { type: 'xp', id: 'player_xp', quantity: 15 }],
    isRepeatable: true,
  },
];

export function getMission(id: string): MissionConfig | undefined {
  return MISSIONS.find(m => m.id === id);
}

export function getMissionsByCategory(category: MissionCategory): MissionConfig[] {
  return MISSIONS.filter(m => m.category === category);
}

export function getAllMissions(): MissionConfig[] {
  return MISSIONS;
}

export function getAvailableMissions(completedMissions: string[], playerLevel: number, unlockedRegions: string[], characterMastery: Record<string, { level: number }>): MissionConfig[] {
  return MISSIONS.filter(mission => {
    if (completedMissions.includes(mission.id) && !mission.isRepeatable) {
      return false;
    }
    if (mission.unlockRequirement) {
      switch (mission.unlockRequirement.type) {
        case 'level':
          if (playerLevel < (mission.unlockRequirement.value as number)) return false;
          break;
        case 'region':
          if (!unlockedRegions.includes(mission.unlockRequirement.value as string)) return false;
          break;
        case 'character_mastery': {
          const [charId, level] = (mission.unlockRequirement.value as string).split(':');
          if (!characterMastery[charId] || characterMastery[charId].level < (parseInt(level) || 0)) return false;
          break;
        }
        case 'mission':
          if (!completedMissions.includes(mission.unlockRequirement.value as string)) return false;
          break;
      }
    }
    return true;
  });
}

export interface MissionProgress {
  missionId: string;
  currentProgress: Record<string, number>;
  completed: boolean;
  claimed: boolean;
  startedAt: number;
}

export const DEFAULT_MISSION_PROGRESS: Record<string, MissionProgress> = {};