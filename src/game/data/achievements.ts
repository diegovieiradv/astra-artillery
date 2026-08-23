export type AchievementCategory = 
  | 'progression' 
  | 'combat' 
  | 'precision' 
  | 'exploration' 
  | 'mastery' 
  | 'collection' 
  | 'special';

export type AchievementTriggerType = 
  | 'first_battle' 
  | 'battle_win' 
  | 'battle_loss' 
  | 'perfect_win' 
  | 'boss_defeated' 
  | 'level_completed' 
  | 'region_completed' 
  | 'stars_collected' 
  | 'long_range_hit' 
  | 'accuracy_threshold' 
  | 'character_mastery_level' 
  | 'all_characters_mastery' 
  | 'player_level' 
  | 'cosmetic_unlocked' 
  | 'all_cosmetics_category' 
  | 'mission_completed' 
  | 'all_missions_category' 
  | 'campaign_completed' 
  | 'new_game_plus' 
  | 'special_ability_used' 
  | 'tactical_item_used';

export interface AchievementTrigger {
  type: AchievementTriggerType;
  target?: string | number;
  count?: number;
  characterId?: string;
  regionId?: string;
  levelId?: number;
}

export interface AchievementReward {
  type: 'currency' | 'cosmetic' | 'title' | 'badge' | 'lore';
  id: string;
  quantity?: number;
}

export interface AchievementConfig {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  triggers: AchievementTrigger[];
  rewards: AchievementReward[];
  isHidden: boolean;
  points: number;
}

export const ACHIEVEMENT_CATEGORIES: Record<AchievementCategory, { label: string; icon: string; color: string }> = {
  progression: { label: 'Progressão', icon: '📈', color: '#60a5fa' },
  combat: { label: 'Combate', icon: '⚔️', color: '#f87171' },
  precision: { label: 'Precisão', icon: '🎯', color: '#a78bfa' },
  exploration: { label: 'Exploração', icon: '🌍', color: '#34d399' },
  mastery: { label: 'Maestria', icon: '🏆', color: '#f472b6' },
  collection: { label: 'Coleção', icon: '🎨', color: '#fbbf24' },
  special: { label: 'Especial', icon: '✨', color: '#f97316' },
};

