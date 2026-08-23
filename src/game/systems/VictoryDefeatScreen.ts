import * as Phaser from 'phaser';

export type BattleResult = 'victory' | 'defeat';

export interface BattleReward {
  xp: number;
  coins: number;
  stars: number;
  items?: string[];
}

export interface VictoryDefeatConfig {
  result: BattleResult;
  reward?: BattleReward;
  level?: number;
  characterName?: string;
}

export class VictoryDefeatScreen {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private graphics!: Phaser.GameObjects.Graphics;
  private onComplete?: () => void;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }
  
  show(config: VictoryDefeatConfig, onComplete?: () => void): void {
    this.onComplete = onComplete;
    
    const cam = this.scene.cameras.main;
    const isVictory = config.result === 'victory';
    
    this.graphics = this.scene.add.graphics().setDepth(600);
    this.container = this.scene.add.container(cam.width / 2, cam.height / 2).setDepth(601);
    
    this.graphics.fillStyle(isVictory ? 0x064e3b : 0x7f1d1d, 0.95);
    this.graphics.fillRect(0, 0, cam.width, cam.height);
    this.graphics.setAlpha(0);
    
    this.scene.tweens.add({
      targets: this.graphics,
      alpha: 1,
      duration: 500,
    });
    
    const resultText = this.scene.add.text(0, -120, isVictory ? 'VITÓRIA!' : 'DERROTA', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '64px',
      color: isVictory ? '#4ade80' : '#ef4444',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5).setAlpha(0).setScale(0.3);
    
    this.container.add(resultText);
    
    this.scene.tweens.add({
      targets: resultText,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 800,
      ease: 'Back.easeOut',
      delay: 300,
    });
    
    if (config.characterName) {
      const charText = this.scene.add.text(0, -50, config.characterName, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
        color: '#f8fafc',
      }).setOrigin(0.5).setAlpha(0);
      
      this.container.add(charText);
      
      this.scene.tweens.add({
        targets: charText,
        alpha: 1,
        duration: 400,
        delay: 800,
      });
    }
    
    if (config.reward) {
      this.showRewards(config.reward, isVictory ? 1200 : 1000);
    }
    
    const continueText = this.scene.add.text(0, 180, 'Clique para continuar', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      color: '#94a3b8',
    }).setOrigin(0.5).setAlpha(0);
    
    this.container.add(continueText);
    
    this.scene.tweens.add({
      targets: continueText,
      alpha: 1,
      duration: 400,
      delay: 2500,
      yoyo: true,
      repeat: -1,
    });
    
    this.scene.time.delayedCall(2500, () => {
      this.scene.input.once('pointerdown', () => {
        this.hide();
      });
      
      this.scene.input.keyboard?.once('keydown-SPACE', () => {
        this.hide();
      });
    });
    
    if (isVictory) {
      this.scene.sound.play('sfx_victory', { volume: 0.7 });
      
      for (let i = 0; i < 20; i++) {
        const particle = this.scene.add.star(
          cam.width * Math.random(),
          -20,
          5,
          4,
          8,
          Phaser.Utils.Array.GetRandom([0x4ade80, 0xfbbf24, 0x60a5fa])
        ).setDepth(602);
        
        this.scene.tweens.add({
          targets: particle,
          y: cam.height + 20,
          x: particle.x + (Math.random() - 0.5) * 200,
          rotation: Math.random() * 6,
          duration: 2000 + Math.random() * 2000,
          delay: i * 100,
          onComplete: () => particle.destroy(),
        });
      }
    }
  }
  
  private showRewards(reward: BattleReward, delay: number): void {
    const startY = 40;
    const spacing = 35;
    
    const xpText = this.scene.add.text(-100, startY, `+${reward.xp} XP`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      color: '#a78bfa',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0);
    
    const coinText = this.scene.add.text(0, startY, `+${reward.coins} 🪙`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      color: '#fbbf24',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0);
    
    const starText = this.scene.add.text(100, startY, `${'⭐'.repeat(reward.stars)}`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px',
    }).setOrigin(0.5).setAlpha(0);
    
    this.container.add([xpText, coinText, starText]);
    
    this.scene.tweens.add({
      targets: [xpText, coinText, starText],
      alpha: 1,
      y: `-=${10}`,
      duration: 400,
      delay: delay,
      ease: 'Power2',
    });
  }
  
  private hide(): void {
    this.scene.tweens.add({
      targets: [this.container, this.graphics],
      alpha: 0,
      duration: 400,
      onComplete: () => {
        this.container.destroy();
        this.graphics.destroy();
        this.onComplete?.();
      },
    });
  }
  
  destroy(): void {
    this.container?.destroy();
    this.graphics?.destroy();
  }
}
