import * as Phaser from 'phaser';

export type FeedbackEventType = 
  | 'perfect_shot'
  | 'long_shot'
  | 'direct_hit'
  | 'critical_hit'
  | 'terrain_ko'
  | 'combo'
  | 'clutch_victory'
  | 'boss_defeated'
  | 'level_up'
  | 'astra_core_recovered'
  | 'new_item'
  | 'achievement_unlocked'
  | 'first_blood'
  | 'comeback'
  | 'dominated';

export interface FeedbackEventConfig {
  text: string;
  subtext?: string;
  color: string;
  strokeColor: string;
  fontSize: string;
  duration: number;
  riseHeight: number;
  scaleFrom: number;
  scaleTo: number;
  screenShake: 'none' | 'light' | 'medium' | 'heavy';
  soundKey?: string;
  soundVolume?: number;
  particleCount: number;
  particleColor: number[];
}

const FEEDBACK_CONFIGS: Record<FeedbackEventType, FeedbackEventConfig> = {
  perfect_shot: {
    text: 'PERFECT SHOT!',
    color: '#fbbf24',
    strokeColor: '#000000',
    fontSize: '48px',
    duration: 1500,
    riseHeight: 100,
    scaleFrom: 1.5,
    scaleTo: 0.8,
    screenShake: 'medium',
    soundKey: 'sfx_perfect',
    soundVolume: 0.7,
    particleCount: 20,
    particleColor: [0xfbbf24, 0xffd700, 0xffaa00],
  },
  long_shot: {
    text: 'LONG SHOT!',
    color: '#60a5fa',
    strokeColor: '#000000',
    fontSize: '42px',
    duration: 1200,
    riseHeight: 80,
    scaleFrom: 1.3,
    scaleTo: 0.7,
    screenShake: 'light',
    soundKey: 'sfx_long_shot',
    soundVolume: 0.6,
    particleCount: 15,
    particleColor: [0x60a5fa, 0x93c5fd, 0x3b82f6],
  },
  direct_hit: {
    text: 'DIRECT HIT!',
    color: '#f87171',
    strokeColor: '#000000',
    fontSize: '44px',
    duration: 1300,
    riseHeight: 90,
    scaleFrom: 1.4,
    scaleTo: 0.75,
    screenShake: 'heavy',
    soundKey: 'sfx_direct_hit',
    soundVolume: 0.8,
    particleCount: 18,
    particleColor: [0xf87171, 0xef4444, 0xdc2626],
  },
  critical_hit: {
    text: 'CRITICAL HIT!',
    color: '#fbbf24',
    strokeColor: '#000000',
    fontSize: '46px',
    duration: 1400,
    riseHeight: 95,
    scaleFrom: 1.45,
    scaleTo: 0.8,
    screenShake: 'heavy',
    soundKey: 'sfx_critical',
    soundVolume: 0.8,
    particleCount: 22,
    particleColor: [0xfbbf24, 0xffd700, 0xf59e0b],
  },
  terrain_ko: {
    text: 'TERRAIN KO!',
    color: '#a78bfa',
    strokeColor: '#000000',
    fontSize: '40px',
    duration: 1200,
    riseHeight: 80,
    scaleFrom: 1.3,
    scaleTo: 0.7,
    screenShake: 'medium',
    soundKey: 'sfx_terrain_ko',
    soundVolume: 0.6,
    particleCount: 12,
    particleColor: [0xa78bfa, 0x8b5cf6, 0x7c3aed],
  },
  combo: {
    text: 'COMBO!',
    color: '#fb923c',
    strokeColor: '#000000',
    fontSize: '52px',
    duration: 1600,
    riseHeight: 110,
    scaleFrom: 1.6,
    scaleTo: 0.9,
    screenShake: 'medium',
    soundKey: 'sfx_combo',
    soundVolume: 0.7,
    particleCount: 25,
    particleColor: [0xfb923c, 0xf97316, 0xea580c],
  },
  clutch_victory: {
    text: 'CLUTCH VICTORY!',
    color: '#4ade80',
    strokeColor: '#000000',
    fontSize: '44px',
    duration: 1500,
    riseHeight: 100,
    scaleFrom: 1.4,
    scaleTo: 0.8,
    screenShake: 'heavy',
    soundKey: 'sfx_victory',
    soundVolume: 0.8,
    particleCount: 30,
    particleColor: [0x4ade80, 0x22c55e, 0x16a34a],
  },
  boss_defeated: {
    text: 'BOSS DEFEATED!',
    color: '#fbbf24',
    strokeColor: '#000000',
    fontSize: '56px',
    duration: 2000,
    riseHeight: 120,
    scaleFrom: 1.8,
    scaleTo: 1,
    screenShake: 'heavy',
    soundKey: 'sfx_boss_defeated',
    soundVolume: 0.9,
    particleCount: 40,
    particleColor: [0xfbbf24, 0xffd700, 0xf59e0b, 0xeab308],
  },
  level_up: {
    text: 'LEVEL UP!',
    color: '#4ade80',
    strokeColor: '#000000',
    fontSize: '52px',
    duration: 1800,
    riseHeight: 110,
    scaleFrom: 1.7,
    scaleTo: 0.9,
    screenShake: 'light',
    soundKey: 'sfx_level_up',
    soundVolume: 0.8,
    particleCount: 35,
    particleColor: [0x4ade80, 0x22c55e, 0x86efac],
  },
  astra_core_recovered: {
    text: 'ASTRA CORE RECOVERED!',
    color: '#c084fc',
    strokeColor: '#000000',
    fontSize: '40px',
    duration: 1600,
    riseHeight: 100,
    scaleFrom: 1.5,
    scaleTo: 0.8,
    screenShake: 'medium',
    soundKey: 'sfx_astra_core',
    soundVolume: 0.7,
    particleCount: 28,
    particleColor: [0xc084fc, 0xa855f7, 0x9333ea],
  },
  new_item: {
    text: 'NEW ITEM!',
    color: '#60a5fa',
    strokeColor: '#000000',
    fontSize: '42px',
    duration: 1200,
    riseHeight: 80,
    scaleFrom: 1.3,
    scaleTo: 0.7,
    screenShake: 'light',
    soundKey: 'sfx_item',
    soundVolume: 0.6,
    particleCount: 15,
    particleColor: [0x60a5fa, 0x3b82f6, 0x2563eb],
  },
  achievement_unlocked: {
    text: 'ACHIEVEMENT UNLOCKED!',
    color: '#fbbf24',
    strokeColor: '#000000',
    fontSize: '38px',
    duration: 1500,
    riseHeight: 90,
    scaleFrom: 1.4,
    scaleTo: 0.75,
    screenShake: 'light',
    soundKey: 'sfx_achievement',
    soundVolume: 0.7,
    particleCount: 20,
    particleColor: [0xfbbf24, 0xffd700, 0xf59e0b],
  },
  first_blood: {
    text: 'FIRST BLOOD!',
    color: '#ef4444',
    strokeColor: '#000000',
    fontSize: '48px',
    duration: 1400,
    riseHeight: 100,
    scaleFrom: 1.5,
    scaleTo: 0.8,
    screenShake: 'heavy',
    soundKey: 'sfx_first_blood',
    soundVolume: 0.8,
    particleCount: 25,
    particleColor: [0xef4444, 0xdc2626, 0xb91c1c],
  },
  comeback: {
    text: 'COMEBACK!',
    color: '#fb923c',
    strokeColor: '#000000',
    fontSize: '46px',
    duration: 1500,
    riseHeight: 100,
    scaleFrom: 1.5,
    scaleTo: 0.85,
    screenShake: 'medium',
    soundKey: 'sfx_comeback',
    soundVolume: 0.7,
    particleCount: 22,
    particleColor: [0xfb923c, 0xf97316, 0xea580c],
  },
  dominated: {
    text: 'DOMINATED!',
    color: '#f87171',
    strokeColor: '#000000',
    fontSize: '44px',
    duration: 1300,
    riseHeight: 90,
    scaleFrom: 1.4,
    scaleTo: 0.75,
    screenShake: 'medium',
    soundKey: 'sfx_dominated',
    soundVolume: 0.7,
    particleCount: 18,
    particleColor: [0xf87171, 0xef4444, 0xdc2626],
  },
};

