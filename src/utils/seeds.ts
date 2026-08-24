export function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function dateSeed(date?: Date): number {
  const d = date || new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

export interface BattleSeedConfig {
  windSpeed: number;
  windDirection: number;
  terrainSeed: number;
  cpuAggression: number;
  cpuAccuracy: number;
}

export function generateBattleSeed(levelId: string, extra?: string): BattleSeedConfig {
  const base = hashString(levelId + (extra || ''));
  const rng = seededRandom(base);
  return {
    windSpeed: 0.2 + rng() * 0.8,
    windDirection: rng() > 0.5 ? 1 : -1,
    terrainSeed: Math.floor(rng() * 10000),
    cpuAggression: 0.3 + rng() * 0.7,
    cpuAccuracy: 0.2 + rng() * 0.6,
  };
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  description: string;
  levelId: string;
  modifier: string;
  modifierType: 'wind' | 'hp' | 'turns' | 'projectile' | 'accuracy';
  modifierValue: number;
  targetStars: number;
  seed: number;
}

const DAILY_CHALLENGE_TEMPLATES = [
  { title: 'VENTO FORTE', description: 'Vença com vento acima de 80%', modifierType: 'wind' as const, modifierValue: 0.8 },
  { title: 'TIRO CERTERO', description: 'Vença com precisão acima de 70%', modifierType: 'accuracy' as const, modifierValue: 70 },
  { title: 'RECUPERACAO', description: 'Vença com 70% HP restante', modifierType: 'hp' as const, modifierValue: 70 },
  { title: 'QUICK DRAW', description: 'Vença em no maximo 6 turnos', modifierType: 'turns' as const, modifierValue: 6 },
  { title: 'PROJETIL NORMAL', description: 'Vença usando apenas projeteis normais', modifierType: 'projectile' as const, modifierValue: 0 },
  { title: 'RAJADA', description: 'Vença em no maximo 4 turnos', modifierType: 'turns' as const, modifierValue: 4 },
  { title: 'RESISTENCIA', description: 'Vença com 50% HP restante', modifierType: 'hp' as const, modifierValue: 50 },
];

const LEVEL_IDS = [
  'arena_1', 'arena_2', 'arena_3', 'arena_4', 'arena_5',
  'arena_6', 'arena_7', 'arena_8', 'arena_9', 'arena_10',
];

export function getDailyChallenge(date?: Date): DailyChallenge {
  const seed = dateSeed(date);
  const rng = seededRandom(seed);
  const template = DAILY_CHALLENGE_TEMPLATES[Math.floor(rng() * DAILY_CHALLENGE_TEMPLATES.length)];
  const levelId = LEVEL_IDS[Math.floor(rng() * LEVEL_IDS.length)];
  return {
    id: `daily-${date ? date.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)}`,
    date: (date || new Date()).toISOString().slice(0, 10),
    title: template.title,
    description: template.description,
    levelId,
    modifier: template.modifierType,
    modifierType: template.modifierType,
    modifierValue: template.modifierValue,
    targetStars: 2,
    seed,
  };
}

export function calculateScore(params: {
  victory: boolean;
  accuracy: number;
  turns: number;
  remainingHp: number;
  maxHp: number;
  difficulty: string;
  stars: number;
}): number {
  if (!params.victory) return 0;
  const base = 1000;
  const accuracyBonus = Math.round(params.accuracy * 5);
  const turnBonus = Math.max(0, (20 - params.turns) * 50);
  const hpBonus = Math.round((params.remainingHp / params.maxHp) * 300);
  const diffMult = params.difficulty === 'hard' ? 1.5 : params.difficulty === 'normal' ? 1.0 : 0.7;
  const starBonus = params.stars * 200;
  return Math.round((base + accuracyBonus + turnBonus + hpBonus + starBonus) * diffMult);
}
