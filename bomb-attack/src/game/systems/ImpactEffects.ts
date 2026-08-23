import * as Phaser from 'phaser';

export type DamageType = 'normal' | 'critical' | 'miss' | 'heal' | 'shield';

export type ImpactSize = 'small' | 'medium' | 'large' | 'massive';

export interface ImpactEffectConfig {
  particleCount: number;
  particleSpeed: number;
  particleLifespan: number;
  particleColors: number[];
  particleSizes: { min: number; max: number };
  shockwaveEnabled: boolean;
  shockwaveRadius: number;
  shockwaveDuration: number;
  screenShake: 'none' | 'light' | 'medium' | 'heavy';
  flashEnabled: boolean;
  flashDuration: number;
}

export interface DamageNumberConfig {
  fontSize: string;
  color: string;
  strokeColor: string;
  strokeThickness: number;
  riseHeight: number;
  duration: number;
  scaleFrom: number;
  scaleTo: number;
  alphaFrom: number;
  alphaTo: number;
}

const IMPACT_CONFIGS: Record<ImpactSize, ImpactEffectConfig> = {
  small: {
    particleCount: 8,
    particleSpeed: 100,
    particleLifespan: 300,
    particleColors: [0xffaa00, 0xff6600],
    particleSizes: { min: 2, max: 4 },
    shockwaveEnabled: false,
    shockwaveRadius: 0,
    shockwaveDuration: 0,
    screenShake: 'light',
    flashEnabled: false,
    flashDuration: 0,
  },
  medium: {
    particleCount: 16,
    particleSpeed: 150,
    particleLifespan: 400,
    particleColors: [0xff6b35, 0xffaa00, 0xff4444],
    particleSizes: { min: 3, max: 6 },
    shockwaveEnabled: true,
    shockwaveRadius: 60,
    shockwaveDuration: 200,
    screenShake: 'medium',
    flashEnabled: true,
    flashDuration: 100,
  },
  large: {
    particleCount: 24,
    particleSpeed: 200,
    particleLifespan: 500,
    particleColors: [0xff6b35, 0xffaa00, 0xff4444, 0xff8800],
    particleSizes: { min: 4, max: 8 },
    shockwaveEnabled: true,
    shockwaveRadius: 100,
    shockwaveDuration: 300,
    screenShake: 'heavy',
    flashEnabled: true,
    flashDuration: 150,
  },
  massive: {
    particleCount: 32,
    particleSpeed: 250,
    particleLifespan: 600,
    particleColors: [0xff6b35, 0xffaa00, 0xff4444, 0xff8800, 0xffff00],
    particleSizes: { min: 5, max: 10 },
    shockwaveEnabled: true,
    shockwaveRadius: 150,
    shockwaveDuration: 400,
    screenShake: 'heavy',
    flashEnabled: true,
    flashDuration: 200,
  },
};

const DAMAGE_NUMBER_CONFIGS: Record<DamageType, DamageNumberConfig> = {
  normal: {
    fontSize: '28px',
    color: '#ef4444',
    strokeColor: '#000000',
    strokeThickness: 3,
    riseHeight: 60,
    duration: 1000,
    scaleFrom: 1,
    scaleTo: 0.5,
    alphaFrom: 1,
    alphaTo: 0,
  },
  critical: {
    fontSize: '40px',
    color: '#fbbf24',
    strokeColor: '#000000',
    strokeThickness: 4,
    riseHeight: 80,
    duration: 1200,
    scaleFrom: 1.5,
    scaleTo: 0.8,
    alphaFrom: 1,
    alphaTo: 0,
  },
  miss: {
    fontSize: '24px',
    color: '#94a3b8',
    strokeColor: '#000000',
    strokeThickness: 2,
    riseHeight: 40,
    duration: 800,
    scaleFrom: 1,
    scaleTo: 0.6,
    alphaFrom: 0.8,
    alphaTo: 0,
  },
  heal: {
    fontSize: '28px',
    color: '#4ade80',
    strokeColor: '#000000',
    strokeThickness: 3,
    riseHeight: 60,
    duration: 1000,
    scaleFrom: 1,
    scaleTo: 0.5,
    alphaFrom: 1,
    alphaTo: 0,
  },
  shield: {
    fontSize: '28px',
    color: '#60a5fa',
    strokeColor: '#000000',
    strokeThickness: 3,
    riseHeight: 60,
    duration: 1000,
    scaleFrom: 1,
    scaleTo: 0.5,
    alphaFrom: 1,
    alphaTo: 0,
  },
};

