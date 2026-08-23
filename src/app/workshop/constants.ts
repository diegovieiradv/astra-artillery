export const UPGRADE_CATEGORIES = [
  { id: 'cannon', label: 'Canhão', icon: '🔫', color: '#f87171', description: 'Poder, Velocidade, Raio, Precisão' },
  { id: 'armor', label: 'Armadura', icon: '🛡️', color: '#34d399', description: 'Vida, Defesa, Resistência' },
  { id: 'mobility', label: 'Mobilidade', icon: '👟', color: '#60a5fa', description: 'Distância, Velocidade de Carga' },
  { id: 'special', label: 'Especial', icon: '✨', color: '#a78bfa', description: 'Recarga, Eficiência, Potência' },
  { id: 'cosmetics', label: 'Cosméticos', icon: '🎨', color: '#fbbf24', description: 'Skins, Trilhas, Explosões' },
] as const;

export const COSMETIC_SLOTS = [
  { id: 'skin', label: 'Skin', icon: '👤' },
  { id: 'trail', label: 'Trilha', icon: '🌈' },
  { id: 'explosion', label: 'Explosão', icon: '💥' },
  { id: 'banner', label: 'Banner', icon: '🏳️' },
  { id: 'frame', label: 'Moldura', icon: '🖼️' },
] as const;

export const COSMETICS_DATA = [
  { id: 'skin_default', slot: 'skin', name: 'Padrão', cost: 0, rarity: 'common', preview: '👤' },
  { id: 'skin_frost', slot: 'skin', name: 'Congelado', cost: 500, rarity: 'rare', preview: '❄️' },
  { id: 'skin_ember', slot: 'skin', name: 'Brasa', cost: 500, rarity: 'rare', preview: '🔥' },
  { id: 'skin_void', slot: 'skin', name: 'Vazio', cost: 1000, rarity: 'epic', preview: '🌑' },
  { id: 'skin_gold', slot: 'skin', name: 'Dourado', cost: 2000, rarity: 'legendary', preview: '✨' },
  { id: 'trail_default', slot: 'trail', name: 'Nenhuma', cost: 0, rarity: 'common', preview: '➖' },
  { id: 'trail_ice', slot: 'trail', name: 'Gelo', cost: 300, rarity: 'rare', preview: '🧊' },
  { id: 'trail_fire', slot: 'trail', name: 'Fogo', cost: 300, rarity: 'rare', preview: '🔥' },
  { id: 'trail_wind', slot: 'trail', name: 'Vento', cost: 300, rarity: 'rare', preview: '💨' },
  { id: 'trail_void', slot: 'trail', name: 'Vazio', cost: 600, rarity: 'epic', preview: '🌌' },
  { id: 'explosion_default', slot: 'explosion', name: 'Padrão', cost: 0, rarity: 'common', preview: '💥' },
  { id: 'explosion_ice', slot: 'explosion', name: 'Congelante', cost: 400, rarity: 'rare', preview: '❄️' },
  { id: 'explosion_fire', slot: 'explosion', name: 'Incendiária', cost: 400, rarity: 'rare', preview: '🌋' },
  { id: 'explosion_void', slot: 'explosion', name: 'Caos', cost: 800, rarity: 'epic', preview: '🕳️' },
];