export const ACHIEVEMENTS: AchievementConfig[] = [
  // PROGRESSION
  {
    id: 'first_blast',
    name: 'Primeira Explosão',
    description: 'Complete sua primeira batalha.',
    category: 'progression',
    triggers: [{ type: 'first_battle' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 100 }, { type: 'badge', id: 'badge_first_blast' }],
    isHidden: false,
    points: 10,
  },
  {
    id: 'ten_battles',
    name: 'Dez Batalhas',
    description: 'Complete 10 batalhas.',
    category: 'progression',
    triggers: [{ type: 'battle_win', count: 10 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 300 }, { type: 'badge', id: 'badge_ten_battles' }],
    isHidden: false,
    points: 20,
  },
  {
    id: 'fifty_battles',
    name: 'Veterano',
    description: 'Complete 50 batalhas.',
    category: 'progression',
    triggers: [{ type: 'battle_win', count: 50 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 1000 }, { type: 'title', id: 'title_veteran' }, { type: 'badge', id: 'badge_fifty_battles' }],
    isHidden: false,
    points: 50,
  },
  {
    id: 'hundred_battles',
    name: 'Centurião',
    description: 'Complete 100 batalhas.',
    category: 'progression',
    triggers: [{ type: 'battle_win', count: 100 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 2500 }, { type: 'title', id: 'title_centurion' }, { type: 'badge', id: 'badge_hundred_battles' }],
    isHidden: false,
    points: 100,
  },
  {
    id: 'level_10',
    name: 'Artilheiro Experiente',
    description: 'Alcance o nível 10 de jogador.',
    category: 'progression',
    triggers: [{ type: 'player_level', target: 10 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 500 }, { type: 'title', id: 'title_experienced' }, { type: 'badge', id: 'badge_level_10' }],
    isHidden: false,
    points: 30,
  },
  {
    id: 'level_20',
    name: 'Mestre de Astra',
    description: 'Alcance o nível 20 de jogador.',
    category: 'progression',
    triggers: [{ type: 'player_level', target: 20 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 2000 }, { type: 'title', id: 'title_astra_master' }, { type: 'badge', id: 'badge_level_20' }, { type: 'cosmetic', id: 'frame_astra_master' }],
    isHidden: false,
    points: 60,
  },
  {
    id: 'level_30',
    name: 'Lenda Viva',
    description: 'Alcance o nível máximo (30) de jogador.',
    category: 'progression',
    triggers: [{ type: 'player_level', target: 30 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 5000 }, { type: 'title', id: 'title_legend' }, { type: 'badge', id: 'badge_level_30' }, { type: 'cosmetic', id: 'skin_legendary' }],
    isHidden: false,
    points: 100,
  },

  // COMBAT
  {
    id: 'boss_breaker',
    name: 'Quebrador de Bosses',
    description: 'Derrote seu primeiro Boss.',
    category: 'combat',
    triggers: [{ type: 'boss_defeated', count: 1 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 500 }, { type: 'badge', id: 'badge_boss_breaker' }],
    isHidden: false,
    points: 25,
  },
  {
    id: 'five_bosses',
    name: 'Caçador de Titãs',
    description: 'Derrote 5 bosses diferentes.',
    category: 'combat',
    triggers: [{ type: 'boss_defeated', count: 5 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 1500 }, { type: 'title', id: 'title_titan_hunter' }, { type: 'badge', id: 'badge_five_bosses' }],
    isHidden: false,
    points: 50,
  },
  {
    id: 'all_bosses',
    name: 'Conquistador Supremo',
    description: 'Derrote todos os 6 bosses da campanha.',
    category: 'combat',
    triggers: [{ type: 'boss_defeated', count: 6 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 5000 }, { type: 'title', id: 'title_supreme_conqueror' }, { type: 'badge', id: 'badge_all_bosses' }, { type: 'cosmetic', id: 'skin_boss_slayer' }],
    isHidden: false,
    points: 100,
  },
  {
    id: 'perfect_win',
    name: 'Impecável',
    description: 'Vença uma batalha sem receber dano.',
    category: 'combat',
    triggers: [{ type: 'perfect_win', count: 1 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 200 }, { type: 'badge', id: 'badge_perfect_win' }],
    isHidden: false,
    points: 15,
  },
  {
    id: 'ten_perfect_wins',
    name: 'Perfeição Absoluta',
    description: 'Vença 10 batalhas sem receber dano.',
    category: 'combat',
    triggers: [{ type: 'perfect_win', count: 10 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 1000 }, { type: 'title', id: 'title_flawless' }, { type: 'badge', id: 'badge_ten_perfect' }],
    isHidden: false,
    points: 50,
  },
  {
    id: 'no_tactical_items',
    name: 'Puro Talento',
    description: 'Vença uma batalha sem usar itens táticos.',
    category: 'combat',
    triggers: [{ type: 'battle_win', target: 'no_tactical_items', count: 1 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 300 }, { type: 'badge', id: 'badge_no_items' }],
    isHidden: false,
    points: 20,
  },

  // PRECISION
  {
    id: 'star_hunter',
    name: 'Caçador de Estrelas',
    description: 'Colete 50 estrelas no total.',
    category: 'precision',
    triggers: [{ type: 'stars_collected', count: 50 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 500 }, { type: 'title', id: 'title_star_hunter' }, { type: 'badge', id: 'badge_star_hunter' }],
    isHidden: false,
    points: 30,
  },
  {
    id: 'star_collector',
    name: 'Colecionador de Estrelas',
    description: 'Colete 150 estrelas no total.',
    category: 'precision',
    triggers: [{ type: 'stars_collected', count: 150 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 2000 }, { type: 'title', id: 'title_star_collector' }, { type: 'badge', id: 'badge_star_collector' }, { type: 'cosmetic', id: 'trail_stars' }],
    isHidden: false,
    points: 60,
  },
  {
    id: 'all_stars',
    name: 'Mestre das Estrelas',
    description: 'Conquiste 3 estrelas em todas as 30 fases.',
    category: 'precision',
    triggers: [{ type: 'stars_collected', count: 90 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 5000 }, { type: 'title', id: 'title_star_master' }, { type: 'badge', id: 'badge_all_stars' }, { type: 'cosmetic', id: 'frame_star_master' }],
    isHidden: false,
    points: 100,
  },
  {
    id: 'long_range_shot',
    name: 'Olho de Falcão',
    description: 'Acerte um disparo a mais de 1200 unidades.',
    category: 'precision',
    triggers: [{ type: 'long_range_hit', target: 1200 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 300 }, { type: 'badge', id: 'badge_long_range' }],
    isHidden: false,
    points: 20,
  },
  {
    id: 'accuracy_80',
    name: 'Mira Calibrada',
    description: 'Mantenha 80% de precisão em 20 batalhas.',
    category: 'precision',
    triggers: [{ type: 'accuracy_threshold', target: 80, count: 20 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 500 }, { type: 'title', id: 'title_sharpshooter' }, { type: 'badge', id: 'badge_accuracy_80' }],
    isHidden: false,
    points: 40,
  },

  // EXPLORATION
  {
    id: 'green_valley_explorer',
    name: 'Explorador do Vale Verde',
    description: 'Complete todas as fases do Vale Verde.',
    category: 'exploration',
    triggers: [{ type: 'region_completed', regionId: 'green_valley' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 300 }, { type: 'badge', id: 'badge_green_valley' }, { type: 'cosmetic', id: 'frame_green_valley' }],
    isHidden: false,
    points: 20,
  },
  {
    id: 'crystal_desert_explorer',
    name: 'Navegador do Deserto',
    description: 'Complete todas as fases do Deserto de Cristal.',
    category: 'exploration',
    triggers: [{ type: 'region_completed', regionId: 'crystal_desert' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 500 }, { type: 'badge', id: 'badge_crystal_desert' }, { type: 'cosmetic', id: 'frame_crystal_desert' }],
    isHidden: false,
    points: 25,
  },
  {
    id: 'frozen_peaks_explorer',
    name: 'Conquistador dos Picos',
    description: 'Complete todas as fases dos Picos Congelados.',
    category: 'exploration',
    triggers: [{ type: 'region_completed', regionId: 'frozen_peaks' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 800 }, { type: 'badge', id: 'badge_frozen_peaks' }, { type: 'cosmetic', id: 'frame_frozen_peaks' }],
    isHidden: false,
    points: 30,
  },
  {
    id: 'ember_lands_explorer',
    name: 'Senhor das Chamas',
    description: 'Complete todas as fases das Terras de Brasa.',
    category: 'exploration',
    triggers: [{ type: 'region_completed', regionId: 'ember_lands' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 1200 }, { type: 'badge', id: 'badge_ember_lands' }, { type: 'cosmetic', id: 'frame_ember_lands' }],
    isHidden: false,
    points: 35,
  },
  {
    id: 'sky_kingdom_explorer',
    name: 'Mestre dos Ventos',
    description: 'Complete todas as fases do Reino Celestial.',
    category: 'exploration',
    triggers: [{ type: 'region_completed', regionId: 'sky_kingdom' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 2000 }, { type: 'badge', id: 'badge_sky_kingdom' }, { type: 'cosmetic', id: 'frame_sky_kingdom' }],
    isHidden: false,
    points: 40,
  },
  {
    id: 'dark_citadel_explorer',
    name: 'Libertação Total',
    description: 'Complete todas as fases da Cidadela Sombria.',
    category: 'exploration',
    triggers: [{ type: 'region_completed', regionId: 'dark_citadel' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 3000 }, { type: 'title', id: 'title_astra_liberator' }, { type: 'badge', id: 'badge_dark_citadel' }, { type: 'cosmetic', id: 'frame_dark_citadel' }],
    isHidden: false,
    points: 50,
  },
  {
    id: 'all_regions',
    name: 'Viajante de Astra',
    description: 'Complete todas as 6 regiões.',
    category: 'exploration',
    triggers: [{ type: 'region_completed', count: 6 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 10000 }, { type: 'title', id: 'title_astra_traveler' }, { type: 'badge', id: 'badge_all_regions' }, { type: 'cosmetic', id: 'banner_world_explorer' }],
    isHidden: false,
    points: 100,
  },

  // MASTERY
  {
    id: 'kai_master',
    name: 'Mestre Kai',
    description: 'Alcance nível 10 de maestria com Kai.',
    category: 'mastery',
    triggers: [{ type: 'character_mastery_level', characterId: 'kai', target: 10 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 1000 }, { type: 'title', id: 'title_kai_master' }, { type: 'badge', id: 'badge_kai_master' }, { type: 'cosmetic', id: 'skin_kai_master' }],
    isHidden: false,
    points: 40,
  },
  {
    id: 'all_characters_mastery_5',
    name: 'Poliglota de Artilharia',
    description: 'Alcance nível 5 de maestria com todos os 8 personagens.',
    category: 'mastery',
    triggers: [{ type: 'all_characters_mastery', target: 5 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 5000 }, { type: 'title', id: 'title_master_of_all' }, { type: 'badge', id: 'badge_all_mastery_5' }],
    isHidden: false,
    points: 80,
  },
  {
    id: 'all_characters_mastery_10',
    name: 'Grão-Mestre',
    description: 'Alcance nível 10 de maestria com todos os 8 personagens.',
    category: 'mastery',
    triggers: [{ type: 'all_characters_mastery', target: 10 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 20000 }, { type: 'title', id: 'title_grandmaster' }, { type: 'badge', id: 'badge_all_mastery_10' }, { type: 'cosmetic', id: 'skin_grandmaster' }],
    isHidden: false,
    points: 150,
  },

  // COLLECTION
  {
    id: 'first_cosmetic',
    name: 'Estilo Próprio',
    description: 'Desbloqueie seu primeiro cosmético.',
    category: 'collection',
    triggers: [{ type: 'cosmetic_unlocked' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 100 }, { type: 'badge', id: 'badge_first_cosmetic' }],
    isHidden: false,
    points: 10,
  },
  {
    id: 'ten_cosmetics',
    name: 'Colecionador',
    description: 'Desbloqueie 10 cosméticos.',
    category: 'collection',
    triggers: [{ type: 'cosmetic_unlocked', count: 10 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 500 }, { type: 'badge', id: 'badge_ten_cosmetics' }],
    isHidden: false,
    points: 25,
  },
  {
    id: 'all_frames',
    name: 'Moldureiro',
    description: 'Desbloqueie todas as molduras de perfil.',
    category: 'collection',
    triggers: [{ type: 'all_cosmetics_category', target: 'frame' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 2000 }, { type: 'title', id: 'title_frame_collector' }, { type: 'badge', id: 'badge_all_frames' }],
    isHidden: false,
    points: 40,
  },
  {
    id: 'all_skins',
    name: 'Troca de Roupas',
    description: 'Desbloqueie todas as skins de personagem.',
    category: 'collection',
    triggers: [{ type: 'all_cosmetics_category', target: 'skin' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 3000 }, { type: 'title', id: 'title_skin_collector' }, { type: 'badge', id: 'badge_all_skins' }],
    isHidden: false,
    points: 50,
  },
  {
    id: 'all_trails',
    name: 'Rastreador',
    description: 'Desbloqueie todas as trilhas de projétil.',
    category: 'collection',
    triggers: [{ type: 'all_cosmetics_category', target: 'trail' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 1500 }, { type: 'title', id: 'title_trail_collector' }, { type: 'badge', id: 'badge_all_trails' }],
    isHidden: false,
    points: 30,
  },

  // SPECIAL
  {
    id: 'campaign_complete',
    name: 'Guardião de Astra',
    description: 'Complete a campanha principal (derrote o Arconte do Vazio).',
    category: 'special',
    triggers: [{ type: 'campaign_completed' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 10000 }, { type: 'title', id: 'title_guardian_of_astra' }, { type: 'badge', id: 'badge_campaign_complete' }, { type: 'cosmetic', id: 'skin_guardian' }, { type: 'lore', id: 'lore_ending' }],
    isHidden: false,
    points: 100,
  },
  {
    id: 'new_game_plus',
    name: 'Nova Jornada',
    description: 'Inicie o New Game+.',
    category: 'special',
    triggers: [{ type: 'new_game_plus' }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 5000 }, { type: 'title', id: 'title_new_journey' }, { type: 'badge', id: 'badge_new_game_plus' }],
    isHidden: true,
    points: 50,
  },
  {
    id: 'special_ability_master',
    name: 'Mestre das Habilidades',
    description: 'Use habilidades especiais 100 vezes.',
    category: 'special',
    triggers: [{ type: 'special_ability_used', count: 100 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 500 }, { type: 'badge', id: 'badge_special_master' }],
    isHidden: false,
    points: 30,
  },
  {
    id: 'tactical_master',
    name: 'Tático',
    description: 'Use itens táticos 50 vezes.',
    category: 'special',
    triggers: [{ type: 'tactical_item_used', count: 50 }],
    rewards: [{ type: 'currency', id: 'coins', quantity: 500 }, { type: 'badge', id: 'badge_tactical_master' }],
    isHidden: false,
    points: 30,
  },
];

export function getAchievement(id: string): AchievementConfig | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAchievementsByCategory(category: AchievementCategory): AchievementConfig[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

export function getAllAchievements(): AchievementConfig[] {
  return ACHIEVEMENTS;
}

export function getVisibleAchievements(): AchievementConfig[] {
  return ACHIEVEMENTS.filter(a => !a.isHidden);
}

export function getTotalAchievementPoints(): number {
  return ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0);
}

export function getUnlockedAchievements(achievementsState: Record<string, { unlocked: boolean }>): string[] {
  return Object.entries(achievementsState)
    .filter(([, state]) => state.unlocked)
    .map(([id]) => id);
}

export interface AchievementState {
  unlocked: boolean;
  unlockedAt?: number;
  progress: Record<string, number>;
}

export const DEFAULT_ACHIEVEMENT_STATE: Record<string, AchievementState> = {};

export function createDefaultAchievementState(): Record<string, AchievementState> {
  const state: Record<string, AchievementState> = {};
  for (const achievement of ACHIEVEMENTS) {
    state[achievement.id] = {
      unlocked: false,
      progress: {},
    };
    for (const trigger of achievement.triggers) {
      state[achievement.id].progress[trigger.type] = 0;
    }
  }
  return state;
}