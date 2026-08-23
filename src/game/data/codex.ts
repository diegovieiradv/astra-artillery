export type CodexUnlockCondition = 
  | 'automatic'
  | 'achievement' 
  | 'mission' 
  | 'mastery' 
  | 'region_completed' 
  | 'boss_defeated' 
  | 'equipment_found'
  | 'core_unlocked'
  | 'total_cores'
  | 'total_regions'
  | 'total_achievements'
  | 'total_missions'
  | 'total_bosses';

export interface CodexEntry {
  id: string;
  title: string;
  description: string;
  unlockedBy?: CodexUnlockCondition;
  unlockedAt?: string;
  meta?: {
    rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    category?: string;
    order?: number;
  };
}

export interface CodexCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  entries: CodexEntry[];
  maxEntries: number;
  unlockCondition?: {
    type: 'total_cores' | 'total_regions' | 'total_achievements' | 'total_missions' | 'total_mastery' | 'total_bosses';
    target: number;
  };
}

export interface CodexState {
  unlockedEntries: Record<string, boolean>;
  unlockedCategories: Record<string, boolean>;
  entryOrder: Record<string, string[]>;
  categoryProgress: Record<string, number>;
  totalEntries: number;
  totalUnlocked: number;
}

export const CODEX_CATEGORIES: CodexCategory[] = [
  {
    id: 'characters',
    name: 'Personagens',
    description: 'Enciclopédia completa dos heróis e seus destinos',
    icon: '👤',
    entries: [
      {
        id: 'soldier_1',
        title: 'O Soldado',
        description: 'O guerreiro básico, treinado para o combate padrão. Seu caminho é a honra nas linhas de frente.',
        unlockedBy: 'automatic',
        meta: { rarity: 'common', order: 1 },
      },
      {
        id: 'soldier_2',
        title: 'O Soldado Veterano',
        description: 'Experiente em batalha, sobreviveu a incontáveis campanhas. Carrega as cicatrizes da guerra.',
        unlockedBy: 'mastery',
        meta: { rarity: 'uncommon', order: 2 },
      },
      {
        id: 'soldier_3',
        title: 'O Comandante',
        description: 'Líder nato que inspira coragem em seus companheiros. Mudou o curso de batalhas perdidas.',
        unlockedBy: 'mission',
        meta: { rarity: 'rare', order: 3 },
      },
      {
        id: 'soldier_4',
        title: 'O General',
        description: 'Estrategista supremo que venceu a guerra mais longa da história de Astra. A lenda vive.',
        unlockedBy: 'total_bosses',
        meta: { rarity: 'legendary', order: 4 },
      },
    ],
    maxEntries: 30,
    unlockCondition: {
      type: 'total_bosses',
      target: 6,
    },
  },
  {
    id: 'bosses',
    name: 'Bosses',
    description: 'Os poderosos guardiões de cada região, essenciais para o desbloqueio dos Núcleos Astrais',
    icon: '👹',
    entries: [
      {
        id: 'crystal_guardian',
        title: 'Guardião de Cristal',
        description: 'Protege a entrada do Vale de Cristal. Sua barreira de energia é impenetrável sem o núcleo verde.',
        unlockedBy: 'automatic',
        meta: { rarity: 'common', order: 1 },
      },
      {
        id: 'desert_overlord',
        title: 'Senhor do Deserto',
        description: 'Manda sobre as dunas infinitas. Controla o vento e a areia com um golpe de sua vara.',
        unlockedBy: 'region_completed',
        meta: { rarity: 'rare', order: 2 },
      },
      {
        id: 'frost_lord',
        title: 'Senhor do Gelo',
        description: 'Rei do pico congelado. Seu olhar gelado pode paralisar o mais corajoso dos guerreiros.',
        unlockedBy: 'region_completed',
        meta: { rarity: 'rare', order: 3 },
      },
      {
        id: 'ember_king',
        title: 'Rei das Chamas',
        description: 'Governante das terras ígneas. Sua chama eterna queima tudo ao seu alcance.',
        unlockedBy: 'region_completed',
        meta: { rarity: 'epic', order: 4 },
      },
      {
        id: 'sky_queen',
        title: 'Rainha do Céu',
        description: 'Soberana do reino aéreo. Domina as correntes de vento que sustentam suas ilhas flutuantes.',
        unlockedBy: 'region_completed',
        meta: { rarity: 'epic', order: 5 },
      },
      {
        id: 'final_entity',
        title: 'O que Resta',
        description: 'O ser que permanece no vazio após a consumação. Guardião do último núcleo, fonte de energia pura e destrutiva.',
        unlockedBy: 'total_cores',
        meta: { rarity: 'legendary', order: 6 },
      },
    ],
    maxEntries: 20,
    unlockCondition: {
      type: 'total_cores',
      target: 6,
    },
  },
  {
    id: 'regions',
    name: 'Regiões',
    description: 'Os seis mundos que compõem o universo de Astra, cada um com sua história única',
    icon: '🗺️',
    entries: [
      {
        id: 'green_valley',
        title: 'Vale Verde',
        description: 'Um reino de paz e natureza exuberante, onde o núcleo verde foi descoberto pela primeira vez.',
        unlockedBy: 'automatic',
        meta: { rarity: 'common', order: 1 },
      },
      {
        id: 'crystal_desert',
        title: 'Deserto de Cristal',
        description: 'Terra árida e brilhante, lar do núcleo que domina a precisão e o vento.',
        unlockedBy: 'boss_defeated',
        meta: { rarity: 'uncommon', order: 2 },
      },
      {
        id: 'frozen_peaks',
        title: 'Picos Congelados',
        description: 'Montanhas eternamente cobertas de neve, guardiãs do núcleo de gelo.',
        unlockedBy: 'boss_defeated',
        meta: { rarity: 'uncommon', order: 3 },
      },
      {
        id: 'ember_lands',
        title: 'Terras de Fogo',
        description: 'Região vulcânica onde o núcleo de explosão foi forjado no coração da montanha.',
        unlockedBy: 'boss_defeated',
        meta: { rarity: 'rare', order: 4 },
      },
      {
        id: 'sky_kingdom',
        title: 'Reino do Céu',
        description: 'Ilhas flutuantes entre as nuvens, onde o núcleo do vento escolhe quem merece voar.',
        unlockedBy: 'boss_defeated',
        meta: { rarity: 'rare', order: 5 },
      },
      {
        id: 'dark_citadel',
        title: 'Cidadela Sombria',
        description: 'O reino final, onde o núcleo última guarda o segredo do poder absoluto.',
        unlockedBy: 'total_cores',
        meta: { rarity: 'legendary', order: 6 },
      },
    ],
    maxEntries: 20,
    unlockCondition: {
      type: 'total_cores',
      target: 6,
    },
  },
  {
    id: 'enemies',
    name: 'Inimigos',
    description: 'As criaturas e forças que habitam cada região, desde as mais fracas até as mais terríveis',
    icon: '👾',
    entries: [
      {
        id: 'imp',
        title: 'Imp',
        description: 'Criatura menor do submundo, fraco e astuto. Ameaça básica em grupo.',
        unlockedBy: 'automatic',
        meta: { rarity: 'common', order: 1 },
      },
      {
        id: 'crystal_shrieker',
        title: 'Grito de Cristal',
        description: 'Emite sons agudos que desorientam. Comum em cavernas do deserto.',
        unlockedBy: 'region_completed',
        meta: { rarity: 'uncommon', order: 2 },
      },
      {
        id: 'frost_ghoul',
        title: 'Ghoul de Gelo',
        description: 'Undead que habita os picos congelados. Seu toque gela a pele exposta.',
        unlockedBy: 'region_completed',
        meta: { rarity: 'uncommon', order: 3 },
      },
      {
        id: 'fire_salamander',
        title: 'Salamandra de Fogo',
        description: 'Elemental de lava que vaga pelas terras de ember. Perigoso em contato direto.',
        unlockedBy: 'region_completed',
        meta: { rarity: 'rare', order: 4 },
      },
      {
        id: 'sky_griffon',
        title: 'Grifo Alado',
        description: 'Criatura nativa do reino céu. Mista entre ave de rapina e leão.',
        unlockedBy: 'region_completed',
        meta: { rarity: 'rare', order: 5 },
      },
      {
        id: 'void_walker',
        title: 'Caminhante do Vazio',
        description: 'Entidade que emerge do núcleo final. Corrompe a realidade ao seu redor.',
        unlockedBy: 'total_cores',
        meta: { rarity: 'legendary', order: 6 },
      },
    ],
    maxEntries: 25,
    unlockCondition: {
      type: 'total_cores',
      target: 6,
    },
  },
  {
    id: 'equipment',
    name: 'Equipamentos',
    description: 'Itens poderosos, artefatos e armas encontradas ou forjadas ao longo da jornada',
    icon: '⚔️',
    entries: [
      {
        id: 'basic_spear',
        title: 'Lança Básica',
        description: 'A primeira arma de qualquer soldado. Confiável e simples.',
        unlockedBy: 'automatic',
        meta: { rarity: 'common', order: 1 },
      },
      {
        id: 'crystal_dagger',
        title: 'Adaga de Cristal',
        description: 'Fio transparente que captura e reflete luz. Precisão sobrenatural.',
        unlockedBy: 'core_unlocked',
        meta: { rarity: 'uncommon', order: 2 },
      },
      {
        id: 'frost_tome',
        title: 'Tomo de Gelo',
        description: 'Páginas geladas que contêm conhecimento antigo. +20% resistência a debuffs.',
        unlockedBy: 'core_unlocked',
        meta: { rarity: 'rare', order: 3 },
      },
      {
        id: 'ember_rod',
        title: 'Cetro de Chamas',
        description: 'Um cetro que canaliza o poder do núcleo ember. Aumenta dano em 30%.',
        unlockedBy: 'core_unlocked',
        meta: { rarity: 'rare', order: 4 },
      },
      {
        id: 'sky_staff',
        title: 'Cajado do Vento',
        description: 'Sopro constante que guia as projéteis. Ignora efeitos de vento adverso.',
        unlockedBy: 'core_unlocked',
        meta: { rarity: 'epic', order: 5 },
      },
      {
        id: 'final_crown',
        title: 'Coroa Final',
        description: 'Símbolo de quem derrotou o último núcleo. Poder absoluto, mas com custo.',
        unlockedBy: 'total_cores',
        meta: { rarity: 'legendary', order: 6 },
      },
    ],
    maxEntries: 20,
    unlockCondition: {
      type: 'total_cores',
      target: 6,
    },
  },
  {
    id: 'history',
    name: 'História',
    description: 'A narrativa completa do universo Astra, desde os primórdios até o presente',
    icon: '📜',
    entries: [
      {
        id: 'creation',
        title: 'A Criação de Astra',
        description: 'Nos primórdios, os seis núcleos foram forjados pelas mãos dos deuses primordiais. Cada um carregava uma fração da essência criadora.',
        unlockedBy: 'automatic',
        meta: { rarity: 'common', order: 1 },
      },
      {
        id: 'the_fall',
        title: 'A Queda',
        description: 'Quando um dos deuses tentou absorver todos os núcleos, a realidade se partiu em seis fragmentos. As seis regiões surgiram das cinzas.',
        unlockedBy: 'total_regions',
        meta: { rarity: 'rare', order: 2 },
      },
      {
        id: 'first_war',
        title: 'A Primeira Guerra',
        description: 'As seis regiões entraram em conflito pelo controle dos núcleos. Batalhas duraram séculos até o surgimento dos primeiros heróis.',
        unlockedBy: 'total_bosses',
        meta: { rarity: 'uncommon', order: 3 },
      },
      {
        id: 'the_schism',
        title: 'O Cisma',
        description: 'Divisão entre aqueles que queriam usar o poder dos núcleos para governar e aqueles que buscavam equilibrar. Duas facções surgiram.',
        unlockedBy: 'total_achievements',
        meta: { rarity: 'rare', order: 4 },
      },
      {
        id: 'present_age',
        title: 'A Era Atual',
        description: 'Os núcleos agora são protegidos por heróis escolhidos. A batalha continua, mas o equilíbrio foi restaurado... por enquanto.',
        unlockedBy: 'total_missions',
        meta: { rarity: 'epic', order: 5 },
      },
      {
        id: 'prophecy',
        title: 'A Profecia',
        description: 'Diz-se que quando todos os seis núcleos forem desbloqueados, a realidade de Astra se reescreverá. Alguns aguardam. Outros temem.',
        unlockedBy: 'total_cores',
        meta: { rarity: 'legendary', order: 6 },
      },
    ],
    maxEntries: 20,
    unlockCondition: {
      type: 'total_cores',
      target: 6,
    },
  },
];

