import * as Phaser from 'phaser';

export interface AchievementPopupConfig {
  title: string;
  description: string;
  icon?: string;
  color?: number;
  duration?: number;
  soundKey?: string;
}

const DEFAULT_CONFIG = {
  color: 0xfbbf24,
  duration: 4000,
  soundKey: 'sfx_achievement',
};

export class AchievementPopup {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private graphics!: Phaser.GameObjects.Graphics;
  private isActive = false;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }
  
  show(config: AchievementPopupConfig): void {
    if (this.isActive) return;
    this.isActive = true;
    
    const cam = this.scene.cameras.main;
    const width = 400;
    const height = 100;
    const x = cam.width / 2;
    const y = -height;
    const targetY = 20;
    
    this.graphics = this.scene.add.graphics().setDepth(200);
    this.container = this.scene.add.container(x, y).setDepth(201);
    
    this.graphics.fillStyle(0x1e293b, 0.95);
    this.graphics.fillRoundedRect(-width / 2, -height / 2, width, height, 12);
    this.graphics.lineStyle(2, config.color || DEFAULT_CONFIG.color);
    this.graphics.strokeRoundedRect(-width / 2, -height / 2, width, height, 12);
    
    const iconText = this.scene.add.text(-width / 2 + 20, 0, config.icon || '🏆', {
      fontSize: '32px',
    }).setOrigin(0, 0.5);
    
    const titleText = this.scene.add.text(-width / 2 + 60, -15, config.title, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      color: '#fbbf24',
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    
    const descText = this.scene.add.text(-width / 2 + 60, 10, config.description, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#94a3b8',
    }).setOrigin(0, 0.5);
    
    this.container.add([this.graphics, iconText, titleText, descText]);
    
    if (config.soundKey || DEFAULT_CONFIG.soundKey) {
      this.scene.sound.play(config.soundKey || DEFAULT_CONFIG.soundKey, { volume: 0.6 });
    }
    
    this.scene.tweens.add({
      targets: this.container,
      y: targetY,
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.time.delayedCall(config.duration || DEFAULT_CONFIG.duration, () => {
          this.hide();
        });
      },
    });
  }
  
  private hide(): void {
    this.scene.tweens.add({
      targets: this.container,
      y: -120,
      alpha: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: () => {
        this.container.destroy();
        this.graphics.destroy();
        this.isActive = false;
      },
    });
  }
  
  isShowing(): boolean {
    return this.isActive;
  }
  
  destroy(): void {
    if (this.container) this.container.destroy();
    if (this.graphics) this.graphics.destroy();
    this.isActive = false;
  }
}
