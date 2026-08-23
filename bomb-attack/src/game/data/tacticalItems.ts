export interface TacticalItemConfig {
  id: string;
  name: string;
  description: string;
  type: 'consumable' | 'equipment' | 'buff';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  cost: number;
  icon: string;
  effects: TacticalItemEffect[];
  cooldown: number;
  maxCharges: number;
  duration?: number;
  visual?: {
    spriteKey: string;
    color: string;
  };
  unlockRequirement?: {
    type: 'level' | 'region' | 'workshop' | 'mastery';
    value: string | number;
  };
}

export interface TacticalItemEffect {
  type: 'heal' | 'shield' | 'repair' | 'teleport' | 'damage_boost' | 'defense_boost' | 'speed_boost' | 'debuff_enemy' | 'cleanse';
  value: number;
  target: 'self' | 'enemy';
  duration?: number;
}

export interface TacticalItemState {
  unlocked: boolean;
  currentCharges: number;
  lastUsed?: number;
  totalUses: number;
}

export interface TacticalInventoryState {
  items: Record<string, TacticalItemState>;
  equippedItem: string | null;
  totalItemsUsed: number;
}

export const DEFAULT_TACTICAL_INVENTORY: TacticalInventoryState = {
  items: {},
  equippedItem: null,
  totalItemsUsed: 0,
};

export function createDefaultTacticalInventory(): TacticalInventoryState {
  return JSON.parse(JSON.stringify(DEFAULT_TACTICAL_INVENTORY));
}

export const TACTICAL_ITEMS: TacticalItemConfig[] = [
  {
    id: 'health_potion',
    name: 'Pocao de Vida',
    description: 'Restaura 30% da vida maxima. Efeito imediato.',
    type: 'consumable',
    rarity: 'common',
    cost: 100,
    icon: '🧪',
    effects: [{ type: 'heal', value: 0.3, target: 'self' }],
    cooldown: 0,
    maxCharges: 3,
    visual: { spriteKey: 'potion_health', color: '#ef4444' },
  },
  {
    id: 'shield_orb',
    name: 'Orbe de Escudo',
    description: 'Cria um escudo que absorve 50 de dano. Dura 2 turnos.',
    type: 'consumable',
    rarity: 'rare',
    cost: 250,
    icon: '🛡️',
    effects: [{ type: 'shield', value: 50, target: 'self', duration: 2 }],
    cooldown: 0,
    maxCharges: 2,
    visual: { spriteKey: 'orb_shield', color: '#3b82f6' },
  },
  {
    id: 'teleport_stone',
    name: 'Pedra de Teleporte',
    description: 'Teleporta para qualquer posicao no mapa.',
    type: 'consumable',
    rarity: 'epic',
    cost: 500,
    icon: '🌀',
    effects: [{ type: 'teleport', value: 1, target: 'self' }],
    cooldown: 0,
    maxCharges: 1,
    visual: { spriteKey: 'stone_teleport', color: '#a855f7' },
  },
  {
    id: 'repair_kit',
    name: 'Kit de Reparo',
    description: 'Repara 25% da vida maxima. Cooldown de 3 turnos.',
    type: 'equipment',
    rarity: 'common',
    cost: 200,
    icon: '🔧',
    effects: [{ type: 'repair', value: 0.25, target: 'self' }],
    cooldown: 3,
    maxCharges: 5,
    visual: { spriteKey: 'kit_repair', color: '#22c55e' },
  },
  {
    id: 'damage_amulet',
    name: 'Amuleto de Dano',
    description: 'Aumenta dano em 20% por 3 turnos.',
    type: 'equipment',
    rarity: 'rare',
    cost: 400,
    icon: '📿',
    effects: [{ type: 'damage_boost', value: 0.2, target: 'self', duration: 3 }],
    cooldown: 4,
    maxCharges: 3,
    visual: { spriteKey: 'amulet_damage', color: '#f97316' },
  },
  {
    id: 'defense_charm',
    name: 'Amuleto de Defesa',
    description: 'Aumenta defesa em 30% por 3 turnos.',
    type: 'equipment',
    rarity: 'rare',
    cost: 400,
    icon: '🧿',
    effects: [{ type: 'defense_boost', value: 0.3, target: 'self', duration: 3 }],
    cooldown: 4,
    maxCharges: 3,
    visual: { spriteKey: 'charm_defense', color: '#14b8a6' },
  },
  {
    id: 'speed_potion',
    name: 'Pocao de Velocidade',
    description: 'Aumenta velocidade de movimento em 50% por 3 turnos.',
    type: 'buff',
    rarity: 'common',
    cost: 150,
    icon: '⚡',
    effects: [{ type: 'speed_boost', value: 0.5, target: 'self', duration: 3 }],
    cooldown: 0,
    maxCharges: 2,
    visual: { spriteKey: 'potion_speed', color: '#eab308' },
  },
  {
    id: 'weakness_hex',
    name: 'Hex de Fraqueza',
    description: 'Diminui dano do inimigo em 25% por 2 turnos.',
    type: 'consumable',
    rarity: 'rare',
    cost: 350,
    icon: '💀',
    effects: [{ type: 'debuff_enemy', value: 0.25, target: 'enemy', duration: 2 }],
    cooldown: 0,
    maxCharges: 1,
    visual: { spriteKey: 'hex_weakness', color: '#7c3aed' },
  },
  {
    id: 'purification_orb',
    name: 'Orbe de Purificacao',
    description: 'Remove todos os debuffs ativos.',
    type: 'consumable',
    rarity: 'epic',
    cost: 600,
    icon: '✨',
    effects: [{ type: 'cleanse', value: 1, target: 'self' }],
    cooldown: 5,
    maxCharges: 2,
    visual: { spriteKey: 'orb_purify', color: '#f0abfc' },
  },
  {
    id: 'mega_bomb',
    name: 'Mega Bomba',
    description: 'Causa 100 de dano ao inimigo. Uso unico.',
    type: 'consumable',
    rarity: 'legendary',
    cost: 1000,
    icon: '💣',
    effects: [{ type: 'damage_boost', value: 100, target: 'enemy' }],
    cooldown: 0,
    maxCharges: 1,
    visual: { spriteKey: 'bomb_mega', color: '#dc2626' },
  },
];

export function getTacticalItem(id: string): TacticalItemConfig | undefined {
  return TACTICAL_ITEMS.find(item => item.id === id);
}

export function getTacticalItemsByType(type: TacticalItemConfig['type']): TacticalItemConfig[] {
  return TACTICAL_ITEMS.filter(item => item.type === type);
}

export function getTacticalItemsByRarity(rarity: TacticalItemConfig['rarity']): TacticalItemConfig[] {
  return TACTICAL_ITEMS.filter(item => item.rarity === rarity);
}

export function calculateTotalCharges(items: TacticalInventoryState): number {
  return Object.values(items.items).reduce((total, item) => total + item.currentCharges, 0);
}

export function isItemOnCooldown(item: TacticalItemConfig, state: TacticalItemState): boolean {
  if (!item.cooldown || !state.lastUsed) return false;
  const timeSinceLastUse = Date.now() - state.lastUsed;
  return timeSinceLastUse < item.cooldown * 1000;
}

export function canUseItem(item: TacticalItemConfig, state: TacticalItemState): boolean {
  if (!state.unlocked) return false;
  if (state.currentCharges <= 0) return false;
  if (isItemOnCooldown(item, state)) return false;
  return true;
}
