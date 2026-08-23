export type TurnPhase = 'idle' | 'aiming' | 'charging' | 'firing' | 'projectile_flying' | 'resolving' | 'turn_end' | 'battle_end';

export type ProjectileTypeId = 
  | 'normal' 
  | 'heavy_bomb' 
  | 'cluster_shot' 
  | 'piercing_shot' 
  | 'fire_shot' 
  | 'ice_shot' 
  | 'electric_shot' 
  | 'bounce_shot' 
  | 'multi_shot' 
  | 'tactical_shot';

export type BattleResult = 'player_win' | 'cpu_win' | 'draw';

export interface ShotParams {
  angle: number;
  power: number;
  wind: number;
  gravity: number;
  startX: number;
  startY: number;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
}

export interface TurnState {
  phase: TurnPhase;
  currentTurn: 'player' | 'cpu';
  turnNumber: number;
  wind: number;
  playerAngle: number;
  playerPower: number;
  cpuAngle: number;
  cpuPower: number;
  projectile?: ProjectileState;
}

export interface ProjectileState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trajectory: TrajectoryPoint[];
  currentPointIndex: number;
  owner: 'player' | 'cpu';
}

export interface DamageEvent {
  targetId: string;
  damage: number;
  isCritical: boolean;
  position: { x: number; y: number };
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
  isBoss?: boolean;
  bossConfig?: import('../game/systems/BossSystem').BossConfig;
  currentPhaseIndex?: number;
  phaseSpecialCooldowns?: Record<string, number>;
  projectileType?: ProjectileTypeId;
}

export interface BattleConfig {
  maxTurns: number;
  turnTimeLimit: number;
  windRange: { min: number; max: number };
  gravity: number;
  baseProjectileSpeed: number;
  explosionRadius: number;
  maxPower: number;
  minPower: number;
}

export const DEFAULT_BATTLE_CONFIG: BattleConfig = {
  maxTurns: 20,
  turnTimeLimit: 30000,
  windRange: { min: -5, max: 5 },
  gravity: 980,
  baseProjectileSpeed: 0.5,
  explosionRadius: 120,
  maxPower: 100,
  minPower: 10,
};

export interface LevelData {
  id: string;
  name: string;
  description: string;
  mapKey: string;
  backgroundKey: string;
  cpuCharacterId: string;
  cpuDifficulty: 'easy' | 'normal' | 'hard';
  unlockRequirement?: string;
}

export interface BattleResultData {
  result: BattleResult;
  turnsPlayed: number;
  playerDamageDealt: number;
  cpuDamageDealt: number;
  remainingHp: number;
  xpEarned: number;
  coinsEarned: number;
}

export interface ProjectilePhysicsConfig {
  gravityModifier: number;
  windModifier: number;
  speedModifier: number;
  dragCoefficient: number;
  mass: number;
  explosionRadius: number;
  damageMultiplier: number;
  specialBehavior?: string;
}