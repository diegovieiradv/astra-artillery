import { ProjectileTypeId } from '@/game/data/projectiles';

export interface CraterConfig {
  id: string;
  radius: number;
  depth: number;
  createdAt: number;
  durability: number; // decreases with further impacts
  maxImpacts: number;
  image: string; // reference to crater sprite or effect
  color: string; // CSS color for the crater visualization
  permanent: boolean; // whether the crater persists permanently or fades
}

export interface FallZone {
  id: string;
  x: number;
  y: number;
  radius: number;
  dangerous: boolean;
  turnCreated: number;
  expiresAt?: number;
}

export interface TerrainState {
  craters: Record<string, CraterConfig>;
  fallZones: Record<string, FallZone>;
  totalImpacts: number;
  permanentCraters: number;
}

export interface TerrainImpactResult {
  craterId: string | null;
  fallZone: boolean;
  damageDealt: number;
  crateLoot?: string;
}

export const DEFAULT_TERRAIN_STATE: TerrainState = {
  craters: {},
  fallZones: {},
  totalImpacts: 0,
  permanentCraters: 0,
};

export function createDefaultTerrainState(): TerrainState {
  return JSON.parse(JSON.stringify(DEFAULT_TERRAIN_STATE));
}

export interface TerrainAbilityEffectParams {
  radius?: number;
  depth?: number;
  permanent?: boolean;
  duration?: number;
}

export interface TerrainAbilityConfig {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  maxCharges: number;
  effect: 'create_crater' | 'expand_crater' | 'create_fall_zone' | 'clear_craters';
  effectParams: TerrainAbilityEffectParams;
}

export const TERRAIN_ABILITIES: TerrainAbilityConfig[] = [
  {
    id: 'crater_small',
    name: 'Cratera Pequena',
    description: 'Cria uma cratera pequena no local do impacto. Raio: 30px, profundidade: 10px.',
    cooldown: 3,
    maxCharges: 1,
    effect: 'create_crater',
    effectParams: { radius: 30, depth: 10, permanent: false },
  },
  {
    id: 'crater_medium',
    name: 'Cratera Média',
    description: 'Cria uma cratera média no local do impacto. Raio: 50px, profundidade: 20px.',
    cooldown: 5,
    maxCharges: 1,
    effect: 'create_crater',
    effectParams: { radius: 50, depth: 20, permanent: true },
  },
  {
    id: 'crater_large',
    name: 'Cratera Grande',
    description: 'Cria uma cratera grande no local do impacto. Raio: 80px, profundidade: 35px. Efeitos duradouros.',
    cooldown: 8,
    maxCharges: 1,
    effect: 'create_crater',
    effectParams: { radius: 80, depth: 35, permanent: true },
  },
  {
    id: 'fall_zone',
    name: 'Zona Perigosa',
    description: 'Cria uma zona de perigo por 3 turnos. Personagens que entram sofrem dano por contato.',
    cooldown: 4,
    maxCharges: 2,
    effect: 'create_fall_zone',
    effectParams: { radius: 40, duration: 3 },
  },
  {
    id: 'clear_craters',
    name: 'Limpar Craters',
    description: 'Remove todas as crateras temporárias do campo de batalha, deixando apenas as permanentes.',
    cooldown: 6,
    maxCharges: 1,
    effect: 'clear_craters',
    effectParams: { permanent: true },
  },
];

export function getTerrainAbility(id: string): TerrainAbilityConfig | undefined {
  return TERRAIN_ABILITIES.find(a => a.id === id);
}

export function getAllTerrainAbilities(): TerrainAbilityConfig[] {
  return [...TERRAIN_ABILITIES];
}