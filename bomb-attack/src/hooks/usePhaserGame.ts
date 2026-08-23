import { useEffect, useRef, useCallback, useState } from 'react';
import * as Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, createGameConfig } from '@/game/config/phaser';
import { BootScene } from '@/game/scenes/BootScene';
import { PreloadScene } from '@/game/scenes/PreloadScene';
import { WorldMapScene } from '@/game/scenes/WorldMapScene';
import { BattleScene } from '@/game/scenes/BattleScene';
import { UIScene } from '@/game/scenes/UIScene';
import { GAME_EVENTS } from '@/game/config/phaser';
import { useGameStore } from '@/stores/gameStore';

interface UsePhaserGameOptions {
  containerRef: React.RefObject<HTMLDivElement>;
  onGameReady?: (game: Phaser.Game) => void;
  onBattleEnd?: (result: { winner: 'player' | 'cpu' }) => void;
  onStartBattle?: (data: { levelId: string; levelNumber: number; difficulty: string; cpuCharacterId: string }) => void;
  playerCharacterId?: string;
  cpuCharacterId?: string;
  levelId?: string;
  difficulty?: 'easy' | 'normal' | 'hard';
}

export interface MobileInputState {
  left: boolean;
  right: boolean;
  angleUp: boolean;
  angleDown: boolean;
  fire: boolean;
  ability: boolean;
}

export function usePhaserGame({
  containerRef,
  onGameReady,
  onBattleEnd,
  onStartBattle,
  playerCharacterId = 'kai',
  cpuCharacterId = 'luna',
  levelId = 'arena_1',
  difficulty = 'normal',
}: UsePhaserGameOptions) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [isReady, setIsReady] = useState(false);
  const mobileInputRef = useRef<MobileInputState>({
    left: false,
    right: false,
    angleUp: false,
    angleDown: false,
    fire: false,
    ability: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const config = createGameConfig(canvas);
    config.scene = [BootScene, PreloadScene, WorldMapScene, BattleScene, UIScene];

    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.events.once('game-ready', () => {
      setIsReady(true);
      onGameReady?.(game);
    });

    game.events.on('battle-end', (data: { winner: 'player' | 'cpu' }) => {
      onBattleEnd?.(data);
    });

    game.events.on('start-battle', (data: { levelId: string; levelNumber: number; difficulty: string; cpuCharacterId: string }) => {
      onStartBattle?.(data);
    });

    return () => {
      game.destroy(true, true);
      container.removeChild(canvas);
      gameRef.current = null;
      setIsReady(false);
    };
  }, [containerRef, onGameReady, onBattleEnd, onStartBattle]);

  const setMobileInput = useCallback((input: Partial<MobileInputState>) => {
    mobileInputRef.current = { ...mobileInputRef.current, ...input };
    
    const game = gameRef.current;
    if (game) {
      const battleScene = game.scene.getScene('BattleScene');
      if (battleScene && battleScene.scene.isActive()) {
        battleScene.events.emit('mobile-input', mobileInputRef.current);
      }
      const worldMapScene = game.scene.getScene('WorldMapScene');
      if (worldMapScene && worldMapScene.scene.isActive()) {
        worldMapScene.events.emit('mobile-input', mobileInputRef.current);
      }
    }
  }, []);

  const getMobileInput = useCallback(() => mobileInputRef.current, []);

  const startBattle = useCallback(() => {
    const game = gameRef.current;
    if (!game || !isReady) return;

    game.registry.set('playerCharacterId', playerCharacterId);
    game.registry.set('cpuCharacterId', cpuCharacterId);
    game.registry.set('levelId', levelId);
    game.registry.set('difficulty', difficulty);
    
    const battleScene = game.scene.getScene('BattleScene');
    if (battleScene && battleScene.scene.isSleeping()) {
      battleScene.scene.wake();
    } else if (battleScene && battleScene.scene.isActive()) {
      battleScene.events.emit('restart-battle', { levelId, difficulty });
    }
  }, [playerCharacterId, cpuCharacterId, levelId, difficulty, isReady]);

  const startWorldMap = useCallback((data: { unlockedLevels: string[]; completedLevels: Record<string, { stars: number; bestTurns: number; bestDamage: number }>; currentLevelId?: string }) => {
    const game = gameRef.current;
    if (!game || !isReady) return;

    game.registry.set('worldMapData', data);

    const worldMapScene = game.scene.getScene('WorldMapScene') as WorldMapScene | undefined;
    if (worldMapScene) {
      if (worldMapScene.scene.isSleeping()) {
        worldMapScene.scene.wake();
      } else if (worldMapScene.scene.isActive()) {
        worldMapScene.refreshData(data);
      } else {
        game.scene.start('WorldMapScene', data);
      }
    }
  }, [isReady]);

  const pauseGame = useCallback(() => {
    gameRef.current?.scene.pause('BattleScene');
    gameRef.current?.scene.pause('WorldMapScene');
  }, []);

  const resumeGame = useCallback(() => {
    gameRef.current?.scene.resume('BattleScene');
    gameRef.current?.scene.resume('WorldMapScene');
  }, []);

  const destroyGame = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.destroy(true, true);
      gameRef.current = null;
      setIsReady(false);
    }
  }, []);

  return {
    game: gameRef.current,
    isReady,
    startBattle,
    startWorldMap,
    pauseGame,
    resumeGame,
    destroyGame,
    setMobileInput,
    getMobileInput,
  };
}

export function useGameControls() {
  const [controls, setControls] = useState<MobileInputState>({
    left: false,
    right: false,
    angleUp: false,
    angleDown: false,
    fire: false,
    ability: false,
  });

  const handleTouchStart = useCallback((action: keyof MobileInputState) => {
    setControls((prev) => ({ ...prev, [action]: true }));
  }, []);

  const handleTouchEnd = useCallback((action: keyof MobileInputState) => {
    setControls((prev) => ({ ...prev, [action]: false }));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        setControls((prev) => ({ ...prev, left: true }));
        break;
      case 'ArrowRight':
      case 'KeyD':
        setControls((prev) => ({ ...prev, right: true }));
        break;
      case 'ArrowUp':
      case 'KeyW':
        setControls((prev) => ({ ...prev, angleUp: true }));
        break;
      case 'ArrowDown':
      case 'KeyS':
        setControls((prev) => ({ ...prev, angleDown: true }));
        break;
      case 'Space':
        e.preventDefault();
        setControls((prev) => ({ ...prev, fire: true }));
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        setControls((prev) => ({ ...prev, ability: true }));
        break;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        setControls((prev) => ({ ...prev, left: false }));
        break;
      case 'ArrowRight':
      case 'KeyD':
        setControls((prev) => ({ ...prev, right: false }));
        break;
      case 'ArrowUp':
      case 'KeyW':
        setControls((prev) => ({ ...prev, angleUp: false }));
        break;
      case 'ArrowDown':
      case 'KeyS':
        setControls((prev) => ({ ...prev, angleDown: false }));
        break;
      case 'Space':
        setControls((prev) => ({ ...prev, fire: false }));
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        setControls((prev) => ({ ...prev, ability: false }));
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { controls, handleTouchStart, handleTouchEnd };
}