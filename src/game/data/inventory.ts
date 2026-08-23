export type InventoryCategory = 
  | 'weapons' 
  | 'cannons' 
  | 'armor' 
  | 'accessories' 
  | 'projectiles' 
  | 'tactical_items' 
  | 'cosmetics';

export type InventoryItemState = 'locked' | 'owned' | 'equipped';

export interface InventoryItem {
  id: string;
  category: InventoryCategory;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  cost: number;
  icon: string;
  state: InventoryItemState;
  stats?: Record<string, number>;
  effects?: string[];
  unlockRequirement?: {
    type: 'level' | 'region' | 'workshop' | 'mastery' | 'level';
    value: string | number;
  };
}

export interface LoadoutConfig {
  characterId: string;
  cannonId: string | null;
  armorId: string | null;
  accessoryId: string | null;
  projectileId: string | null;
  tacticalItemId: string | null;
}

export const INVENTORY_CATEGORIES: Record<InventoryCategory, { label: string; icon: string; color: string }> = {
  weapons: { label: 'Armas', icon: '🔫', color: '#f87171' },
  cannons: { label: 'Canhões', icon: '🛡️', color: '#34d399' },
  armor: { label: 'Armaduras', icon: '🛡️', color: '#34d399' },
  accessories: { label: 'Acessórios', icon: '💍', color: '#a78bfa' },
  projectiles: { label: 'Projéteis', icon: '💣', color: '#fbbf24' },
  tactical_items: { label: 'Itens Táticos', icon: '🧪', color: '#a78bfa' },
  cosmetics: { label: 'Cosméticos', icon: '🎨', color: '#fbbf24' },
};

export const RARITY_COLORS: Record<string, string> = {
  common: '#64748b',
  rare: '#60a5fa',
  epic: '#a78bfa',
  legendary: '#fbbf24',
};

export const RARITY_LABELS: Record<string, string> = {
  common: 'Comum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
};

export const INVENTORY_SLOTS = {
  character: { label: 'Personagem', required: true },
  cannon: { label: 'Canhão', required: false },
  armor: { label: 'Armadura', required: false },
  accessory: { label: 'Acessório', required: false },
  projectile: { label: 'Projétil', required: false },
  tactical_item: { label: 'Item Tático', required: false },
} as const;

export type LoadoutSlot = keyof typeof INVENTORY_SLOTS;

export const DEFAULT_LOADOUT: LoadoutConfig = {
  characterId: 'kai',
  cannonId: null,
  armorId: null,
  accessoryId: null,
  projectileId: 'normal',
  tacticalItemId: null,
};

export function getItemById(id: string): InventoryItem | undefined {
  // This will be populated from a registry
  return undefined;
}

export function getItemsByCategory(category: InventoryCategory): InventoryItem[] {
  // This will be populated from a registry
  return [];
}

export function getEquippedItems(loadout: LoadoutConfig): Record<string, string | null> {
  return {
    character: loadout.characterId,
    cannon: loadout.cannonId,
    armor: loadout.armorId,
    accessory: loadout.accessoryId,
    projectile: loadout.projectileId,
    tactical_item: loadout.tacticalItemId,
  };
}

export const UPGRADE_TABS = [
  { id: 'cannon', label: 'Canhão', icon: '🔫', color: '#f87171', description: 'Poder, Velocidade, Raio, Precisão' },
  { id: 'armor', label: 'Armadura', icon: '🛡️', color: '#34d399', description: 'Vida, Defesa, Resistência' },
  { id: 'mobility', label: 'Mobilidade', icon: '👟', color: '#60a5fa', description: 'Distância, Velocidade de Carga' },
  { id: 'special', label: 'Especial', icon: '✨', color: '#a78bfa', description: 'Recarga, Eficiência, Potência' },
  { id: 'cosmetics', label: 'Cosméticos', icon: '🎨', color: '#fbbf24', description: 'Skins, Trilhas, Explosões' },
] as const;

export const COSMETIC_SLOTS = [
  { id: 'skin', label: 'Skin', icon: '👤' },
  { id: 'trail', label: 'Trilha', icon: '✨' },
  { id: 'explosion', label: 'Explosão', icon: '💥' },
  { id: 'frame', label: 'Moldura', icon: '🖼️' },
  { id: 'banner', label: 'Banner', icon: '🏳️' },
] as const;

export const COSMETICS_DATA = [
  { id: 'skin_kai_default', name: 'Kai Padrão', slot: 'skin', rarity: 'common' as const, cost: 0, preview: '👤' },
  { id: 'skin_luna_default', name: 'Luna Padrão', slot: 'skin', rarity: 'common' as const, cost: 0, preview: '👤' },
  { id: 'skin_bolt_default', name: 'Bolt Padrão', slot: 'skin', rarity: 'common' as const, cost: 0, preview: '👤' },
  { id: 'skin_nova_default', name: 'Nova Padrão', slot: 'skin', rarity: 'common' as const, cost: 0, preview: '👤' },
  { id: 'trail_default', name: 'Trilha Dourada', slot: 'trail', rarity: 'common' as const, cost: 0, preview: '✨' },
  { id: 'explosion_default', name: 'Explosão Padrão', slot: 'explosion', rarity: 'common' as const, cost: 0, preview: '💥' },
  { id: 'frame_default', name: 'Moldura Básica', slot: 'frame', rarity: 'common' as const, cost: 0, preview: '🖼️' },
  { id: 'banner_default', name: 'Banner Inicial', slot: 'banner', rarity: 'common' as const, cost: 0, preview: '🏳️' },
] as const;