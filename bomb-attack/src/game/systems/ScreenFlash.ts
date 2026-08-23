import * as Phaser from 'phaser';

export type FlashType = 
  | 'damage'
  | 'heal'
  | 'critical'
  | 'boss'
  | 'victory'
  | 'defeat'
  | 'level_up'
  | 'combo'
  | 'miss'
  | 'dodge';

export interface FlashConfig {
  color: number;
  alpha: number;
  duration: number;
  fadeIn: number;
  fadeOut: number;
  intensity: number;
  screenShake: 'none' | 'light' | 'medium' | 'heavy';
}

const FLASH_CONFIGS: Record<FlashType, FlashConfig> = {
  damage: {
    color: 0xff0000,
    alpha: 0.3,
    duration: 200,
    fadeIn: 50,
    fadeOut: 150,
    intensity: 1,
    screenShake: 'light',
  },
  heal: {
    color: 0x00ff00,
    alpha: 0.25,
    duration: 250,
    fadeIn: 80,
    fadeOut: 170,
    intensity: 1,
    screenShake: 'none',
  },
  critical: {
    color: 0xffff00,
    alpha: 0.4,
    duration: 300,
    fadeIn: 30,
    fadeOut: 270,
    intensity: 1.5,
    screenShake: 'medium',
  },
  boss: {
    color: 0xff00ff,
    alpha: 0.35,
    duration: 350,
    fadeIn: 50,
    fadeOut: 300,
    intensity: 1.2,
    screenShake: 'heavy',
  },
  victory: {
    color: 0x00ff00,
    alpha: 0.4,
    duration: 500,
    fadeIn: 100,
    fadeOut: 400,
    intensity: 1,
    screenShake: 'none',
  },
  defeat: {
    color: 0xff0000,
    alpha: 0.5,
    duration: 600,
    fadeIn: 150,
    fadeOut: 450,
    intensity: 1.5,
    screenShake: 'heavy',
  },
  level_up: {
    color: 0x00ffff,
    alpha: 0.3,
    duration: 400,
    fadeIn: 50,
    fadeOut: 350,
    intensity: 1,
    screenShake: 'light',
  },
  combo: {
    color: 0xff8800,
    alpha: 0.35,
    duration: 250,
    fadeIn: 40,
    fadeOut: 210,
    intensity: 1.2,
    screenShake: 'medium',
  },
  miss: {
    color: 0x888888,
    alpha: 0.15,
    duration: 150,
    fadeIn: 30,
    fadeOut: 120,
    intensity: 0.5,
    screenShake: 'none',
  },
  dodge: {
    color: 0x0088ff,
    alpha: 0.2,
    duration: 200,
    fadeIn: 40,
    fadeOut: 160,
    intensity: 0.7,
    screenShake: 'light',
  },
};

export class ScreenFlash {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  private isFlashing = false;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics().setDepth(100);
  }
  
  flash(type: FlashType, callback?: () => void): void {
    if (this.isFlashing) return;
    
    const config = FLASH_CONFIGS[type];
    this.isFlashing = true;
    
    const cam = this.scene.cameras.main;
    
    this.scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: config.duration,
      ease: 'Power2',
      onUpdate: (tween) => {
        const progress = tween.getValue() / 100;
        let alpha: number;
        
        const fadeInEnd = config.fadeIn / config.duration;
        const fadeOutStart = 1 - (config.fadeOut / config.duration);
        
        if (progress < fadeInEnd) {
          alpha = (progress / fadeInEnd) * config.alpha * config.intensity;
        } else if (progress > fadeOutStart) {
          alpha = ((1 - progress) / (1 - fadeOutStart)) * config.alpha * config.intensity;
        } else {
          alpha = config.alpha * config.intensity;
        }
        
        this.graphics.clear();
        this.graphics.fillStyle(config.color, alpha);
        this.graphics.fillRect(0, 0, cam.width, cam.height);
      },
      onComplete: () => {
        this.graphics.clear();
        this.isFlashing = false;
        callback?.();
      },
    });
    
    if (config.screenShake !== 'none') {
      const intensityMap = {
        light: 0.005,
        medium: 0.01,
        heavy: 0.02,
      };
      this.scene.cameras.main.shake(
        config.duration * 0.5,
        intensityMap[config.screenShake]
      );
    }
  }
  
  flashDamage(callback?: () => void): void {
    this.flash('damage', callback);
  }
  
  flashHeal(callback?: () => void): void {
    this.flash('heal', callback);
  }
  
  flashCritical(callback?: () => void): void {
    this.flash('critical', callback);
  }
  
  flashBoss(callback?: () => void): void {
    this.flash('boss', callback);
  }
  
  flashVictory(callback?: () => void): void {
    this.flash('victory', callback);
  }
  
  flashDefeat(callback?: () => void): void {
    this.flash('defeat', callback);
  }
  
  flashLevelUp(callback?: () => void): void {
    this.flash('level_up', callback);
  }
  
  flashCombo(callback?: () => void): void {
    this.flash('combo', callback);
  }
  
  flashMiss(callback?: () => void): void {
    this.flash('miss', callback);
  }
  
  flashDodge(callback?: () => void): void {
    this.flash('dodge', callback);
  }
  
  isCurrentlyFlashing(): boolean {
    return this.isFlashing;
  }
  
  clearAll(): void {
    this.graphics.clear();
    this.isFlashing = false;
  }
  
  destroy(): void {
    this.graphics.destroy();
  }
}
