import * as Phaser from 'phaser';

export type PopupType = 'damage' | 'heal' | 'critical' | 'miss' | 'shield' | 'xp' | 'coin';

export interface DamagePopupConfig {
  text: string;
  type: PopupType;
  fontSize?: number;
  color?: string;
  strokeColor?: string;
  duration?: number;
  riseHeight?: number;
}

const POPUP_STYLES: Record<PopupType, { color: string; stroke: string; fontSize: number; riseHeight: number }> = {
  damage: { color: '#f87171', stroke: '#000000', fontSize: 24, riseHeight: 60 },
  heal: { color: '#4ade80', stroke: '#000000', fontSize: 24, riseHeight: 50 },
  critical: { color: '#fbbf24', stroke: '#000000', fontSize: 32, riseHeight: 80 },
  miss: { color: '#94a3b8', stroke: '#000000', fontSize: 20, riseHeight: 40 },
  shield: { color: '#60a5fa', stroke: '#000000', fontSize: 22, riseHeight: 55 },
  xp: { color: '#a78bfa', stroke: '#000000', fontSize: 20, riseHeight: 50 },
  coin: { color: '#fbbf24', stroke: '#000000', fontSize: 20, riseHeight: 50 },
};

export class DamagePopup {
  private scene: Phaser.Scene;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }
  
  show(x: number, y: number, config: DamagePopupConfig): void {
    const style = POPUP_STYLES[config.type];
    const fontSize = config.fontSize || style.fontSize;
    const riseHeight = config.riseHeight || style.riseHeight;
    
    const text = this.scene.add.text(x, y, config.text, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: `${fontSize}px`,
      color: config.color || style.color,
      fontStyle: 'bold',
      stroke: config.strokeColor || style.stroke,
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(150);
    
    const offsetX = (Math.random() - 0.5) * 40;
    
    this.scene.tweens.add({
      targets: text,
      x: x + offsetX,
      y: y - riseHeight,
      alpha: 0,
      duration: config.duration || 800,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    });
    
    if (config.type === 'critical') {
      this.createCriticalEffect(x, y);
    } else if (config.type === 'heal') {
      this.createHealEffect(x, y);
    }
  }
  
  showDamage(x: number, y: number, amount: number): void {
    this.show(x, y, { text: `-${amount}`, type: 'damage' });
  }
  
  showHeal(x: number, y: number, amount: number): void {
    this.show(x, y, { text: `+${amount}`, type: 'heal' });
  }
  
  showCritical(x: number, y: number, amount: number): void {
    this.show(x, y, { text: `-${amount}`, type: 'critical' });
  }
  
  showMiss(x: number, y: number): void {
    this.show(x, y, { text: 'MISS', type: 'miss' });
  }
  
  showShield(x: number, y: number, amount: number): void {
    this.show(x, y, { text: `+${amount}`, type: 'shield' });
  }
  
  showXP(x: number, y: number, amount: number): void {
    this.show(x, y, { text: `+${amount} XP`, type: 'xp' });
  }
  
  showCoin(x: number, y: number, amount: number): void {
    this.show(x, y, { text: `+${amount}`, type: 'coin' });
  }
  
  private createCriticalEffect(x: number, y: number): void {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      const particle = this.scene.add.star(x, y, 5, 3, 6, 0xfbbf24)
        .setDepth(149);
      
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * 50,
        y: y + Math.sin(angle) * 50,
        alpha: 0,
        scale: 0,
        duration: 400,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
  }
  
  private createHealEffect(x: number, y: number): void {
    for (let i = 0; i < 5; i++) {
      const particle = this.scene.add.circle(
        x + (Math.random() - 0.5) * 30,
        y,
        3,
        0x4ade80
      ).setDepth(149);
      
      this.scene.tweens.add({
        targets: particle,
        y: y - 40 - Math.random() * 30,
        alpha: 0,
        duration: 600,
        delay: i * 50,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
  }
  
  destroy(): void {}
}
