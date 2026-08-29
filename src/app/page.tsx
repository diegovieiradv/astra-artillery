'use client';

import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { audioManager, initAudioFromSettings } from '@/utils/audio';
import { useI18n } from '@/hooks/useI18n';
import { SplashScreen } from '@/components/splash/SplashScreen';
import styles from './page.module.css';

/** Positions (top%, left%) for the twinkling star particles */
const PARTICLE_POSITIONS = [
  { top: '8%', left: '12%', delay: '0s' },
  { top: '15%', left: '78%', delay: '0.8s' },
  { top: '22%', left: '45%', delay: '1.5s' },
  { top: '35%', left: '88%', delay: '0.3s' },
  { top: '12%', left: '55%', delay: '2.1s' },
  { top: '45%', left: '8%', delay: '1.0s' },
  { top: '55%', left: '92%', delay: '0.6s' },
  { top: '65%', left: '20%', delay: '1.8s' },
  { top: '30%', left: '30%', delay: '2.5s' },
  { top: '50%', left: '65%', delay: '0.2s' },
  { top: '18%', left: '95%', delay: '1.2s' },
  { top: '70%', left: '50%', delay: '0.9s' },
  { top: '40%', left: '72%', delay: '2.0s' },
  { top: '25%', left: '5%', delay: '1.4s' },
  { top: '60%', left: '38%', delay: '0.5s' },
];

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const { selectedCharacterId, settings } = useGameStore();
  const { t } = useI18n();

  // Memoize particles to avoid re-renders
  const particles = useMemo(() => PARTICLE_POSITIONS, []);

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
    <div className={`${styles.titleScreen} ${settings.reduceMotion ? styles.reduceMotion : ''}`}>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Cover image as fullscreen background */}
      <div className={styles.coverImage} />

      {/* Subtle gradient overlay for readability */}
      <div className={styles.overlay} />

      {/* Twinkling star particles */}
      <div className={styles.particles}>
        {particles.map((p, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{ top: p.top, left: p.left, animationDelay: p.delay }}
          />
        ))}
      </div>

      {/* Logo/Title - preserved for a11y/SEO */}
      <header aria-hidden="true" className={`${styles.header} ${showContent ? styles.visible : ''}`}>
        <h1 className={styles.title}>
          <span className={styles.titleMain}>ASTRA</span>
          <span className={styles.titleSub}>ARTILLERY</span>
        </h1>
        <p className={styles.subtitle}>{t('home.subtitle')}</p>
      </header>

      {/* Play button - videogame cartoon style */}
      <main className={`${styles.main} ${showContent ? styles.visible : ''}`}>
        <button
          className={styles.btnPlay}
          onClick={handleStart}
          aria-label={selectedCharacterId ? t('home.continueGame') : t('home.newGame')}
        >
          {t('common.play').toUpperCase()}
        </button>
      </main>

      {/* Discreet footer */}
      <footer className={styles.footer}>
        <p>{t('home.version')}</p>
      </footer>
    </div>
  );
}
