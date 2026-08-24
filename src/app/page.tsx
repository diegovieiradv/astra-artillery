'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/stores/gameStore';
import { audioManager, initAudioFromSettings } from '@/utils/audio';
import { useI18n } from '@/hooks/useI18n';
import { SplashScreen } from '@/components/splash/SplashScreen';
import { AttractMode } from '@/components/ui/AttractMode';
import styles from './page.module.css';

const FEATURED_CHARS = [
  { id: 'kai', name: 'Kai', role: 'balanced' },
  { id: 'luna', name: 'Luna', role: 'precision' },
  { id: 'bolt', name: 'Bolt', role: 'mobility' },
  { id: 'nova', name: 'Nova', role: 'power' },
];

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const { selectedCharacterId, settings } = useGameStore();
  const { t } = useI18n();

  useEffect(() => {
    if (showSplash) return;
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, [showSplash]);

  useEffect(() => {
    initAudioFromSettings(settings);
    audioManager.preloadAll().catch(console.warn);
    audioManager.play('bgm_menu', 'music', { loop: true, volume: 0.4 });

    return () => {
      audioManager.stopMusic();
    };
  }, [settings.musicVolume, settings.musicEnabled, settings.sfxVolume, settings.sfxEnabled]);

  const handleStart = () => {
    if (selectedCharacterId) {
      window.location.href = '/map';
    } else {
      window.location.href = '/characters';
    }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className={styles.page}>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && <AttractMode />}

      {/* Background layers */}
      <div className={styles.skyBg} />
      <div className={styles.cloudLayer}>
        <div className={`${styles.cloud} ${styles.c1}`} />
        <div className={`${styles.cloud} ${styles.c2}`} />
        <div className={`${styles.cloud} ${styles.c3}`} />
      </div>
      <div className={styles.terrainBg} />

      <header className={styles.header} aria-hidden="true">
        <div className={styles.logoArea}>
          <h1 className={styles.title}>
            <span className={styles.titleMain}>ASTRA</span>
            <span className={styles.titleSub}>ARTILLERY</span>
          </h1>
          <p className={styles.subtitle}>{t('home.subtitle')}</p>
        </div>
      </header>

      <main className={styles.main}>
        {/* Character showcase */}
        <div className={`${styles.heroShowcase} ${showContent ? styles.visible : ''}`}>
          {FEATURED_CHARS.map((ch, i) => (
            <div key={ch.id} className={styles.heroCard} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.heroPortrait}>
                <img src={`/characters/avatar_${ch.id}.svg`} alt={ch.name} />
              </div>
              <span className={styles.heroLabel}>{ch.name}</span>
            </div>
          ))}
        </div>

        <div className={`${styles.buttonGroup} ${showContent ? styles.visible : ''}`}>
          <button
            className={`${styles.btn} ${styles.btnPlay}`}
            onClick={handleStart}
            aria-label={selectedCharacterId ? t('home.continueGame') : t('home.newGame')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
            {selectedCharacterId ? t('home.continueGame') : t('home.newGame')}
          </button>

          <div className={styles.secondaryRow}>
            <Link href="/workshop" className={`${styles.btn} ${styles.btnSecondary}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              {t('nav.workshop')}
            </Link>

            <Link href="/settings" className={`${styles.btn} ${styles.btnSecondary}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              {t('nav.settings')}
            </Link>

            <Link href="/about" className={`${styles.btn} ${styles.btnSecondary}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Sobre
            </Link>
          </div>
        </div>

        <div className={`${styles.version} ${showContent ? styles.visible : ''}`}>
          {t('home.version')}
        </div>
      </main>

      <footer className={styles.footer} aria-hidden="true">
        <p>{t('home.footer')}</p>
        <p className={styles.credit}>{t('home.footerTech')}</p>
      </footer>

      {settings.reduceMotion && <style jsx>{`
        .${styles.btn} { transition: none; }
        .${styles.cloud} { animation: none; }
      `}</style>}
    </div>
  );
}
