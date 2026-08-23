export type AstraCoreId = 
  | 'green_core' 
  | 'desert_core' 
  | 'frost_core' 
  | 'ember_core' 
  | 'sky_core' 
  | 'final_core';

export type CoreAbilityType = 
  | 'heal' 
  | 'precision_boost' 
  | 'freeze_enemy' 
  | 'explosion_boost' 
  | 'wind_control' 
  | 'reality_shift';

export interface CoreAbility {
  type: CoreAbilityType;
  name: string;
  description: string;
  cooldown: number;
  maxCharges: number;
  effect: {
    healAmount?: number;
    precisionBonus?: number;
    freezeDuration?: number;
    damageMultiplier?: number;
    blastRadiusMultiplier?: number;
    windOverride?: number;
    realityEffect?: string;
  };
}

export interface AstraCoreConfig {
  id: AstraCoreId;
  name: string;
  description: string;
  regionId: string;
  unlocked: boolean;
  ability: CoreAbility;
  lore: string;
}

export const ASTRA_CORES: Record<AstraCoreId, AstraCoreConfig> = {
  green_core: {
    id: 'green_core',
    name: 'Núcleo Verde',
    description: 'A energia da natureza cura e protege.',
    regionId: 'green_valley',
    unlocked: false,
    ability: {
      type: 'heal',
      name: 'Renovação Natural',
      description: 'Cura 30% da vida máxima e concede imunidade a efeitos negativos por 2 turnos.',
      cooldown: 4,
      maxCharges: 2,
      effect: {
        healAmount: 0.3,
      },
    },
    lore: 'O primeiro Núcleo recuperado. Sua energia pulsa com a força vital de Astra, capaz de fechar feridas e purificar venenos.',
  },
  desert_core: {
    id: 'desert_core',
    name: 'Núcleo do Deserto',
    description: 'A precisão absoluta do cristal guia seus disparos.',
    regionId: 'crystal_desert',
    unlocked: false,
    ability: {
      type: 'precision_boost',
      name: 'Olho do Cristal',
      description: 'Próximos 3 disparos têm +100% precisão e ignoram vento.',
      cooldown: 3,
      maxCharges: 1,
      effect: {
        precisionBonus: 1.0,
      },
    },
    lore: 'Cristais puros formam este Núcleo. Quem o possui enxerga a trajetória perfeita, como se o vento não existisse.',
  },
  frost_core: {
    id: 'frost_core',
    name: 'Núcleo Congelado',
    description: 'O frio eterno paralisa seus inimigos.',
    regionId: 'frozen_peaks',
    unlocked: false,
    ability: {
      type: 'freeze_enemy',
      name: 'Zero Absoluto',
      description: 'Congela o inimigo por 2 turnos: não pode mover, mira fixa, -50% defesa.',
      cooldown: 5,
      maxCharges: 1,
      effect: {
        freezeDuration: 2,
      },
    },
    lore: 'O gelo mais antigo de Astra reside aqui. Seu toque suspende o tempo, deixando inimigos vulneráveis.',
  },
  ember_core: {
    id: 'ember_core',
    name: 'Núcleo das Brasa',
    description: 'O fogo purificador amplifica sua destruição.',
    regionId: 'ember_lands',
    unlocked: false,
    ability: {
      type: 'explosion_boost',
      name: 'Supernova',
      description: 'Próximo disparo tem +100% dano, +50% raio de explosão e cria zona de fogo por 3 turnos.',
      cooldown: 6,
      maxCharges: 1,
      effect: {
        damageMultiplier: 2.0,
        blastRadiusMultiplier: 1.5,
      },
    },
    lore: 'Magma vivo flui neste Núcleo. Libera o calor de mil vulcões, transformando o campo de batalha em cinzas.',
  },
  sky_core: {
    id: 'sky_core',
    name: 'Núcleo Celestial',
    description: 'Os ventos obedecem à sua vontade.',
    regionId: 'sky_kingdom',
    unlocked: false,
    ability: {
      type: 'wind_control',
      name: 'Comando dos Ventos',
      description: 'Define o vento para qualquer valor entre -5 e +5 por 3 turnos.',
      cooldown: 4,
      maxCharges: 2,
      effect: {
        windOverride: 5,
      },
    },
    lore: 'O céu de Astra converge neste Núcleo. Quem o controla dita as correntes de ar, tornando impossível errar a mira.',
  },
  final_core: {
    id: 'final_core',
    name: 'Núcleo Final',
    description: 'O poder supremo de Astra reescreve a realidade.',
    regionId: 'dark_citadel',
    unlocked: false,
    ability: {
      type: 'reality_shift',
      name: 'Mudança da Realidade',
      description: 'Efeito aleatório poderoso: cura total, dano massivo, teleport, ou inversão de turno.',
      cooldown: 8,
      maxCharges: 1,
      effect: {
        realityEffect: 'random_supreme',
      },
    },
    lore: 'O último Núcleo, forjado no vazio. Contém a essência de toda Astra. Seu uso é imprevisível, mas sempre decisivo.',
  },
};

export function getAstraCore(id: AstraCoreId): AstraCoreConfig | undefined {
  return ASTRA_CORES[id];
}

export function getAstraCoresByRegion(regionId: string): AstraCoreConfig[] {
  return Object.values(ASTRA_CORES).filter(c => c.regionId === regionId);
}

export function getAllAstraCores(): AstraCoreConfig[] {
  return Object.values(ASTRA_CORES);
}

export const CORE_REGION_ORDER: AstraCoreId[] = [
  'green_core',
  'desert_core',
  'frost_core',
  'ember_core',
  'sky_core',
  'final_core',
];

export interface AstraCoreState {
  unlocked: boolean;
  currentCharges: number;
  cooldownRemaining: number;
  lastUsedTurn?: number;
}

export const DEFAULT_ASTRA_CORE_STATE: Record<AstraCoreId, AstraCoreState> = {
  green_core: { unlocked: false, currentCharges: 2, cooldownRemaining: 0 },
  desert_core: { unlocked: false, currentCharges: 1, cooldownRemaining: 0 },
  frost_core: { unlocked: false, currentCharges: 1, cooldownRemaining: 0 },
  ember_core: { unlocked: false, currentCharges: 1, cooldownRemaining: 0 },
  sky_core: { unlocked: false, currentCharges: 2, cooldownRemaining: 0 },
  final_core: { unlocked: false, currentCharges: 1, cooldownRemaining: 0 },
};

export function createDefaultAstraCoreState(): Record<AstraCoreId, AstraCoreState> {
  return JSON.parse(JSON.stringify(DEFAULT_ASTRA_CORE_STATE));
}