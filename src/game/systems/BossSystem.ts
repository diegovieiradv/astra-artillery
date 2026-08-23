import { CHARACTERS } from '../characters/registry';
import { ShotParams } from '../../types/battle';
import { calculateTrajectory } from '../physics/Ballistics';
import { PHYSICS_CONFIG, COMBAT_CONFIG, TURN_CONFIG } from '../config/game';

export type BossBehaviorType = 'tactical' | 'aggressive' | 'defensive' | 'berserk';

export interface BossSpecialAttack {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  execute: (boss: BossEntity, target: { x: number; y: number }, scene: Phaser.Scene) => ShotParams;
}

export interface BossPhase {
  hpThreshold: number;
  behavior: BossBehaviorType;
  specialAttacks: string[];
  environmentChanges?: EnvironmentChange[];
  dialogue?: string;
}

export interface EnvironmentChange {
  type: 'particles' | 'shader' | 'platform';
  config: Record<string, unknown>;
}

export interface BossConfig {
  id: string;
  name: string;
  characterId: string;
  hpMultiplier: number;
  phases: BossPhase[];
  introDialogue?: string;
  victoryDialogue?: string;
  musicTrack: string;
  specialAttacks: Record<string, BossSpecialAttack>;
}

export interface BossEntity {
  id: string;
  characterId: string;
  name: string;
  hp: number;
  maxHp: number;
  x: number;
  y: number;
  facing: 'left' | 'right';
  isPlayer: false;
  abilityCooldown: number;
  bossConfig: BossConfig;
  currentPhaseIndex: number;
  phaseSpecialCooldowns: Record<string, number>;
  isBoss: true;
}

export function createBossEntity(bossConfig: BossConfig, arena: { cpuStartX: number; startY: number }): BossEntity {
  const baseChar = CHARACTERS[bossConfig.characterId];
  const maxHp = Math.floor((baseChar?.stats.health || 100) * 100 * bossConfig.hpMultiplier);
  
  return {
    id: 'boss',
    characterId: bossConfig.characterId,
    name: bossConfig.name,
    hp: maxHp,
    maxHp,
    x: arena.cpuStartX,
    y: arena.startY,
    facing: 'left',
    isPlayer: false,
    abilityCooldown: 0,
    bossConfig,
    currentPhaseIndex: 0,
    phaseSpecialCooldowns: {},
    isBoss: true,
  };
}

export function getCurrentBossPhase(boss: BossEntity): BossPhase {
  const hpPercent = boss.hp / boss.maxHp;
  const phases = boss.bossConfig.phases;
  
  for (let i = phases.length - 1; i >= 0; i--) {
    if (hpPercent <= phases[i].hpThreshold) {
      boss.currentPhaseIndex = i;
      return phases[i];
    }
  }
  
  boss.currentPhaseIndex = 0;
  return phases[0];
}

export function executeBossTurn(
  boss: BossEntity,
  playerX: number,
  playerY: number,
  currentWind: number,
  scene: Phaser.Scene
): ShotParams | null {
  const phase = getCurrentBossPhase(boss);
  const behavior = phase.behavior;
  
  const dx = playerX - boss.x;
  const baseAngle = Math.atan2(-1, dx > 0 ? 1 : -1) * (180 / Math.PI);
  
  let angleOffset = 0;
  let power = 50;
  let useSpecial = false;
  let specialAttack: BossSpecialAttack | null = null;
  
  switch (behavior) {
    case 'tactical':
      angleOffset = (Math.random() - 0.5) * 15;
      power = 45 + Math.random() * 25;
      break;
    case 'aggressive':
      angleOffset = (Math.random() - 0.5) * 25;
      power = 55 + Math.random() * 30;
      break;
    case 'defensive':
      angleOffset = (Math.random() - 0.5) * 10;
      power = 35 + Math.random() * 20;
      break;
    case 'berserk':
      angleOffset = (Math.random() - 0.5) * 35;
      power = 65 + Math.random() * 25;
      break;
  }
  
  const availableSpecials = phase.specialAttacks
    .map(id => boss.bossConfig.specialAttacks[id])
    .filter(atk => atk && boss.phaseSpecialCooldowns[atk.id] <= 0);
  
  if (availableSpecials.length > 0 && Math.random() < 0.3) {
    specialAttack = availableSpecials[Math.floor(Math.random() * availableSpecials.length)];
    useSpecial = true;
  }
  
  if (useSpecial && specialAttack) {
    const params = specialAttack.execute(boss, { x: playerX, y: playerY }, scene);
    boss.phaseSpecialCooldowns[specialAttack.id] = specialAttack.cooldown;
    return params;
  }
  
  const angle = Phaser.Math.Clamp(baseAngle + angleOffset, 10, 170);
  
  return {
    angle,
    power: Phaser.Math.Clamp(power, 10, 100),
    wind: currentWind,
    gravity: PHYSICS_CONFIG.gravity,
    startX: boss.x,
    startY: boss.y - 60,
  };
}

