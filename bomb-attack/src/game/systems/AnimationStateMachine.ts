import * as Phaser from 'phaser';
import { CharacterEntity } from '../../types/battle';

export type AnimationState = 
  | 'idle' 
  | 'walk' 
  | 'aim' 
  | 'charge' 
  | 'attack' 
  | 'hit' 
  | 'special' 
  | 'victory' 
  | 'defeat';

export interface AnimationConfig {
  key: string;
  frames: string[];
  frameRate: number;
  repeat: number;
  yoyo?: boolean;
}

export const ANIMATION_CONFIGS: Record<AnimationState, AnimationConfig> = {
  idle: { key: 'idle', frames: ['idle_0', 'idle_1', 'idle_2', 'idle_3'], frameRate: 4, repeat: -1 },
  walk: { key: 'walk', frames: ['walk_0', 'walk_1', 'walk_2', 'walk_3'], frameRate: 8, repeat: -1 },
  aim: { key: 'aim', frames: ['aim_0', 'aim_1'], frameRate: 4, repeat: -1 },
  charge: { key: 'charge', frames: ['charge_0', 'charge_1'], frameRate: 6, repeat: -1 },
  attack: { key: 'attack', frames: ['attack_0', 'attack_1'], frameRate: 12, repeat: 0 },
  hit: { key: 'hit', frames: ['hit_0'], frameRate: 1, repeat: 0 },
  special: { key: 'special', frames: ['special_0'], frameRate: 1, repeat: 0 },
  victory: { key: 'victory', frames: ['victory_0'], frameRate: 1, repeat: 0 },
  defeat: { key: 'defeat', frames: ['defeat_0'], frameRate: 1, repeat: 0 },
};

export class CharacterAnimationController {
  private scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Sprite;
  private characterId: string;
  private currentState: AnimationState = 'idle';
  private previousState: AnimationState | null = null;
  private isTransitioning = false;
  private stateLock = false;

  constructor(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite, characterId: string) {
    this.scene = scene;
    this.sprite = sprite;
    this.characterId = characterId;
  }

  public play(state: AnimationState, force = false): void {
    if (this.isTransitioning && !force) return;
    if (this.currentState === state && !force) return;

    const animKey = `${this.characterId}_${state}`;
    
    if (!this.scene.anims.exists(animKey)) {
      this.createAnimation(state);
    }

    if (this.scene.anims.exists(animKey)) {
      this.previousState = this.currentState;
      this.currentState = state;
      this.sprite.play(animKey);
      
      if (state === 'attack' || state === 'hit' || state === 'special') {
        this.isTransitioning = true;
        this.sprite.once('animationcomplete', () => {
          this.isTransitioning = false;
          if (state === 'attack' || state === 'special') {
            this.play('idle');
          } else if (state === 'hit') {
            this.play(this.previousState || 'idle');
          }
        });
      }
    }
  }

  private createAnimation(state: AnimationState): void {
    const config = ANIMATION_CONFIGS[state];
    const animKey = `${this.characterId}_${state}`;
    
    this.scene.anims.create({
      key: animKey,
      frames: config.frames.map(f => ({ key: this.characterId, frame: f })),
      frameRate: config.frameRate,
      repeat: config.repeat,
      yoyo: config.yoyo,
    });
  }

  public getCurrentState(): AnimationState {
    return this.currentState;
  }

  public lockState(lock: boolean): void {
    this.stateLock = lock;
  }

  public isLocked(): boolean {
    return this.stateLock;
  }
}

export class AnimationStateMachine {
  private controllers: Map<string, CharacterAnimationController> = new Map();
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public register(sprite: Phaser.GameObjects.Sprite, characterId: string): CharacterAnimationController {
    const controller = new CharacterAnimationController(this.scene, sprite, characterId);
    this.controllers.set(characterId, controller);
    return controller;
  }

  public unregister(characterId: string): void {
    this.controllers.delete(characterId);
  }

  public getController(characterId: string): CharacterAnimationController | undefined {
    return this.controllers.get(characterId);
  }

  public updateState(characterId: string, state: AnimationState, force = false): void {
    const controller = this.controllers.get(characterId);
    if (controller) {
      controller.play(state, force);
    }
  }

  public updateFromEntity(entity: CharacterEntity): void {
    const controller = this.controllers.get(entity.id);
    if (!controller) return;

    if (entity.isPlayer) {
      this.updatePlayerState(entity);
    } else {
      this.updateCPUState(entity);
    }
  }

  private updatePlayerState(entity: CharacterEntity): void {
    const controller = this.controllers.get(entity.id);
    if (!controller) return;
    
    if (entity.abilityCooldown > 0 && !controller.isLocked()) {
      this.updateState(entity.id, 'special');
      return;
    }

    // State logic would be driven by BattleScene phases
  }

  private updateCPUState(entity: CharacterEntity): void {
    // CPU state logic
  }

  public playAttack(entityId: string): void {
    this.updateState(entityId, 'attack', true);
  }

  public playHit(entityId: string): void {
    this.updateState(entityId, 'hit', true);
  }

  public playSpecial(entityId: string): void {
    this.updateState(entityId, 'special', true);
  }

  public playVictory(entityId: string): void {
    this.updateState(entityId, 'victory', true);
  }

  public playDefeat(entityId: string): void {
    this.updateState(entityId, 'defeat', true);
  }
}

export function createCharacterAnimations(scene: Phaser.Scene, characterId: string): void {
  Object.entries(ANIMATION_CONFIGS).forEach(([state, config]) => {
    const animKey = `${characterId}_${state}`;
    if (!scene.anims.exists(animKey)) {
      scene.anims.create({
        key: animKey,
        frames: config.frames.map(f => ({ key: characterId, frame: f })),
        frameRate: config.frameRate,
        repeat: config.repeat,
        yoyo: config.yoyo,
      });
    }
  });
}