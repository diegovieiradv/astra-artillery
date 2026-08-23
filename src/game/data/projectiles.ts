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

export type ProjectileBehavior = 
  | 'normal' 
  | 'heavy' 
  | 'cluster' 
  | 'piercing' 
  | 'fire' 
  | 'ice' 
  | 'electric' 
  | 'bounce' 
  | 'multi' 
  | 'tactical';

export interface ProjectilePhysicsConfig {
  gravityModifier: number;
  windModifier: number;
  speedModifier: number;
  dragCoefficient: number;
  mass: number;
  explosionRadius: number;
  damageMultiplier: number;
  specialBehavior?: ProjectileSpecialBehavior;
}

export type ProjectileSpecialBehavior = 
  | 'none' 
  | 'cluster_explosion' 
  | 'piercing_penetration' 
  | 'area_burn' 
  | 'freeze_zone' 
  | 'chain_lightning' 
  | 'bounce' 
  | 'multi_shot' 
  | 'terrain_deform';

export interface ProjectileTypeConfig {
  id: ProjectileTypeId;
  name: string;
  description: string;
  behavior: ProjectileBehavior;
  physics: ProjectilePhysicsConfig;
  visual: {
    spriteKey: string;
    trailEffect?: string;
    color: string;
    scale: number;
  };
  audio: {
    launchSfx: string;
    impactSfx: string;
  };
  unlockRequirement?: {
    type: 'level' | 'region' | 'workshop' | 'mastery';
    value: string | number;
  };
  isDefault: boolean;
}

