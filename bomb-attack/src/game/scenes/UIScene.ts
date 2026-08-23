import * as Phaser from 'phaser';
import { GAME_EVENTS } from '../config/phaser';
import { COMBAT_CONFIG, UI_CONFIG } from '../config/game';

export class UIScene extends Phaser.Scene {
  private windText!: Phaser.GameObjects.Text;
  private turnText!: Phaser.GameObjects.Text;
  private angleText!: Phaser.GameObjects.Text;
  private powerBarBg!: Phaser.GameObjects.Rectangle;
  private powerBarFill!: Phaser.GameObjects.Rectangle;
  private powerText!: Phaser.GameObjects.Text;
  private playerHpBar!: Phaser.GameObjects.Rectangle;
  private playerHpFill!: Phaser.GameObjects.Rectangle;
  private cpuHpBar!: Phaser.GameObjects.Rectangle;
  private cpuHpFill!: Phaser.GameObjects.Rectangle;
  private abilityIcon!: Phaser.GameObjects.Image;
  private abilityCooldownText!: Phaser.GameObjects.Text;
  private abilityCooldownBg!: Phaser.GameObjects.Graphics;
  
  private currentWind = 0;
  private turnNumber = 1;
  private currentTurn: 'player' | 'cpu' = 'player';
  private playerAngle = 45;
  private playerPower = 50;
  private playerHp = 100;
  private playerMaxHp = 100;
  private cpuHp = 100;
  private cpuMaxHp = 100;
  private abilityCooldown = 0;
  private maxAbilityCooldown = 0;

  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    this.createHUD();
    this.setupEventListeners();
  }

  private createHUD(): void {
    const cam = this.cameras.main;
    const w = cam.width;
    const h = cam.height;
    
    this.add.rectangle(w / 2, h - UI_CONFIG.hudHeight / 2, w, UI_CONFIG.hudHeight, 0x0f172a, 0.9).setScrollFactor(0).setDepth(100);
    
    this.windText = this.add.text(30, h - 100, 'VENTO: → 0.0', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px',
      color: '#f8fafc',
      fontStyle: 'bold',
    }).setScrollFactor(0).setDepth(101);
    
    this.turnText = this.add.text(w - 30, h - 100, 'TURNO 1 - VOCÊ', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px',
      color: '#f8fafc',
      fontStyle: 'bold',
    }).setScrollFactor(0).setOrigin(1, 0).setDepth(101);
    
    this.angleText = this.add.text(30, h - 60, 'ÂNGULO: 45°', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      color: '#f8fafc',
    }).setScrollFactor(0).setDepth(101);
    
    this.powerBarBg = this.add.rectangle(250, h - 60, UI_CONFIG.powerBarWidth, UI_CONFIG.powerBarHeight, 0x334155)
      .setScrollFactor(0).setOrigin(0, 0.5).setDepth(101);
    
    this.powerBarFill = this.add.rectangle(250, h - 60, UI_CONFIG.powerBarWidth * 0.5, UI_CONFIG.powerBarHeight, 0x4ade80)
      .setScrollFactor(0).setOrigin(0, 0.5).setDepth(101);
    
    this.powerText = this.add.text(250, h - 60, '50%', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      color: '#f8fafc',
    }).setScrollFactor(0).setOrigin(0.5).setDepth(101);
    
    this.playerHpBar = this.add.rectangle(w / 2 - 220, h - 100, UI_CONFIG.hpBarWidth, UI_CONFIG.hpBarHeight, 0x334155)
      .setScrollFactor(0).setOrigin(0, 0.5).setDepth(101);
    this.playerHpFill = this.add.rectangle(w / 2 - 220, h - 100, UI_CONFIG.hpBarWidth, UI_CONFIG.hpBarHeight, 0x4ade80)
      .setScrollFactor(0).setOrigin(0, 0.5).setDepth(101);
    this.add.text(w / 2 - 310, h - 100, 'VOCÊ', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#f8fafc',
    }).setScrollFactor(0).setOrigin(1, 0.5).setDepth(101);
    
    this.cpuHpBar = this.add.rectangle(w / 2 + 30, h - 100, UI_CONFIG.hpBarWidth, UI_CONFIG.hpBarHeight, 0x334155)
      .setScrollFactor(0).setOrigin(0, 0.5).setDepth(101);
    this.cpuHpFill = this.add.rectangle(w / 2 + 30, h - 100, UI_CONFIG.hpBarWidth, UI_CONFIG.hpBarHeight, 0xef4444)
      .setScrollFactor(0).setOrigin(0, 0.5).setDepth(101);
    this.add.text(w / 2 + 230, h - 100, 'INIMIGO', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#f8fafc',
    }).setScrollFactor(0).setOrigin(0, 0.5).setDepth(101);
    
    this.abilityCooldownBg = this.add.graphics().setScrollFactor(0).setDepth(101);
    this.abilityIcon = this.add.image(w - 100, h - 60, 'ui_ability_icon')
      .setScale(0.8)
      .setScrollFactor(0)
      .setDepth(101)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.events.emit(GAME_EVENTS.ABILITY_USED, { requestedBy: 'player' }));
    
    this.abilityCooldownText = this.add.text(w - 100, h - 60, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      color: '#f8fafc',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setScrollFactor(0).setOrigin(0.5).setDepth(102);
    
    this.add.text(w - 250, h - 60, '[ESPACO] Carregar  [↑↓] Mirar  [←→] Mover  [SHIFT] Habilidade', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#94a3b8',
    }).setScrollFactor(0).setOrigin(1, 0.5).setDepth(101);
  }

  private setupEventListeners(): void {
    this.game.events.on(GAME_EVENTS.WIND_CHANGE, (data: { wind: number }) => {
      this.currentWind = data.wind;
      this.updateWindDisplay();
    });
    
    this.game.events.on(GAME_EVENTS.TURN_START, (data: { turn: 'player' | 'cpu'; turnNumber: number }) => {
      this.currentTurn = data.turn;
      this.turnNumber = data.turnNumber;
      this.updateTurnDisplay();
    });
    
    this.game.events.on(GAME_EVENTS.PHASE_CHANGE, (data: { phase: string }) => {
      // Phase change handled by BattleScene
    });
    
    this.game.events.on(GAME_EVENTS.PLAYER_SHOT, () => {
      // Shot fired
    });
    
    this.game.events.on(GAME_EVENTS.DAMAGE_DEALT, (data: { target: string; damage: number }) => {
      if (data.target === 'player') {
        this.playerHp = Math.max(0, this.playerHp - data.damage);
      } else if (data.target === 'cpu') {
        this.cpuHp = Math.max(0, this.cpuHp - data.damage);
      }
      this.updateHpBars();
    });
    
    this.game.events.on(GAME_EVENTS.ABILITY_USED, (data: { abilityId: string; cooldown?: number }) => {
      if (data.cooldown) {
        this.abilityCooldown = data.cooldown;
        this.maxAbilityCooldown = data.cooldown;
        this.updateAbilityCooldown();
      }
    });
    
    this.game.events.on(GAME_EVENTS.BATTLE_END, () => {
      // Battle ended
    });
  }

  update(time: number, delta: number): void {
    if (this.abilityCooldown > 0) {
      this.abilityCooldown -= delta / 1000;
      if (this.abilityCooldown < 0) this.abilityCooldown = 0;
      this.updateAbilityCooldown();
    }
  }

  public updateWind(wind: number): void {
    this.currentWind = wind;
    this.updateWindDisplay();
  }

  public updateTurn(turn: 'player' | 'cpu', turnNumber: number): void {
    this.currentTurn = turn;
    this.turnNumber = turnNumber;
    this.updateTurnDisplay();
  }

  public updateAngle(angle: number): void {
    this.playerAngle = angle;
    this.angleText.setText(`ÂNGULO: ${angle}°`);
  }

  public updatePower(power: number): void {
    this.playerPower = power;
    this.powerBarFill.width = UI_CONFIG.powerBarWidth * (power / 100);
    this.powerText.setText(`${Math.round(power)}%`);
  }

  public updateHp(playerHp: number, playerMaxHp: number, cpuHp: number, cpuMaxHp: number): void {
    this.playerHp = playerHp;
    this.playerMaxHp = playerMaxHp;
    this.cpuHp = cpuHp;
    this.cpuMaxHp = cpuMaxHp;
    this.updateHpBars();
  }

  public setAbilityCooldown(cooldown: number): void {
    this.abilityCooldown = cooldown;
    this.maxAbilityCooldown = cooldown;
    this.updateAbilityCooldown();
  }

  private updateWindDisplay(): void {
    this.windText.setText(`VENTO: ${this.currentWind >= 0 ? '→' : '←'} ${Math.abs(this.currentWind).toFixed(1)}`);
    this.windText.setColor(this.currentWind >= 0 ? '#60a5fa' : '#f87171');
  }

  private updateTurnDisplay(): void {
    this.turnText.setText(`TURNO ${this.turnNumber} - ${this.currentTurn === 'player' ? 'VOCÊ' : 'INIMIGO'}`);
    this.turnText.setColor(this.currentTurn === 'player' ? '#4ade80' : '#f87171');
  }

  private updateHpBars(): void {
    const playerPct = this.playerHp / this.playerMaxHp;
    const cpuPct = this.cpuHp / this.cpuMaxHp;
    
    this.playerHpFill.width = UI_CONFIG.hpBarWidth * playerPct;
    this.cpuHpFill.width = UI_CONFIG.hpBarWidth * cpuPct;
    
    const playerColor = playerPct > 0.5 ? 0x4ade80 : playerPct > 0.25 ? 0xfbbf24 : 0xef4444;
    const cpuColor = cpuPct > 0.5 ? 0xef4444 : cpuPct > 0.25 ? 0xfbbf24 : 0x4ade80;
    
    this.playerHpFill.setFillStyle(playerColor);
    this.cpuHpFill.setFillStyle(cpuColor);
  }

  private updateAbilityCooldown(): void {
    this.abilityCooldownBg.clear();
    
    if (this.abilityCooldown > 0) {
      const pct = this.abilityCooldown / this.maxAbilityCooldown;
      const cam = this.cameras.main;
      const x = cam.width - 100;
      const y = cam.height - 60;
      const radius = 28;
      
      this.abilityCooldownBg.fillStyle(0x000000, 0.7);
      this.abilityCooldownBg.slice(x, y, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - pct), true);
      this.abilityCooldownBg.fillPath();
      
      this.abilityCooldownText.setText(Math.ceil(this.abilityCooldown).toString());
    } else {
      this.abilityCooldownText.setText('');
    }
  }
}