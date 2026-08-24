import * as Phaser from 'phaser';
import { LEVELS, getLevel, REGIONS, REGION_ORDER, RegionId, LevelConfig } from '../data/levels';
import { GAME_EVENTS } from '../config/phaser';
import { useGameStore } from '@/stores/gameStore';

interface WorldMapSceneData {
  unlockedLevels: string[];
  completedLevels: Record<string, { stars: number; bestTurns: number; bestDamage: number }>;
  currentLevelId?: string;
}

type LevelState = 'locked' | 'available' | 'completed' | 'perfect' | 'boss' | 'boss_completed' | 'boss_perfect';

export class WorldMapScene extends Phaser.Scene {
  private mapContainer!: Phaser.GameObjects.Container;
  private backgroundLayers: Phaser.GameObjects.GameObject[] = [];
  private levelNodes: Map<number, LevelNode> = new Map();
  private pathGraphics!: Phaser.GameObjects.Graphics;
  private particleEmitters: Map<number, Phaser.GameObjects.Particles.ParticleEmitter> = new Map();
  
  private unlockedLevels: string[] = [];
  private completedLevels: Record<string, { stars: number; bestTurns: number; bestDamage: number }> = {};
  private currentLevelId?: string;
  
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private containerStartX = 0;
  private containerStartY = 0;
  private zoomLevel = 1;
  private minZoom = 0.5;
  private maxZoom = 2;
  
  private selectedNode: LevelNode | null = null;
  private levelInfoPanel?: Phaser.GameObjects.Container;
  
  private parallaxOffset = 0;

  constructor() {
    super({ key: 'WorldMapScene' });
  }

  init(data: WorldMapSceneData): void {
    const registryData = this.registry.get('worldMapData');
    if (registryData) {
      this.unlockedLevels = registryData.unlockedLevels || ['arena_1'];
      this.completedLevels = registryData.completedLevels || {};
      this.currentLevelId = registryData.currentLevelId;
    } else {
      this.unlockedLevels = data.unlockedLevels || ['arena_1'];
      this.completedLevels = data.completedLevels || {};
      this.currentLevelId = data.currentLevelId;
    }
  }

  preload(): void {
    this.load.setPath('/maps/');
    this.load.image('world_bg_sky', 'world_sky.svg');
    this.load.image('world_bg_mountains', 'world_mountains.svg');
    this.load.image('world_bg_trees', 'world_trees.svg');
    this.load.image('world_bg_crystals', 'world_crystals.svg');
    this.load.setPath('/ui/');
    this.load.image('node_locked', 'node_locked.svg');
    this.load.image('node_available', 'node_available.svg');
    this.load.image('node_completed', 'node_completed.svg');
    this.load.image('node_perfect', 'node_perfect.svg');
    this.load.image('node_boss', 'node_boss.svg');
    this.load.image('node_boss_completed', 'node_boss_completed.svg');
    this.load.image('node_boss_perfect', 'node_boss_perfect.svg');
    this.load.setPath('/effects/');
    this.load.image('particle_star', 'star.svg');
    this.load.image('particle_spark', 'spark.svg');
    this.load.image('particle_leaf', 'leaf.svg');
    this.load.setPath('/ui/');
    this.load.image('ui_panel', 'panel.svg');
  }

  create(): void {
    this.setupCamera();
    this.createBackground();
    this.createMapContainer();
    this.createPaths();
    this.createLevelNodes();
    this.createLevelInfoPanel();
    this.setupInput();
    this.setupEvents();
    this.focusOnCurrentLevel();
    this.animateEntrance();
    this.game.events.emit('world-map-ready');
  }

  private setupCamera(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBounds(0, 0, 3840, 2160);
    this.cameras.main.centerOn(width / 2, height / 2);
  }

  private createBackground(): void {
    const region = REGIONS.green_valley;
    const colors = this.getRegionColors(region.theme);
    
    this.cameras.main.setBackgroundColor(colors.bg);
    
    const sky = this.add.rectangle(1920, 1080, 3840, 2160, colors.sky).setDepth(-100);
    this.backgroundLayers.push(sky);
    
    const mountains = this.add.graphics().setDepth(-50);
    this.drawMountains(mountains, colors.mountains);
    this.backgroundLayers.push(mountains);
    
    const ground = this.add.graphics().setDepth(-10);
    this.drawGround(ground, colors.ground);
    this.backgroundLayers.push(ground);
    
    this.addEnvironmentAnimations(region.theme);
  }

