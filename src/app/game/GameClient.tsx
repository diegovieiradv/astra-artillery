'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePhaserGame, useGameControls } from '@/hooks/usePhaserGame';
import { useGameStore, useBattleStore } from '@/stores/gameStore';
import { MobileControls } from '@/components/game/MobileControls';
import { GameLoader } from '@/components/loading/GameLoader';
import { CHARACTERS, LEVELS } from '@/game/characters/registry';
import { audioManager, initAudioFromSettings, vibrationManager } from '@/utils/audio';
import styles from './page.module.css';

export default function GameClient() {
  const router = useRouter();
  const { playerCharacter, cpuCharacter, levelId, difficulty, battleResult, turnsPlayed, playerDamageDealt, cpuDamageDealt, setBattleResult, resetBattle } = useBattleStore();
  const { settings, unlockLevel, completeLevel } = useGameStore();
  
const containerRef = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);
  const [winner, setWinner] = useState<'player' | 'cpu' | null>(null);
  const [loading, setLoading] = useState(true);
  const [orientationWarning, setOrientationWarning] = useState(false);
  
  const { controls } = useGameControls();
  
  useEffect(() => {
    initAudioFromSettings(settings);
    audioManager.preloadAll().catch(console.warn);
    audioManager.play('bgm_battle', 'music', { loop: true, volume: 0.5 });
    
    return () => {
      audioManager.stopMusic();
    };
  }, [settings.musicVolume, settings.musicEnabled, settings.sfxVolume, settings.sfxEnabled]);
   
  const { isReady, startBattle, destroyGame, setMobileInput } = usePhaserGame({
    containerRef,
    onGameReady: () => setLoading(false),
    onBattleEnd: (result) => {
      setWinner(result.winner);
      const isPlayerWin = result.winner === 'player';
      setBattleResult(isPlayerWin ? 'player_win' : 'cpu_win');
      
      if (isPlayerWin && levelId) {
        const levelIndex = LEVELS.findIndex(l => l.id === levelId);
        if (levelIndex >= 0 && levelIndex < LEVELS.length - 1) {
          const nextLevel = LEVELS[levelIndex + 1];
          unlockLevel(nextLevel.id);
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
    if (!playerCharacter || !cpuCharacter) {
      router.push('/characters');
    }
  }, [playerCharacter, cpuCharacter, router]);

  if (loading || !isReady) {
    return (
      <div className={styles.page}>
        <div className={styles.loaderContainer}>
          <GameLoader message="Preparando arena..." showProgress={false} />
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
      <div className={styles.gameContainer} ref={containerRef} role="application" aria-label="Área de jogo">
        <div className={styles.canvasWrapper}>
          <div id="game-container" className={styles.canvas} />
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
      </div>

      <MobileControls 
        disabled={battleResult !== 'playing'} 
        setMobileInput={setMobileInput}
      />

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