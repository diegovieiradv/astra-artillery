'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllCharacters, CHARACTER_ROLES } from '@/game/characters/registry';
import { useGameStore, useBattleStore } from '@/stores/gameStore';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

const ROLE_COLORS: Record<string, string> = {
  balanced: '#4ade80',
  precision: '#60a5fa',
  power: '#f97316',
  support: '#a78bfa',
  mobility: '#facc15',
  explosives: '#ef4444',
  defense: '#06b6d4',
  wind_specialist: '#34d399',
  multi_shot: '#f472b6',
  tactical: '#818cf8',
};

export default function CharactersPage() {
  const router = useRouter();
  const { selectedCharacterId, selectCharacter, unlockedCharacters } = useGameStore();
  const { setBattleConfig } = useBattleStore();
  const characters = getAllCharacters();
  const [selectedId, setSelectedId] = useState<string | null>(selectedCharacterId);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (selectedCharacterId) setSelectedId(selectedCharacterId);
  }, [selectedCharacterId]);

  useEffect(() => {
    if (selectedId) selectCharacter(selectedId);
  }, [selectedId, selectCharacter]);

  const selectedChar = characters.find(c => c.id === selectedId);
  const roleColor = selectedChar ? (ROLE_COLORS[selectedChar.role] || '#4ade80') : '#4ade80';

  const isUnlocked = (id: string) => {
    return unlockedCharacters.includes(id) || characters.findIndex(c => c.id === id) < 4;
  };

  const handleConfirm = () => {
    if (!selectedId || !selectedChar) return;
    setBattleConfig({
      playerCharacter: selectedChar,
      cpuCharacter: characters.find(c => c.id === 'luna')!,
      levelId: 'arena_1',
      difficulty: 'normal',
    });
    router.push('/map');
  };

  if (!mounted) {
    return (
      <div className={styles.page}>
        <div className={styles.loading} aria-live="polite">
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>ESCOLHA SEU HERÓI</h1>
        <div style={{ width: 40 }} />
      </header>

      <main className={styles.main}>
        <div className={styles.previewArea}>
          <AnimatePresence mode="wait">
            {selectedChar ? (
              <motion.div
                key={selectedChar.id}
                className={styles.preview}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.portraitWrap} style={{ borderColor: `${roleColor}40` }}>
                  <Image
                    src={`/characters/${selectedChar.avatarKey}.svg`}
                    alt={selectedChar.name}
                    width={280}
                    height={280}
                    className={styles.portrait}
                    priority
                  />
                  <div className={styles.portraitGlow} style={{ background: `radial-gradient(circle, ${roleColor}20 0%, transparent 70%)` }} />
                </div>

                <div className={styles.infoPanel}>
                  <div className={styles.nameRow}>
                    <h2 className={styles.charName}>{selectedChar.name}</h2>
                    <span className={styles.roleTag} style={{ background: `${roleColor}20`, color: roleColor, borderColor: `${roleColor}40` }}>
                      {CHARACTER_ROLES[selectedChar.role]?.label || selectedChar.role}
                    </span>
                  </div>
                  <p className={styles.charDesc}>{selectedChar.description}</p>

                  <div className={styles.statsGrid}>
                    {[
                      { label: 'HP', value: Math.round(selectedChar.stats.health * 100), max: 150, icon: '❤️' },
                      { label: 'ATK', value: Math.round(selectedChar.stats.attack * 100), max: 130, icon: '⚔️' },
                      { label: 'DEF', value: Math.round(selectedChar.stats.defense * 100), max: 150, icon: '🛡️' },
                      { label: 'SPD', value: Math.round(selectedChar.stats.mobility * 100), max: 140, icon: '💨' },
                    ].map((stat) => (
                      <div key={stat.label} className={styles.statItem}>
                        <div className={styles.statHeader}>
                          <span className={styles.statIcon}>{stat.icon}</span>
                          <span className={styles.statLabel}>{stat.label}</span>
                          <span className={styles.statValue}>{stat.value}</span>
                        </div>
                        <div className={styles.statBar}>
                          <motion.div
                            className={styles.statFill}
                            style={{ background: roleColor }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.abilityBlock}>
                    <div className={styles.abilityHeader}>
                      <span className={styles.abilityIcon}>⭐</span>
                      <span className={styles.abilityName}>{selectedChar.specialAbility.name}</span>
                      <span className={styles.abilityCD}>{selectedChar.specialAbility.cooldown}T CD</span>
                    </div>
                    <p className={styles.abilityDesc}>{selectedChar.specialAbility.description}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className={styles.emptyState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>Selecione um herói abaixo</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.selectorArea}>
          <div className={styles.charScroller} ref={scrollRef} role="listbox" aria-label="Selecionar personagem">
            {characters.map((char) => {
              const locked = !isUnlocked(char.id);
              const active = selectedId === char.id;
              const color = ROLE_COLORS[char.role] || '#4ade80';
              return (
                <button
                  key={char.id}
                  className={`${styles.thumb} ${active ? styles.thumbActive : ''} ${locked ? styles.thumbLocked : ''}`}
                  onClick={() => !locked && setSelectedId(char.id)}
                  disabled={locked}
                  role="option"
                  aria-selected={active}
                  aria-label={`${char.name}${locked ? ' (bloqueado)' : ''}`}
                  style={active ? { borderColor: color, boxShadow: `0 0 16px ${color}40` } : undefined}
                >
                  {locked ? (
                    <div className={styles.lockIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                  ) : (
                    <Image
                      src={`/characters/avatar_${char.id}.svg`}
                      alt={char.name}
                      width={56}
                      height={56}
                      className={styles.thumbImg}
                    />
                  )}
                  <span className={styles.thumbName}>{char.name}</span>
                  {active && <div className={styles.thumbIndicator} style={{ background: color }} />}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <motion.button
          className={`${styles.confirmBtn} ${selectedId ? '' : styles.disabled}`}
          onClick={handleConfirm}
          disabled={!selectedId}
          whileHover={selectedId ? { scale: 1.03 } : undefined}
          whileTap={selectedId ? { scale: 0.97 } : undefined}
        >
          ESCOLHER E JOGAR
        </motion.button>
      </footer>
    </div>
  );
}
