import * as Phaser from 'phaser';
import { CHARACTERS } from '../characters/registry';
import { 
  calculateTrajectory, 
  calculateDamage, 
  generateInitialWind,
  getProjectilePhysicsConfig
} from '../physics/Ballistics';
import { PHYSICS_CONFIG, COMBAT_CONFIG, TURN_CONFIG } from '../config/game';
import { ShotParams, TurnPhase, BattleConfig, DamageEvent, CharacterEntity, ProjectileTypeId, ProjectilePhysicsConfig } from '../../types/battle';
import { GAME_EVENTS } from '../config/phaser';
import { getArena, ArenaDef } from '../maps/arenas';
import { 
  BossEntity, 
  BossConfig, 
  BossPhase, 
  executeBossTurn, 
  updateBossCooldowns, 
  checkPhaseTransition, 
  applyEnvironmentChange,
  createBossEntity,
  VERDANT_GUARDIAN_CONFIG,
  VERDANT_GUARDIAN_SPECIAL_ATTACKS
} from '../systems/BossSystem';
import { getProjectileType, PROJECTILE_TYPES, ProjectileTypeConfig } from '../data/projectiles';
import { CameraController, CameraShakeIntensity } from '../systems/CameraController';
import { ImpactEffects, ImpactSize, DamageType } from '../systems/ImpactEffects';
import { ContextualFeedback, FeedbackData } from '../systems/ContextualFeedback';
import { RewardAnimations } from '../systems/RewardAnimations';
import { ScreenFlash } from '../systems/ScreenFlash';
import { PauseSystem } from '../systems/PauseSystem';
import { GamepadManager } from '../../utils/gamepad';

interface BattleSceneData {
  playerCharacterId: string;
  cpuCharacterId: string;
  levelId: string;
  difficulty: 'easy' | 'normal' | 'hard';
}

export class BattleScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cpu!: Phaser.GameObjects.Sprite;
  private projectile?: Phaser.GameObjects.Sprite;
  private ground!: Phaser.GameObjects.Rectangle;
  private platforms: Phaser.GameObjects.Rectangle[] = [];
  
  private playerEntity!: CharacterEntity;
  private cpuEntity!: CharacterEntity;
  
  private currentWind = 0;
  private turnNumber = 1;
  private currentPhase: TurnPhase = 'idle';
  private currentTurn: 'player' | 'cpu' = 'player';
  
  private playerAngle = 45;
  private playerPower = 50;
  private isCharging = false;
  private chargeStartTime = 0;
  private playerProjectileType: ProjectileTypeId = 'normal';
  
  private trajectoryGraphics!: Phaser.GameObjects.Graphics;
  private explosionGraphics!: Phaser.GameObjects.Graphics;
  private damageNumbers: Phaser.GameObjects.Text[] = [];
  
  private config: BattleConfig = { 
    ...TURN_CONFIG, 
    gravity: PHYSICS_CONFIG.gravity,
    baseProjectileSpeed: PHYSICS_CONFIG.baseProjectileSpeed,
    explosionRadius: COMBAT_CONFIG.explosionRadius,
    maxPower: COMBAT_CONFIG.maxPower,
    minPower: COMBAT_CONFIG.minPower,
  } as BattleConfig;
  private difficulty: 'easy' | 'normal' | 'hard' = 'normal';
  private levelId = 'arena_1';
  
  private inputKeys!: { left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; space: Phaser.Input.Keyboard.Key; shift: Phaser.Input.Keyboard.Key };
  private mobileControls: { left: boolean; right: boolean; angleUp: boolean; angleDown: boolean; fire: boolean; ability: boolean } = { left: false, right: false, angleUp: false, angleDown: false, fire: false, ability: false };
  
  private aiThinking = false;
  private turnTimer?: Phaser.Time.TimerEvent;
  private battleEnded = false;
  
  private isBossBattle = false;
  private bossConfig?: BossConfig;
  private bossEntity?: BossEntity;
  private bossDialogueText?: Phaser.GameObjects.Text;
  private bossIntroShown = false;
  
  private cameraController!: CameraController;
  private impactEffects!: ImpactEffects;
  private contextualFeedback!: ContextualFeedback;
  private rewardAnimations!: RewardAnimations;
  private screenFlash!: ScreenFlash;
  private pauseSystem!: PauseSystem;
  private gamepadManager!: GamepadManager;

  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data: BattleSceneData): void {
    this.levelId = data.levelId || 'arena_1';
    this.difficulty = data.difficulty || 'normal';
    
    const level = this.getLevelConfig(this.levelId);
    this.isBossBattle = level?.isBoss || false;
    this.bossConfig = level?.bossConfig;
    
    if (this.isBossBattle && this.bossConfig) {
      const arena = getArena(this.levelId);
      this.bossEntity = createBossEntity(this.bossConfig, arena);
    }
  }

  private getLevelConfig(arenaId: string) {
    const { LEVELS } = require('../data/levels');
    return LEVELS.find((l: any) => l.arenaId === arenaId);
  }

  create(): void {
    this.createWorld();
    this.createCharacters();
    this.createUI();
    this.createInput();
    this.setupSystems();
    
    this.cameraController = new CameraController(this);
    this.impactEffects = new ImpactEffects(this);
    this.contextualFeedback = new ContextualFeedback(this);
    this.rewardAnimations = new RewardAnimations(this);
    this.screenFlash = new ScreenFlash(this);
    this.pauseSystem = new PauseSystem(this);
    this.gamepadManager = new GamepadManager();
    this.gamepadManager.onInput((state) => {
      this.mobileControls = {
        left: state.left,
        right: state.right,
        angleUp: state.angleUp,
        angleDown: state.angleDown,
        fire: state.fire,
        ability: state.ability,
      };
      if (state.pause) {
        this.togglePause();
      }
    });
    
    this.currentWind = generateInitialWind(this.config);
    this.emitEvent(GAME_EVENTS.WIND_CHANGE, { wind: this.currentWind });
    this.startTurn('player');
  }

  private createWorld(): void {
    const arena = getArena(this.levelId);
    
    this.cameras.main.setBounds(0, 0, 1920, 1080);
    
    if (this.textures.exists(arena.backgroundKey)) {
      this.add.image(960, 540, arena.backgroundKey).setDisplaySize(1920, 1080).setDepth(-1);
    } else {
      this.cameras.main.setBackgroundColor('#87ceeb');
    }
    
    this.ground = this.add.rectangle(960, arena.groundY + 80, 1920, 200, 0x37474f).setOrigin(0.5, 0);
    this.physics.add.existing(this.ground, true);
    this.ground.setVisible(false);
    
    this.platforms = arena.platforms.map(p => {
      const platform = this.add.rectangle(p.x, p.y, p.width, p.height, 0x37474f).setOrigin(0.5);
      this.physics.add.existing(platform, true);
      platform.setVisible(false);
      return platform;
    });
  }

