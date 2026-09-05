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

const tornAbility = createAbility(
  'chain_detonation',
  'Detonação Sombria',
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

const pyraAbility = createAbility(
  'frozen_shell',
  'Explosão Estelar',
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

const miraAbility = createAbility(
  'gale_force',
  'Tiro Arcano',
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

const rookAbility = createAbility(
  'burst_barrage',
  'Barragem Pesada',
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

const draxAbility = createAbility(
  'field_manipulation',
  'Fúria Cósmica',
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
    element: 'energy',
    difficulty: 'easy',
    title: 'O Artilheiro Indomável',
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
    element: 'ice',
    difficulty: 'medium',
    title: 'A Olho de Águia',
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
    element: 'electricity',
    difficulty: 'hard',
    title: 'O Trovão Destrutivo',
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
    element: 'nature',
    difficulty: 'easy',
    title: 'A Guardiã da Luz',
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
    element: 'nature',
    difficulty: 'medium',
    title: 'O Espírito do Vento',
  },
  torn: {
    id: 'torn',
    name: 'Torn',
    description: 'Guerreiro sombrio que domina energias destructivas. Seus tiros carregam poder devastador.',
    role: 'explosives',
    stats: { health: 85, attack: 1.2, defense: 0.9, mobility: 0.8 },
    specialAbility: tornAbility,
    spriteKey: 'char_torn',
    avatarKey: 'avatar_torn',
    element: 'dark',
    difficulty: 'medium',
    title: 'O Guerreiro das Trevas',
  },
  pyra: {
    id: 'pyra',
    name: 'Pyra',
    description: 'Mestra do fogo e explosões. Cada disparo incendeia o campo de batalha.',
    role: 'defense',
    stats: { health: 150, attack: 0.7, defense: 1.5, mobility: 0.6 },
    specialAbility: pyraAbility,
    spriteKey: 'char_pyra',
    avatarKey: 'avatar_pyra',
    element: 'fire',
    difficulty: 'hard',
    title: 'A Mestra das Chamas',
  },
  mira: {
    id: 'mira',
    name: 'Mira',
    description: 'Arqueira de precisão arcana. Seus cálculos são infalíveis.',
    role: 'wind_specialist',
    stats: { health: 80, attack: 0.9, defense: 0.8, mobility: 1.2 },
    specialAbility: miraAbility,
    spriteKey: 'char_mira',
    avatarKey: 'avatar_mira',
    element: 'arcane',
    difficulty: 'medium',
    title: 'A Arqueira Arcana',
  },
  rook: {
    id: 'rook',
    name: 'Rook',
    description: 'Artilheiro pesado com defesa inabalável. Muro de poder no campo.',
    role: 'multi_shot',
    stats: { health: 75, attack: 0.8, defense: 0.7, mobility: 1.1 },
    specialAbility: rookAbility,
    spriteKey: 'char_rook',
    avatarKey: 'avatar_rook',
    element: 'artillery',
    difficulty: 'easy',
    title: 'O Muro de Aço',
  },
  drax: {
    id: 'drax',
    name: 'Drax',
    description: 'Energia vermelha devastadora. Ofensiva pura e poder destrutivo.',
    role: 'tactical',
    stats: { health: 85, attack: 0.85, defense: 0.9, mobility: 1.0 },
    specialAbility: draxAbility,
    spriteKey: 'char_drax',
    avatarKey: 'avatar_drax',
    element: 'cosmic',
    difficulty: 'medium',
    title: 'O Destruidor Estelar',
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