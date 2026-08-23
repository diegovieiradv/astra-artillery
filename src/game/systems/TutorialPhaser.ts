import * as Phaser from 'phaser';

export interface TutorialStep {
  id: string;
  target?: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'wait' | 'input';
  highlight?: boolean;
  duration?: number;
}

export class TutorialPhaser {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private graphics!: Phaser.GameObjects.Graphics;
  private highlightGraphics!: Phaser.GameObjects.Graphics;
  private steps: TutorialStep[] = [];
  private currentStep = 0;
  private isActive = false;
  private onComplete?: () => void;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }
  
  start(steps: TutorialStep[], onComplete?: () => void): void {
    if (this.isActive) return;
    
    this.steps = steps;
    this.currentStep = 0;
    this.onComplete = onComplete;
    this.isActive = true;
    
    this.highlightGraphics = this.scene.add.graphics().setDepth(500);
    this.showStep(this.steps[this.currentStep]);
  }
  
  private showStep(step: TutorialStep): void {
    const cam = this.scene.cameras.main;
    const width = 350;
    const height = 120;
    
    let x = cam.width / 2;
    let y = cam.height - height / 2 - 30;
    
    if (step.position === 'top') {
      y = height / 2 + 30;
    }
    
    this.graphics = this.scene.add.graphics().setDepth(501);
    this.container = this.scene.add.container(x, y).setDepth(502);
    
    this.graphics.fillStyle(0x1e293b, 0.95);
    this.graphics.fillRoundedRect(-width / 2, -height / 2, width, height, 12);
    this.graphics.lineStyle(2, 0x4ade80);
    this.graphics.strokeRoundedRect(-width / 2, -height / 2, width, height, 12);
    
    const stepIndicator = this.scene.add.text(
      -width / 2 + 15,
      -height / 2 + 10,
      `${this.currentStep + 1}/${this.steps.length}`,
      {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '12px',
        color: '#64748b',
      }
    );
    
    const titleText = this.scene.add.text(
      -width / 2 + 15,
      -height / 2 + 30,
      step.title,
      {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
        color: '#4ade80',
        fontStyle: 'bold',
      }
    );
    
    const descText = this.scene.add.text(
      -width / 2 + 15,
      -height / 2 + 55,
      step.description,
      {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        color: '#f8fafc',
        wordWrap: { width: width - 30 },
      }
    );
    
    const continueText = this.scene.add.text(
      width / 2 - 15,
      height / 2 - 15,
      'Clique para continuar',
      {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '11px',
        color: '#94a3b8',
      }
    ).setOrigin(1, 1);
    
    this.container.add([this.graphics, stepIndicator, titleText, descText, continueText]);
    this.container.setAlpha(0);
    
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      y: y - 5,
      duration: 300,
      ease: 'Power2',
    });
    
    if (step.highlight && step.target) {
      this.highlightTarget(step.target);
    }
    
    this.scene.input.once('pointerdown', () => {
      this.nextStep();
    });
    
    this.scene.input.keyboard?.once('keydown-SPACE', () => {
      this.nextStep();
    });
    
    this.scene.input.keyboard?.once('keydown-ENTER', () => {
      this.nextStep();
    });
  }
  
  private highlightTarget(target: string): void {
    try {
      const element = this.scene.children.getByName(target) as Phaser.GameObjects.Rectangle;
      if (element) {
        const bounds = element.getBounds();
        this.highlightGraphics.clear();
        this.highlightGraphics.fillStyle(0x4ade80, 0.3);
        this.highlightGraphics.fillRoundedRect(
          bounds.x - 8,
          bounds.y - 8,
          bounds.width + 16,
          bounds.height + 16,
          8
        );
        this.highlightGraphics.lineStyle(2, 0x4ade80);
        this.highlightGraphics.strokeRoundedRect(
          bounds.x - 8,
          bounds.y - 8,
          bounds.width + 16,
          bounds.height + 16,
          8
        );
      }
    } catch (e) {
      console.warn('Tutorial highlight failed:', e);
    }
  }
  
  private nextStep(): void {
    this.container?.destroy();
    this.graphics?.destroy();
    this.highlightGraphics?.clear();
    
    this.currentStep++;
    
    if (this.currentStep >= this.steps.length) {
      this.complete();
    } else {
      this.showStep(this.steps[this.currentStep]);
    }
  }
  
  private complete(): void {
    this.isActive = false;
    this.onComplete?.();
  }
  
  skip(): void {
    this.container?.destroy();
    this.graphics?.destroy();
    this.highlightGraphics?.destroy();
    this.isActive = false;
    this.onComplete?.();
  }
  
  isActiveTutorial(): boolean {
    return this.isActive;
  }
  
  destroy(): void {
    this.container?.destroy();
    this.graphics?.destroy();
    this.highlightGraphics?.destroy();
    this.isActive = false;
  }
}