export interface FeedbackTrigger {
  eventType: FeedbackEventType;
  condition: (data: FeedbackData) => boolean;
}

export interface FeedbackData {
  damage: number;
  distance: number;
  isCritical: boolean;
  isTerrainHit: boolean;
  targetHp: number;
  targetMaxHp: number;
  attackerHp: number;
  attackerMaxHp: number;
  turnNumber: number;
  comboCount: number;
  isBoss: boolean;
}

export class ContextualFeedback {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  private activeFeedbacks: Phaser.GameObjects.Text[] = [];
  private comboCount = 0;
  private lastHitTime = 0;
  private comboTimeout = 2000;
  
  private defaultTriggers: FeedbackTrigger[] = [
    {
      eventType: 'perfect_shot',
      condition: (data) => data.distance < 50 && data.damage > 0,
    },
    {
      eventType: 'long_shot',
      condition: (data) => data.distance > 800 && data.damage > 0,
    },
    {
      eventType: 'direct_hit',
      condition: (data) => data.distance < 30 && data.damage > 0,
    },
    {
      eventType: 'critical_hit',
      condition: (data) => data.isCritical,
    },
    {
      eventType: 'terrain_ko',
      condition: (data) => data.isTerrainHit && data.targetHp <= 0,
    },
    {
      eventType: 'first_blood',
      condition: (data) => data.turnNumber === 1 && data.damage > 0,
    },
    {
      eventType: 'comeback',
      condition: (data) => data.attackerHp < data.attackerMaxHp * 0.2 && data.targetHp <= 0,
    },
    {
      eventType: 'dominated',
      condition: (data) => data.attackerHp === data.attackerMaxHp && data.targetHp <= 0,
    },
  ];
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics().setDepth(25);
  }
  
  checkAndTrigger(data: FeedbackData): FeedbackEventType | null {
    const now = this.scene.time.now;
    
    if (now - this.lastHitTime < this.comboTimeout) {
      this.comboCount++;
    } else {
      this.comboCount = 1;
    }
    this.lastHitTime = now;
    
    if (this.comboCount >= 3) {
      this.triggerEvent('combo');
      return 'combo';
    }
    
    for (const trigger of this.defaultTriggers) {
      if (trigger.condition(data)) {
        this.triggerEvent(trigger.eventType);
        return trigger.eventType;
      }
    }
    
    return null;
  }
  
  triggerEvent(eventType: FeedbackEventType): void {
    const config = FEEDBACK_CONFIGS[eventType];
    
    this.createFeedbackText(config);
    this.createParticleEffect(config);
    
    if (config.soundKey) {
      this.scene.sound.play(config.soundKey, { volume: config.soundVolume || 0.5 });
    }
  }
  
  private createFeedbackText(config: FeedbackEventConfig): void {
    const cam = this.scene.cameras.main;
    const centerX = cam.width / 2;
    const centerY = cam.height / 3;
    
    const text = this.scene.add.text(centerX, centerY, config.text, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: config.fontSize,
      color: config.color,
      fontStyle: 'bold',
      stroke: config.strokeColor,
      strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(30).setScale(config.scaleFrom);
    
    this.activeFeedbacks.push(text);
    
    if (config.subtext) {
      const subtext = this.scene.add.text(centerX, centerY + 50, config.subtext, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
        color: config.color,
        fontStyle: 'bold',
        stroke: config.strokeColor,
        strokeThickness: 2,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(30).setAlpha(0);
      
      this.scene.tweens.add({
        targets: subtext,
        alpha: 1,
        duration: 300,
        delay: 200,
      });
      
      this.scene.time.delayedCall(config.duration, () => {
        subtext.destroy();
      });
    }
    
    this.scene.tweens.add({
      targets: text,
      y: centerY - config.riseHeight,
      scaleX: config.scaleTo,
      scaleY: config.scaleTo,
      alpha: 0,
      duration: config.duration,
      ease: 'Power2',
      onComplete: () => {
        text.destroy();
        const idx = this.activeFeedbacks.indexOf(text);
        if (idx > -1) this.activeFeedbacks.splice(idx, 1);
      },
    });
  }
  
  private createParticleEffect(config: FeedbackEventConfig): void {
    const cam = this.scene.cameras.main;
    const centerX = cam.width / 2;
    const centerY = cam.height / 3;
    
    for (let i = 0; i < config.particleCount; i++) {
      const angle = (Math.PI * 2 / config.particleCount) * i;
      const speed = 100 + Math.random() * 100;
      const color = Phaser.Utils.Array.GetRandom(config.particleColor);
      const size = 3 + Math.random() * 4;
      
      const particle = this.scene.add.circle(centerX, centerY, size, color, 1)
        .setScrollFactor(0)
        .setDepth(29);
      
      this.scene.tweens.add({
        targets: particle,
        x: centerX + Math.cos(angle) * speed,
        y: centerY + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0,
        duration: 600,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
  }
  
  triggerVictory(): void {
    this.triggerEvent('clutch_victory');
  }
  
  triggerBossDefeated(): void {
    this.triggerEvent('boss_defeated');
  }
  
  triggerLevelUp(): void {
    this.triggerEvent('level_up');
  }
  
  triggerAstraCore(): void {
    this.triggerEvent('astra_core_recovered');
  }
  
  triggerNewItem(): void {
    this.triggerEvent('new_item');
  }
  
  triggerAchievement(): void {
    this.triggerEvent('achievement_unlocked');
  }
  
  resetCombo(): void {
    this.comboCount = 0;
    this.lastHitTime = 0;
  }
  
  getComboCount(): number {
    return this.comboCount;
  }
  
  clearAll(): void {
    this.activeFeedbacks.forEach(t => {
      if (t.active) t.destroy();
    });
    this.activeFeedbacks = [];
    this.graphics.clear();
  }
  
  destroy(): void {
    this.clearAll();
    this.graphics.destroy();
  }
}