  private getRegionColors(theme: string) {
    const themes: Record<string, { bg: number; sky: number; mountains: number; ground: number }> = {
      nature: { bg: 0x0f172a, sky: 0x1e3a2e, mountains: 0x166534, ground: 0x14532d },
      desert: { bg: 0x1c1917, sky: 0x3d2914, mountains: 0x78350f, ground: 0x92400e },
      ice: { bg: 0x0c1a2e, sky: 0x164e63, mountains: 0x0369a1, ground: 0x075985 },
      fire: { bg: 0x1c1917, sky: 0x3d1a1a, mountains: 0x9a3412, ground: 0xc2410c },
      sky: { bg: 0x0c1a2e, sky: 0x1e1b4b, mountains: 0x3730a3, ground: 0x4338ca },
      void: { bg: 0x0a0a0a, sky: 0x18181b, mountains: 0x3f3f46, ground: 0x52525b },
    };
    return themes[theme] || themes.nature;
  }

  private drawMountains(graphics: Phaser.GameObjects.Graphics, color: number): void {
    graphics.fillStyle(color, 0.6);
    graphics.beginPath();
    graphics.moveTo(0, 1800);
    for (let x = 0; x <= 3840; x += 100) {
      const y = 1800 - Math.sin(x * 0.002) * 200 - Math.sin(x * 0.005) * 100 + Math.random() * 50;
      graphics.lineTo(x, y);
    }
    graphics.lineTo(3840, 2160);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.fillStyle(color, 0.4);
    graphics.beginPath();
    graphics.moveTo(0, 1600);
    for (let x = 0; x <= 3840; x += 80) {
      const y = 1600 - Math.sin(x * 0.003) * 150 - Math.sin(x * 0.007) * 80;
      graphics.lineTo(x, y);
    }
    graphics.lineTo(3840, 2160);
    graphics.closePath();
    graphics.fillPath();
  }

  private drawGround(graphics: Phaser.GameObjects.Graphics, color: number): void {
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 1900, 3840, 260);
    
