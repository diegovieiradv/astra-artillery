import { 
  ShotParams, 
  TrajectoryPoint, 
  DEFAULT_BATTLE_CONFIG, 
  ProjectilePhysicsConfig 
} from '@/types/battle';
import { degToRad, clamp } from '@/types/physics';

export function calculateTrajectory(
  params: ShotParams, 
  config: typeof DEFAULT_BATTLE_CONFIG = DEFAULT_BATTLE_CONFIG,
  projectileConfig?: ProjectilePhysicsConfig
): TrajectoryPoint[] {
  const rad = degToRad(params.angle);
  
  // Apply projectile physics modifiers
  const gravity = config.gravity * (projectileConfig?.gravityModifier ?? 1.0);
  const windAccel = params.wind * 8 * (projectileConfig?.windModifier ?? 1.0);
  const speed = params.power * config.baseProjectileSpeed * (projectileConfig?.speedModifier ?? 1.0);
  const drag = projectileConfig?.dragCoefficient ?? 0.02;
  const mass = projectileConfig?.mass ?? 1.0;

  const v0 = speed;
  const vx0 = Math.cos(rad) * v0;
  const vy0 = -Math.sin(rad) * v0;

  const points: TrajectoryPoint[] = [];
  let x = params.startX;
  let y = params.startY;
  let vx = vx0;
  let vy = vy0;
  const dt = 1 / 60;

  for (let t = 0; t < 15; t += dt) {
    points.push({ x, y, vx, vy, t });
    
    // Apply wind
    vx += windAccel * dt;
    
    // Apply gravity
    vy += gravity * dt;
    
    // Apply drag (air resistance proportional to velocity squared / mass)
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed > 0) {
      const dragForce = drag * speed * speed / mass;
      const dragAngle = Math.atan2(vy, vx);
      vx -= dragForce * Math.cos(dragAngle) * dt;
      vy -= dragForce * Math.sin(dragAngle) * dt;
    }
    
    x += vx * dt;
    y += vy * dt;
    
    if (y > 1080) break;
  }
  return points;
}

export function calculateDamage(
  distanceFromCenter: number,
  explosionRadius: number,
  baseDamage: number,
  attackerAttack: number,
  defenderDefense: number,
  damageMultiplier: number = 1.0
): number {
  if (distanceFromCenter > explosionRadius) return 0;

  const falloff = 1 - (distanceFromCenter / explosionRadius);
  const rawDamage = baseDamage * falloff * attackerAttack * damageMultiplier;
  const mitigated = rawDamage * (100 / (100 + defenderDefense));
  return Math.max(1, Math.floor(mitigated));
}

export function calculateWindChange(currentWind: number, config: typeof DEFAULT_BATTLE_CONFIG): number {
  const change = (Math.random() - 0.5) * 2;
  const newWind = currentWind + change;
  return clamp(newWind, config.windRange.min, config.windRange.max);
}

export function generateInitialWind(config: typeof DEFAULT_BATTLE_CONFIG): number {
  return (Math.random() - 0.5) * (config.windRange.max - config.windRange.min) * 0.5;
}

export function getProjectilePhysicsConfig(typeId: string): ProjectilePhysicsConfig | undefined {
  // This will be implemented by importing from projectiles data
  // For now, return a default config based on type
  const configs: Record<string, ProjectilePhysicsConfig> = {
    normal: {
      gravityModifier: 1.0,
      windModifier: 1.0,
      speedModifier: 1.0,
      dragCoefficient: 0.02,
      mass: 1.0,
      explosionRadius: 120,
      damageMultiplier: 1.0,
    },
    heavy_bomb: {
      gravityModifier: 1.5,
      windModifier: 0.7,
      speedModifier: 0.7,
      dragCoefficient: 0.05,
      mass: 2.5,
      explosionRadius: 200,
      damageMultiplier: 1.8,
    },
    cluster_shot: {
      gravityModifier: 0.9,
      windModifier: 1.2,
      speedModifier: 1.1,
      dragCoefficient: 0.03,
      mass: 0.8,
      explosionRadius: 80,
      damageMultiplier: 0.6,
    },
    piercing_shot: {
      gravityModifier: 0.8,
      windModifier: 0.5,
      speedModifier: 1.4,
      dragCoefficient: 0.01,
      mass: 0.5,
      explosionRadius: 60,
      damageMultiplier: 1.3,
    },
    fire_shot: {
      gravityModifier: 1.0,
      windModifier: 1.1,
      speedModifier: 1.0,
      dragCoefficient: 0.02,
      mass: 1.0,
      explosionRadius: 100,
      damageMultiplier: 1.1,
    },
    ice_shot: {
      gravityModifier: 1.1,
      windModifier: 0.8,
      speedModifier: 0.9,
      dragCoefficient: 0.03,
      mass: 1.2,
      explosionRadius: 90,
      damageMultiplier: 0.8,
    },
    electric_shot: {
      gravityModifier: 0.7,
      windModifier: 0.6,
      speedModifier: 1.5,
      dragCoefficient: 0.01,
      mass: 0.6,
      explosionRadius: 110,
      damageMultiplier: 1.0,
    },
    bounce_shot: {
      gravityModifier: 0.9,
      windModifier: 1.0,
      speedModifier: 1.2,
      dragCoefficient: 0.015,
      mass: 0.7,
      explosionRadius: 70,
      damageMultiplier: 0.9,
    },
    multi_shot: {
      gravityModifier: 1.0,
      windModifier: 1.0,
      speedModifier: 1.0,
      dragCoefficient: 0.02,
      mass: 0.9,
      explosionRadius: 80,
      damageMultiplier: 0.5,
    },
    tactical_shot: {
      gravityModifier: 1.0,
      windModifier: 1.0,
      speedModifier: 0.8,
      dragCoefficient: 0.04,
      mass: 1.5,
      explosionRadius: 150,
      damageMultiplier: 0.7,
    },
  };
  
  return configs[typeId];
}