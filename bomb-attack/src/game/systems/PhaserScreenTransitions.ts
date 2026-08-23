import * as Phaser from 'phaser';

export type TransitionEffect = 'fade' | 'wipe-left' | 'wipe-right' | 'wipe-up' | 'wipe-down' | 'iris' | 'dissolve' | 'zoom';

export interface TransitionConfig {
  duration: number;
  ease: string;
}

const TRANSITION_CONFIGS: Record<TransitionEffect, TransitionConfig> = {
  fade: { duration: 500, ease: 'Power2' },
  'wipe-left': { duration: 600, ease: 'Power2' },
  'wipe-right': { duration: 600, ease: 'Power2' },
  'wipe-up': { duration: 600, ease: 'Power2' },
  'wipe-down': { duration: 600, ease: 'Power2' },
  iris: { duration: 700, ease: 'Power2' },
  dissolve: { duration: 800, ease: 'Linear' },
  zoom: { duration: 500, ease: 'Back.easeIn' },
};

export class PhaserScreenTransitions {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  private isTransitioning = false;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics().setDepth(1000);
  }
  
  async transition(
    effect: TransitionEffect,
    callback: () => void
  ): Promise<void> {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    const config = TRANSITION_CONFIGS[effect];
    
    switch (effect) {
      case 'fade':
        await this.fadeTransition(config, callback);
        break;
      case 'wipe-left':
      case 'wipe-right':
      case 'wipe-up':
      case 'wipe-down':
        await this.wipeTransition(effect, config, callback);
        break;
      case 'iris':
        await this.irisTransition(config, callback);
        break;
      case 'dissolve':
        await this.dissolveTransition(config, callback);
        break;
      case 'zoom':
        await this.zoomTransition(config, callback);
        break;
    }
    
    this.isTransitioning = false;
  }
  
  private fadeTransition(config: TransitionConfig, callback: () => void): Promise<void> {
    return new Promise((resolve) => {
      const cam = this.scene.cameras.main;
      const { duration } = config;
      
      this.graphics.fillStyle(0x000000, 1);
      this.graphics.fillRect(0, 0, cam.width, cam.height);
      this.graphics.setAlpha(0);
      
      this.scene.tweens.add({
        targets: this.graphics,
        alpha: 1,
        duration: duration / 2,
        ease: 'Power2',
        onComplete: () => {
          callback();
          this.scene.tweens.add({
            targets: this.graphics,
            alpha: 0,
            duration: duration / 2,
            ease: 'Power2',
            onComplete: () => {
              this.graphics.clear();
              resolve();
            },
          });
        },
      });
    });
  }
  
  private wipeTransition(
    direction: 'wipe-left' | 'wipe-right' | 'wipe-up' | 'wipe-down',
    config: TransitionConfig,
    callback: () => void
  ): Promise<void> {
    return new Promise((resolve) => {
      const cam = this.scene.cameras.main;
      const { duration } = config;
      
      let progress = { value: 0 };
      
      this.scene.tweens.add({
        targets: progress,
        value: 1,
        duration: duration / 2,
        ease: 'Power2',
        onUpdate: () => {
          this.graphics.clear();
          this.graphics.fillStyle(0x000000, 1);
          
          switch (direction) {
            case 'wipe-left':
              this.graphics.fillRect(0, 0, cam.width * progress.value, cam.height);
              break;
            case 'wipe-right':
              this.graphics.fillRect(cam.width * (1 - progress.value), 0, cam.width * progress.value, cam.height);
              break;
            case 'wipe-up':
              this.graphics.fillRect(0, 0, cam.width, cam.height * progress.value);
              break;
            case 'wipe-down':
              this.graphics.fillRect(0, cam.height * (1 - progress.value), cam.width, cam.height * progress.value);
              break;
          }
        },
        onComplete: () => {
          callback();
          
          this.scene.tweens.add({
            targets: progress,
            value: 0,
            duration: duration / 2,
            ease: 'Power2',
            onUpdate: () => {
              this.graphics.clear();
              this.graphics.fillStyle(0x000000, 1);
              
              switch (direction) {
                case 'wipe-left':
                  this.graphics.fillRect(cam.width * progress.value, 0, cam.width * (1 - progress.value), cam.height);
                  break;
                case 'wipe-right':
                  this.graphics.fillRect(0, 0, cam.width * progress.value, cam.height);
                  break;
                case 'wipe-up':
                  this.graphics.fillRect(0, cam.height * progress.value, cam.width, cam.height * (1 - progress.value));
                  break;
                case 'wipe-down':
                  this.graphics.fillRect(0, 0, cam.width, cam.height * progress.value);
                  break;
              }
            },
            onComplete: () => {
              this.graphics.clear();
              resolve();
            },
          });
        },
      });
    });
  }
  
  private irisTransition(config: TransitionConfig, callback: () => void): Promise<void> {
    return new Promise((resolve) => {
      const cam = this.scene.cameras.main;
      const { duration } = config;
      const centerX = cam.width / 2;
      const centerY = cam.height / 2;
      const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
      
      let progress = { value: 0 };
      
      this.scene.tweens.add({
        targets: progress,
        value: 1,
        duration: duration / 2,
        ease: 'Power2',
        onUpdate: () => {
          this.graphics.clear();
          this.graphics.fillStyle(0x000000, 1);
          this.graphics.fillCircle(centerX, centerY, maxRadius * progress.value);
        },
        onComplete: () => {
          callback();
          
          this.scene.tweens.add({
            targets: progress,
            value: 0,
            duration: duration / 2,
            ease: 'Power2',
            onUpdate: () => {
              this.graphics.clear();
              this.graphics.fillStyle(0x000000, 1);
              this.graphics.fillCircle(centerX, centerY, maxRadius * progress.value);
            },
            onComplete: () => {
              this.graphics.clear();
              resolve();
            },
          });
        },
      });
    });
  }
  
  private dissolveTransition(config: TransitionConfig, callback: () => void): Promise<void> {
    return new Promise((resolve) => {
      const cam = this.scene.cameras.main;
      const { duration } = config;
      const blockSize = 20;
      const cols = Math.ceil(cam.width / blockSize);
      const rows = Math.ceil(cam.height / blockSize);
      const totalBlocks = cols * rows;
      
      let progress = { value: 0 };
      const blocks: Array<{ x: number; y: number; delay: number }> = [];
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          blocks.push({
            x: col * blockSize,
            y: row * blockSize,
            delay: Math.random(),
          });
        }
      }
      
      blocks.sort((a, b) => a.delay - b.delay);
      
      this.scene.tweens.add({
        targets: progress,
        value: 1,
        duration: duration,
        ease: 'Linear',
        onUpdate: () => {
          this.graphics.clear();
          this.graphics.fillStyle(0x000000, 1);
          
          const blocksToShow = Math.floor(progress.value * totalBlocks);
          for (let i = 0; i < blocksToShow; i++) {
            const block = blocks[i];
            this.graphics.fillRect(block.x, block.y, blockSize, blockSize);
          }
        },
        onComplete: () => {
          callback();
          
          this.scene.time.delayedCall(100, () => {
            this.graphics.clear();
            resolve();
          });
        },
      });
    });
  }
  
  private zoomTransition(config: TransitionConfig, callback: () => void): Promise<void> {
    return new Promise((resolve) => {
      const cam = this.scene.cameras.main;
      const { duration } = config;
      
      this.graphics.fillStyle(0x000000, 1);
      this.graphics.fillRect(0, 0, cam.width, cam.height);
      this.graphics.setAlpha(0);
      this.graphics.setScale(0.5);
      
      this.scene.tweens.add({
        targets: this.graphics,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: duration / 2,
        ease: 'Back.easeIn',
        onComplete: () => {
          callback();
          
          this.scene.tweens.add({
            targets: this.graphics,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: duration / 2,
            ease: 'Back.easeOut',
            onComplete: () => {
              this.graphics.clear();
              this.graphics.setScale(1);
              resolve();
            },
          });
        },
      });
    });
  }
  
  isCurrentlyTransitioning(): boolean {
    return this.isTransitioning;
  }
  
  destroy(): void {
    this.graphics.destroy();
  }
}
