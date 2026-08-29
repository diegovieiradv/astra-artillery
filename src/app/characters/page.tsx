'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllCharacters, CHARACTER_ROLES } from '@/game/characters/registry';
import { useGameStore, useBattleStore } from '@/stores/gameStore';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

const ROLE_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(CHARACTER_ROLES).map(([key, value]) => [key, value.color])
);

type RoleKey = keyof typeof CHARACTER_ROLES | 'all';

const ROLE_FILTERS: { key: RoleKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  ...Object.entries(CHARACTER_ROLES).map(([key, value]) => ({
    key: key as RoleKey,
    label: value.label,
  })),
];

const DEFAULT_UNLOCKED = ['kai', 'luna', 'bolt', 'nova'];

function RoleFilterIcon({ role, size = 20 }: { role: RoleKey; size?: number }) {
  const color =
    role === 'all'
      ? '#ffffff'
      : CHARACTER_ROLES[role as keyof typeof CHARACTER_ROLES]?.color || '#ffffff';
  const svgProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (role) {
    case 'all':
      return (
        <svg {...svgProps}>
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={color}
            stroke="none"
          />
        </svg>
      );
    case 'balanced':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      );
    case 'precision':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" fill={color} />
        </svg>
      );
    case 'power':
      return (
        <svg {...svgProps}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={color} stroke="none" />
        </svg>
      );
    case 'support':
      return (
        <svg {...svgProps}>
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            fill={color}
            stroke="none"
          />
        </svg>
      );
    case 'mobility':
      return (
        <svg {...svgProps}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} stroke="none" />
        </svg>
      );
    case 'explosives':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="14" r="6" fill={color} stroke="none" />
          <path d="M12 2v4M8 4l1 3M16 4l-1 3" />
        </svg>
      );
    case 'defense':
      return (
        <svg {...svgProps}>
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            fill={color}
            stroke="none"
          />
        </svg>
      );
    case 'wind_specialist':
      return (
        <svg {...svgProps}>
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
        </svg>
      );
    case 'multi_shot':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="2" fill={color} />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      );
    case 'tactical':
      return (
        <svg {...svgProps}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    default:
      return (
        <svg {...svgProps}>
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={color}
            stroke="none"
          />
        </svg>
      );
  }
}

export default function CharactersPage() {
  const router = useRouter();
  const { selectedCharacterId, selectCharacter, unlockedCharacters, settings } =
    useGameStore();
  const { setBattleConfig } = useBattleStore();
  const characters = useMemo(() => getAllCharacters(), []);
  const [selectedId, setSelectedId] = useState<string | null>(selectedCharacterId);
  const [activeFilter, setActiveFilter] = useState<RoleKey>('all');
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
      : characters.filter((c) => c.role === activeFilter);

  const selectedChar = characters.find((c) => c.id === selectedId);
  const roleColor = selectedChar
    ? ROLE_COLORS[selectedChar.role] || '#4ade80'
    : '#4ade80';

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
          <h1 className={styles.title}>ESCOLHA SEU HERÓI</h1>
          <p className={styles.subtitle}>
            Cada herói possui habilidades únicas e um estilo de batalha
            especial!
          </p>
        </div>
        <div style={{ width: 80 }} />
      </header>

      <main className={styles.main}>
        <div className={styles.leftColumn}>
          <div
            className={styles.filterBar}
            role="toolbar"
            aria-label="Filtrar por função"
          >
            {ROLE_FILTERS.map((filter) => {
              const isActive = activeFilter === filter.key;
              const filterColor =
                filter.key === 'all'
                  ? '#ffffff'
                  : ROLE_COLORS[filter.key] || '#ffffff';
              return (
                <button
                  key={filter.key}
                  className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ''}`}
                  onClick={() => setActiveFilter(filter.key)}
                  aria-label={filter.label}
                  aria-pressed={isActive}
                  style={
                    isActive
                      ? {
                          borderColor: filterColor,
                          background: `${filterColor}25`,
                        }
                      : undefined
                  }
                >
                  <RoleFilterIcon role={filter.key} />
                </button>
              );
            })}
          </div>

          <div
            className={styles.characterGrid}
            role="listbox"
            aria-label="Selecionar personagem"
          >
            {filteredCharacters.map((char) => {
              const locked = !isUnlocked(char.id);
              const active = selectedId === char.id;
              const color = ROLE_COLORS[char.role] || '#4ade80';
              return (
                <motion.button
                  key={char.id}
                  className={`${styles.characterCard} ${active ? styles.characterCardSelected : ''} ${locked ? styles.characterCardLocked : ''}`}
                  onClick={() => handleSelect(char.id)}
                  disabled={locked}
                  role="option"
                  aria-selected={active}
                  aria-label={`${char.name}${locked ? ' (bloqueado)' : ''}`}
                  style={
                    active
                      ? {
                          borderColor: color,
                          boxShadow: `0 0 20px ${color}40, inset 0 0 20px ${color}10`,
                        }
                      : undefined
                  }
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
                  {active && (
                    <div
                      className={styles.activeIndicator}
                      style={{ background: color }}
                    />
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
                    <span
                      className={styles.roleBadge}
                      style={{
                        background: `${roleColor}25`,
                        color: roleColor,
                        borderColor: `${roleColor}50`,
                      }}
                    >
                      {CHARACTER_ROLES[selectedChar.role]?.label ||
                        selectedChar.role}
                    </span>
                  </div>
                  <p className={styles.charDescription}>
                    {selectedChar.description}
                  </p>

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

                  <div className={styles.statsSection}>
                    <span className={styles.statsLabel}>ATRIBUTOS</span>
                    {[
                      {
                        label: 'HP',
                        value: selectedChar.stats.health,
                        max: 150,
                        icon: '❤️',
                      },
                      {
                        label: 'ATK',
                        value: Math.round(selectedChar.stats.attack * 100),
                        max: 130,
                        icon: '⚔️',
                      },
                      {
                        label: 'DEF',
                        value: Math.round(selectedChar.stats.defense * 100),
                        max: 150,
                        icon: '🛡️',
                      },
                      {
                        label: 'SPD',
                        value: Math.round(selectedChar.stats.mobility * 100),
                        max: 140,
                        icon: '💨',
                      },
                    ].map((stat) => (
                      <div key={stat.label} className={styles.statRow}>
                        <span className={styles.statIcon}>{stat.icon}</span>
                        <span className={styles.statName}>{stat.label}</span>
                        <div className={styles.statBar}>
                          <motion.div
                            className={styles.statFill}
                            style={{ background: roleColor }}
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
      </footer>
    </div>
  );
}
