import * as Phaser from 'phaser';

export interface XPBarConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  bgColor: number;
  fillColor: number;
  borderColor: number;
  borderWidth: number;
}

export interface StarConfig {
  x: number;
  y: number;
  size: number;
  filledColor: number;
  emptyColor: number;
  spacing: number;
}

export interface CoinConfig {
  x: number;
  y: number;
  color: number;
  size: number;
  fontSize: string;
}

const DEFAULT_XP_CONFIG: XPBarConfig = {
  x: 960,
  y: 600,
  width: 400,
  height: 30,
  bgColor: 0x1e293b,
  fillColor: 0x4ade80,
  borderColor: 0x64748b,
  borderWidth: 2,
};

const DEFAULT_STAR_CONFIG: StarConfig = {
  x: 960,
  y: 450,
  size: 40,
  filledColor: 0xfbbf24,
  emptyColor: 0x334155,
  spacing: 60,
};

const DEFAULT_COIN_CONFIG: CoinConfig = {
  x: 960,
  y: 520,
  color: 0xfbbf24,
  size: 24,
  fontSize: '28px',
};

export class RewardAnimations {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics().setDepth(50);
  }
  
  animateXPBar(
    startXP: number,
    endXP: number,
    xpToNextLevel: number,
    config: XPBarConfig = DEFAULT_XP_CONFIG,
    callback?: (levelUp: boolean, overflowXP: number) => void
  ): void {
    this.graphics.clear();
    
    this.graphics.fillStyle(config.bgColor);
    this.graphics.fillRoundedRect(
      config.x - config.width / 2,
      config.y,
      config.width,
      config.height,
      8
    );
    
    this.graphics.lineStyle(config.borderWidth, config.borderColor);
    this.graphics.strokeRoundedRect(
      config.x - config.width / 2,
      config.y,
      config.width,
      config.height,
      8
    );
    
    const startPercent = Math.min(startXP / xpToNextLevel, 1);
    const endPercent = Math.min(endXP / xpToNextLevel, 1);
    
    let fillGraphics = this.scene.add.graphics().setDepth(51);
    fillGraphics.fillStyle(config.fillColor);
    
    const drawFill = (percent: number) => {
      fillGraphics.clear();
      fillGraphics.fillStyle(config.fillColor);
      fillGraphics.fillRoundedRect(
        config.x - config.width / 2 + 2,
        config.y + 2,
        (config.width - 4) * percent,
        config.height - 4,
        6
      );
    };
    
    drawFill(startPercent);
    
    const xpLabel = this.scene.add.text(config.x, config.y - 20, `${startXP} / ${xpToNextLevel} XP`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      color: '#f8fafc',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(52);
    
    this.scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 1500,
      ease: 'Power2',
      onUpdate: (tween) => {
        const progress = tween.getValue() / 100;
        const currentPercent = startPercent + (endPercent - startPercent) * progress;
        drawFill(Math.min(currentPercent, 1));
        
        const currentXP = Math.round(startXP + (endXP - startXP) * progress);
        xpLabel.setText(`${currentXP} / ${xpToNextLevel} XP`);
      },
      onComplete: () => {
        if (endXP >= xpToNextLevel) {
          const overflowXP = endXP - xpToNextLevel;
          this.createLevelUpCelebration(config.x, config.y + config.height / 2, () => {
            fillGraphics.destroy();
            xpLabel.destroy();
            callback?.(true, overflowXP);
          });
        } else {
          this.scene.time.delayedCall(500, () => {
            fillGraphics.destroy();
            xpLabel.destroy();
            callback?.(false, 0);
          });
        }
      },
    });
  }
  
  private createLevelUpCelebration(x: number, y: number, callback?: () => void): void {
    const levelUpText = this.scene.add.text(x, y, 'LEVEL UP!', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '64px',
      color: '#4ade80',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5).setDepth(60).setScale(0);
    
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 / 30) * i;
      const speed = 150 + Math.random() * 100;
      const color = Phaser.Utils.Array.GetRandom([0x4ade80, 0x22c55e, 0x86efac, 0xfbbf24]);
      const size = 4 + Math.random() * 6;
      
      const particle = this.scene.add.circle(x, y, size, color, 1).setDepth(59);
      
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed - 50,
        alpha: 0,
        scale: 0,
        duration: 800,
        delay: 200 + Math.random() * 200,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
    
    this.scene.tweens.add({
      targets: levelUpText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: levelUpText,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: 'Power2',
          onComplete: () => {
            this.scene.time.delayedCall(1000, () => {
              this.scene.tweens.add({
                targets: levelUpText,
                alpha: 0,
                y: y - 50,
                duration: 500,
                onComplete: () => {
                  levelUpText.destroy();
                  callback?.();
                },
              });
            });
          },
        });
      },
    });
  }
  
  animateStars(
    earnedStars: number,
    maxStars: number = 3,
    config: StarConfig = DEFAULT_STAR_CONFIG,
    callback?: () => void
  ): void {
    const startX = config.x - ((maxStars - 1) * config.spacing) / 2;
    
    for (let i = 0; i < maxStars; i++) {
      const starX = startX + i * config.spacing;
      const starY = config.y;
      const filled = i < earnedStars;
      
      this.scene.time.delayedCall(i * 300, () => {
        this.createStar(starX, starY, config.size, filled, config.filledColor, config.emptyColor);
      });
    }
    
    this.scene.time.delayedCall(maxStars * 300 + 500, () => {
      callback?.();
    });
  }
  
  private createStar(
    x: number,
    y: number,
    size: number,
    filled: boolean,
    filledColor: number,
    emptyColor: number
  ): void {
    const color = filled ? filledColor : emptyColor;
    const star = this.scene.add.star(x, y, 5, size * 0.4, size, color)
      .setDepth(55)
      .setScale(0)
      .setAlpha(filled ? 1 : 0.5);
    
    this.scene.tweens.add({
      targets: star,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: star,
          scaleX: 1,
          scaleY: 1,
          duration: 150,
          ease: 'Power2',
        });
        
        if (filled) {
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const particle = this.scene.add.circle(x, y, 3, filledColor, 1).setDepth(56);
            
            this.scene.tweens.add({
              targets: particle,
              x: x + Math.cos(angle) * 40,
              y: y + Math.sin(angle) * 40,
              alpha: 0,
              scale: 0,
              duration: 400,
              delay: 100,
              onComplete: () => particle.destroy(),
            });
          }
        }
      },
    });
  }
  
  animateCoins(
    amount: number,
    config: CoinConfig = DEFAULT_COIN_CONFIG,
    callback?: () => void
  ): void {
    const coinIcon = this.scene.add.circle(config.x - 60, config.y, config.size / 2, config.color)
      .setDepth(55)
      .setStrokeStyle(2, 0xf59e0b);
    
    const coinLabel = this.scene.add.text(config.x - 40, config.y, 'ASTRA COINS', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      color: '#94a3b8',
    }).setOrigin(0, 0.5).setDepth(56);
    
    const amountText = this.scene.add.text(config.x + 80, config.y, '+0', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: config.fontSize,
      color: '#fbbf24',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(1, 0.5).setDepth(57);
    
    this.scene.tweens.addCounter({
      from: 0,
      to: amount,
      duration: 1000,
      ease: 'Power2',
      onUpdate: (tween) => {
        const value = Math.round(tween.getValue());
        amountText.setText(`+${value}`);
      },
      onComplete: () => {
        amountText.setText(`+${amount}`);
        
        this.scene.tweens.add({
          targets: amountText,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 200,
          yoyo: true,
          onComplete: () => {
            this.scene.time.delayedCall(500, () => {
              coinIcon.destroy();
              coinLabel.destroy();
              amountText.destroy();
              callback?.();
            });
          },
        });
      },
    });
  }
  
  animateRewardSequence(
    xp: number,
    coins: number,
    stars: number,
    currentXP: number,
    xpToNextLevel: number,
    callback?: () => void
  ): void {
    let sequenceIndex = 0;
    
    const nextStep = () => {
      sequenceIndex++;
      
      switch (sequenceIndex) {
        case 1:
          this.animateStars(stars, 3, DEFAULT_STAR_CONFIG, nextStep);
          break;
        case 2:
          this.animateXPBar(currentXP, currentXP + xp, xpToNextLevel, DEFAULT_XP_CONFIG, (levelUp) => {
            if (levelUp) {
              this.scene.time.delayedCall(1500, nextStep);
            } else {
              nextStep();
            }
          });
          break;
        case 3:
          this.animateCoins(coins, DEFAULT_COIN_CONFIG, nextStep);
          break;
        case 4:
          this.scene.time.delayedCall(500, () => {
            callback?.();
          });
          break;
      }
    };
    
    nextStep();
  }
  
  clearAll(): void {
    this.graphics.clear();
  }
  
  destroy(): void {
    this.graphics.destroy();
  }
}
