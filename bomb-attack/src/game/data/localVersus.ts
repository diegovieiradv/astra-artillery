export interface LocalVersusConfig {
  id: string;
  name: string;
  description: string;
  mode: 'classic' | 'sudden_death' | 'team' | 'king_of_hill';
  maxPlayers: number;
  turnTimeLimit: number;
  roundsToWin: number;
  rewards: VersusReward[];
}

export interface VersusReward {
  type: 'xp' | 'currency' | 'badge' | 'title';
  value: number | string;
}

export interface PlayerConfig {
  id: string;
  name: string;
  characterId: string;
  color: string;
  isCPU: boolean;
  difficulty?: 'easy' | 'normal' | 'hard';
}

export interface VersusMatchState {
  matchId: string;
  config: LocalVersusConfig;
  players: PlayerConfig[];
  currentTurn: number;
  turnCount: number;
  scores: Record<string, number>;
  winner: string | null;
  isActive: boolean;
  startedAt: number;
  turnStartedAt: number;
  status: 'waiting' | 'playing' | 'finished';
}

export interface LocalVersusState {
  currentMatch: VersusMatchState | null;
  matchHistory: VersusMatchResult[];
  stats: VersusStats;
}

export interface VersusMatchResult {
  matchId: string;
  configId: string;
  players: PlayerConfig[];
  winner: string;
  scores: Record<string, number>;
  turns: number;
  duration: number;
  completedAt: number;
}

export interface VersusStats {
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  winStreak: number;
  bestWinStreak: number;
  favoriteMode: string;
  totalTurns: number;
}

export const DEFAULT_LOCAL_VERSUS_STATE: LocalVersusState = {
  currentMatch: null,
  matchHistory: [],
  stats: {
    totalMatches: 0,
    totalWins: 0,
    totalLosses: 0,
    winStreak: 0,
    bestWinStreak: 0,
    favoriteMode: '',
    totalTurns: 0,
  },
};

export function createDefaultLocalVersusState(): LocalVersusState {
  return JSON.parse(JSON.stringify(DEFAULT_LOCAL_VERSUS_STATE));
}

export const LOCAL_VERSUS_MODES: LocalVersusConfig[] = [
  {
    id: 'classic',
    name: 'Classico',
    description: 'Modo classico - quem acertar o oponente primeiro vence.',
    mode: 'classic',
    maxPlayers: 2,
    turnTimeLimit: 30,
    roundsToWin: 3,
    rewards: [{ type: 'xp', value: 100 }, { type: 'currency', value: 150 }],
  },
  {
    id: 'sudden_death',
    name: 'Morte Subita',
    description: 'Um round so - quem morrer primeiro perde.',
    mode: 'sudden_death',
    maxPlayers: 2,
    turnTimeLimit: 20,
    roundsToWin: 1,
    rewards: [{ type: 'xp', value: 150 }, { type: 'currency', value: 200 }],
  },
  {
    id: 'team',
    name: 'Equipe',
    description: '2v2 - cada jogador controla um personagem.',
    mode: 'team',
    maxPlayers: 4,
    turnTimeLimit: 30,
    roundsToWin: 2,
    rewards: [{ type: 'xp', value: 200 }, { type: 'currency', value: 300 }, { type: 'badge', value: 'badge_team_victory' }],
  },
  {
    id: 'king_of_hill',
    name: 'Rei da Colina',
    description: 'Controle o territorio - quem ficar no topo por mais tempo vence.',
    mode: 'king_of_hill',
    maxPlayers: 2,
    turnTimeLimit: 25,
    roundsToWin: 5,
    rewards: [{ type: 'xp', value: 250 }, { type: 'currency', value: 400 }, { type: 'title', value: 'title_king_of_hill' }],
  },
];

export function getLocalVersusMode(id: string): LocalVersusConfig | undefined {
  return LOCAL_VERSUS_MODES.find(mode => mode.id === id);
}

export function getLocalVersusModes(): LocalVersusConfig[] {
  return [...LOCAL_VERSUS_MODES];
}

export function calculateVersusWinner(scores: Record<string, number>): string | null {
  const entries = Object.entries(scores);
  if (entries.length === 0) return null;
  
  let maxScore = 0;
  let winner = null;
  
  for (const [playerId, score] of entries) {
    if (score > maxScore) {
      maxScore = score;
      winner = playerId;
    }
  }
  
  return winner;
}

export function isMatchFinished(match: VersusMatchState): boolean {
  if (!match) return false;
  
  const requiredWins = match.config.roundsToWin;
  for (const score of Object.values(match.scores)) {
    if (score >= requiredWins) return true;
  }
  
  return false;
}

export function getNextPlayer(match: VersusMatchState): PlayerConfig {
  const nextIndex = (match.currentTurn + 1) % match.players.length;
  return match.players[nextIndex];
}

export function generateMatchId(): string {
  return `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