export function updateBossCooldowns(boss: BossEntity, delta: number): void {
  for (const key of Object.keys(boss.phaseSpecialCooldowns)) {
    boss.phaseSpecialCooldowns[key] = Math.max(0, boss.phaseSpecialCooldowns[key] - delta / 1000);
  }
}

export function checkPhaseTransition(boss: BossEntity): BossPhase | null {
  const oldPhaseIndex = boss.currentPhaseIndex;
  const newPhase = getCurrentBossPhase(boss);
  
  if (boss.currentPhaseIndex !== oldPhaseIndex) {
    return newPhase;
  }
  return null;
}

export function applyEnvironmentChange(change: EnvironmentChange, scene: Phaser.Scene): void {
  switch (change.type) {
    case 'particles':
      if (change.config.type === 'vines_spread') {
        const { count, color, speed } = change.config;
        for (let i = 0; i < (count as number); i++) {
          const x = Phaser.Math.Between(0, 1920);
          const y = Phaser.Math.Between(800, 1080);
          const particle = scene.add.circle(x, y, 3, Phaser.Display.Color.HexStringToColor(color as string).color, 0.8);
          scene.tweens.add({
            targets: particle,
            y: y - 200,
            x: x + Phaser.Math.Between(-100, 100),
            alpha: 0,
            duration: 2000 / (speed as number),
            onComplete: () => particle.destroy(),
          });
        }
      } else if (change.config.type === 'blizzard_intense') {
        const { count, color, speed } = change.config;
        for (let i = 0; i < (count as number); i++) {
          const x = Phaser.Math.Between(0, 1920);
          const y = Phaser.Math.Between(0, 1080);
          const particle = scene.add.circle(x, y, 2, Phaser.Display.Color.HexStringToColor(color as string).color, 0.9);
          scene.tweens.add({
            targets: particle,
            y: y + 1080,
            x: x + Phaser.Math.Between(-200, 200),
            alpha: 0,
            duration: 3000 / (speed as number),
            onComplete: () => particle.destroy(),
          });
        }
      } else if (change.config.type === 'meteor_shower') {
        const { count, color, speed } = change.config;
        for (let i = 0; i < (count as number); i++) {
          const x = Phaser.Math.Between(0, 1920);
          const y = Phaser.Math.Between(-200, 0);
          const particle = scene.add.circle(x, y, Phaser.Math.Between(4, 10), Phaser.Display.Color.HexStringToColor(color as string).color, 1);
          scene.tweens.add({
            targets: particle,
            y: 1080 + 200,
            x: x + Phaser.Math.Between(-100, 100),
            alpha: 0,
            scale: 0,
            duration: 2000 / (speed as number),
            onComplete: () => particle.destroy(),
          });
        }
      }
      break;
    case 'shader':
      if (change.config.type === 'screen_shake') {
        scene.cameras.main.shake(500, (change.config.intensity as number) || 0.3);
      } else if (change.config.type === 'screen_freeze') {
        scene.cameras.main.flash((change.config.intensity as number) || 0.5 * 1000, 0x60a5fa);
      } else if (change.config.type === 'screen_burn') {
        scene.cameras.main.flash((change.config.intensity as number) || 0.6 * 1000, 0xef4444);
      }
      break;
  }
}

