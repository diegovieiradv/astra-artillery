import { Character, CharacterStats, SpecialAbility, AbilityContext, AbilityResult, AbilityEffect, CHARACTER_ROLES } from '@/types/character';

const createAbility = (
  id: string,
  name: string,
  description: string,
  cooldown: number,
  execute: (ctx: AbilityContext) => AbilityResult
): SpecialAbility => ({ id, name, description, cooldown, execute });

const kaiAbility = createAbility(
  'focused_shot',
  'Tiro Focado',
  'Próximo disparo tem +25% precisão e ignora 50% da defesa do alvo',
  3,
  (ctx): AbilityResult => ({
    success: true,
    effects: [
      { type: 'buff', value: 25, duration: 1, target: 'self' },
      { type: 'debuff', value: 50, duration: 1, target: 'enemy' },
    ],
  })
);

const lunaAbility = createAbility(
  'eagle_eye',
  'Olho de Águia',
  'Revela a trajetória exata do próximo tiro do inimigo e ganha +30% precisão',
  2,
  (ctx): AbilityResult => ({
    success: true,
    effects: [
      { type: 'buff', value: 30, duration: 2, target: 'self' },
      { type: 'buff', value: 100, duration: 1, target: 'enemy' },
    ],
  })
);

const boltAbility = createAbility(
  'heavy_impact',
  'Impacto Pesado',
  'Próximo disparo causa +50% dano e aumenta raio de explosão em 30%',
  4,
  (ctx): AbilityResult => ({
    success: true,
    effects: [
      { type: 'buff', value: 50, duration: 1, target: 'self' },
      { type: 'buff', value: 30, duration: 1, target: 'self' },
    ],
  })
);

const novaAbility = createAbility(
  'barrier_field',
  'Campo de Barreira',
  'Cria uma barreira que absorve até 40% do dano do próximo ataque inimigo',
  3,
  (ctx): AbilityResult => ({
    success: true,
    effects: [
      { type: 'buff', value: 40, duration: 1, target: 'self' },
    ],
  })
);

const zephyrAbility = createAbility(
  'wind_step',
  'Passo do Vento',
  'Ganha movimento extra neste turno e +40% chance de esquiva no próximo ataque inimigo',
  2,
  (ctx): AbilityResult => ({
    success: true,
    effects: [
      { type: 'buff', value: 100, duration: 1, target: 'self' },
      { type: 'debuff', value: 40, duration: 1, target: 'enemy' },
    ],
  })
);

const igneousAbility = createAbility(
  'chain_detonation',
  'Detonação em Cadeia',
  'Próximo disparo cria 3 explosões menores em sequência ao longo da trajetória',
  4,
  (ctx): AbilityResult => ({
    success: true,
    effects: [
      { type: 'buff', value: 30, duration: 1, target: 'self' },
      { type: 'buff', value: 3, duration: 1, target: 'self' },
    ],
  })
);

const glacisAbility = createAbility(
  'frozen_shell',
  'Casco Congelado',
  'Ganha imunidade a dano e reflete 50% do dano recebido no próximo ataque inimigo',
  4,
  (ctx): AbilityResult => ({
    success: true,
    effects: [
      { type: 'buff', value: 100, duration: 1, target: 'self' },
      { type: 'buff', value: 50, duration: 1, target: 'self' },
    ],
  })
);

const aerisAbility = createAbility(
  'gale_force',
  'Força da Tempestade',
  'Altera o vento para o valor oposto no próximo turno e ganha +25% precisão',
  3,
  (ctx): AbilityResult => ({
    success: true,
    effects: [
      { type: 'buff', value: 25, duration: 2, target: 'self' },
      { type: 'buff', value: 100, duration: 1, target: 'enemy' },
    ],
  })
);

const scatterAbility = createAbility(
  'burst_barrage',
  'Rajada Dispersa',
  'Dispara 3 projéteis em leque cobrindo ampla área, cada um com 60% do dano base',
  4,
  (ctx): AbilityResult => ({
    success: true,
    effects: [
      { type: 'buff', value: 3, duration: 1, target: 'self' },
      { type: 'buff', value: 60, duration: 1, target: 'self' },
    ],
  })
);

const tactosAbility = createAbility(
  'field_manipulation',
  'Manipulação de Campo',
  'Aplica debuff de -30% ataque e -20% mobilidade no inimigo por 2 turnos',
  3,
  (ctx): AbilityResult => ({
    success: true,
    effects: [
      { type: 'debuff', value: 30, duration: 2, target: 'enemy' },
      { type: 'debuff', value: 20, duration: 2, target: 'enemy' },
    ],
  })
);

