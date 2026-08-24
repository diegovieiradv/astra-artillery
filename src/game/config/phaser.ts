import * as Phaser from 'phaser';
import { PHYSICS_CONFIG, COMBAT_CONFIG, TURN_CONFIG } from './game';

export const GAME_WIDTH = 1920;
export const GAME_HEIGHT = 1080;
export const GAME_SCALE_MODE = Phaser.Scale.FIT;
export const GAME_BACKGROUND_COLOR = '#87ceeb';

export function createGameConfig(canvas: HTMLCanvasElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    canvas,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scale: {
      mode: GAME_SCALE_MODE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      min: {
        width: 320,
        height: 180,
      },
      max: {
        width: 3840,
        height: 2160,
      },
    },
    backgroundColor: GAME_BACKGROUND_COLOR,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: PHYSICS_CONFIG.gravity },
        debug: false,
      },
    },
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
    },
    fps: {
      target: 60,
      forceSetTimeOut: false,
      smoothStep: true,
    },
    callbacks: {
      postBoot: (game: Phaser.Game) => {
        game.events.emit('game-ready');
      },
    },
    dom: {
      createContainer: true,
    },
    audio: {
      disableWebAudio: false,
    },
  };
}

export const GAME_EVENTS = {
  SCENE_READY: 'scene-ready',
  TURN_START: 'turn-start',
  TURN_END: 'turn-end',
  PHASE_CHANGE: 'phase-change',
  WIND_CHANGE: 'wind-change',
  PLAYER_SHOT: 'player-shot',
  CPU_SHOT: 'cpu-shot',
  PROJECTILE_LAUNCH: 'projectile-launch',
  PROJECTILE_IMPACT: 'projectile-impact',
  DAMAGE_DEALT: 'damage-dealt',
  CHARACTER_KO: 'character-ko',
  BATTLE_END: 'battle-end',
  ABILITY_USED: 'ability-used',
  LEVEL_COMPLETE: 'level-complete',
} as const;

export type GameEventKey = keyof typeof GAME_EVENTS;