export const VERDANT_GUARDIAN_SPECIAL_ATTACKS: Record<string, BossSpecialAttack> = {
  vine_slash: {
    id: 'vine_slash',
    name: 'Chicote de Vinha',
    description: 'Dispara uma vinha que explode em área larga',
    cooldown: 2,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 70,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  seed_bomb: {
    id: 'seed_bomb',
    name: 'Bomba de Sementes',
    description: 'Lança múltiplas sementes que criam explosões menores',
    cooldown: 3,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI) + Phaser.Math.Between(-15, 15),
        power: 60,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  root_grasp: {
    id: 'root_grasp',
    name: 'Raízes Apreendedoras',
    description: 'Cria raízes que impedem movimento do jogador',
    cooldown: 4,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 55,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  nature_wrath: {
    id: 'nature_wrath',
    name: 'Ira da Natureza',
    description: 'Ataque final devastador com explosão massiva',
    cooldown: 5,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 85,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
};

export const VERDANT_GUARDIAN_CONFIG: BossConfig = {
  id: 'verdant_guardian',
  name: 'Verdant Guardian',
  characterId: 'boss_verdant_guardian',
  hpMultiplier: 3.0,
  phases: [
    { 
      hpThreshold: 1.0, 
      behavior: 'tactical', 
      specialAttacks: ['vine_slash', 'seed_bomb'],
      dialogue: 'A floresta protege seus segredos... Vocês não passarão!'
    },
    { 
      hpThreshold: 0.6, 
      behavior: 'aggressive', 
      specialAttacks: ['vine_slash', 'seed_bomb', 'root_grasp'],
      environmentChanges: [{ type: 'particles', config: { type: 'vines_spread', count: 30, color: '#22c55e', speed: 0.8 } }],
      dialogue: 'A natureza desperta sua fúria!'
    },
    { 
      hpThreshold: 0.3, 
      behavior: 'berserk', 
      specialAttacks: ['vine_slash', 'seed_bomb', 'root_grasp', 'nature_wrath'],
      environmentChanges: [{ type: 'shader', config: { type: 'screen_shake', intensity: 0.5 } }],
      dialogue: 'Sintam a ira da natureza!'
    },
  ],
  introDialogue: 'A floresta protege seus segredos... Vocês não passarão!',
  victoryDialogue: 'A natureza reconhece sua força. O caminho está aberto.',
  musicTrack: 'bgm_boss',
  specialAttacks: VERDANT_GUARDIAN_SPECIAL_ATTACKS,
};

export const FROST_WYRM_SPECIAL_ATTACKS: Record<string, BossSpecialAttack> = {
  ice_breath: {
    id: 'ice_breath',
    name: 'Sopro de Gelo',
    description: 'Dispara um cone de gelo que congela a área',
    cooldown: 2,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 65,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  frost_nova: {
    id: 'frost_nova',
    name: 'Nova Congelante',
    description: 'Explosão de gelo em área que reduz mobilidade',
    cooldown: 3,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 60,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  blizzard_storm: {
    id: 'blizzard_storm',
    name: 'Tempestade de Neve',
    description: 'Cria uma tempestade que reduz precisão do inimigo',
    cooldown: 4,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 55,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  absolute_zero: {
    id: 'absolute_zero',
    name: 'Zero Absoluto',
    description: 'Ataque final que congela tudo na tela',
    cooldown: 5,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 90,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
};

export const FROST_WYRM_CONFIG: BossConfig = {
  id: 'frost_wyrm',
  name: 'Frost Wyrm',
  characterId: 'boss_frost_wyrm',
  hpMultiplier: 4.0,
  phases: [
    { 
      hpThreshold: 1.0, 
      behavior: 'tactical', 
      specialAttacks: ['ice_breath', 'frost_nova'],
      dialogue: 'O frio eterno vos aguarda...'
    },
    { 
      hpThreshold: 0.5, 
      behavior: 'aggressive', 
      specialAttacks: ['ice_breath', 'frost_nova', 'blizzard_storm'],
      environmentChanges: [{ type: 'particles', config: { type: 'blizzard_intense', count: 80, color: '#e0e7ff', speed: 2.5 } }],
      dialogue: 'A tempestade cresce!'
    },
    { 
      hpThreshold: 0.2, 
      behavior: 'berserk', 
      specialAttacks: ['ice_breath', 'frost_nova', 'blizzard_storm', 'absolute_zero'],
      environmentChanges: [{ type: 'shader', config: { type: 'screen_freeze', intensity: 0.7 } }],
      dialogue: 'Zero absoluto... para todos!'
    },
  ],
  introDialogue: 'O frio eterno vos aguarda...',
  victoryDialogue: 'Vossa chama... aquece o gelo.',
  musicTrack: 'bgm_boss',
  specialAttacks: FROST_WYRM_SPECIAL_ATTACKS,
};

export const MAGMA_LORD_SPECIAL_ATTACKS: Record<string, BossSpecialAttack> = {
  magma_shield: {
    id: 'magma_shield',
    name: 'Escudo de Magma',
    description: 'Cria um escudo que reflete dano',
    cooldown: 2,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 50,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  lava_pool: {
    id: 'lava_pool',
    name: 'Poça de Lava',
    description: 'Cria poças de lava que causam dano contínuo',
    cooldown: 3,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 70,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  meteor_rain: {
    id: 'meteor_rain',
    name: 'Chuva de Meteoros',
    description: 'Faz chover meteoros na área',
    cooldown: 4,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 75,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  supernova: {
    id: 'supernova',
    name: 'Supernova',
    description: 'Explosão massiva de fogo e magma',
    cooldown: 5,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 95,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
};

export const MAGMA_LORD_CONFIG: BossConfig = {
  id: 'magma_lord',
  name: 'Magma Lord',
  characterId: 'boss_magma_lord',
  hpMultiplier: 4.5,
  phases: [
    { 
      hpThreshold: 1.0, 
      behavior: 'defensive', 
      specialAttacks: ['magma_shield', 'lava_pool'],
      dialogue: 'O fogo purifica tudo!'
    },
    { 
      hpThreshold: 0.5, 
      behavior: 'aggressive', 
      specialAttacks: ['magma_shield', 'lava_pool', 'meteor_rain'],
      environmentChanges: [{ type: 'particles', config: { type: 'meteor_shower', count: 40, color: '#fbbf24', speed: 2.0 } }],
      dialogue: 'O céu cai em chamas!'
    },
    { 
      hpThreshold: 0.2, 
      behavior: 'berserk', 
      specialAttacks: ['magma_shield', 'lava_pool', 'meteor_rain', 'supernova'],
      environmentChanges: [{ type: 'shader', config: { type: 'screen_burn', intensity: 0.8 } }],
      dialogue: 'A supernova vos consumirá!'
    },
  ],
  introDialogue: 'O fogo purifica tudo!',
  victoryDialogue: 'Vossa cinza... alimenta a chama.',
  musicTrack: 'bgm_boss',
  specialAttacks: MAGMA_LORD_SPECIAL_ATTACKS,
};

export const STORM_SOVEREIGN_SPECIAL_ATTACKS: Record<string, BossSpecialAttack> = {
  lightning_strike: {
    id: 'lightning_strike',
    name: 'Golpe de Raio',
    description: 'Dispara um raio preciso que ignora defesa',
    cooldown: 2,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 80,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  wind_shear: {
    id: 'wind_shear',
    name: 'Cisalhamento do Vento',
    description: 'Cria uma zona de vento extremo que desvia projéteis',
    cooldown: 3,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 65,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  tornado_barrage: {
    id: 'tornado_barrage',
    name: 'Saraivada de Tornados',
    description: 'Lança múltiplos tornados que perseguem o alvo',
    cooldown: 4,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI) + Phaser.Math.Between(-20, 20),
        power: 70,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  cataclysm: {
    id: 'cataclysm',
    name: 'Cataclismo',
    description: 'Tempestade final devastadora que cobre toda a arena',
    cooldown: 5,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 95,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
};

export const STORM_SOVEREIGN_CONFIG: BossConfig = {
  id: 'storm_sovereign',
  name: 'Storm Sovereign',
  characterId: 'boss_storm_sovereign',
  hpMultiplier: 5.0,
  phases: [
    { 
      hpThreshold: 1.0, 
      behavior: 'tactical', 
      specialAttacks: ['lightning_strike', 'wind_shear'],
      dialogue: 'Os ventos obedecem à minha vontade!'
    },
    { 
      hpThreshold: 0.5, 
      behavior: 'aggressive', 
      specialAttacks: ['lightning_strike', 'wind_shear', 'tornado_barrage'],
      environmentChanges: [{ type: 'particles', config: { type: 'tornado_field', count: 15, color: '#60a5fa', speed: 2.0 } }],
      dialogue: 'A tempestade se intensifica!'
    },
    { 
      hpThreshold: 0.2, 
      behavior: 'berserk', 
      specialAttacks: ['lightning_strike', 'wind_shear', 'tornado_barrage', 'cataclysm'],
      environmentChanges: [{ type: 'shader', config: { type: 'screen_shake', intensity: 0.8 } }],
      dialogue: 'O cataclismo vos aguarda!'
    },
  ],
  introDialogue: 'Os ventos obedecem à minha vontade!',
  victoryDialogue: 'Vossos ventos... encontram paz.',
  musicTrack: 'bgm_boss',
  specialAttacks: STORM_SOVEREIGN_SPECIAL_ATTACKS,
};

export const VOID_ARCHON_SPECIAL_ATTACKS: Record<string, BossSpecialAttack> = {
  void_bolt: {
    id: 'void_bolt',
    name: 'Projétil do Vazio',
    description: 'Dispara um projétil que ignora toda defesa e cura',
    cooldown: 2,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 85,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  reality_rift: {
    id: 'reality_rift',
    name: 'Fenda na Realidade',
    description: 'Cria uma fenda que teleporta o projétil próximo ao alvo',
    cooldown: 3,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 80,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  corruption_wave: {
    id: 'corruption_wave',
    name: 'Onda de Corrupção',
    description: 'Onda expansiva que corrompe a área',
    cooldown: 4,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 75,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
  entropy: {
    id: 'entropy',
    name: 'Entropia',
    description: 'Colapso final da realidade na área',
    cooldown: 5,
    execute: (boss, target, scene) => {
      return {
        angle: Phaser.Math.Angle.Between(boss.x, boss.y, target.x, target.y) * (180 / Math.PI),
        power: 100,
        wind: 0,
        gravity: PHYSICS_CONFIG.gravity,
        startX: boss.x,
        startY: boss.y - 60,
      };
    },
  },
};

export const VOID_ARCHON_CONFIG: BossConfig = {
  id: 'void_archon',
  name: 'Void Archon',
  characterId: 'boss_void_archon',
  hpMultiplier: 6.0,
  phases: [
    { 
      hpThreshold: 1.0, 
      behavior: 'tactical', 
      specialAttacks: ['void_bolt', 'reality_rift'],
      dialogue: 'A realidade se curva diante de mim!'
    },
    { 
      hpThreshold: 0.5, 
      behavior: 'aggressive', 
      specialAttacks: ['void_bolt', 'reality_rift', 'corruption_wave'],
      environmentChanges: [{ type: 'particles', config: { type: 'corruption_spread', count: 40, color: '#f87171', speed: 1.5 } }],
      dialogue: 'A corrupção se espalha!'
    },
    { 
      hpThreshold: 0.2, 
      behavior: 'berserk', 
      specialAttacks: ['void_bolt', 'reality_rift', 'corruption_wave', 'entropy'],
      environmentChanges: [{ type: 'shader', config: { type: 'screen_void', intensity: 1.0 } }],
      dialogue: 'O fim de todas as coisas!'
    },
  ],
  introDialogue: 'A realidade se curva diante de mim!',
  victoryDialogue: 'A luz... retorna ao vazio.',
  musicTrack: 'bgm_boss',
  specialAttacks: VOID_ARCHON_SPECIAL_ATTACKS,
};