export const CODEX_ENTRY_UNLOCK_CONDITIONS = {
  automatic: 'Desbloqueado automaticamente ao iniciar o jogo',
  mission: 'Completo uma missão específica',
  achievement: 'Desbloqueado através de um feito',
  mastery: 'Alcançou um nível de mestre com um personagem',
  region_completed: 'Completou todas as missões de uma região',
  boss_defeated: 'Derrotou o boss de uma região',
  core_unlocked: 'Núcleo Astra correspondente desbloqueado',
  total_cores: 'Desbloqueado ao coletar todos os 6 Núcleos Astrais',
  total_regions: 'Desbloqueado ao completar todas as 6 regiões',
  total_achievements: 'Desbloqueado ao conquistar todos os feitos',
  total_missions: 'Desbloqueado ao completar todas as 30 missões',
  total_mastery: 'Desbloqueado ao completar toda a maestria',
  total_bosses: 'Desbloqueado ao derrotar todos os 6 bosses',
};

export function getCodexCategory(categories: CodexCategory[], id: string): CodexCategory | undefined {
  return categories.find(c => c.id === id);
}

export function getCodexEntriesByCategory(categories: CodexCategory[], categoryId: string): CodexEntry[] {
  const category = getCodexCategory(categories, categoryId);
  return category ? category.entries : [];
}

export function getUnlockedEntries(state: CodexState, entries: CodexEntry[]): CodexEntry[] {
  return entries.filter(e => state.unlockedEntries[e.id] === true);
}

export function getCategoryProgress(state: CodexState, category: CodexCategory): number {
  const unlocked = getUnlockedEntries(state, category.entries).length;
  return Math.round((unlocked / category.maxEntries) * 100);
}

export function getTotalProgress(state: CodexState): number {
  if (state.totalEntries === 0) return 0;
  return Math.round((state.totalUnlocked / state.totalEntries) * 100);
}