private createCharacters(): void {
    const arena = getArena(this.levelId);
    const playerChar = CHARACTERS[this.registry.get('playerCharacterId') as string] || CHARACTERS.kai;
    
    this.playerEntity = {
      id: 'player',
      characterId: playerChar.id,
      name: playerChar.name,
      hp: Math.floor(playerChar.stats.health * 100),
      maxHp: Math.floor(playerChar.stats.health * 100),
      x: arena.playerStartX,
      y: arena.startY,
      facing: 'right',
      isPlayer: true,
      abilityCooldown: 0,
      projectileType: 'normal' as ProjectileTypeId,
    };
    
    // Set player's selected projectile type from registry or store
    this.playerProjectileType = 'normal';
    
    this.player = this.add.sprite(this.playerEntity.x, this.playerEntity.y, `char_${playerChar.id}`)
      .setOrigin(0.5, 1)
      .setScale(2)
      .setFlipX(false);
    
    this.physics.add.existing(this.player);
    (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.ground);
    this.platforms.forEach(p => {
      this.physics.add.collider(this.player, p);
    });
    
    if (this.isBossBattle && this.bossEntity && this.bossConfig) {
      this.cpuEntity = {
        id: 'boss',
        characterId: this.bossEntity.characterId,
        name: this.bossEntity.name,
        hp: this.bossEntity.hp,
        maxHp: this.bossEntity.maxHp,
        x: this.bossEntity.x,
        y: this.bossEntity.y,
        facing: 'left',
        isPlayer: false,
        abilityCooldown: 0,
        isBoss: true,
        bossConfig: this.bossConfig,
        currentPhaseIndex: 0,
        phaseSpecialCooldowns: {},
      };
      
      this.cpu = this.add.sprite(this.cpuEntity.x, this.cpuEntity.y, `char_${this.bossEntity.characterId}`)
        .setOrigin(0.5, 1)
        .setScale(3)
        .setFlipX(true);
      
      this.physics.add.existing(this.cpu);
      (this.cpu.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
      this.physics.add.collider(this.cpu, this.ground);
      this.platforms.forEach(p => {
        this.physics.add.collider(this.cpu, p);
      });
      
      this.showBossIntro();
    } else {
      const cpuChar = CHARACTERS[this.registry.get('cpuCharacterId') as string] || CHARACTERS.luna;
      
      this.cpuEntity = {
        id: 'cpu',
        characterId: cpuChar.id,
        name: cpuChar.name,
        hp: Math.floor(cpuChar.stats.health * 100),
        maxHp: Math.floor(cpuChar.stats.health * 100),
        x: arena.cpuStartX,
        y: arena.startY,
        facing: 'left',
        isPlayer: false,
        abilityCooldown: 0,
      };
      
      this.cpu = this.add.sprite(this.cpuEntity.x, this.cpuEntity.y, `char_${cpuChar.id}`)
        .setOrigin(0.5, 1)
        .setScale(2)
        .setFlipX(true);
      
      this.physics.add.existing(this.cpu);
      (this.cpu.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
      this.physics.add.collider(this.cpu, this.ground);
      this.platforms.forEach(p => {
        this.physics.add.collider(this.cpu, p);
      });
    }
  }

  private showBossIntro(): void {
    if (this.bossIntroShown || !this.bossConfig) return;
    
    this.bossIntroShown = true;
    const cam = this.cameras.main;
    
    const overlay = this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x000000, 0.8).setScrollFactor(0).setDepth(100);
    
    const bossName = this.add.text(cam.width / 2, cam.height / 2 - 50, this.bossConfig.name, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '48px',
      color: '#f8fafc',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
    
    const dialogue = this.add.text(cam.width / 2, cam.height / 2 + 30, this.bossConfig.introDialogue || '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px',
      color: '#fbbf24',
      wordWrap: { width: 600 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
    
    this.bossDialogueText = dialogue;
    
    this.tweens.add({
      targets: [overlay, bossName, dialogue],
      alpha: { from: 0, to: 1 },
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.time.delayedCall(3000, () => {
          this.tweens.add({
            targets: [overlay, bossName, dialogue],
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
              overlay.destroy();
              bossName.destroy();
              dialogue.destroy();
              this.bossDialogueText = undefined;
            },
          });
        });
      },
    });
  }

  private showBossVictory(): void {
    if (!this.bossConfig) return;
    
    const cam = this.cameras.main;
    
    const overlay = this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x000000, 0.8).setScrollFactor(0).setDepth(100);
    
    const victoryText = this.add.text(cam.width / 2, cam.height / 2 - 50, 'VITÓRIA!', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '48px',
      color: '#4ade80',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
    
    const dialogue = this.add.text(cam.width / 2, cam.height / 2 + 30, this.bossConfig.victoryDialogue || '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px',
      color: '#fbbf24',
      wordWrap: { width: 600 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
    
    this.tweens.add({
      targets: [overlay, victoryText, dialogue],
      alpha: { from: 0, to: 1 },
      duration: 500,
      ease: 'Power2',
    });
  }

  private createUI(): void {
    this.trajectoryGraphics = this.add.graphics();
    this.explosionGraphics = this.add.graphics();
    
    this.createHUD();
  }

  private createHUD(): void {
    const cam = this.cameras.main;
    
    this.add.rectangle(cam.width / 2, cam.height - 60, cam.width, 120, 0x0f172a, 0.85).setScrollFactor(0);
    
    this.add.text(30, cam.height - 100, `VENTO: ${this.currentWind >= 0 ? '→' : '←'} ${Math.abs(this.currentWind).toFixed(1)}`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px',
      color: '#f8fafc',
      fontStyle: 'bold',
    }).setScrollFactor(0).setName('windText');
    
    this.add.text(cam.width - 30, cam.height - 100, `TURNO ${this.turnNumber}`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '24px',
      color: '#f8fafc',
      fontStyle: 'bold',
    }).setScrollFactor(0).setOrigin(1, 0).setName('turnText');
    
    this.add.text(30, cam.height - 60, `ÂNGULO: ${this.playerAngle}°`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      color: '#f8fafc',
    }).setScrollFactor(0).setName('angleText');
    
    this.add.rectangle(250, cam.height - 60, 200, 24, 0x334155).setScrollFactor(0).setOrigin(0, 0.5);
    this.add.rectangle(250, cam.height - 60, 200 * (this.playerPower / 100), 24, 0x4ade80).setScrollFactor(0).setOrigin(0, 0.5).setName('powerBarFill');
    this.add.text(250, cam.height - 60, `${this.playerPower}%`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      color: '#f8fafc',
    }).setScrollFactor(0).setOrigin(0.5).setName('powerText');
    
    this.add.text(cam.width - 250, cam.height - 60, `[ESPACO] Carregar  [SETAS] Mirar  [A/D] Mover  [SHIFT] Habilidade`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#94a3b8',
    }).setScrollFactor(0).setOrigin(1, 0.5);
  }

  private createInput(): void {
    this.inputKeys = this.input.keyboard!.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    }) as any;
    
    this.input.keyboard!.on('keydown-SHIFT', () => this.useAbility());
    this.input.keyboard!.on('keydown-ESC', () => this.togglePause());
    this.input.keyboard!.on('keydown-P', () => this.togglePause());
    
    this.events.on('mobile-input', (input: { left: boolean; right: boolean; angleUp: boolean; angleDown: boolean; fire: boolean; ability: boolean }) => {
      this.mobileControls = input;
    });
  }

  private setupSystems(): void {
    this.events.on(GAME_EVENTS.TURN_START, this.onTurnStart, this);
    this.events.on(GAME_EVENTS.TURN_END, this.onTurnEnd, this);
    this.events.on(GAME_EVENTS.PLAYER_SHOT, this.onPlayerShot, this);
    this.events.on(GAME_EVENTS.CPU_SHOT, this.onCPUShot, this);
    this.events.on(GAME_EVENTS.PROJECTILE_IMPACT, this.onProjectileImpact, this);
    this.events.on(GAME_EVENTS.BATTLE_END, this.onBattleEnd, this);
    this.events.on('shutdown', () => {
      this.pauseSystem.destroy();
      this.gamepadManager.destroy();
    });
  }

  private emitEvent(event: string, data?: any): void {
    this.events.emit(event, data);
    this.game.events.emit(event, data);
  }

  update(time: number, delta: number): void {
    if (this.battleEnded || this.pauseSystem.isPaused()) return;
    
    if (this.isBossBattle && this.bossEntity) {
      updateBossCooldowns(this.bossEntity, delta);
      
      const phaseTransition = checkPhaseTransition(this.bossEntity);
      if (phaseTransition) {
        this.onBossPhaseChange(phaseTransition);
      }
    }
    
    this.handleInput(delta);
    this.updateTrajectoryPreview();
    this.updateHUD();
    this.updateProjectile(delta);
    this.updateDamageNumbers(delta);
    this.cameraController.update(delta);
    
    if (this.currentPhase === 'projectile_flying' && this.projectile) {
      this.checkProjectileCollisions();
    }
  }

  private handleInput(delta: number): void {
    if (this.currentTurn !== 'player' || this.currentPhase === 'projectile_flying') return;
    
    const moveSpeed = COMBAT_CONFIG.moveSpeed * (delta / 1000);
    const maxMove = COMBAT_CONFIG.maxMoveDistance;
    let moved = false;
    
    if (this.inputKeys.left.isDown || this.mobileControls.left) {
      this.moveCharacter(this.playerEntity, this.player, -moveSpeed, maxMove);
      moved = true;
    }
    if (this.inputKeys.right.isDown || this.mobileControls.right) {
      this.moveCharacter(this.playerEntity, this.player, moveSpeed, maxMove);
      moved = true;
    }
    if (moved) {
      this.playerEntity.facing = (this.inputKeys.left.isDown || this.mobileControls.left) ? 'left' : 'right';
      this.player.setFlipX(this.playerEntity.facing === 'left');
    }
    
    if (this.inputKeys.up.isDown || this.mobileControls.angleUp) {
      this.playerAngle = Phaser.Math.Clamp(this.playerAngle + COMBAT_CONFIG.angleAdjustRate, 0, 180);
    }
    if (this.inputKeys.down.isDown || this.mobileControls.angleDown) {
      this.playerAngle = Phaser.Math.Clamp(this.playerAngle - COMBAT_CONFIG.angleAdjustRate, 0, 180);
    }
    
    if (this.inputKeys.space.isDown || this.mobileControls.fire) {
      if (!this.isCharging && this.currentPhase === 'aiming') {
        this.startCharging();
      } else if (this.isCharging) {
        this.continueCharging(delta);
      }
    } else if (this.isCharging) {
      this.releaseShot();
    }
  }

  private moveCharacter(entity: CharacterEntity, sprite: Phaser.GameObjects.Sprite, deltaX: number, maxDistance: number): void {
    const newX = Phaser.Math.Clamp(entity.x + deltaX, 50, 1870);
    const distance = Math.abs(newX - entity.x);
    
    if (distance > 0) {
      entity.x = newX;
      sprite.x = newX;
    }
  }

  private startCharging(): void {
    this.isCharging = true;
    this.chargeStartTime = this.time.now;
    this.currentPhase = 'charging';
    this.emitEvent(GAME_EVENTS.PHASE_CHANGE, { phase: 'charging' });
    this.sound.play('sfx_power_charge', { volume: 0.3, loop: true });
  }

  private continueCharging(delta: number): void {
    const chargeRate = COMBAT_CONFIG.powerChargeRate * (delta / 1000);
    this.playerPower = Phaser.Math.Clamp(this.playerPower + chargeRate, COMBAT_CONFIG.minPower, COMBAT_CONFIG.maxPower);
  }

  private releaseShot(): void {
    this.isCharging = false;
    this.currentPhase = 'firing';
    this.sound.stopByKey('sfx_power_charge');
    
    // Get projectile type and its physics config
    const projectileType = this.playerEntity.projectileType || 'normal';
    const projectileConfig = getProjectilePhysicsConfig(projectileType);
    const projectileTypeConfig = getProjectileType(this.playerEntity.projectileType || 'normal');
    
    // Play launch sound based on projectile type
    const launchSfx = projectileTypeConfig?.audio?.launchSfx || 'sfx_fire';
    this.sound.play(launchSfx, { volume: 0.5 });
    
    const params: ShotParams = {
      angle: this.playerAngle,
      power: this.playerPower,
      wind: this.currentWind,
      gravity: PHYSICS_CONFIG.gravity,
      startX: this.playerEntity.x,
      startY: this.playerEntity.y - 60,
    };
    
    // Pass projectile physics config to trajectory calculation
    const trajectory = calculateTrajectory(params, {
      ...TURN_CONFIG,
      gravity: PHYSICS_CONFIG.gravity,
      baseProjectileSpeed: PHYSICS_CONFIG.baseProjectileSpeed,
      explosionRadius: COMBAT_CONFIG.explosionRadius,
      maxPower: COMBAT_CONFIG.maxPower,
      minPower: COMBAT_CONFIG.minPower,
    } as any, projectileConfig);
    
    this.launchProjectile(trajectory, 'player', projectileTypeConfig);
    this.emitEvent(GAME_EVENTS.PLAYER_SHOT, { params, trajectory, projectileType });
  }

  private launchProjectile(trajectory: any[], owner: 'player' | 'cpu', projectileTypeConfig?: any): void {
    this.currentPhase = 'projectile_flying';
    this.emitEvent(GAME_EVENTS.PHASE_CHANGE, { phase: 'projectile_flying' });
    
    const spriteKey = projectileTypeConfig?.visual?.spriteKey || 'projectile';
    const scale = projectileTypeConfig?.visual?.scale || 1.5;
    
    this.projectile = this.add.sprite(trajectory[0].x, trajectory[0].y, spriteKey)
      .setScale(scale)
      .setDepth(10);
    
    (this.projectile as any).trajectory = trajectory;
    (this.projectile as any).currentIndex = 0;
    (this.projectile as any).owner = owner;
    (this.projectile as any).projectileType = projectileTypeConfig?.id || 'normal';
    
    this.cameraController.followProjectile(this.projectile);
  }

  private updateProjectile(delta: number): void {
    if (!this.projectile || this.currentPhase !== 'projectile_flying') return;
    
    const proj = this.projectile as any;
    const trajectory = proj.trajectory;
    const index = proj.currentIndex;
    
    if (index < trajectory.length) {
      const point = trajectory[index];
      this.projectile.x = point.x;
      this.projectile.y = point.y;
      this.projectile.rotation = Math.atan2(point.vy, point.vx);
      proj.currentIndex++;
    } else {
      this.projectileImpact();
    }
  }

  private checkProjectileCollisions(): void {
    if (!this.projectile) return;
    
    const arena = getArena(this.levelId);
    const proj = this.projectile as any;
    const trajectory = proj.trajectory;
    const index = proj.currentIndex;
    
    if (index < trajectory.length) {
      const point = trajectory[index];
      
      if (point.y >= arena.groundY) {
        this.projectileImpact();
        return;
      }
      
      for (const platform of this.platforms) {
        if (point.x >= platform.x - platform.width / 2 && 
            point.x <= platform.x + platform.width / 2 &&
            point.y >= platform.y - platform.height / 2 &&
            point.y <= platform.y + platform.height / 2) {
          this.projectileImpact();
          return;
        }
      }
    }
  }

  private projectileImpact(): void {
    if (!this.projectile) return;
    
    const impactX = this.projectile.x;
    const impactY = this.projectile.y;
    const owner = (this.projectile as any).owner;
    const projectileType = (this.projectile as any).projectileType || 'normal';
    
    const target = owner === 'player' ? this.cpuEntity : this.playerEntity;
    const attacker = owner === 'player' ? this.playerEntity : this.cpuEntity;
    const attackerChar = CHARACTERS[attacker.characterId];
    
    const distance = Phaser.Math.Distance.Between(impactX, impactY, target.x, target.y);
    const damage = calculateDamage(
      distance,
      COMBAT_CONFIG.explosionRadius,
      COMBAT_CONFIG.baseDamage,
      attackerChar.stats.attack,
      CHARACTERS[target.characterId].stats.defense
    );
    
    const impactSize = this.impactEffects.getImpactSize(damage, COMBAT_CONFIG.baseDamage * 2);
    const isCritical = damage > COMBAT_CONFIG.baseDamage * 1.5;
    const isMiss = damage === 0;
    const damageType = this.impactEffects.getDamageType(isCritical, isMiss, false);
    
    this.impactEffects.createImpact(impactX, impactY, impactSize, damageType, damage > 0 ? damage : undefined);
    this.sound.play('sfx_explosion', { volume: 0.6 });
    this.cameraController.shake(impactSize === 'massive' ? 'heavy' : impactSize === 'large' ? 'medium' : 'light');
    
    if (damage > 0) {
      if (isCritical) {
        this.screenFlash.flashCritical();
      } else {
        this.screenFlash.flashDamage();
      }
      
      this.applyDamage(target, damage, impactX, impactY);
      
      const feedbackData: FeedbackData = {
        damage,
        distance,
        isCritical,
        isTerrainHit: false,
        targetHp: target.hp,
        targetMaxHp: target.maxHp,
        attackerHp: attacker.hp,
        attackerMaxHp: attacker.maxHp,
        turnNumber: this.turnNumber,
        comboCount: this.contextualFeedback.getComboCount(),
        isBoss: this.isBossBattle,
      };
      this.contextualFeedback.checkAndTrigger(feedbackData);
    } else {
      this.impactEffects.createMissEffect(impactX, impactY);
      this.screenFlash.flashMiss();
    }
    
    this.projectile.destroy();
    this.projectile = undefined;
    this.currentPhase = 'resolving';
    this.emitEvent(GAME_EVENTS.PROJECTILE_IMPACT, { x: impactX, y: impactY, damage, target: target.id });
    
    this.time.delayedCall(500, () => {
      this.cameraController.returnToDefault();
    });
  }

  private createExplosion(x: number, y: number): void {
    this.explosionGraphics.clear();
    this.explosionGraphics.fillStyle(0xff6b35, 0.8);
    this.explosionGraphics.fillCircle(x, y, COMBAT_CONFIG.explosionRadius);
    
    this.tweens.add({
      targets: this.explosionGraphics,
      alpha: 0,
      scale: 1.5,
      duration: 300,
      onComplete: () => this.explosionGraphics.clear(),
    });
    
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i;
      const particle = this.add.circle(x, y, 4, 0xffaa00, 1);
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * 80,
        y: y + Math.sin(angle) * 80,
        alpha: 0,
        scale: 0,
        duration: 500,
        onComplete: () => particle.destroy(),
      });
    }
  }

  private applyDamage(target: CharacterEntity, damage: number, x: number, y: number): void {
    target.hp = Math.max(0, target.hp - damage);
    
    const damageText = this.add.text(x, y - 40, `-${damage}`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '28px',
      color: '#ef4444',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20);
    
    this.tweens.add({
      targets: damageText,
      y: y - 100,
      alpha: 0,
      duration: 1000,
      onComplete: () => damageText.destroy(),
    });
    
    this.damageNumbers.push(damageText);
    this.sound.play('sfx_hit', { volume: 0.5 });
    this.emitEvent(GAME_EVENTS.DAMAGE_DEALT, { target: target.id, damage });
    
    if (target.hp <= 0) {
      this.emitEvent(GAME_EVENTS.CHARACTER_KO, { characterId: target.id });
    }
  }

  private updateDamageNumbers(delta: number): void {
    this.damageNumbers = this.damageNumbers.filter(t => t.active);
  }

  private updateTrajectoryPreview(): void {
    this.trajectoryGraphics.clear();
    
    if (this.currentTurn !== 'player' || this.currentPhase !== 'aiming' && this.currentPhase !== 'charging') return;
    
    const params: ShotParams = {
      angle: this.playerAngle,
      power: this.isCharging ? this.playerPower : 50,
      wind: this.currentWind,
      gravity: PHYSICS_CONFIG.gravity,
      startX: this.playerEntity.x,
      startY: this.playerEntity.y - 60,
    };
    
    const trajectory = calculateTrajectory(params);
    
    this.trajectoryGraphics.lineStyle(2, 0x4ade80, 0.6);
    this.trajectoryGraphics.beginPath();
    this.trajectoryGraphics.moveTo(trajectory[0].x, trajectory[0].y);
    
    for (let i = 1; i < trajectory.length; i += 3) {
      this.trajectoryGraphics.lineTo(trajectory[i].x, trajectory[i].y);
    }
    this.trajectoryGraphics.strokePath();
  }

  private updateHUD(): void {
    const cam = this.cameras.main;
    
    const windText = this.children.getByName('windText') as Phaser.GameObjects.Text;
    if (windText) {
      windText.setText(`VENTO: ${this.currentWind >= 0 ? '→' : '←'} ${Math.abs(this.currentWind).toFixed(1)}`);
    }
    
    const turnText = this.children.getByName('turnText') as Phaser.GameObjects.Text;
    if (turnText) {
      turnText.setText(`TURNO ${this.turnNumber} - ${this.currentTurn === 'player' ? 'VOCÊ' : 'INIMIGO'}`);
    }
    
    const angleText = this.children.getByName('angleText') as Phaser.GameObjects.Text;
    if (angleText) {
      angleText.setText(`ÂNGULO: ${this.playerAngle}°`);
    }
    
    const powerFill = this.children.getByName('powerBarFill') as Phaser.GameObjects.Rectangle;
    const powerText = this.children.getByName('powerText') as Phaser.GameObjects.Text;
    if (powerFill && powerText) {
      powerFill.width = 200 * (this.playerPower / 100);
      powerText.setText(`${Math.round(this.playerPower)}%`);
    }
  }

  private startTurn(who: 'player' | 'cpu'): void {
    this.currentTurn = who;
    this.currentPhase = who === 'player' ? 'aiming' : 'aiming';
    this.emitEvent(GAME_EVENTS.TURN_START, { turn: who, turnNumber: this.turnNumber });
    
    if (who === 'cpu') {
      this.aiThinking = true;
      const thinkTime = TURN_CONFIG.aiThinkingTime[this.difficulty];
      this.time.delayedCall(thinkTime, () => this.executeCPUTurn());
    } else {
      this.playerPower = 50;
      this.playerAngle = this.playerEntity.facing === 'right' ? 45 : 135;
    }
    
    this.turnTimer = this.time.delayedCall(this.config.turnTimeLimit, () => this.forceEndTurn());
  }

  private onTurnStart(): void {
  }

  private onTurnEnd(): void {
    if (this.turnTimer) this.turnTimer.remove();
    
    if (this.currentTurn === 'player') {
      this.currentTurn = 'cpu';
      this.turnNumber++;
      this.currentWind = calculateWindChange(this.currentWind, this.config);
      this.emitEvent(GAME_EVENTS.WIND_CHANGE, { wind: this.currentWind });
      this.time.delayedCall(1000, () => this.startTurn('cpu'));
    } else {
      this.currentTurn = 'player';
      this.time.delayedCall(1000, () => this.startTurn('player'));
    }
  }

  private forceEndTurn(): void {
    if (this.currentTurn === 'player' && this.isCharging) {
      this.releaseShot();
    } else if (this.currentTurn === 'cpu' && this.aiThinking) {
      this.executeCPUTurn();
    }
  }

  private executeCPUTurn(): void {
    this.aiThinking = false;
    
    if (this.isBossBattle && this.bossEntity && this.bossConfig) {
      updateBossCooldowns(this.bossEntity, 1000 / 60);
      
      const phaseTransition = checkPhaseTransition(this.bossEntity);
      if (phaseTransition) {
        this.onBossPhaseChange(phaseTransition);
      }
      
      const params = executeBossTurn(
        this.bossEntity,
        this.playerEntity.x,
        this.playerEntity.y,
        this.currentWind,
        this
      );
      
      if (params) {
        const trajectory = calculateTrajectory(params);
        this.launchProjectile(trajectory, 'cpu');
        this.emitEvent(GAME_EVENTS.CPU_SHOT, { params, trajectory });
      }
      return;
    }
    
    const accuracy = TURN_CONFIG.aiAccuracy[this.difficulty];
    
    const dx = this.playerEntity.x - this.cpuEntity.x;
    const baseAngle = Math.atan2(-1, dx > 0 ? 1 : -1) * (180 / Math.PI);
    const cpuAngle = baseAngle + (Math.random() - 0.5) * 30 * accuracy * 10;
    const cpuPower = 40 + Math.random() * 40;
    
    const params: ShotParams = {
      angle: Phaser.Math.Clamp(cpuAngle, 10, 170),
      power: cpuPower,
      wind: this.currentWind,
      gravity: PHYSICS_CONFIG.gravity,
      startX: this.cpuEntity.x,
      startY: this.cpuEntity.y - 60,
    };
    
    const trajectory = calculateTrajectory(params);
    this.launchProjectile(trajectory, 'cpu');
    this.emitEvent(GAME_EVENTS.CPU_SHOT, { params, trajectory });
  }

  private onBossPhaseChange(phase: any): void {
    if (!this.bossConfig) return;
    
    const cam = this.cameras.main;
    
    this.sound.play('sfx_ability', { volume: 0.8 });
    this.cameraController.shake('boss');
    this.cameraController.zoomTo('special', 300);
    
    const phaseText = this.add.text(cam.width / 2, cam.height / 2, `FASE ${this.bossEntity!.currentPhaseIndex + 1}`, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '48px',
      color: '#f87171',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setAlpha(0);
    
    if (phase.dialogue) {
      const dialogue = this.add.text(cam.width / 2, cam.height / 2 + 60, phase.dialogue, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '24px',
        color: '#fbbf24',
        wordWrap: { width: 600 },
      }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setAlpha(0);
      
      this.tweens.add({
        targets: [phaseText, dialogue],
        alpha: 1,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
          this.time.delayedCall(2000, () => {
            this.tweens.add({
              targets: [phaseText, dialogue],
              alpha: 0,
              duration: 300,
              onComplete: () => {
                phaseText.destroy();
                dialogue.destroy();
              },
            });
          });
        },
      });
    } else {
      this.tweens.add({
        targets: phaseText,
        alpha: 1,
        duration: 300,
        onComplete: () => {
          this.time.delayedCall(1500, () => {
            this.tweens.add({
              targets: phaseText,
              alpha: 0,
              duration: 300,
              onComplete: () => phaseText.destroy(),
            });
          });
        },
      });
    }
    
    if (phase.environmentChanges) {
      phase.environmentChanges.forEach((change: import('../systems/BossSystem').EnvironmentChange) => applyEnvironmentChange(change, this));
    }
  }

  private onPlayerShot(): void {
  }

  private onCPUShot(): void {
  }

  private onProjectileImpact(): void {
    this.time.delayedCall(1500, () => {
      if (!this.battleEnded) {
        this.emitEvent(GAME_EVENTS.TURN_END);
      }
    });
  }

  private onBattleEnd(data: { winner: 'player' | 'cpu' }): void {
    this.battleEnded = true;
    
    if (data.winner === 'player') {
      if (this.isBossBattle) {
        this.contextualFeedback.triggerBossDefeated();
        this.screenFlash.flashBoss();
      } else {
        this.contextualFeedback.triggerVictory();
        this.screenFlash.flashVictory();
      }
      
      this.time.delayedCall(1500, () => {
        this.rewardAnimations.animateRewardSequence(100, 50, 2, 0, 500, () => {
          this.scene.pause();
          this.emitEvent(GAME_EVENTS.BATTLE_END, data);
        });
      });
    } else {
      this.screenFlash.flashDefeat();
      this.scene.pause();
      this.emitEvent(GAME_EVENTS.BATTLE_END, data);
    }
  }

  private useAbility(): void {
    if (this.currentTurn !== 'player' || this.playerEntity.abilityCooldown > 0) return;
    
    const char = CHARACTERS[this.playerEntity.characterId];
    const ability = char.specialAbility;
    
    this.playerEntity.abilityCooldown = ability.cooldown;
    this.sound.play('sfx_ability', { volume: 0.6 });
    this.emitEvent(GAME_EVENTS.ABILITY_USED, { abilityId: ability.id, characterId: char.id });
  }

  togglePause(): void {
    if (this.battleEnded) return;
    this.pauseSystem.toggle('manual');
    this.emitEvent('pause-toggle', { paused: this.pauseSystem.isPaused() });
  }

  isPaused(): boolean {
    return this.pauseSystem.isPaused();
  }

  private onCharacterKO(data: { characterId: string }): void {
    if (data.characterId === 'player') {
      this.endBattle('cpu');
    } else if (data.characterId === 'cpu' || data.characterId === 'boss') {
      if (this.isBossBattle) {
        this.showBossVictory();
        this.time.delayedCall(3000, () => {
          this.endBattle('player');
        });
      } else {
        this.endBattle('player');
      }
    }
  }

  private endBattle(winner: 'player' | 'cpu'): void {
    this.battleEnded = true;
    this.emitEvent(GAME_EVENTS.BATTLE_END, { winner });
  }
}

function calculateWindChange(currentWind: number, config: BattleConfig): number {
  const change = (Math.random() - 0.5) * 2;
  const newWind = currentWind + change;
  return Phaser.Math.Clamp(newWind, config.windRange.min, config.windRange.max);
}