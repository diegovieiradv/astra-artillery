import * as Phaser from 'phaser';

export interface PerformanceStats {
  fps: number;
  memory: number;
  drawCalls: number;
  textureCount: number;
  particleCount: number;
}

export class PerformanceMonitor {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private graphics!: Phaser.GameObjects.Graphics;
  private fpsText!: Phaser.GameObjects.Text;
  private memoryText!: Phaser.GameObjects.Text;
  private statsText!: Phaser.GameObjects.Text;
  private isVisible = false;
  private updateTimer?: Phaser.Time.TimerEvent;
  private fpsHistory: number[] = [];
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }
  
  show(): void {
    if (this.isVisible) return;
    this.isVisible = true;
    
    const cam = this.scene.cameras.main;
    
    this.graphics = this.scene.add.graphics().setDepth(900);
    this.container = this.scene.add.container(10, 10).setDepth(901);
    
    this.graphics.fillStyle(0x000000, 0.7);
    this.graphics.fillRoundedRect(0, 0, 180, 80, 8);
    
    this.fpsText = this.scene.add.text(10, 8, 'FPS: --', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#4ade80',
    });
    
    this.memoryText = this.scene.add.text(10, 28, 'Memory: --', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#60a5fa',
    });
    
    this.statsText = this.scene.add.text(10, 48, 'Draw: --', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#fbbf24',
    });
    
    this.container.add([this.graphics, this.fpsText, this.memoryText, this.statsText]);
    
    this.updateTimer = this.scene.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => this.updateStats(),
    });
  }
  
  hide(): void {
    this.isVisible = false;
    this.updateTimer?.destroy();
    this.container?.destroy();
    this.graphics?.destroy();
  }
  
  toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
  
  private updateStats(): void {
    if (!this.isVisible) return;
    
    const fps = Math.round(this.scene.game.loop.actualFps);
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > 60) this.fpsHistory.shift();
    
    const avgFps = Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length);
    
    const fpsColor = avgFps >= 55 ? '#4ade80' : avgFps >= 30 ? '#fbbf24' : '#ef4444';
    this.fpsText.setText(`FPS: ${avgFps} (${fps})`);
    this.fpsText.setColor(fpsColor);
    
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      if (memory) {
        const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
        this.memoryText.setText(`Memory: ${used}/${total}MB`);
        
        const memColor = used < total * 0.7 ? '#60a5fa' : used < total * 0.9 ? '#fbbf24' : '#ef4444';
        this.memoryText.setColor(memColor);
      }
    }
    
    const renderer = this.scene.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    if (renderer) {
      const drawCalls = (renderer as any).drawCalls || 0;
      const textureCount = this.scene.textures.getTextureKeys().length;
      this.statsText.setText(`Draw: ${drawCalls} | Tex: ${textureCount}`);
    }
  }
  
  isShowing(): boolean {
    return this.isVisible;
  }
  
  destroy(): void {
    this.hide();
  }
}
