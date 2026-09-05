'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePhaserGame, useGameControls } from '@/hooks/usePhaserGame';
import { useGameStore, useBattleStore } from '@/stores/gameStore';
import { MobileControls } from '@/components/game/MobileControls';
import { WeatherIndicator } from '@/components/game/WeatherIndicator';
import { PauseOverlay } from '@/components/game/PauseOverlay';
import { GameLoader } from '@/components/loading/GameLoader';
import { ContextualTipToast } from '@/components/ui/ContextualTipToast';
import { PhotoMode } from '@/components/ui/PhotoMode';
import { CHARACTERS } from '@/game/characters/registry';
import { LEVELS } from '@/game/data/levels';
import { getRandomWeather } from '@/game/data/weather';
import { audioManager, initAudioFromSettings, vibrationManager } from '@/utils/audio';
import { toggleFullscreen, isFullscreen } from '@/utils/fullscreen';
import { incrementMissStreak, resetMissStreak, getMissStreak } from '@/game/data/tips';
import styles from './page.module.css';

export default function GameClient() {
  const router = useRouter();
  const { playerCharacter, cpuCharacter, levelId, difficulty, battleResult, turnsPlayed, playerDamageDealt, cpuDamageDealt, setBattleResult, resetBattle } = useBattleStore();
  const { settings, unlockLevel, completeLevel } = useGameStore();
  
const containerRef = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);
  const [winner, setWinner] = useState<'player' | 'cpu' | null>(null);
  const [battleReady, setBattleReady] = useState(false);
  const [engineError, setEngineError] = useState(false);
  const [orientationWarning, setOrientationWarning] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<ReturnType<typeof getRandomWeather>>('clear');
  const [isPaused, setIsPaused] = useState(false);
  const [isFS, setIsFS] = useState(false);
  
  const { controls } = useGameControls();
  
  useEffect(() => {
    initAudioFromSettings(settings);
    audioManager.preloadAll().catch(console.warn);
    audioManager.play('bgm_battle', 'music', { loop: true, volume: 0.5 });
    
    const weather = getRandomWeather();
    setCurrentWeather(weather);
    
    return () => {
      audioManager.stopMusic();
    };
  }, [settings.musicVolume, settings.musicEnabled, settings.sfxVolume, settings.sfxEnabled]);
   
  const { isReady, status, error, startBattle, destroyGame, setMobileInput, pauseGame, resumeGame, game } = usePhaserGame({
    containerRef,
    onBattleEnd: (result) => {
      setWinner(result.winner);
      const isPlayerWin = result.winner === 'player';
      setBattleResult(isPlayerWin ? 'player_win' : 'cpu_win');
      if (isPlayerWin) {
        resetMissStreak();
      } else {
        incrementMissStreak();
      }
      
      if (isPlayerWin && levelId) {
        const levelIndex = LEVELS.findIndex(l => l.arenaId === levelId);
        if (levelIndex >= 0 && levelIndex < LEVELS.length - 1) {
          const nextLevel = LEVELS[levelIndex + 1];
          unlockLevel(nextLevel.arenaId);
        }
        completeLevel(levelId, {
          stars: turnsPlayed <= 5 ? 3 : turnsPlayed <= 10 ? 2 : 1,
          turns: turnsPlayed,
          damage: playerDamageDealt,
        });
      }
      
      setShowResults(true);
    },
    playerCharacterId: playerCharacter?.id ?? undefined,
    cpuCharacterId: cpuCharacter?.id ?? undefined,
    levelId: levelId ?? undefined,
    difficulty,
  });

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setOrientationWarning(window.innerHeight > window.innerWidth && window.innerWidth < 768);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (status === 'error') {
      setEngineError(true);
    }
  }, [status, error]);

  useEffect(() => {
    if (!isReady || !game) return;

    const onBattleReady = () => {
      setBattleReady(true);
    };
    game.events.once('battle-ready', onBattleReady);

    const onPauseToggle = (data: { paused: boolean }) => {
      setIsPaused(data.paused);
      if (data.paused) {
        audioManager.setVolume('music', settings.musicVolume * 0.3);
      } else {
        audioManager.setVolume('music', settings.musicVolume);
      }
    };
    game.events.on('pause-toggle', onPauseToggle);

    startBattle();

    return () => {
      game.events.off('battle-ready', onBattleReady);
      game.events.off('pause-toggle', onPauseToggle);
    };
  }, [isReady, game, startBattle, settings.musicVolume]);

  const handleResume = useCallback(() => {
    const battleScene = game?.scene.getScene('BattleScene');
    if (battleScene) {
      (battleScene as any).togglePause?.();
    }
  }, [game]);

  const handleQuitPause = useCallback(() => {
    resumeGame();
    setIsPaused(false);
    resetBattle();
    router.push('/map');
  }, [game, router, resetBattle, resumeGame]);

  const handleToggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    await toggleFullscreen(container || undefined);
    setIsFS(isFullscreen());
  }, []);

  useEffect(() => {
    const onFSChange = () => setIsFS(isFullscreen());
    document.addEventListener('fullscreenchange', onFSChange);
    document.addEventListener('webkitfullscreenchange', onFSChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFSChange);
      document.removeEventListener('webkitfullscreenchange', onFSChange);
    };
  }, []);

  useEffect(() => {
    if (!playerCharacter || !cpuCharacter) {
      router.push('/characters');
    }
  }, [playerCharacter, cpuCharacter, router]);

  if (engineError) {
    return (
      <div className={styles.page}>
        <div className={styles.gameContainer}>
          <div className={styles.loaderContainer}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#ef4444' }}>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '1.125rem', fontWeight: 600 }}>
                Nao foi possivel iniciar o motor do jogo.
              </p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: '#94a3b8' }}>
                {error?.message || 'Erro desconhecido'}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: '#4ade80',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 600,
                }}
              >
                TENTAR NOVAMENTE
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && winner) {
  return (
      <div className={styles.page}>
        <div className={styles.resultsOverlay}>
          <div className={styles.resultsCard}>
            <div className={`${styles.resultIcon} ${winner === 'player' ? styles.victory : styles.defeat}`}>
              {winner === 'player' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="15" y1="9" x2="9" y2="15" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="9" y1="9" x2="15" y2="15" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <h2 className={styles.resultTitle}>
              {winner === 'player' ? 'VITÓRIA!' : 'DERROTA'}
            </h2>
            <p className={styles.resultSubtitle}>
              {winner === 'player' 
                ? `Você derrotou ${cpuCharacter?.name} em ${turnsPlayed} turnos!` 
                : `${cpuCharacter?.name} foi mais forte desta vez.`}
            </p>
            
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Turnos</span>
                <span className={styles.statValue}>{turnsPlayed}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Seu Dano</span>
                <span className={styles.statValue}>{playerDamageDealt}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Dano Inimigo</span>
                <span className={styles.statValue}>{cpuDamageDealt}</span>
              </div>
            </div>
            
            <div className={styles.actions}>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => { resetBattle(); router.push('/map'); }}
              >
                PRÓXIMA FASE
              </button>
              <button 
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => { resetBattle(); router.push('/characters'); }}
              >
                MUDAR PERSONAGEM
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.gameContainer} ref={containerRef} role="application" aria-label="Area de jogo">
        {!battleReady && (
          <div className={styles.loaderContainer}>
            <GameLoader message="Preparando arena..." showProgress={false} />
          </div>
        )}
        <div className={styles.canvasWrapper} style={{ display: battleReady ? undefined : 'none' }}>
          <div id="game-container" className={styles.canvas} />
        </div>
        
        <div className={styles.hudOverlay}>
          <WeatherIndicator weather={currentWeather} wind={0} />
          <button
            className={styles.fullscreenBtn}
            onClick={handleToggleFullscreen}
            aria-label={isFS ? 'Sair da tela cheia' : 'Tela cheia'}
            title={isFS ? 'Sair da tela cheia' : 'Tela cheia'}
          >
            {isFS ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m20 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
        
        {orientationWarning && (
          <div className={styles.orientationOverlay} role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
              <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Gire seu aparelho</h3>
            <p>Para uma melhor experiência, jogue em orientação paisagem</p>
          </div>
        )}

        <PauseOverlay isPaused={isPaused} onResume={handleResume} onQuit={handleQuitPause} />
      </div>

      <MobileControls 
        disabled={battleResult !== 'playing'} 
        setMobileInput={setMobileInput}
      />

      <ContextualTipToast
        context={{
          missStreak: getMissStreak(),
          battleTurns: turnsPlayed,
        }}
      />
      <PhotoMode />

      <div className={styles.debugInfo} aria-hidden="true">
        {process.env.NODE_ENV === 'development' && (
          <details>
            <summary>Debug</summary>
            <pre>{JSON.stringify({ playerCharacter: playerCharacter?.id, cpuCharacter: cpuCharacter?.id, levelId, difficulty, turnsPlayed, battleResult }, null, 2)}</pre>
          </details>
        )}
      </div>
    </div>
  );
}