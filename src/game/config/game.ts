export const PHYSICS_CONFIG = {
  gravity: 980,
  baseProjectileSpeed: 0.5,
  windInfluence: 8,
  maxSimulationTime: 15,
  fixedTimeStep: 1 / 60,
  groundLevel: 900,
  ceilingLevel: 100,
  leftBound: 0,
  rightBound: 1920,
} as const;

export const COMBAT_CONFIG = {
  explosionRadius: 120,
  maxPower: 100,
  minPower: 10,
  powerChargeRate: 35,
  angleAdjustRate: 2,
  moveSpeed: 150,
  maxMoveDistance: 200,
  baseDamage: 35,
  criticalChance: 0.1,
  criticalMultiplier: 1.5,
} as const;

export const TURN_CONFIG = {
  maxTurns: 20,
  turnTimeLimit: 30000,
  windChangeRange: 2,
  windRange: { min: -5, max: 5 } as const,
  aiThinkingTime: { easy: 800, normal: 1200, hard: 600 } as const,
  aiAccuracy: { easy: 0.35, normal: 0.2, hard: 0.08 } as const,
} as const;

export const UI_CONFIG = {
  hudHeight: 120,
  powerBarWidth: 200,
  powerBarHeight: 24,
  angleDisplaySize: 48,
  windDisplaySize: 36,
  damageNumberDuration: 1500,
  hpBarWidth: 180,
  hpBarHeight: 16,
} as const;