    graphics.fillStyle(Phaser.Display.Color.ValueToColor(color).brighten(20).color, 0.5);
    graphics.beginPath();
    graphics.moveTo(0, 1900);
    for (let x = 0; x <= 3840; x += 50) {
      graphics.lineTo(x, 1900 - Math.sin(x * 0.01) * 20);
    }
    graphics.lineTo(3840, 2160);
    graphics.lineTo(0, 2160);
    graphics.closePath();
    graphics.fillPath();
  }

  private addEnvironmentAnimations(theme: string): void {
    const animations = LEVELS
      .filter(l => l.regionId === 'green_valley')
      .flatMap(l => l.environmentAnimations);
    
    animations.forEach(anim => {
      if (anim.type === 'particles') {
        this.createParticleEffect(anim.config);
      }
    });
  }

  private createParticleEffect(config: Record<string, unknown>): void {
    const { type, count, color, speed } = config;
    const particles = this.add.particles(0, 0, 'particle_star', {
      x: { min: 0, max: 3840 },
      y: { min: 100, max: 1800 },
      lifespan: { min: 10000, max: 20000 },
      speedX: { min: -20 * (speed as number), max: 20 * (speed as number) },
      speedY: { min: -10 * (speed as number), max: 10 * (speed as number) },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.6, end: 0 },
      tint: Phaser.Display.Color.HexStringToColor(color as string).color,
      quantity: count as number,
      blendMode: 'ADD',
      emitting: true,
    });
    particles.setDepth(-5);
  }

  private createMapContainer(): void {
    this.mapContainer = this.add.container(0, 0);
    this.pathGraphics = this.add.graphics().setDepth(5);
    this.mapContainer.add(this.pathGraphics);
  }

  private createPaths(): void {
    const regionLevels = LEVELS.filter(l => l.regionId === 'green_valley').sort((a, b) => a.id - b.id);
    
    this.pathGraphics.clear();
    this.pathGraphics.lineStyle(4, 0x4ade80, 0.8);
    
    regionLevels.forEach((level, index) => {
      if (index === 0) return;
      
      const prevLevel = regionLevels[index - 1];
      const nextLevel = level;
      
      if (!prevLevel.pathToNext) return;
      
      const start = prevLevel.nodePosition;
      const end = nextLevel.nodePosition;
      const control = {
        x: prevLevel.pathToNext.controlX || (start.x + end.x) / 2,
        y: prevLevel.pathToNext.controlY || (start.y + end.y) / 2 - 100,
      };
      
      const isUnlocked = this.unlockedLevels.includes(nextLevel.arenaId);
      const isCompleted = !!this.completedLevels[nextLevel.arenaId];
      
      this.pathGraphics.lineStyle(
        4,
        isCompleted ? 0x4ade80 : isUnlocked ? 0xfbbf24 : 0x475569,
        isCompleted || isUnlocked ? 0.8 : 0.3
      );
      
      this.pathGraphics.beginPath();
      this.pathGraphics.moveTo(start.x, start.y);
      this.drawQuadraticCurve(this.pathGraphics, start, control, end);
      this.pathGraphics.strokePath();
      
      if (isCompleted) {
        this.addPathParticles(start, end, control);
      }
    });
    this.mapContainer.add(this.pathGraphics);
  }

  private addPathParticles(start: { x: number; y: number }, end: { x: number; y: number }, control: { x: number; y: number }): void {
    const particles = this.add.particles(start.x, start.y, 'particle_spark', {
      lifespan: 2000,
      speed: 100,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: 0x4ade80,
      quantity: 1,
      frequency: 300,
      blendMode: 'ADD',
      emitting: true,
      follow: this.createPathFollower(start, end, control),
    });
    particles.setDepth(6);
    this.particleEmitters.set(end.x * 1000 + end.y, particles);
  }

  private createPathFollower(start: { x: number; y: number }, end: { x: number; y: number }, control: { x: number; y: number }): Phaser.GameObjects.PathFollower {
    const curve = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(start.x, start.y),
      new Phaser.Math.Vector2(control.x, control.y),
      new Phaser.Math.Vector2(end.x, end.y)
    );
    const path = new Phaser.Curves.Path(start.x, start.y);
    path.add(curve);
    const follower = this.add.follower(path, start.x, start.y, 'particle_spark');
    follower.startFollow(10000);
    return follower;
  }

  private createLevelNodes(): void {
    const regionLevels = LEVELS.filter(l => l.regionId === 'green_valley').sort((a, b) => a.id - b.id);
    
    regionLevels.forEach((level, index) => {
      const state = this.getLevelState(level);
      const node = new LevelNode(this, level, state, index === 0);
      this.levelNodes.set(level.id, node);
      this.mapContainer.add(node.container);
    });
  }

  private getLevelState(level: LevelConfig): LevelState {
    const arenaId = level.arenaId;
    const isUnlocked = this.unlockedLevels.includes(arenaId);
    const completed = this.completedLevels[arenaId];
    const stars = completed?.stars || 0;
    const isPerfect = stars === 3;
    
    if (!isUnlocked) return 'locked';
    if (level.isBoss) {
      if (completed) return isPerfect ? 'boss_perfect' : 'boss_completed';
      return 'boss';
    }
    if (completed) return isPerfect ? 'perfect' : 'completed';
    return 'available';
  }

  private createLevelInfoPanel(): void {
    const { width, height } = this.scale;
    this.levelInfoPanel = this.add.container(width - 300, 100).setDepth(50).setScrollFactor(0).setVisible(false);
    
    const panelBg = this.add.rectangle(0, 0, 280, 300, 0x0f172a, 0.95).setStrokeStyle(2, 0x4ade80);
    const title = this.add.text(0, -120, '', { fontSize: '18px', color: '#f8fafc', fontStyle: 'bold' }).setOrigin(0.5);
    const desc = this.add.text(0, -80, '', { fontSize: '14px', color: '#94a3b8', wordWrap: { width: 260 } }).setOrigin(0.5);
    const difficulty = this.add.text(0, -20, '', { fontSize: '14px', color: '#fbbf24' }).setOrigin(0.5);
    const starsText = this.add.text(0, 20, '', { fontSize: '14px', color: '#f8fafc' }).setOrigin(0.5);
    const rewardsText = this.add.text(0, 60, '', { fontSize: '13px', color: '#4ade80' }).setOrigin(0.5);
    const startBtn = this.add.rectangle(0, 120, 200, 40, 0x4ade80).setInteractive({ useHandCursor: true });
    const startBtnText = this.add.text(0, 120, 'INICIAR', { fontSize: '16px', color: '#0f172a', fontStyle: 'bold' }).setOrigin(0.5);
    
    startBtn.on('pointerdown', () => this.startSelectedLevel());
    startBtn.on('pointerover', () => startBtn.setFillStyle(0x22c55e));
    startBtn.on('pointerout', () => startBtn.setFillStyle(0x4ade80));
    
    this.levelInfoPanel.add([panelBg, title, desc, difficulty, starsText, rewardsText, startBtn, startBtnText]);
    this.levelInfoPanel.setData('title', title);
    this.levelInfoPanel.setData('desc', desc);
    this.levelInfoPanel.setData('difficulty', difficulty);
    this.levelInfoPanel.setData('stars', starsText);
    this.levelInfoPanel.setData('rewards', rewardsText);
    this.levelInfoPanel.setData('startBtn', startBtn);
  }

  private setupInput(): void {
    this.input.on('wheel', (pointer: Phaser.Input.Pointer, _: any, __: any, deltaY: number) => {
      this.handleZoom(deltaY > 0 ? -0.1 : 0.1, pointer.x, pointer.y);
    });
    
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0 || pointer.buttons === 1) {
        this.startDrag(pointer);
      }
    });
    
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        this.drag(pointer);
      }
    });
    
    this.input.on('pointerup', () => {
      this.endDrag();
    });
    
    this.input.keyboard?.on('keydown-ESC', () => this.closeLevelInfo());
    this.input.keyboard?.on('keydown-PLUS', () => this.handleZoom(0.1, this.scale.width / 2, this.scale.height / 2));
    this.input.keyboard?.on('keydown-MINUS', () => this.handleZoom(-0.1, this.scale.width / 2, this.scale.height / 2));
    
    if (this.sys.game.device.os.android || this.sys.game.device.os.iOS) {
      this.setupTouchGestures();
    }
  }

  private setupTouchGestures(): void {
    let lastDist = 0;
    let lastCenter = { x: 0, y: 0 };
    let activePointers: Phaser.Input.Pointer[] = [];
    
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      activePointers.push(pointer);
      if (activePointers.length === 2) {
        const p1 = activePointers[0];
        const p2 = activePointers[1];
        lastDist = Phaser.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);
        lastCenter = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      }
    });
    
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      activePointers = activePointers.filter(p => p !== pointer);
    });
    
    this.input.on('pointermove', () => {
      if (activePointers.length === 2) {
        const p1 = activePointers[0];
        const p2 = activePointers[1];
        const dist = Phaser.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);
        const center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        
        const zoomDelta = (dist - lastDist) * 0.005;
        this.handleZoom(zoomDelta, center.x, center.y);
        
        if (!this.isDragging) {
          const dx = center.x - lastCenter.x;
          const dy = center.y - lastCenter.y;
          this.mapContainer.x -= dx / this.zoomLevel;
          this.mapContainer.y -= dy / this.zoomLevel;
        }
        
        lastDist = dist;
        lastCenter = center;
      }
    });
  }

  private startDrag(pointer: Phaser.Input.Pointer): void {
    const node = this.getNodeAt(pointer.x, pointer.y);
    if (node && node.level.isBoss) return;
    
    this.isDragging = true;
    this.dragStartX = pointer.x;
    this.dragStartY = pointer.y;
    this.containerStartX = this.mapContainer.x;
    this.containerStartY = this.mapContainer.y;
  }

  private drag(pointer: Phaser.Input.Pointer): void {
    if (!this.isDragging) return;
    
    const dx = (pointer.x - this.dragStartX) / this.zoomLevel;
    const dy = (pointer.y - this.dragStartY) / this.zoomLevel;
    
    this.mapContainer.x = Phaser.Math.Clamp(this.containerStartX + dx, -1920, 1920);
    this.mapContainer.y = Phaser.Math.Clamp(this.containerStartY + dy, -1080, 1080);
  }

  private endDrag(): void {
    this.isDragging = false;
  }

  private handleZoom(delta: number, centerX: number, centerY: number): void {
    const newZoom = Phaser.Math.Clamp(this.zoomLevel + delta, this.minZoom, this.maxZoom);
    const zoomRatio = newZoom / this.zoomLevel;
    
    this.mapContainer.x = centerX - (centerX - this.mapContainer.x) * zoomRatio;
    this.mapContainer.y = centerY - (centerY - this.mapContainer.y) * zoomRatio;
    this.mapContainer.setScale(newZoom);
    
    this.zoomLevel = newZoom;
  }

  private getNodeAt(x: number, y: number): LevelNode | null {
    const worldX = (x - this.mapContainer.x) / this.zoomLevel;
    const worldY = (y - this.mapContainer.y) / this.zoomLevel;
    
    for (const node of this.levelNodes.values()) {
      const dx = worldX - node.container.x;
      const dy = worldY - node.container.y;
      if (Math.sqrt(dx * dx + dy * dy) < 50) {
        return node;
      }
    }
    return null;
  }

  private drawQuadraticCurve(
    graphics: Phaser.GameObjects.Graphics,
    start: { x: number; y: number },
    control: { x: number; y: number },
    end: { x: number; y: number },
    segments: number = 20
  ): void {
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const invT = 1 - t;
      const x = invT * invT * start.x + 2 * invT * t * control.x + t * t * end.x;
      const y = invT * invT * start.y + 2 * invT * t * control.y + t * t * end.y;
      graphics.lineTo(x, y);
    }
  }

  private setupEvents(): void {
    this.events.on(GAME_EVENTS.LEVEL_COMPLETE, (data: { levelId: string; stars: number }) => {
      this.onLevelComplete(data.levelId, data.stars);
    });
    
    this.events.on('select-level', (levelId: number) => {
      this.selectLevel(levelId);
    });
  }

  private selectLevel(levelId: number): void {
    const level = getLevel(levelId);
    const node = this.levelNodes.get(levelId);
    if (!level || !node) return;
    
    this.closeLevelInfo();
    this.selectedNode = node;
    
    const state = this.getLevelState(level);
    const isPlayable = state !== 'locked';
    
    const panel = this.levelInfoPanel!;
    panel.getData('title').setText(level.name);
    panel.getData('desc').setText(this.getLevelDescription(level));
    panel.getData('difficulty').setText(`Dificuldade: ${this.getDifficultyLabel(level.difficulty)}`);
    
    const completed = this.completedLevels[level.arenaId];
    const stars = completed?.stars || 0;
    panel.getData('stars').setText(`Estrelas: ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`);
    
    const rewards = level.rewards;
    panel.getData('rewards').setText(
      `Recompensa: ${rewards.baseCurrency} moedas\n` +
      `⭐ 3: +${rewards.starThresholds.currency[0]} | ⭐⭐ 2: +${rewards.starThresholds.currency[1]} | ⭐ 1: +${rewards.starThresholds.currency[2]}`
    );
    
    panel.getData('startBtn').setVisible(isPlayable);
    panel.setVisible(true);
    
    this.tweens.add({
      targets: panel,
      alpha: { from: 0, to: 1 },
      x: { from: panel.x + 50, to: panel.x },
      duration: 300,
      ease: 'Back.easeOut',
    });
    
    this.highlightPathToNode(node);
  }

  private getLevelDescription(level: LevelConfig): string {
    const descriptions: Record<string, string> = {
      arena_1: 'Terreno plano com poucas elevações. Ideal para aprender os fundamentos.',
      arena_2: 'Ventos fortes e imprevisíveis. Plataformas elevadas criam oportunidades táticas.',
      arena_3: 'Múltiplas plataformas móveis. Requer precisão e timing perfeitos.',
      arena_4: 'Cristais brilhantes alteram a física. Use-os a seu favor.',
      boss_1: 'Chefe da região. Combate em múltiplas fases com mecânicas únicas.',
    };
    return descriptions[level.arenaId] || 'Fase desconhecida.';
  }

  private getDifficultyLabel(diff: string): string {
    const labels: Record<string, string> = { easy: 'Fácil', normal: 'Normal', hard: 'Difícil' };
    return labels[diff] || diff;
  }

  private highlightPathToNode(node: LevelNode): void {
    this.pathGraphics.clear();
    this.createPaths();
    
    this.pathGraphics.lineStyle(6, 0x4ade80, 1);
    this.pathGraphics.beginPath();
    this.pathGraphics.moveTo(node.container.x, node.container.y);
    this.pathGraphics.lineTo(node.container.x, node.container.y - 100);
    this.pathGraphics.strokePath();
  }

  private closeLevelInfo(): void {
    if (this.levelInfoPanel?.visible) {
      this.tweens.add({
        targets: this.levelInfoPanel,
        alpha: 0,
        x: this.levelInfoPanel.x + 50,
        duration: 200,
        ease: 'Back.easeIn',
        onComplete: () => this.levelInfoPanel?.setVisible(false),
      });
      this.selectedNode = null;
      this.pathGraphics.clear();
      this.createPaths();
    }
  }

  private startSelectedLevel(): void {
    if (!this.selectedNode) return;
    
    const level = this.selectedNode.level;
    this.game.events.emit('start-battle', {
      levelId: level.arenaId,
      levelNumber: level.id,
      difficulty: level.difficulty,
      cpuCharacterId: level.cpuCharacterId,
    });
  }

  private onLevelComplete(levelId: string, stars: number): void {
    const level = LEVELS.find(l => l.arenaId === levelId);
    if (!level) return;
    
    const node = this.levelNodes.get(level.id);
    if (!node) return;
    
    const isPerfect = stars === 3;
    const newState: LevelState = level.isBoss ? (isPerfect ? 'boss_perfect' : 'boss_completed') : (isPerfect ? 'perfect' : 'completed');
    
    node.updateState(newState);
    this.playUnlockAnimation(level.id);
    
    const nextLevel = getLevel(level.id + 1);
    if (nextLevel) {
      setTimeout(() => this.unlockNextLevel(nextLevel), 1500);
    }
    
    this.createPaths();
  }

  private playUnlockAnimation(levelId: number): void {
    const node = this.levelNodes.get(levelId);
    if (!node) return;
    
    this.tweens.add({
      targets: node.container,
      scale: { from: 1, to: 1.3 },
      duration: 300,
      yoyo: true,
      ease: 'Back.easeOut',
    });
    
    const particles = this.add.particles(node.container.x, node.container.y, 'particle_star', {
      lifespan: 1000,
      speed: { min: 50, max: 150 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: 0x4ade80,
      quantity: 20,
      blendMode: 'ADD',
      emitting: true,
    });
    particles.setDepth(20);
    
    this.time.delayedCall(1000, () => particles.destroy());
    
    this.sound.play('sfx_unlock', { volume: 0.5 });
  }

  private unlockNextLevel(nextLevel: LevelConfig): void {
    if (this.unlockedLevels.includes(nextLevel.arenaId)) return;
    
    this.unlockedLevels.push(nextLevel.arenaId);
    
    const node = this.levelNodes.get(nextLevel.id);
    if (!node) return;
    
    node.updateState('available');
    
    this.tweens.add({
      targets: node.container,
      scale: { from: 0.5, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 500,
      ease: 'Back.easeOut',
    });
    
    const pathIndex = LEVELS.findIndex(l => l.id === nextLevel.id) - 1;
    if (pathIndex >= 0) {
      this.animatePathDraw(pathIndex);
    }
    
    this.sound.play('sfx_unlock', { volume: 0.6 });
  }

  private animatePathDraw(pathIndex: number): void {
    const regionLevels = LEVELS.filter(l => l.regionId === 'green_valley').sort((a, b) => a.id - b.id);
    if (pathIndex < 0 || pathIndex >= regionLevels.length - 1) return;
    
    const prevLevel = regionLevels[pathIndex];
    const nextLevel = regionLevels[pathIndex + 1];
    if (!prevLevel.pathToNext) return;
    
    const start = prevLevel.nodePosition;
    const end = nextLevel.nodePosition;
    const control = {
      x: prevLevel.pathToNext.controlX || (start.x + end.x) / 2,
      y: prevLevel.pathToNext.controlY || (start.y + end.y) / 2 - 100,
    };
    
    const drawGraphics = this.add.graphics().setDepth(7);
    drawGraphics.lineStyle(6, 0x4ade80, 1);
    
    const path = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(start.x, start.y),
      new Phaser.Math.Vector2(control.x, control.y),
      new Phaser.Math.Vector2(end.x, end.y)
    );
    
    const points = path.getPoints(50);
    let currentPoint = 0;
    
    this.tweens.add({
      targets: { point: 0 },
      point: points.length - 1,
      duration: 800,
      ease: 'Sine.easeOut',
      onUpdate: (tween) => {
        const progress = tween.getValue();
        const idx = Math.floor(progress);
        if (idx > currentPoint && idx < points.length) {
          drawGraphics.clear();
          drawGraphics.lineStyle(6, 0x4ade80, 1);
          drawGraphics.beginPath();
          drawGraphics.moveTo(points[0].x, points[0].y);
          for (let i = 1; i <= idx; i++) {
            drawGraphics.lineTo(points[i].x, points[i].y);
          }
          drawGraphics.strokePath();
          currentPoint = idx;
        }
      },
      onComplete: () => {
        drawGraphics.destroy();
        this.createPaths();
      },
    });
  }

  private focusOnCurrentLevel(): void {
    let targetLevelId = this.currentLevelId ? parseInt(this.currentLevelId.replace('arena_', '')) : 1;
    if (this.currentLevelId === 'boss_1') targetLevelId = 5;
    
    const targetLevel = getLevel(targetLevelId);
    if (!targetLevel) return;
    
    const node = this.levelNodes.get(targetLevelId);
    if (!node) return;
    
    const { width, height } = this.scale;
    const targetX = width / 2 - node.container.x * this.zoomLevel;
    const targetY = height / 2 - node.container.y * this.zoomLevel;
    
    this.mapContainer.x = targetX;
    this.mapContainer.y = targetY;
  }

  private animateEntrance(): void {
    this.mapContainer.setAlpha(0);
    this.mapContainer.setScale(0.8);
    
    this.tweens.add({
      targets: this.mapContainer,
      alpha: 1,
      scale: 1,
      duration: 800,
      ease: 'Back.easeOut',
    });
    
    let delay = 0;
    this.levelNodes.forEach((node, levelId) => {
      const level = getLevel(levelId);
      if (!level) return;
      
      node.container.setAlpha(0);
      node.container.setScale(0.5);
      
      this.time.delayedCall(delay, () => {
        this.tweens.add({
          targets: node.container,
          alpha: 1,
          scale: 1,
          duration: 400,
          ease: 'Back.easeOut',
        });
      });
      
      delay += 100;
    });
  }

  update(time: number, delta: number): void {
    this.parallaxOffset += delta * 0.0001;
    
    this.backgroundLayers.forEach((layer, index) => {
      if (layer instanceof Phaser.GameObjects.Image) {
        layer.x = 1920 + Math.sin(this.parallaxOffset + index) * 50 * (index + 1) * 0.1;
      }
    });
    
    this.levelNodes.forEach(node => {
      if (node.state === 'available' || node.state === 'boss') {
        node.pulseAnimation(time);
      }
    });
  }

  public refreshData(data: WorldMapSceneData): void {
    this.unlockedLevels = data.unlockedLevels || ['arena_1'];
    this.completedLevels = data.completedLevels || {};
    this.currentLevelId = data.currentLevelId;
    
    this.levelNodes.forEach((node, levelId) => {
      const level = getLevel(levelId);
      if (!level) return;
      const newState = this.getLevelState(level);
      if (node.state !== newState) {
        node.updateState(newState);
      }
    });
    
    this.pathGraphics.clear();
    this.createPaths();
  }
}

