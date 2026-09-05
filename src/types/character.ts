export interface CharacterStats {
  health: number;
  attack: number;
  defense: number;
  mobility: number;
}

export interface SpecialAbility {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  execute: (ctx: AbilityContext) => AbilityResult;
}

export interface AbilityContext {
  caster: CharacterEntity;
  target?: CharacterEntity;
  battle: BattleContext;
}

export interface AbilityResult {
  success: boolean;
  effects: AbilityEffect[];
}

export interface AbilityEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'movement';
  value: number;
  duration?: number;
  target: 'self' | 'enemy' | 'area';
}

export interface BattleContext {
  wind: number;
  turn: number;
  characters: CharacterEntity[];
}

export interface CharacterEntity {
  id: string;
  characterId: string;
  name: string;
  hp: number;
  maxHp: number;
  x: number;
  y: number;
  facing: 'left' | 'right';
  isPlayer: boolean;
  abilityCooldown: number;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  role: 'balanced' | 'precision' | 'power' | 'support' | 'mobility' | 'explosives' | 'defense' | 'wind_specialist' | 'multi_shot' | 'tactical';
  stats: CharacterStats;
  specialAbility: SpecialAbility;
  spriteKey: string;
  avatarKey: string;
  element?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  title?: string;
}

export const CHARACTER_ELEMENTS: Record<string, { label: string; color: string; icon: string }> = {
  fire: { label: 'Fogo', color: '#f97316', icon: '🔥' },
  ice: { label: 'Gelo', color: '#60a5fa', icon: '❄️' },
  dark: { label: 'Sombrio', color: '#a78bfa', icon: '🌑' },
  nature: { label: 'Natureza', color: '#4ade80', icon: '🌿' },
  electricity: { label: 'Eletricidade', color: '#facc15', icon: '⚡' },
  arcane: { label: 'Arcano', color: '#c084fc', icon: '✨' },
  artillery: { label: 'Artilharia', color: '#f87171', icon: '💥' },
  energy: { label: 'Energia', color: '#22d3ee', icon: '💫' },
  cosmic: { label: 'Cósmico', color: '#ef4444', icon: '🌟' },
};

export const CHARACTER_ROLES = {
  balanced: { label: 'Equilibrado', color: '#4ade80' },
  precision: { label: 'Precisão', color: '#60a5fa' },
  power: { label: 'Potência', color: '#f87171' },
  support: { label: 'Suporte', color: '#fbbf24' },
  mobility: { label: 'Mobilidade', color: '#a78bfa' },
  explosives: { label: 'Explosivos', color: '#fb923c' },
  defense: { label: 'Defesa', color: '#34d399' },
  wind_specialist: { label: 'Especialista em Vento', color: '#60a5fa' },
  multi_shot: { label: 'Multi-Tiro', color: '#f472b6' },
  tactical: { label: 'Tático', color: '#a855f7' },
} as const;