'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { default as dynamicImport } from 'next/dynamic';
import { useGameStore, useBattleStore } from '@/stores/gameStore';
import { getAllCharacters } from '@/game/characters/registry';
import { GameLoader } from '@/components/loading/GameLoader';
import styles from './page.module.css';

const WorldMapClient = dynamicImport(() => import('./WorldMapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#0f172a'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '1.5rem',
        color: '#4ade80'
      }}>
        <svg width="80" height="80" viewBox="0 0 120 120" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
          <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="4"/>
          <path d="M60 20 L60 55 M45 40 L60 55 L75 40" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="60" cy="60" r="12" fill="currentColor"/>
          <circle cx="60" cy="60" r="4" fill="#0f172a"/>
        </svg>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '1.125rem', fontWeight: 500 }}>Carregando mapa...</p>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  ),
});

export const dynamic = 'force-dynamic';

export default function MapPage() {
  const router = useRouter();
  const { unlockedLevels, completedLevels, selectedCharacterId } = useGameStore();
  const { setBattleConfig } = useBattleStore();
  const [showCharSelect, setShowCharSelect] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const characters = getAllCharacters();

  useEffect(() => {
    let mounted = true;
    
    const tryHydrate = () => {
      // Always check localStorage first — SSR hydration may have completed with default state
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('astra-artillery-save');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.version === 2 && parsed.selectedCharacterId) {
              useGameStore.setState(parsed, true); // replace state with persisted data
            }
          } catch {
            // ignore parse errors
          }
        }
      }
      // Then check middleware hydration status
      if (useGameStore.persist.hasHydrated()) {
        if (mounted) setHydrated(true);
        return true;
      }
      return false;
    };

    if (!tryHydrate()) {
      const unsub = useGameStore.persist.onFinishHydration(() => {
        if (mounted) setHydrated(true);
      });
      return () => { mounted = false; unsub(); };
    }
    return () => { mounted = false; };
  }, []);

  if (!hydrated) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (!selectedCharacterId) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Selecione um personagem primeiro...</p>
        </div>
      </div>
    );
  }

  const handleCharacterChange = () => {
    router.push('/characters');
  };

  const handleStartBattle = (data: { levelId: string; levelNumber: number; difficulty: string; cpuCharacterId: string }) => {
    const level = data;
    const battleStore = useBattleStore.getState();
    const { playerCharacter } = battleStore;
    if (!playerCharacter) {
      router.push('/characters');
      return;
    }
    
    const cpuChar = characters.find(c => c.id === level.cpuCharacterId) || characters[1];
    
    setBattleConfig({
      playerCharacter,
      cpuCharacter: cpuChar,
      levelId: level.levelId,
      difficulty: level.difficulty as 'easy' | 'normal' | 'hard',
    });
    
    router.push('/game');
  };

  const handleMapReady = (data: { unlockedLevels: string[]; completedLevels: Record<string, { stars: number; bestTurns: number; bestDamage: number }>; currentLevelId?: string }) => {
    // WorldMapScene is ready, data is already in store
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>GREEN VALLEY</h1>
        <button 
          className={styles.changeChar} 
          onClick={handleCharacterChange}
          aria-label="Trocar personagem"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      <main className={styles.main}>
        <WorldMapClient
          unlockedLevels={unlockedLevels}
          completedLevels={completedLevels}
          currentLevelId={unlockedLevels[unlockedLevels.length - 1] || 'arena_1'}
          onStartBattle={handleStartBattle}
        />
      </main>
    </div>
  );
}