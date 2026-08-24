import { getDailyChallenge, calculateScore, type DailyChallenge } from '@/utils/seeds';

export interface LevelRanking {
  levelId: string;
  scores: number[];
  bestScore: number;
  bestAccuracy: number;
  fewestTurns: number;
  highestDamage: number;
  bestStars: number;
  totalPlays: number;
}

export interface MatchHistoryEntry {
  id: string;
  date: string;
  mode: 'campaign' | 'sandbox' | 'daily' | 'tournament' | 'training';
  levelId: string;
  characterId: string;
  result: 'victory' | 'defeat';
  accuracy: number;
  turns: number;
  score: number;
  stars: number;
  duration: number;
}

export interface CombatMedal {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  date?: string;
}

export const COMBAT_MEDAL_DEFS: Omit<CombatMedal, 'earned' | 'date'>[] = [
  { id: 'long_shot', name: 'Long Shot', description: 'Acertou alvo a mais de 80% do alcance maximo', icon: '🎯' },
  { id: 'direct_hit', name: 'Direct Hit', description: 'Dano direto sem tocar no terreno primeiro', icon: '💥' },
  { id: 'perfect_aim', name: 'Perfect Aim', description: 'Precisao de 90% ou mais em uma batalha', icon: '🏹' },
  { id: 'survivor', name: 'Survivor', description: 'Venceu com 10% de HP restante ou menos', icon: '💪' },
  { id: 'boss_breaker', name: 'Boss Breaker', description: 'Derrotou um boss', icon: '👑' },
  { id: 'terrain_master', name: 'Terrain Master', description: 'Usou terreno para causar dano extra 3 vezes', icon: '⛰️' },
  { id: 'clutch_win', name: 'Clutch Win', description: 'Venceu no ultimo turno possivel', icon: '🔥' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Venceu em 3 turnos ou menos', icon: '⚡' },
  { id: 'unstoppable', name: 'Unstoppable', description: 'Venceu 5 batalhas consecutivas', icon: '🏆' },
  { id: 'daily_complete', name: 'Daily Hero', description: 'Completou o desafio diario', icon: '📅' },
];

const MAX_HISTORY = 50;
const STORAGE_KEY_RANKINGS = 'astra-artillery-rankings';
const STORAGE_KEY_HISTORY = 'astra-artillery-match-history';
const STORAGE_KEY_MEDALS = 'astra-artillery-medals';

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore */ }
}

export function getRankings(): Record<string, LevelRanking> {
  return getStorage(STORAGE_KEY_RANKINGS, {});
}

export function saveRanking(levelId: string, params: {
  score: number;
  accuracy: number;
  turns: number;
  damage: number;
  stars: number;
}): void {
  const rankings = getRankings();
  const existing = rankings[levelId] || {
    levelId,
    scores: [],
    bestScore: 0,
    bestAccuracy: 0,
    fewestTurns: Infinity,
    highestDamage: 0,
    bestStars: 0,
    totalPlays: 0,
  };
  existing.scores.push(params.score);
  existing.scores.sort((a, b) => b - a);
  existing.scores = existing.scores.slice(0, 10);
  existing.bestScore = Math.max(existing.bestScore, params.score);
  existing.bestAccuracy = Math.max(existing.bestAccuracy, params.accuracy);
  existing.fewestTurns = Math.min(existing.fewestTurns, params.turns);
  existing.highestDamage = Math.max(existing.highestDamage, params.damage);
  existing.bestStars = Math.max(existing.bestStars, params.stars);
  existing.totalPlays++;
  rankings[levelId] = existing;
  setStorage(STORAGE_KEY_RANKINGS, rankings);
}

export function getMatchHistory(): MatchHistoryEntry[] {
  return getStorage(STORAGE_KEY_HISTORY, []);
}

export function addMatchHistory(entry: Omit<MatchHistoryEntry, 'id' | 'date'>): void {
  const history = getMatchHistory();
  const newEntry: MatchHistoryEntry = {
    ...entry,
    id: `match-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    date: new Date().toISOString(),
  };
  history.unshift(newEntry);
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  setStorage(STORAGE_KEY_HISTORY, history);
}

export function getMedals(): CombatMedal[] {
  const stored = getStorage<Record<string, { earned: boolean; date?: string }>>(STORAGE_KEY_MEDALS, {});
  return COMBAT_MEDAL_DEFS.map((def) => ({
    ...def,
    earned: stored[def.id]?.earned || false,
    date: stored[def.id]?.date,
  }));
}

export function earnMedal(medalId: string): boolean {
  const medals = getMedals();
  const existing = medals.find(m => m.id === medalId);
  if (existing?.earned) return false;
  const stored = getStorage<Record<string, { earned: boolean; date?: string }>>(STORAGE_KEY_MEDALS, {});
  stored[medalId] = { earned: true, date: new Date().toISOString() };
  setStorage(STORAGE_KEY_MEDALS, stored);
  return true;
}

export function checkMedals(params: {
  accuracy?: number;
  hpPercent?: number;
  turns?: number;
  isBoss?: boolean;
  isTerrainDamage?: boolean;
  isLastTurn?: boolean;
  consecutiveWins?: number;
  range?: number;
  isDirectHit?: boolean;
}): string[] {
  const earned: string[] = [];
  if (params.range && params.range > 80) {
    if (earnMedal('long_shot')) earned.push('long_shot');
  }
  if (params.isDirectHit) {
    if (earnMedal('direct_hit')) earned.push('direct_hit');
  }
  if (params.accuracy && params.accuracy >= 90) {
    if (earnMedal('perfect_aim')) earned.push('perfect_aim');
  }
  if (params.hpPercent !== undefined && params.hpPercent <= 10) {
    if (earnMedal('survivor')) earned.push('survivor');
  }
  if (params.isBoss) {
    if (earnMedal('boss_breaker')) earned.push('boss_breaker');
  }
  if (params.isTerrainDamage) {
    if (earnMedal('terrain_master')) earned.push('terrain_master');
  }
  if (params.isLastTurn) {
    if (earnMedal('clutch_win')) earned.push('clutch_win');
  }
  if (params.turns !== undefined && params.turns <= 3) {
    if (earnMedal('speed_demon')) earned.push('speed_demon');
  }
  if (params.consecutiveWins !== undefined && params.consecutiveWins >= 5) {
    if (earnMedal('unstoppable')) earned.push('unstoppable');
  }
  return earned;
}

export { getDailyChallenge, calculateScore };
export type { DailyChallenge };