export const PROJECTILE_TYPES: Record<ProjectileTypeId, ProjectileTypeConfig> = {
  normal: {
    id: 'normal',
    name: 'Tiro Normal',
    description: 'Projétil equilibrado, base para todos os outros.',
    behavior: 'normal',
    physics: {
      gravityModifier: 1.0,
      windModifier: 1.0,
      speedModifier: 1.0,
      dragCoefficient: 0.02,
      mass: 1.0,
      explosionRadius: 120,
      damageMultiplier: 1.0,
      specialBehavior: 'none',
    },
    visual: {
      spriteKey: 'projectile',
      trailEffect: 'trail_normal',
      color: '#fbbf24',
      scale: 1.5,
    },
    audio: {
      launchSfx: 'sfx_shot',
      impactSfx: 'sfx_explosion',
    },
    isDefault: true,
  },
  heavy_bomb: {
    id: 'heavy_bomb',
    name: 'Bomba Pesada',
    description: 'Explosão massiva com raio ampliado e dano aumentado, mas mais lento e afetado pela gravidade.',
    behavior: 'heavy',
    physics: {
      gravityModifier: 1.5,
      windModifier: 0.7,
      speedModifier: 0.7,
      dragCoefficient: 0.05,
      mass: 2.5,
      explosionRadius: 200,
      damageMultiplier: 1.8,
      specialBehavior: 'none',
    },
    visual: {
      spriteKey: 'projectile_heavy',
      trailEffect: 'trail_heavy',
      color: '#ef4444',
      scale: 2.0,
    },
    audio: {
      launchSfx: 'sfx_shot_heavy',
      impactSfx: 'sfx_explosion_heavy',
    },
    unlockRequirement: {
      type: 'workshop',
      value: 'cannon_level_3',
    },
    isDefault: false,
  },
  cluster_shot: {
    id: 'cluster_shot',
    name: 'Tiro em Cacho',
    description: 'Divide-se em múltiplos sub-projéteis no ar, cobrindo área ampla.',
    behavior: 'cluster',
    physics: {
      gravityModifier: 0.9,
      windModifier: 1.2,
      speedModifier: 1.1,
      dragCoefficient: 0.03,
      mass: 0.8,
      explosionRadius: 80,
      damageMultiplier: 0.6,
      specialBehavior: 'cluster_explosion',
    },
    visual: {
      spriteKey: 'projectile_cluster',
      trailEffect: 'trail_cluster',
      color: '#a78bfa',
      scale: 1.2,
    },
    audio: {
      launchSfx: 'sfx_shot_cluster',
      impactSfx: 'sfx_explosion_cluster',
    },
    unlockRequirement: {
      type: 'workshop',
      value: 'cannon_level_5',
    },
    isDefault: false,
  },
  piercing_shot: {
    id: 'piercing_shot',
    name: 'Tiro Perfurante',
    description: 'Atravessa obstáculos e inimigos com raio reduzido, mas ignora cobertura.',
    behavior: 'piercing',
    physics: {
      gravityModifier: 0.8,
      windModifier: 0.5,
      speedModifier: 1.4,
      dragCoefficient: 0.01,
      mass: 0.5,
      explosionRadius: 60,
      damageMultiplier: 1.3,
      specialBehavior: 'piercing_penetration',
    },
    visual: {
      spriteKey: 'projectile_piercing',
      trailEffect: 'trail_piercing',
      color: '#22d3ee',
      scale: 1.0,
    },
    audio: {
      launchSfx: 'sfx_shot_piercing',
      impactSfx: 'sfx_explosion_piercing',
    },
    unlockRequirement: {
      type: 'workshop',
      value: 'cannon_level_4',
    },
    isDefault: false,
  },
  fire_shot: {
    id: 'fire_shot',
    name: 'Tiro Incendiário',
    description: 'Cria zona de fogo que queima inimigos por turnos.',
    behavior: 'fire',
    physics: {
      gravityModifier: 1.0,
      windModifier: 1.1,
      speedModifier: 1.0,
      dragCoefficient: 0.02,
      mass: 1.0,
      explosionRadius: 100,
      damageMultiplier: 1.1,
      specialBehavior: 'area_burn',
    },
    visual: {
      spriteKey: 'projectile_fire',
      trailEffect: 'trail_fire',
      color: '#fb923c',
      scale: 1.3,
    },
    audio: {
      launchSfx: 'sfx_shot_fire',
      impactSfx: 'sfx_explosion_fire',
    },
    unlockRequirement: {
      type: 'workshop',
      value: 'special_level_3',
    },
    isDefault: false,
  },
  ice_shot: {
    id: 'ice_shot',
    name: 'Tiro Congelante',
    description: 'Cria zona de gelo que reduz mobilidade e velocidade dos inimigos.',
    behavior: 'ice',
    physics: {
      gravityModifier: 1.1,
      windModifier: 0.8,
      speedModifier: 0.9,
      dragCoefficient: 0.03,
      mass: 1.2,
      explosionRadius: 90,
      damageMultiplier: 0.8,
      specialBehavior: 'freeze_zone',
    },
    visual: {
      spriteKey: 'projectile_ice',
      trailEffect: 'trail_ice',
      color: '#60a5fa',
      scale: 1.2,
    },
    audio: {
      launchSfx: 'sfx_shot_ice',
      impactSfx: 'sfx_explosion_ice',
    },
    unlockRequirement: {
      type: 'workshop',
      value: 'special_level_3',
    },
    isDefault: false,
  },
  electric_shot: {
    id: 'electric_shot',
    name: 'Tiro Elétrico',
    description: 'Cadeia de raios que salta entre inimigos próximos.',
    behavior: 'electric',
    physics: {
      gravityModifier: 0.7,
      windModifier: 0.6,
      speedModifier: 1.5,
      dragCoefficient: 0.01,
      mass: 0.6,
      explosionRadius: 110,
      damageMultiplier: 1.0,
      specialBehavior: 'chain_lightning',
    },
    visual: {
      spriteKey: 'projectile_electric',
      trailEffect: 'trail_electric',
      color: '#fbbf24',
      scale: 1.1,
    },
    audio: {
      launchSfx: 'sfx_shot_electric',
      impactSfx: 'sfx_explosion_electric',
    },
    unlockRequirement: {
      type: 'workshop',
      value: 'special_level_4',
    },
    isDefault: false,
  },
  bounce_shot: {
    id: 'bounce_shot',
    name: 'Tiro Ricochete',
    description: 'Ricocheteia em superfícies e inimigos até 3 vezes.',
    behavior: 'bounce',
    physics: {
      gravityModifier: 0.9,
      windModifier: 1.0,
      speedModifier: 1.2,
      dragCoefficient: 0.015,
      mass: 0.7,
      explosionRadius: 70,
      damageMultiplier: 0.9,
      specialBehavior: 'bounce',
    },
    visual: {
      spriteKey: 'projectile_bounce',
      trailEffect: 'trail_bounce',
      color: '#a3e635',
      scale: 1.1,
    },
    audio: {
      launchSfx: 'sfx_shot_bounce',
      impactSfx: 'sfx_explosion_bounce',
    },
    unlockRequirement: {
      type: 'workshop',
      value: 'cannon_level_4',
    },
    isDefault: false,
  },
  multi_shot: {
    id: 'multi_shot',
    name: 'Salva Múltipla',
    description: 'Dispara 3 projéteis em leque com dispersão controlada.',
    behavior: 'multi',
    physics: {
      gravityModifier: 1.0,
      windModifier: 1.0,
      speedModifier: 1.0,
      dragCoefficient: 0.02,
      mass: 0.9,
      explosionRadius: 80,
      damageMultiplier: 0.5,
      specialBehavior: 'multi_shot',
    },
    visual: {
      spriteKey: 'projectile_multi',
      trailEffect: 'trail_multi',
      color: '#f472b6',
      scale: 1.0,
    },
    audio: {
      launchSfx: 'sfx_shot_multi',
      impactSfx: 'sfx_explosion_multi',
    },
    unlockRequirement: {
      type: 'workshop',
      value: 'cannon_level_5',
    },
    isDefault: false,
  },
  tactical_shot: {
    id: 'tactical_shot',
    name: 'Tiro Tático',
    description: 'Deforma o terreno criando cobertura ou abrindo caminhos.',
    behavior: 'tactical',
    physics: {
      gravityModifier: 1.0,
      windModifier: 1.0,
      speedModifier: 0.8,
      dragCoefficient: 0.04,
      mass: 1.5,
      explosionRadius: 150,
      damageMultiplier: 0.7,
      specialBehavior: 'terrain_deform',
    },
    visual: {
      spriteKey: 'projectile_tactical',
      trailEffect: 'trail_tactical',
      color: '#a78bfa',
      scale: 1.4,
    },
    audio: {
      launchSfx: 'sfx_shot_tactical',
      impactSfx: 'sfx_explosion_tactical',
    },
    unlockRequirement: {
      type: 'workshop',
      value: 'special_level_5',
    },
    isDefault: false,
  },
};

export function getProjectileType(id: ProjectileTypeId): ProjectileTypeConfig {
  return PROJECTILE_TYPES[id];
}

export function getAllProjectileTypes(): ProjectileTypeConfig[] {
  return Object.values(PROJECTILE_TYPES);
}

export function getDefaultProjectileType(): ProjectileTypeConfig {
  return PROJECTILE_TYPES.normal;
}

export function getAvailableProjectileTypes(unlockedTypes: ProjectileTypeId[]): ProjectileTypeConfig[] {
  return Object.values(PROJECTILE_TYPES).filter(p => 
    p.isDefault || unlockedTypes.includes(p.id)
  );
}

export function getProjectilePhysicsConfig(typeId: ProjectileTypeId): ProjectilePhysicsConfig {
  return PROJECTILE_TYPES[typeId]?.physics || PROJECTILE_TYPES.normal.physics;
}

export function isProjectileUnlocked(typeId: ProjectileTypeId, unlockedTypes: ProjectileTypeId[]): boolean {
  const type = PROJECTILE_TYPES[typeId];
  if (!type) return false;
  if (type.isDefault) return true;
  return unlockedTypes.includes(typeId);
}