export const CHARACTERS: Record<string, Character> = {
  kai: {
    id: 'kai',
    name: 'Kai',
    description: 'Um aventureiro equilibrado que domina os fundamentos da artilharia. Versátil em qualquer situação.',
    role: 'balanced',
    stats: { health: 100, attack: 1.0, defense: 1.0, mobility: 1.0 },
    specialAbility: kaiAbility,
    spriteKey: 'char_kai',
    avatarKey: 'avatar_kai',
  },
  luna: {
    id: 'luna',
    name: 'Luna',
    description: 'Especialista em precisão cirúrgica. Seus cálculos balísticos são quase infalíveis a longa distância.',
    role: 'precision',
    stats: { health: 80, attack: 0.9, defense: 0.8, mobility: 1.1 },
    specialAbility: lunaAbility,
    spriteKey: 'char_luna',
    avatarKey: 'avatar_luna',
  },
  bolt: {
    id: 'bolt',
    name: 'Bolt',
    description: 'Mestre da força bruta. Seus projéteis carregam energia devastadora, mas exigem posicionamento cuidadoso.',
    role: 'power',
    stats: { health: 120, attack: 1.3, defense: 1.1, mobility: 0.7 },
    specialAbility: boltAbility,
    spriteKey: 'char_bolt',
    avatarKey: 'avatar_bolt',
  },
  nova: {
    id: 'nova',
    name: 'Nova',
    description: 'Estrategista que controla o campo de batalha. Suas barreiras protegem a equipe nos momentos cruciais.',
    role: 'support',
    stats: { health: 90, attack: 0.7, defense: 1.2, mobility: 1.0 },
    specialAbility: novaAbility,
    spriteKey: 'char_nova',
    avatarKey: 'avatar_nova',
  },
  zephyr: {
    id: 'zephyr',
    name: 'Zephyr',
    description: 'Mestre da mobilidade e esquiva. Move-se como o vento, impossível de atingir.',
    role: 'mobility',
    stats: { health: 75, attack: 0.85, defense: 0.7, mobility: 1.4 },
    specialAbility: zephyrAbility,
    spriteKey: 'char_zephyr',
    avatarKey: 'avatar_zephyr',
  },
  igneous: {
    id: 'igneous',
    name: 'Igneous',
    description: 'Especialista em explosões em cadeia. Domina a arte da destruição em área.',
    role: 'explosives',
    stats: { health: 85, attack: 1.2, defense: 0.9, mobility: 0.8 },
    specialAbility: igneousAbility,
    spriteKey: 'char_igneous',
    avatarKey: 'avatar_igneous',
  },
  glacis: {
    id: 'glacis',
    name: 'Glacis',
    description: 'Tanque impenetrável de gelo. Absorve dano e contra-ataca com reflexo mortal.',
    role: 'defense',
    stats: { health: 150, attack: 0.7, defense: 1.5, mobility: 0.6 },
    specialAbility: glacisAbility,
    spriteKey: 'char_glacis',
    avatarKey: 'avatar_glacis',
  },
  aeris: {
    id: 'aeris',
    name: 'Aeris',
    description: 'Mestra dos ventos. Controla o campo de batalha manipulando as correntes de ar.',
    role: 'wind_specialist',
    stats: { health: 80, attack: 0.9, defense: 0.8, mobility: 1.2 },
    specialAbility: aerisAbility,
    spriteKey: 'char_aeris',
    avatarKey: 'avatar_aeris',
  },
  scatter: {
    id: 'scatter',
    name: 'Scatter',
    description: 'Especialista em disparos múltiplos. Cada tiro libera uma rajada de projéteis que cobrem ampla área.',
    role: 'multi_shot',
    stats: { health: 75, attack: 0.8, defense: 0.7, mobility: 1.1 },
    specialAbility: scatterAbility,
    spriteKey: 'char_scatter',
    avatarKey: 'avatar_scatter',
  },
  tactos: {
    id: 'tactos',
    name: 'Tactos',
    description: 'Estrategista tático que manipula o campo de batalha com armadilhas e debuffs em área.',
    role: 'tactical',
    stats: { health: 85, attack: 0.85, defense: 0.9, mobility: 1.0 },
    specialAbility: tactosAbility,
    spriteKey: 'char_tactos',
    avatarKey: 'avatar_tactos',
  },
};

export function getCharacter(id: string): Character | undefined {
  return CHARACTERS[id];
}

export function getAllCharacters(): Character[] {
  return Object.values(CHARACTERS);
}

export function getCharacterStats(characterId: string): CharacterStats | null {
  return CHARACTERS[characterId]?.stats ?? null;
}

export { CHARACTER_ROLES };

export const LEVELS = [
  { id: 'arena_1', name: 'Planícies de Aether' },
  { id: 'arena_2', name: 'Cânion dos Ventos' },
  { id: 'arena_3', name: 'Cidadela Flutuante' },
  { id: 'boss_1', name: 'Fortaleza do Núcleo' },
];