class LevelNode {
  public container: Phaser.GameObjects.Container;
  public level: LevelConfig;
  public state: LevelState;
  private sprite: Phaser.GameObjects.Image;
  private starContainer: Phaser.GameObjects.Container;
  private pulseTween?: Phaser.Tweens.Tween;
  private glowGraphics?: Phaser.GameObjects.Graphics;

  constructor(scene: WorldMapScene, level: LevelConfig, state: LevelState, isFirst: boolean) {
    this.level = level;
    this.state = state;
    
    this.container = scene.add.container(level.nodePosition.x, level.nodePosition.y);
    this.container.setSize(100, 100).setInteractive();
    
    this.sprite = scene.add.image(0, 0, this.getTextureKey(state)).setScale(1.5);
    this.container.add(this.sprite);
    
    this.starContainer = scene.add.container(0, 50);
    this.container.add(this.starContainer);
    
    if (level.isBoss) {
      const crown = scene.add.text(0, -55, '👑', { fontSize: '24px' }).setOrigin(0.5);
      this.container.add(crown);
    }
    
    this.setupInteraction(scene);
    
    if (!isFirst && state === 'locked') {
      this.container.setAlpha(0.4);
      this.container.setScale(0.8);
    }
  }

  private getTextureKey(state: LevelState): string {
    const keys: Record<LevelState, string> = {
      locked: 'node_locked',
      available: 'node_available',
      completed: 'node_completed',
      perfect: 'node_perfect',
      boss: 'node_boss',
      boss_completed: 'node_boss_completed',
      boss_perfect: 'node_boss_perfect',
    };
    return keys[state] || 'node_locked';
  }

