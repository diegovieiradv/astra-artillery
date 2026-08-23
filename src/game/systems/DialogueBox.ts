import * as Phaser from 'phaser';

export interface DialogueLine {
  speaker: string;
  text: string;
  portrait?: string;
}

export interface DialogueBoxConfig {
  width?: number;
  height?: number;
  padding?: number;
  backgroundColor?: number;
  borderColor?: number;
  textColor?: string;
  speakerColor?: string;
  fontSize?: number;
  typingSpeed?: number;
}

const DEFAULT_CONFIG: Required<DialogueBoxConfig> = {
  width: 800,
  height: 150,
  padding: 20,
  backgroundColor: 0x1e293b,
  borderColor: 0x475569,
  textColor: '#f8fafc',
  speakerColor: '#4ade80',
  fontSize: 18,
  typingSpeed: 30,
};

export class DialogueBox {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private graphics!: Phaser.GameObjects.Graphics;
  private speakerText!: Phaser.GameObjects.Text;
  private dialogueText!: Phaser.GameObjects.Text;
  private config: Required<DialogueBoxConfig>;
  private lines: DialogueLine[] = [];
  private currentLine = 0;
  private isTyping = false;
  private typewriterTimer?: Phaser.Time.TimerEvent;
  private onComplete?: () => void;
  private skipRequested = false;
  
  constructor(scene: Phaser.Scene, config: DialogueBoxConfig = {}) {
    this.scene = scene;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  show(lines: DialogueLine[], onComplete?: () => void): void {
    this.lines = lines;
    this.currentLine = 0;
    this.onComplete = onComplete;
    
    const cam = this.scene.cameras.main;
    const x = cam.width / 2;
    const y = cam.height - this.config.height / 2 - 20;
    
    this.graphics = this.scene.add.graphics().setDepth(300);
    this.container = this.scene.add.container(x, y).setDepth(301);
    
    this.graphics.fillStyle(this.config.backgroundColor, 0.95);
    this.graphics.fillRoundedRect(
      -this.config.width / 2,
      -this.config.height / 2,
      this.config.width,
      this.config.height,
      12
    );
    this.graphics.lineStyle(2, this.config.borderColor);
    this.graphics.strokeRoundedRect(
      -this.config.width / 2,
      -this.config.height / 2,
      this.config.width,
      this.config.height,
      12
    );
    
    this.speakerText = this.scene.add.text(
      -this.config.width / 2 + this.config.padding,
      -this.config.height / 2 + this.config.padding,
      '',
      {
        fontFamily: 'system-ui, sans-serif',
        fontSize: `${this.config.fontSize + 4}px`,
        color: this.config.speakerColor,
        fontStyle: 'bold',
      }
    );
    
    this.dialogueText = this.scene.add.text(
      -this.config.width / 2 + this.config.padding,
      -this.config.height / 2 + this.config.padding + 28,
      '',
      {
        fontFamily: 'system-ui, sans-serif',
        fontSize: `${this.config.fontSize}px`,
        color: this.config.textColor,
        wordWrap: { width: this.config.width - this.config.padding * 2 },
      }
    );
    
    this.container.add([this.graphics, this.speakerText, this.dialogueText]);
    
    this.container.setAlpha(0);
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      y: y - 10,
      duration: 300,
      ease: 'Power2',
    });
    
    this.showLine(this.lines[this.currentLine]);
    
    this.scene.input.on('pointerdown', this.handleClick, this);
    this.scene.input.keyboard?.on('keydown-SPACE', this.handleClick, this);
    this.scene.input.keyboard?.on('keydown-ENTER', this.handleClick, this);
  }
  
  private showLine(line: DialogueLine): void {
    this.speakerText.setText(line.speaker);
    this.dialogueText.setText('');
    this.isTyping = true;
    this.skipRequested = false;
    
    let charIndex = 0;
    const fullText = line.text;
    
    this.typewriterTimer = this.scene.time.addEvent({
      delay: this.config.typingSpeed,
      repeat: fullText.length - 1,
      callback: () => {
        if (this.skipRequested) {
          this.dialogueText.setText(fullText);
          this.isTyping = false;
          this.typewriterTimer?.destroy();
          return;
        }
        
        charIndex++;
        this.dialogueText.setText(fullText.substring(0, charIndex));
        
        if (charIndex >= fullText.length) {
          this.isTyping = false;
        }
      },
    });
  }
  
  private handleClick = (): void => {
    if (this.isTyping) {
      this.skipRequested = true;
      return;
    }
    
    this.currentLine++;
    
    if (this.currentLine >= this.lines.length) {
      this.hide();
    } else {
      this.showLine(this.lines[this.currentLine]);
    }
  };
  
  hide(): void {
    this.scene.input.off('pointerdown', this.handleClick, this);
    this.scene.input.keyboard?.off('keydown-SPACE', this.handleClick, this);
    this.scene.input.keyboard?.off('keydown-ENTER', this.handleClick, this);
    
    this.typewriterTimer?.destroy();
    
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      y: this.container.y + 20,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.container.destroy();
        this.graphics.destroy();
        this.onComplete?.();
      },
    });
  }
  
  skip(): void {
    this.hide();
  }
  
  getCurrentLine(): DialogueLine | null {
    return this.lines[this.currentLine] || null;
  }
  
  isActive(): boolean {
    return this.container?.active ?? false;
  }
  
  destroy(): void {
    this.typewriterTimer?.destroy();
    this.container?.destroy();
    this.graphics?.destroy();
    this.scene.input.off('pointerdown', this.handleClick, this);
  }
}
