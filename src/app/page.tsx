'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/stores/gameStore';
import { audioManager, initAudioFromSettings } from '@/utils/audio';
import { useI18n } from '@/hooks/useI18n';
import { SplashScreen } from '@/components/splash/SplashScreen';
import { AttractMode } from '@/components/ui/AttractMode';
import styles from './page.module.css';

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

      <header className={styles.header} aria-hidden="true">
        <div className={styles.logoContainer}>
          <svg className={styles.logo} viewBox="0 0 120 120" role="img" aria-label="Astra Artillery Logo">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#4ade80" strokeWidth="4"/>
            <path d="M60 20 L60 55 M45 40 L60 55 L75 40" fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="60" cy="60" r="12" fill="#4ade80"/>
            <circle cx="60" cy="60" r="4" fill="#0f172a"/>
          </svg>
          <h1 className={styles.title}>ASTRA ARTILLERY</h1>
          <p className={styles.subtitle}>{t('home.subtitle')}</p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={`${styles.buttonGroup} ${showContent ? styles.visible : ''}`}>
          <button
            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}
            onClick={handleStart}
            aria-label={selectedCharacterId ? t('home.continueGame') : t('home.newGame')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {selectedCharacterId ? t('home.continueGame') : t('home.newGame')}
          </button>

          <div className={styles.secondaryButtons}>
            <Link href="/workshop" className={`${styles.btn} ${styles.btnSecondary}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              {t('nav.workshop')}
            </Link>

            <Link href="/settings" className={`${styles.btn} ${styles.btnSecondary}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
        .${styles.logo} { animation: none; }
      `}</style>}
    </div>
  );
}
