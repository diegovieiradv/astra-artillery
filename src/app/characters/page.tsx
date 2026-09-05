'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllCharacters, CHARACTER_ROLES } from '@/game/characters/registry';
import { CHARACTER_ELEMENTS } from '@/types/character';
import { useGameStore, useBattleStore } from '@/stores/gameStore';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

const ROLE_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(CHARACTER_ROLES).map(([key, value]) => [key, value.color])
);

type ElementKey = 'all' | 'fire' | 'ice' | 'dark' | 'nature' | 'electricity' | 'arcane' | 'artillery' | 'energy' | 'cosmic';

const ELEMENT_FILTERS: { key: ElementKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  ...Object.entries(CHARACTER_ELEMENTS).map(([key]) => ({
    key: key as ElementKey,
    label: CHARACTER_ELEMENTS[key].icon,
  })),
];

const DEFAULT_UNLOCKED = ['kai', 'luna', 'bolt', 'nova'];

const DIFFICULTY_MAP: Record<string, { label: string; stars: number }> = {
  easy: { label: 'FÁCIL', stars: 1 },
  medium: { label: 'MÉDIA', stars: 2 },
  hard: { label: 'DIFÍCIL', stars: 3 },
};

const STAT_COLORS = {
  attack: '#f87171',
  defense: '#60a5fa',
  mobility: '#4ade80',
  luck: '#fbbf24',
};

function ElementFilterIcon({ element, size = 20 }: { element: ElementKey; size?: number }) {
  if (element === 'all') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill="#ffffff"
          stroke="none"
        />
      </svg>
    );
  }
  const elemInfo = CHARACTER_ELEMENTS[element];
  if (!elemInfo) return null;
  return (
    <span style={{ fontSize: size * 0.7, lineHeight: 1 }}>
      {elemInfo.icon}
    </span>
  );
}

