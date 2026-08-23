export interface NGPlusConfig {
  id: string;
  name: string;
  description: string;
  difficultyMultiplier: number;
  enemyHealthMultiplier: number;
  enemyDamageMultiplier: number;
  rewardMultiplier: number;
  unlockRequirement: number;
  modifiers: NGModifier[];
}

export interface NGModifier {
  id: string;
  name: string;
  description: string;
  effect: 'health_up' | 'damage_up' | 'speed_up' | 'shield' | 'regen' | 'crit_up';
  value: number;
}

export interface NGPlusState {
  currentCycle: number;
  unlockedCycles: number[];
  modifiers: string[];
  stats: NGPlusStats;
}

export interface NGPlusStats {
  totalCycles: number;
  totalTime: number;
  totalKills: number;
  totalDamage: number;
  bestCycle: number;
  averageTime: number;
}

export const DEFAULT_NG_PLUS_STATE: NGPlusState = {
  currentCycle: 1,
  unlockedCycles: [1],
  modifiers: [],
  stats: {
    totalCycles: 0,
    totalTime: 0,
    totalKills: 0,
    totalDamage: 0,
    bestCycle: 0,
    averageTime: 0,
  },
};

export function createDefaultNGPlusState(): NGPlusState {
  return JSON.parse(JSON.stringify(DEFAULT_NG_PLUS_STATE));
}

export const NG_PLUS_CYCLES: NGPlusConfig[] = [
  {
    id: 'ng1',
    name: 'Novo Jogo+ 1',
    description: 'Segunda volta - inimigos um pouco mais fortes.',
    difficultyMultiplier: 1.5,
    enemyHealthMultiplier: 1.5,
    enemyDamageMultiplier: 1.5,
    rewardMultiplier: 2.0,
    unlockRequirement: 1,
    modifiers: [{ id: 'mod_health_up_1', name: 'Vida Extra', description: '+50% vida inimiga', effect: 'health_up', value: 50 }],
  },
  {
    id: 'ng2',
    name: 'Novo Jogo+ 2',
    description: 'Terceira volta - inimigos muito mais fortes.',
    difficultyMultiplier: 2.0,
    enemyHealthMultiplier: 2.0,
    enemyDamageMultiplier: 2.0,
    rewardMultiplier: 3.0,
    unlockRequirement: 2,
    modifiers: [
      { id: 'mod_health_up_2', name: 'Vida Extra', description: '+100% vida inimiga', effect: 'health_up', value: 100 },
      { id: 'mod_damage_up_1', name: 'Dano Extra', description: '+50% dano inimigo', effect: 'damage_up', value: 50 },
    ],
  },
  {
    id: 'ng3',
    name: 'Novo Jogo+ 3',
    description: 'Quarta volta - desafio extremo.',
    difficultyMultiplier: 2.5,
    enemyHealthMultiplier: 2.5,
    enemyDamageMultiplier: 2.5,
    rewardMultiplier: 4.0,
    unlockRequirement: 3,
    modifiers: [
      { id: 'mod_health_up_3', name: 'Vida Extra', description: '+150% vida inimiga', effect: 'health_up', value: 150 },
      { id: 'mod_damage_up_2', name: 'Dano Extra', description: '+100% dano inimigo', effect: 'damage_up', value: 100 },
      { id: 'mod_speed_up_1', name: 'Velocidade Extra', description: '+25% velocidade inimiga', effect: 'speed_up', value: 25 },
    ],
  },
  {
    id: 'ng4',
    name: 'Novo Jogo+ 4',
    description: 'Quinta volta - para jogadores lendarios.',
    difficultyMultiplier: 3.0,
    enemyHealthMultiplier: 3.0,
    enemyDamageMultiplier: 3.0,
    rewardMultiplier: 5.0,
    unlockRequirement: 4,
    modifiers: [
      { id: 'mod_health_up_4', name: 'Vida Extra', description: '+200% vida inimiga', effect: 'health_up', value: 200 },
      { id: 'mod_damage_up_3', name: 'Dano Extra', description: '+150% dano inimigo', effect: 'damage_up', value: 150 },
      { id: 'mod_speed_up_2', name: 'Velocidade Extra', description: '+50% velocidade inimiga', effect: 'speed_up', value: 50 },
      { id: 'mod_shield_1', name: 'Escudo Inimigo', description: 'Inimigos ganham escudo', effect: 'shield', value: 1 },
    ],
  },
  {
    id: 'ng5',
    name: 'Novo Jogo+ 5',
    description: 'Sexta volta - o limite supremo.',
    difficultyMultiplier: 5.0,
    enemyHealthMultiplier: 5.0,
    enemyDamageMultiplier: 5.0,
    rewardMultiplier: 10.0,
    unlockRequirement: 5,
    modifiers: [
      { id: 'mod_health_up_5', name: 'Vida Extra', description: '+400% vida inimiga', effect: 'health_up', value: 400 },
      { id: 'mod_damage_up_4', name: 'Dano Extra', description: '+300% dano inimigo', effect: 'damage_up', value: 300 },
      { id: 'mod_speed_up_3', name: 'Velocidade Extra', description: '+75% velocidade inimiga', effect: 'speed_up', value: 75 },
      { id: 'mod_shield_2', name: 'Escudo Inimigo', description: 'Inimigos ganham escudo forte', effect: 'shield', value: 2 },
      { id: 'mod_regen_1', name: 'Regeneracao', description: 'Inimigos regeneram vida', effect: 'regen', value: 5 },
    ],
  },
];

export function getNGPlusConfig(id: string): NGPlusConfig | undefined {
  return NG_PLUS_CYCLES.find(cycle => cycle.id === id);
}

export function getNGPlusConfigs(): NGPlusConfig[] {
  return [...NG_PLUS_CYCLES];
}

export function getAvailableNGPlus(state: NGPlusState): NGPlusConfig[] {
  return NG_PLUS_CYCLES.filter(cycle => 
    state.unlockedCycles.includes(cycle.unlockRequirement)
  );
}

export function isNGPlusUnlocked(state: NGPlusState, cycle: number): boolean {
  return state.unlockedCycles.includes(cycle);
}

export function unlockNGPlus(state: NGPlusState, cycle: number): NGPlusState {
  if (state.unlockedCycles.includes(cycle)) {
    return state;
  }
  return {
    ...state,
    unlockedCycles: [...state.unlockedCycles, cycle],
  };
}

export function calculateNGPlusDamage(base: number, multiplier: number): number {
  return Math.round(base * multiplier);
}

export function calculateNGPlusHealth(base: number, multiplier: number): number {
  return Math.round(base * multiplier);
}

export function calculateNGPlusReward(base: number, multiplier: number): number {
  return Math.round(base * multiplier);
}
