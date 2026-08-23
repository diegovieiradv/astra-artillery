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
  const [loading, setLoading] = useState(true);
  const [orientationWarning, setOrientationWarning] = useState(false);

  const { isReady, startWorldMap, destroyGame, setMobileInput } = usePhaserGame({
    containerRef,
    onGameReady: () => setLoading(false),
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
    if (isReady) {
      startWorldMap({
        unlockedLevels,
        completedLevels,
        currentLevelId,
      });
    }
  }, [isReady, startWorldMap, unlockedLevels, completedLevels, currentLevelId]);

  useEffect(() => {
    if (!isReady) return;
    startWorldMap({
      unlockedLevels,
      completedLevels,
      currentLevelId,
    });
  }, [unlockedLevels, completedLevels, currentLevelId, isReady, startWorldMap]);

  if (loading || !isReady) {
    return (
      <div className={styles.page}>
        <div className={styles.loaderContainer}>
          <GameLoader message="Carregando mapa..." showProgress={false} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.gameContainer} ref={containerRef} role="application" aria-label="Mapa do mundo">
        <div className={styles.canvasWrapper}>
          <div id="worldmap-container" className={styles.canvas} />
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
    </div>
  );
}