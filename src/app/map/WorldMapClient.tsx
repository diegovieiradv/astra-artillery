'use client';

import { useEffect, useRef, useState } from 'react';
import { usePhaserGame } from '@/hooks/usePhaserGame';
import { GameLoader } from '@/components/loading/GameLoader';
import styles from './WorldMapClient.module.css';

interface WorldMapClientProps {
  unlockedLevels: string[];
  completedLevels: Record<string, { stars: number; bestTurns: number; bestDamage: number }>;
  currentLevelId: string;
  onStartBattle: (data: { levelId: string; levelNumber: number; difficulty: string; cpuCharacterId: string }) => void;
}

export default function WorldMapClient({
  unlockedLevels,
  completedLevels,
  currentLevelId,
  onStartBattle,
}: WorldMapClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [engineError, setEngineError] = useState(false);
  const [orientationWarning, setOrientationWarning] = useState(false);

  const { isReady, status, error, startWorldMap, destroyGame, setMobileInput, game } = usePhaserGame({
    containerRef,
    onStartBattle,
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
      return;
    }
  }, [status, error]);

  useEffect(() => {
    if (isReady && game) {
      const onWorldMapReady = () => {
        setSceneReady(true);
      };
      game.events.once('world-map-ready', onWorldMapReady);

      startWorldMap({
        unlockedLevels,
        completedLevels,
        currentLevelId,
      });

      return () => {
        game.events.off('world-map-ready', onWorldMapReady);
      };
    }
  }, [isReady, game, startWorldMap, unlockedLevels, completedLevels, currentLevelId]);

  if (engineError) {
    return (
      <div className={styles.page}>
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
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.gameContainer} ref={containerRef} role="application" aria-label="Mapa do mundo">
        {!sceneReady && (
          <div className={styles.loaderContainer}>
            <GameLoader message="Carregando mapa..." showProgress={false} />
          </div>
        )}
        <div className={styles.canvasWrapper} style={{ display: sceneReady ? undefined : 'none' }}>
          <div id="worldmap-container" className={styles.canvas} />
        </div>
        
        {orientationWarning && (
          <div className={styles.orientationOverlay} role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
              <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Gire seu aparelho</h3>
            <p>Para uma melhor experiencia, jogue em orientacao paisagem</p>
          </div>
        )}
      </div>
    </div>
  );
}
