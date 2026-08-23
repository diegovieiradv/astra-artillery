export interface TrainingModeConfig {
  id: string;
  name: string;
  description: string;
  category: 'angle' | 'power' | 'wind' | 'projectile' | 'combined';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  objectives: TrainingObjective[];
  rewards: TrainingReward[];
  unlockRequirement?: {
    type: 'level' | 'region' | 'achievement';
    value: string | number;
  };
}

export interface TrainingObjective {
  id: string;
  description: string;
  target: number;
  unit: string;
  optional: boolean;
}

export interface TrainingReward {
  type: 'xp' | 'currency' | 'mastery';
  value: number;
  target?: string;
}

export interface TrainingState {
  currentMode: string | null;
  isActive: boolean;
  startedAt: number | null;
  completedModes: string[];
  stats: TrainingStats;
  tutorialProgress: Record<string, boolean>;
}

export interface TrainingStats {
  totalSessions: number;
  totalTime: number;
  totalShots: number;
  averageAccuracy: number;
  bestAccuracy: number;
  totalDamage: number;
}

export const DEFAULT_TRAINING_STATE: TrainingState = {
  currentMode: null,
  isActive: false,
  startedAt: null,
  completedModes: [],
  stats: {
    totalSessions: 0,
    totalTime: 0,
    totalShots: 0,
    averageAccuracy: 0,
    bestAccuracy: 0,
    totalDamage: 0,
  },
  tutorialProgress: {},
};

export function createDefaultTrainingState(): TrainingState {
  return JSON.parse(JSON.stringify(DEFAULT_TRAINING_STATE));
}

export const TRAINING_MODES: TrainingModeConfig[] = [
  {
    id: 'angle_basics',
    name: 'Angulo Basico',
    description: 'Aprenda a controlar o angulo do canhao para acertar alvos.',
    category: 'angle',
    difficulty: 'beginner',
    duration: 5,
    objectives: [
      { id: 'hit_target', description: 'Acerte 3 alvos', target: 3, unit: 'hits', optional: false },
      { id: 'perfect_shot', description: 'Acerte 1 tiro perfeito', target: 1, unit: 'perfect', optional: true },
    ],
    rewards: [{ type: 'xp', value: 50 }],
  },
  {
    id: 'power_control',
    name: 'Controle de Potencia',
    description: 'Domine a forca do disparo para alcancar diferentes distancias.',
    category: 'power',
    difficulty: 'beginner',
    duration: 5,
    objectives: [
      { id: 'hit_near', description: 'Acerte alvo proximo', target: 1, unit: 'hit', optional: false },
      { id: 'hit_far', description: 'Acerte alvo distante', target: 1, unit: 'hit', optional: false },
      { id: 'hit_perfect', description: 'Acerte exatamente no centro', target: 1, unit: 'perfect', optional: true },
    ],
    rewards: [{ type: 'xp', value: 50 }],
  },
  {
    id: 'wind_mastery',
    name: 'Mestria do Vento',
    description: 'Aprenda a compensar o vento para acertar seus tiros.',
    category: 'wind',
    difficulty: 'intermediate',
    duration: 7,
    objectives: [
      { id: 'compensate_wind', description: 'Acerte 3 alvos com vento', target: 3, unit: 'hits', optional: false },
      { id: 'no_wind', description: 'Acerte 2 alvos sem vento', target: 2, unit: 'hits', optional: false },
      { id: 'extreme_wind', description: 'Acerte 1 alvo com vento forte', target: 1, unit: 'hit', optional: true },
    ],
    rewards: [{ type: 'xp', value: 75 }, { type: 'currency', value: 100 }],
  },
  {
    id: 'projectile_types',
    name: 'Tipos de Projetil',
    description: 'Conheca os diferentes projeteis e seus comportamentos.',
    category: 'projectile',
    difficulty: 'intermediate',
    duration: 8,
    objectives: [
      { id: 'use_normal', description: 'Use projetil normal', target: 1, unit: 'use', optional: false },
      { id: 'use_heavy', description: 'Use projetil pesado', target: 1, unit: 'use', optional: false },
      { id: 'use_special', description: 'Use projetil especial', target: 1, unit: 'use', optional: true },
    ],
    rewards: [{ type: 'xp', value: 75 }, { type: 'mastery', value: 10, target: 'kai' }],
  },
  {
    id: 'combined_challenge',
    name: 'Desafio Combinado',
    description: 'Combine angulo, potencia e vento para acertar alvos moveis.',
    category: 'combined',
    difficulty: 'advanced',
    duration: 10,
    objectives: [
      { id: 'hit_moving', description: 'Acerte 3 alvos moveis', target: 3, unit: 'hits', optional: false },
      { id: 'perfect_streak', description: 'Acerte 5 tiros seguidos', target: 5, unit: 'perfect', optional: true },
      { id: 'no_damage', description: 'Complete sem levar dano', target: 1, unit: 'clear', optional: false },
    ],
    rewards: [{ type: 'xp', value: 150 }, { type: 'currency', value: 250 }],
  },
  {
    id: 'precision_master',
    name: 'Mestre da Precisao',
    description: 'Desafio extremo de precisao com vento variavel e alvos pequenos.',
    category: 'combined',
    difficulty: 'advanced',
    duration: 12,
    objectives: [
      { id: 'hit_small', description: 'Acerte 5 alvos pequenos', target: 5, unit: 'hits', optional: false },
      { id: 'perfect_10', description: 'Consiga 10 tiros perfeitos', target: 10, unit: 'perfect', optional: true },
      { id: 'speed_run', description: 'Complete em menos de 2 minutos', target: 1, unit: 'clear', optional: true },
    ],
    rewards: [{ type: 'xp', value: 200 }, { type: 'currency', value: 500 }],
  },
];

export function getTrainingMode(id: string): TrainingModeConfig | undefined {
  return TRAINING_MODES.find(mode => mode.id === id);
}

export function getTrainingModesByCategory(category: TrainingModeConfig['category']): TrainingModeConfig[] {
  return TRAINING_MODES.filter(mode => mode.category === category);
}

export function getTrainingModesByDifficulty(difficulty: TrainingModeConfig['difficulty']): TrainingModeConfig[] {
  return TRAINING_MODES.filter(mode => mode.difficulty === difficulty);
}

export function isTrainingCompleted(state: TrainingState, modeId: string): boolean {
  return state.completedModes.includes(modeId);
}

export function calculateTrainingAccuracy(hits: number, totalShots: number): number {
  if (totalShots === 0) return 0;
  return Math.round((hits / totalShots) * 100);
}

export function getUnlockedTrainingModes(state: TrainingState, playerLevel: number): TrainingModeConfig[] {
  return TRAINING_MODES.filter(mode => {
    if (!mode.unlockRequirement) return true;
    if (mode.unlockRequirement.type === 'level') {
      return playerLevel >= (mode.unlockRequirement.value as number);
    }
    return true;
  });
}
