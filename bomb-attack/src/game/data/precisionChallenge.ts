export interface PrecisionChallengeConfig {
  id: string;
  name: string;
  description: string;
  category: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  maxShots: number;
  timeLimit: number;
  targetScore: number;
  rewards: PrecisionReward[];
  unlockRequirement?: {
    type: 'level' | 'region' | 'challenge';
    value: string | number;
  };
}

export interface PrecisionReward {
  type: 'xp' | 'currency' | 'badge' | 'title';
  value: number | string;
}

export interface PrecisionState {
  currentChallenge: string | null;
  isActive: boolean;
  startedAt: number | null;
  shotsRemaining: number;
  currentScore: number;
  completedChallenges: string[];
  bestScores: Record<string, PrecisionScore>;
  rankings: PrecisionRanking[];
  stats: PrecisionStats;
}

export interface PrecisionScore {
  challengeId: string;
  score: number;
  shotsUsed: number;
  accuracy: number;
  time: number;
  completedAt: number;
}

export interface PrecisionRanking {
  challengeId: string;
  rank: number;
  score: number;
  playerName: string;
  completedAt: number;
}

export interface PrecisionStats {
  totalChallenges: number;
  totalShots: number;
  totalHits: number;
  averageAccuracy: number;
  bestAccuracy: number;
  totalScore: number;
  averageScore: number;
}

export const DEFAULT_PRECISION_STATE: PrecisionState = {
  currentChallenge: null,
  isActive: false,
  startedAt: null,
  shotsRemaining: 0,
  currentScore: 0,
  completedChallenges: [],
  bestScores: {},
  rankings: [],
  stats: {
    totalChallenges: 0,
    totalShots: 0,
    totalHits: 0,
    averageAccuracy: 0,
    bestAccuracy: 0,
    totalScore: 0,
    averageScore: 0,
  },
};

export function createDefaultPrecisionState(): PrecisionState {
  return JSON.parse(JSON.stringify(DEFAULT_PRECISION_STATE));
}

export const PRECISION_CHALLENGES: PrecisionChallengeConfig[] = [
  {
    id: 'bronze_10_shots',
    name: 'Bronze - 10 Tiros',
    description: 'Acerte o maximo possivel com apenas 10 tiros.',
    category: 'bronze',
    maxShots: 10,
    timeLimit: 60,
    targetScore: 500,
    rewards: [{ type: 'xp', value: 100 }, { type: 'currency', value: 150 }],
  },
  {
    id: 'silver_8_shots',
    name: 'Prata - 8 Tiros',
    description: 'Desafio mais restritivo com apenas 8 tiros.',
    category: 'silver',
    maxShots: 8,
    timeLimit: 50,
    targetScore: 750,
    rewards: [{ type: 'xp', value: 200 }, { type: 'currency', value: 300 }],
    unlockRequirement: { type: 'challenge', value: 'bronze_10_shots' },
  },
  {
    id: 'gold_5_shots',
    name: 'Ouro - 5 Tiros',
    description: 'Precisao extrema com apenas 5 tiros.',
    category: 'gold',
    maxShots: 5,
    timeLimit: 40,
    targetScore: 1000,
    rewards: [{ type: 'xp', value: 350 }, { type: 'currency', value: 500 }, { type: 'badge', value: 'badge_gold_precision' }],
    unlockRequirement: { type: 'challenge', value: 'silver_8_shots' },
  },
  {
    id: 'platinum_3_shots',
    name: 'Platina - 3 Tiros',
    description: 'Apenas 3 tiros para marcar pontos maximos.',
    category: 'platinum',
    maxShots: 3,
    timeLimit: 30,
    targetScore: 1500,
    rewards: [{ type: 'xp', value: 500 }, { type: 'currency', value: 750 }, { type: 'title', value: 'title_precision_master' }],
    unlockRequirement: { type: 'challenge', value: 'gold_5_shots' },
  },
  {
    id: 'diamond_1_shot',
    name: 'Diamante - 1 Tiro',
    description: 'Um unico tiro para provar sua maestria.',
    category: 'diamond',
    maxShots: 1,
    timeLimit: 20,
    targetScore: 2000,
    rewards: [{ type: 'xp', value: 1000 }, { type: 'currency', value: 1500 }, { type: 'badge', value: 'badge_diamond_precision' }],
    unlockRequirement: { type: 'challenge', value: 'platinum_3_shots' },
  },
  {
    id: 'speed_bronze',
    name: 'Velocidade Bronze',
    description: 'Acerte 5 alvos o mais rapido possivel.',
    category: 'bronze',
    maxShots: 15,
    timeLimit: 30,
    targetScore: 600,
    rewards: [{ type: 'xp', value: 150 }, { type: 'currency', value: 200 }],
    unlockRequirement: { type: 'level', value: 5 },
  },
  {
    id: 'speed_silver',
    name: 'Velocidade Prata',
    description: 'Acerte 8 alvos contra o relogio.',
    category: 'silver',
    maxShots: 12,
    timeLimit: 25,
    targetScore: 1000,
    rewards: [{ type: 'xp', value: 300 }, { type: 'currency', value: 400 }],
    unlockRequirement: { type: 'challenge', value: 'speed_bronze' },
  },
  {
    id: 'perfect_gold',
    name: 'Perfeito Ouro',
    description: 'Acerte 10 alvos sem errar nenhum tiro.',
    category: 'gold',
    maxShots: 10,
    timeLimit: 60,
    targetScore: 1200,
    rewards: [{ type: 'xp', value: 400 }, { type: 'currency', value: 600 }, { type: 'badge', value: 'badge_perfect_run' }],
    unlockRequirement: { type: 'challenge', value: 'speed_silver' },
  },
];

export function getPrecisionChallenge(id: string): PrecisionChallengeConfig | undefined {
  return PRECISION_CHALLENGES.find(challenge => challenge.id === id);
}

export function getPrecisionChallengesByCategory(category: PrecisionChallengeConfig['category']): PrecisionChallengeConfig[] {
  return PRECISION_CHALLENGES.filter(challenge => challenge.category === category);
}

export function getUnlockedChallenges(state: PrecisionState, playerLevel: number): PrecisionChallengeConfig[] {
  return PRECISION_CHALLENGES.filter(challenge => {
    if (!challenge.unlockRequirement) return true;
    if (challenge.unlockRequirement.type === 'level') {
      return playerLevel >= (challenge.unlockRequirement.value as number);
    }
    if (challenge.unlockRequirement.type === 'challenge') {
      return state.completedChallenges.includes(challenge.unlockRequirement.value as string);
    }
    return true;
  });
}

export function calculatePrecisionScore(hits: number, totalShots: number, timeBonus: number): number {
  if (totalShots === 0) return 0;
  const accuracy = hits / totalShots;
  const baseScore = Math.round(accuracy * 1000);
  return baseScore + timeBonus;
}

export function getChallengeRank(state: PrecisionState, challengeId: string): number {
  const score = state.bestScores[challengeId];
  if (!score) return 0;
  
  const allScores = Object.values(state.bestScores)
    .filter(s => s.challengeId === challengeId)
    .sort((a, b) => b.score - a.score);
  
  return allScores.findIndex(s => s.score === score.score) + 1;
}

export function isChallengeCompleted(state: PrecisionState, challengeId: string): boolean {
  return state.completedChallenges.includes(challengeId);
}

export function getTargetReached(state: PrecisionState, challengeId: string): boolean {
  const score = state.bestScores[challengeId];
  const challenge = getPrecisionChallenge(challengeId);
  if (!score || !challenge) return false;
  return score.score >= challenge.targetScore;
}