export class ImpactEffects {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  private particles: Phaser.GameObjects.Arc[] = [];
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics().setDepth(15);
  }
  
  createImpact(
    x: number,
    y: number,
    size: ImpactSize = 'medium',
    damageType: DamageType = 'normal',
    damageAmount?: number
  ): void {
    const config = IMPACT_CONFIGS[size];
    
    this.createParticles(x, y, config);
    
    if (config.shockwaveEnabled) {
      this.createShockwave(x, y, config.shockwaveRadius, config.shockwaveDuration);
    }
    
    if (config.flashEnabled) {
      this.createFlash(x, y, config.flashDuration);
    }
    
    if (damageAmount !== undefined) {
      this.createDamageNumber(x, y, damageAmount, damageType);
    }
  }
  
  private createParticles(x: number, y: number, config: ImpactEffectConfig): void {
    for (let i = 0; i < config.particleCount; i++) {
      const angle = (Math.PI * 2 / config.particleCount) * i + (Math.random() - 0.5) * 0.5;
      const speed = config.particleSpeed * (0.5 + Math.random() * 0.5);
      const size = Phaser.Math.Between(config.particleSizes.min, config.particleSizes.max);
      const color = Phaser.Utils.Array.GetRandom(config.particleColors);
      
      const particle = this.scene.add.circle(x, y, size, color, 1).setDepth(16);
      this.particles.push(particle);
      
      const targetX = x + Math.cos(angle) * speed;
      const targetY = y + Math.sin(angle) * speed;
      
      this.scene.tweens.add({
        targets: particle,
        x: targetX,
        y: targetY,
        alpha: 0,
        scale: 0,
        duration: config.particleLifespan,
        ease: 'Power2',
        onComplete: () => {
          particle.destroy();
          const idx = this.particles.indexOf(particle);
          if (idx > -1) this.particles.splice(idx, 1);
        },
      });
    }
  }
  
  private createShockwave(x: number, y: number, radius: number, duration: number): void {
    const shockwave = this.scene.add.circle(x, y, 10, 0xffffff, 0.3).setDepth(14);
    
    this.scene.tweens.add({
      targets: shockwave,
      radius: radius,
      alpha: 0,
      duration,
      ease: 'Power2',
      onUpdate: () => {
        shockwave.setRadius(shockwave.radius);
      },
      onComplete: () => shockwave.destroy(),
    });
  }
  
  private createFlash(x: number, y: number, duration: number): void {
    const flash = this.scene.add.circle(x, y, 30, 0xffffff, 0.8).setDepth(17);
    
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 2,
      duration,
      ease: 'Power2',
      onComplete: () => flash.destroy(),
    });
  }
  
  createDamageNumber(
    x: number,
    y: number,
    amount: number,
    type: DamageType = 'normal'
  ): Phaser.GameObjects.Text {
    const config = DAMAGE_NUMBER_CONFIGS[type];
    
    let text = `-${amount}`;
    if (type === 'heal') text = `+${amount}`;
    if (type === 'miss') text = 'MISS';
    if (type === 'critical') text = `-${amount}!`;
    
    const damageText = this.scene.add.text(x, y - 20, text, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: config.fontSize,
      color: config.color,
      fontStyle: 'bold',
      stroke: config.strokeColor,
      strokeThickness: config.strokeThickness,
    }).setOrigin(0.5).setDepth(20);
    
    this.scene.tweens.add({
      targets: damageText,
      y: y - 20 - config.riseHeight,
      alpha: config.alphaTo,
      scaleX: config.scaleTo,
      scaleY: config.scaleTo,
      duration: config.duration,
      ease: 'Power2',
      onStart: () => {
        damageText.setScale(config.scaleFrom);
      },
      onComplete: () => damageText.destroy(),
    });
    
    return damageText;
  }
  
  createCriticalImpact(x: number, y: number, damage: number): void {
    this.createImpact(x, y, 'large', 'critical', damage);
    
    const star = this.scene.add.star(x, y, 5, 10, 20, 0xfbbf24).setDepth(18);
    
    this.scene.tweens.add({
      targets: star,
      rotation: Math.PI * 2,
      scale: 0,
      alpha: 0,
      duration: 600,
      ease: 'Power2',
      onComplete: () => star.destroy(),
    });
  }
  
  createMissEffect(x: number, y: number): void {
    this.createDamageNumber(x, y, 0, 'miss');
    
    for (let i = 0; i < 5; i++) {
      const dust = this.scene.add.circle(
        x + (Math.random() - 0.5) * 30,
        y + Math.random() * 10,
        3,
        0x94a3b8,
        0.6
      ).setDepth(14);
      
      this.scene.tweens.add({
        targets: dust,
        y: dust.y - 20,
        alpha: 0,
        duration: 400,
        delay: i * 50,
        onComplete: () => dust.destroy(),
      });
    }
  }
  
  createHealEffect(x: number, y: number, amount: number): void {
    this.createDamageNumber(x, y, amount, 'heal');
    
    for (let i = 0; i < 8; i++) {
      const spark = this.scene.add.circle(x, y, 4, 0x4ade80, 1).setDepth(16);
      
      this.scene.tweens.add({
        targets: spark,
        x: x + (Math.random() - 0.5) * 60,
        y: y - 40 - Math.random() * 40,
        alpha: 0,
        scale: 0,
        duration: 500,
        delay: i * 60,
        onComplete: () => spark.destroy(),
      });
    }
  }
  
  createShieldEffect(x: number, y: number, damage: number): void {
    this.createDamageNumber(x, y, damage, 'shield');
    
    const shield = this.scene.add.circle(x, y, 40, 0x60a5fa, 0.3).setDepth(14);
    
    this.scene.tweens.add({
      targets: shield,
      scale: 1.5,
      alpha: 0,
      duration: 400,
      onComplete: () => shield.destroy(),
    });
  }
  
  getImpactSize(damage: number, maxDamage: number): ImpactSize {
    const ratio = damage / maxDamage;
    if (ratio >= 0.8) return 'massive';
    if (ratio >= 0.5) return 'large';
    if (ratio >= 0.2) return 'medium';
    return 'small';
  }
  
  getDamageType(isCritical: boolean, isMiss: boolean, isHeal: boolean): DamageType {
    if (isMiss) return 'miss';
    if (isHeal) return 'heal';
    if (isCritical) return 'critical';
    return 'normal';
  }
  
  clearAll(): void {
    this.particles.forEach(p => {
      if (p.active) p.destroy();
    });
    this.particles = [];
    this.graphics.clear();
  }
  
  destroy(): void {
    this.clearAll();
    this.graphics.destroy();
  }
}