export default function CharactersPage() {
  const router = useRouter();
  const { selectedCharacterId, selectCharacter, unlockedCharacters, settings } =
    useGameStore();
  const { setBattleConfig } = useBattleStore();
  const characters = useMemo(() => getAllCharacters(), []);
  const [selectedId, setSelectedId] = useState<string | null>(selectedCharacterId);
  const [activeFilter, setActiveFilter] = useState<ElementKey>('all');
  const [mounted, setMounted] = useState(false);

  const reduceMotion = settings?.reduceMotion ?? false;

  useEffect(() => {
    setMounted(true);
    if (selectedCharacterId) setSelectedId(selectedCharacterId);
  }, [selectedCharacterId]);

  useEffect(() => {
    if (selectedId) selectCharacter(selectedId);
  }, [selectedId, selectCharacter]);

  const filteredCharacters =
    activeFilter === 'all'
      ? characters
      : characters.filter((c) => c.element === activeFilter);

  const selectedChar = characters.find((c) => c.id === selectedId);
  const roleColor = selectedChar
    ? ROLE_COLORS[selectedChar.role] || '#d4a73a'
    : '#d4a73a';
  const elementInfo = selectedChar?.element ? CHARACTER_ELEMENTS[selectedChar.element] : null;
  const difficultyInfo = selectedChar?.difficulty ? DIFFICULTY_MAP[selectedChar.difficulty] : null;

  // Calculate stats as 0-100 scale for display
  const getStatDisplay = useCallback((stat: string, value: number) => {
    const maxMap: Record<string, number> = {
      attack: 130,
      defense: 150,
      mobility: 140,
    };
    const max = maxMap[stat] || 100;
    const pct = Math.round((value / max) * 100);
    // Simulate "luck" as a derived stat from attack + mobility
    return pct;
  }, []);

  const luckValue = selectedChar
    ? Math.round(((selectedChar.stats.attack + selectedChar.stats.mobility) / 2.4) * 100)
    : 0;

  const isUnlocked = useCallback(
    (id: string) => {
      return (
        unlockedCharacters.includes(id) ||
        DEFAULT_UNLOCKED.includes(id)
      );
    },
    [unlockedCharacters]
  );

  const handleSelect = useCallback(
    (id: string) => {
      if (!isUnlocked(id)) return;
      setSelectedId(id);
    },
    [isUnlocked]
  );

  const handleConfirm = useCallback(() => {
    if (!selectedId || !selectedChar) return;
    const opponents = characters.filter((c) => c.id !== selectedId);
    const cpuCharacter =
      opponents[Math.floor(Math.random() * opponents.length)];
    setBattleConfig({
      playerCharacter: selectedChar,
      cpuCharacter,
      levelId: 'arena_1',
      difficulty: 'normal',
    });
    router.push('/map');
  }, [selectedId, selectedChar, characters, setBattleConfig, router]);

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
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>VOLTAR</span>
        </Link>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>ESCOLHA SEU PERSONAGEM</h1>
          <p className={styles.subtitle}>
            Cada herói possui habilidades únicas e um estilo de batalha
            especial!
          </p>
        </div>
        <div style={{ width: 80 }} />
      </header>

      <main className={styles.main}>
        <div className={styles.leftColumn}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionDiamond} />
            <h2>HERÓIS DISPONÍVEIS</h2>
            <div className={styles.sectionDiamond} />
          </div>

          <div
            className={styles.characterGrid}
            role="listbox"
            aria-label="Selecionar personagem"
          >
            {filteredCharacters.map((char) => {
              const locked = !isUnlocked(char.id);
              const active = selectedId === char.id;
              const elem = char.element ? CHARACTER_ELEMENTS[char.element] : null;
              return (
                <motion.button
                  key={char.id}
                  className={`${styles.characterCard} ${active ? styles.characterCardSelected : ''} ${locked ? styles.characterCardLocked : ''}`}
                  onClick={() => handleSelect(char.id)}
                  disabled={locked}
                  role="option"
                  aria-selected={active}
                  aria-label={`${char.name}${locked ? ' (bloqueado)' : ''}`}
                  whileHover={!reduceMotion && !locked ? { scale: 1.06 } : undefined}
                  whileTap={!reduceMotion && !locked ? { scale: 0.94 } : undefined}
                  transition={{ duration: 0.15 }}
                >
                  {locked ? (
                    <div className={styles.lockOverlay}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  ) : (
                    <Image
                      src={`/characters/avatar_${char.id}.svg`}
                      alt={char.name}
                      width={64}
                      height={64}
                      className={styles.characterAvatar}
                    />
                  )}
                  <span className={styles.characterName}>{char.name}</span>
                  {elem && (
                    <span className={styles.characterElement}>{elem.icon}</span>
                  )}
                  {active && (
                    <div className={styles.activeIndicator} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <AnimatePresence mode="wait">
            {selectedChar ? (
              <motion.div
                key={selectedChar.id}
                className={styles.previewPanel}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.previewImageWrap}>
                  <div
                    className={styles.previewPlatform}
                    style={{
                      background: `radial-gradient(circle, ${roleColor}30 0%, transparent 70%)`,
                    }}
                  />
                  <Image
                    src={`/characters/${selectedChar.id}.svg`}
                    alt={selectedChar.name}
                    width={280}
                    height={280}
                    className={styles.previewImage}
                    priority
                  />
                </div>

                <div className={styles.detailsPanel}>
                  <div className={styles.detailsHeader}>
                    <h2 className={styles.charName}>{selectedChar.name}</h2>
                  </div>
                  {selectedChar.title && (
                    <span className={styles.charTitle}>{selectedChar.title}</span>
                  )}
                  <p className={styles.charDescription}>
                    {selectedChar.description}
                  </p>

                  {/* Difficulty */}
                  {difficultyInfo && (
                    <div className={styles.difficultySection}>
                      <span className={styles.difficultyLabel}>DIFICULDADE:</span>
                      <div className={styles.difficultyStars}>
                        {[1, 2, 3].map((star) => (
                          <span
                            key={star}
                            className={`${styles.difficultyStar} ${star <= difficultyInfo.stars ? styles.difficultyStarActive : ''}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className={styles.difficultyText}>{difficultyInfo.label}</span>
                    </div>
                  )}

                  {/* Ability */}
                  <div className={styles.abilitySection}>
                    <div className={styles.abilityHeader}>
                      <span className={styles.abilityLabel}>
                        HABILIDADE ESPECIAL
                      </span>
                    </div>
                    <div className={styles.abilityCard}>
                      <div className={styles.abilityTitle}>
                        <span
                          className={styles.abilityStar}
                          style={{ color: roleColor }}
                        >
                          ★
                        </span>
                        <span>{selectedChar.specialAbility.name}</span>
                        <span className={styles.abilityCooldown}>
                          {selectedChar.specialAbility.cooldown}T CD
                        </span>
                      </div>
                      <p className={styles.abilityDescription}>
                        {selectedChar.specialAbility.description}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className={styles.statsSection}>
                    <span className={styles.statsLabel}>ATRIBUTOS</span>
                    {[
                      {
                        label: 'ATAQUE',
                        value: Math.round(selectedChar.stats.attack * 100),
                        max: 130,
                        color: STAT_COLORS.attack,
                      },
                      {
                        label: 'DEFESA',
                        value: Math.round(selectedChar.stats.defense * 100),
                        max: 150,
                        color: STAT_COLORS.defense,
                      },
                      {
                        label: 'AGIL.',
                        value: Math.round(selectedChar.stats.mobility * 100),
                        max: 140,
                        color: STAT_COLORS.mobility,
                      },
                      {
                        label: 'SORTE',
                        value: Math.min(100, Math.round(
                          ((selectedChar.stats.attack + selectedChar.stats.mobility) / 2.4) * 100
                        )),
                        max: 100,
                        color: STAT_COLORS.luck,
                      },
                    ].map((stat) => (
                      <div key={stat.label} className={styles.statRow}>
                        <span className={styles.statName}>{stat.label}</span>
                        <div className={styles.statBar}>
                          <motion.div
                            className={styles.statFill}
                            style={{ background: stat.color }}
                            initial={
                              reduceMotion
                                ? {
                                    width: `${(stat.value / stat.max) * 100}%`,
                                  }
                                : { width: 0 }
                            }
                            animate={{
                              width: `${(stat.value / stat.max) * 100}%`,
                            }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                          />
                        </div>
                        <span className={styles.statValue}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className={styles.emptyState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>Selecione um herói</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className={styles.footer}>
        {/* Filters at bottom-left */}
        <div
          className={styles.filterBar}
          role="toolbar"
          aria-label="Filtrar por elemento"
        >
          <span className={styles.filterLabel}>FILTRAR POR:</span>
          {ELEMENT_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ''}`}
                onClick={() => setActiveFilter(filter.key)}
                aria-label={filter.key === 'all' ? 'Todos' : CHARACTER_ELEMENTS[filter.key]?.label || filter.key}
                aria-pressed={isActive}
              >
                <ElementFilterIcon element={filter.key} />
              </button>
            );
          })}
        </div>

        {/* Confirm button */}
        <motion.button
          className={`${styles.confirmBtn} ${selectedId ? '' : styles.confirmBtnDisabled}`}
          onClick={handleConfirm}
          disabled={!selectedId}
          whileHover={
            !reduceMotion && selectedId ? { scale: 1.03 } : undefined
          }
          whileTap={
            !reduceMotion && selectedId ? { scale: 0.97 } : undefined
          }
        >
          CONFIRMAR HERÓI
        </motion.button>
        <span className={styles.confirmBtnSubtitle}>INICIAR AVENTURA</span>

        {/* Tip */}
        <p className={styles.tipText}>
          DICA: Você pode desbloquear novos heróis avançando no jogo!
        </p>
      </footer>
    </div>
  );
}
