import * as Phaser from 'phaser';

export interface BossIntroConfig {
  bossName: string;
  bossTitle?: string;
  healthBarColor?: number;
  duration?: number;
}

export class BossIntroAnimations {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private graphics!: Phaser.GameObjects.Graphics;
  private isActive = false;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }
  
  async playIntro(config: BossIntroConfig): Promise<void> {
    if (this.isActive) return;
    this.isActive = true;
    
    const cam = this.scene.cameras.main;
    
    this.graphics = this.scene.add.graphics().setDepth(400);
    this.container = this.scene.add.container(cam.width / 2, cam.height / 2).setDepth(401);
    
    this.graphics.fillStyle(0x000000, 0.8);
    this.graphics.fillRect(0, 0, cam.width, cam.height);
    this.graphics.setAlpha(0);
    
    this.scene.tweens.add({
      targets: this.graphics,
      alpha: 1,
      duration: 500,
    });
    
    await this.delay(300);
    
    const warningText = this.scene.add.text(0, -80, '⚠️ BOSS APPEARING ⚠️', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px',
      color: '#ef4444',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0);
    
    this.container.add(warningText);
    
    this.scene.tweens.add({
      targets: warningText,
      alpha: 1,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 400,
      yoyo: true,
      repeat: 2,
      ease: 'Power2',
    });
    
    await this.delay(1500);
    
    warningText.destroy();
    
    const nameText = this.scene.add.text(0, -30, config.bossName, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '48px',
      color: '#fbbf24',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setAlpha(0).setScale(0.5);
    
    this.container.add(nameText);
    
    this.scene.tweens.add({
      targets: nameText,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: 'Back.easeOut',
    });
    
    await this.delay(400);
    
    if (config.bossTitle) {
      const titleText = this.scene.add.text(0, 30, config.bossTitle, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
        color: '#94a3b8',
        fontStyle: 'italic',
      }).setOrigin(0.5).setAlpha(0);
      
      this.container.add(titleText);
      
      this.scene.tweens.add({
        targets: titleText,
        alpha: 1,
        y: 25,
        duration: 400,
        ease: 'Power2',
      });
      
      await this.delay(600);
    }
    
    for (let i = 0; i < 5; i++) {
      const flashX = cam.width * Math.random();
      const flashY = cam.height * Math.random();
      
      const flash = this.scene.add.circle(flashX, flashY, 30, 0xfbbf24, 0.5)
        .setDepth(402);
      
      this.scene.tweens.add({
        targets: flash,
        scaleX: 3,
        scaleY: 3,
        alpha: 0,
        duration: 300,
        delay: i * 100,
        onComplete: () => flash.destroy(),
      });
    }
    
    await this.delay(800);
    
    this.scene.tweens.add({
      targets: [this.container, this.graphics],
      alpha: 0,
      duration: 500,
      onComplete: () => {
        this.container.destroy();
        this.graphics.destroy();
        this.isActive = false;
      },
    });
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => this.scene.time.delayedCall(ms, resolve));
  }
  
  isPlaying(): boolean {
    return this.isActive;
  }
  
  destroy(): void {
    this.container?.destroy();
    this.graphics?.destroy();
    this.isActive = false;
  }
}