  private setupInteraction(scene: WorldMapScene): void {
    this.container.on('pointerover', () => {
      if (this.state !== 'locked') {
        scene.tweens.add({
          targets: this.container,
          scale: 1.2,
          duration: 150,
          ease: 'Back.easeOut',
        });
        this.startPulse(scene);
      }
    });
    
    this.container.on('pointerout', () => {
      if (this.state !== 'locked') {
        scene.tweens.add({
          targets: this.container,
          scale: 1,
          duration: 150,
          ease: 'Back.easeIn',
        });
        this.stopPulse();
      }
    });
    
    this.container.on('pointerdown', () => {
      if (this.state !== 'locked') {
        scene.events.emit('select-level', this.level.id);
      }
    });
  }

  private startPulse(scene: WorldMapScene): void {
    this.stopPulse();
    this.pulseTween = scene.tweens.add({
      targets: this.sprite,
      scale: { from: 1.5, to: 1.7 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private stopPulse(): void {
    if (this.pulseTween) {
      this.pulseTween.stop();
      this.pulseTween = undefined;
    }
    if (this.sprite) {
      this.sprite.setScale(1.5);
    }
  }

  public pulseAnimation(time: number): void {
    if ((this.state === 'available' || this.state === 'boss') && !this.pulseTween) {
      this.sprite.setScale(1.5 + Math.sin(time * 0.003) * 0.1);
    }
  }

  public updateState(newState: LevelState): void {
    this.state = newState;
    this.sprite.setTexture(this.getTextureKey(newState));
    
    this.starContainer.removeAll(true);
    const completed = useGameStore.getState().completedLevels[this.level.arenaId];
    const stars = completed?.stars || 0;
    
    if (stars > 0 && !this.level.isBoss) {
      for (let i = 0; i < stars; i++) {
        const star = this.container.scene.add.image((i - 1) * 20, 0, 'particle_star').setScale(0.6).setTint(0xfbbf24);
        this.starContainer.add(star);
      }
    }
    
    if (newState === 'locked') {
      this.container.setAlpha(0.4);
      this.container.setScale(0.8);
    } else {
      this.container.setAlpha(1);
      this.container.setScale(1);
    }
  }
}