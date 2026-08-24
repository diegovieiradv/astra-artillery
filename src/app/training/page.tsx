'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { TRAINING_MODES, TrainingModeConfig } from '@/game/data/trainingMode';
import styles from './page.module.css';

const CATEGORY_INFO: Record<string, { label: string; icon: string; color: string }> = {
  angle: { label: 'Ângulo', icon: '📐', color: '#60a5fa' },
  power: { label: 'Potência', icon: '💪', color: '#f87171' },
  wind: { label: 'Vento', icon: '🌬️', color: '#34d399' },
  projectile: { label: 'Projéteis', icon: '💣', color: '#fbbf24' },
  combined: { label: 'Combinado', icon: '⚡', color: '#a78bfa' },
};

const DIFFICULTY_INFO: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Iniciante', color: '#4ade80' },
  intermediate: { label: 'Intermediário', color: '#fbbf24' },
  advanced: { label: 'Avançado', color: '#f87171' },
};

export default function TrainingPage() {
  const { playerLevel, training } = useGameStore();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<TrainingModeConfig | null>(null);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Carregando treinamento...</p>
        </div>
      </div>
    );
  }

  const completedModes = training?.completedModes || [];
  const categories = ['all', ...new Set(TRAINING_MODES.map(m => m.category))];

  const filteredModes = selectedCategory === 'all'
    ? TRAINING_MODES
    : TRAINING_MODES.filter(m => m.category === selectedCategory);

  const isUnlocked = (mode: TrainingModeConfig) => {
    if (!mode.unlockRequirement) return true;
    if (mode.unlockRequirement.type === 'level') {
      return playerLevel >= (mode.unlockRequirement.value as number);
    }
    return true;
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>TREINAMENTO</h1>
        <div className={styles.stats}>
          <span>{completedModes.length}/{TRAINING_MODES.length}</span>
        </div>
      </header>

      <main className={styles.main}>
        <p className={styles.subtitle}>
          Pratique suas habilidades sem penalizar progresso.
        </p>

        <nav className={styles.tabs} role="tablist">
          {categories.map((cat) => {
            const info = cat === 'all' ? { label: 'Todos', icon: '🎯', color: '#94a3b8' } : CATEGORY_INFO[cat];
            return (
              <button
                key={cat}
                className={`${styles.tab} ${selectedCategory === cat ? styles.tabActive : ''}`}
                onClick={() => setSelectedCategory(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
                style={selectedCategory === cat ? { borderColor: info.color, color: info.color } : undefined}
              >
                <span aria-hidden="true">{info.icon}</span>
                {info.label}
              </button>
            );
          })}
        </nav>

        <div className={styles.grid}>
          <AnimatePresence mode="wait">
            {filteredModes.map((mode) => {
              const unlocked = isUnlocked(mode);
              const completed = completedModes.includes(mode.id);
              const catInfo = CATEGORY_INFO[mode.category];
              const diffInfo = DIFFICULTY_INFO[mode.difficulty];

              return (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${styles.card} ${!unlocked ? styles.locked : ''} ${completed ? styles.completed : ''}`}
                  onClick={() => unlocked && setSelectedMode(mode)}
                  role="button"
                  tabIndex={unlocked ? 0 : -1}
                  aria-disabled={!unlocked}
                  aria-label={`${mode.name} - ${unlocked ? (completed ? 'Concluído' : 'Disponível') : 'Bloqueado'}`}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.cardIcon}>{catInfo.icon}</span>
                    <span className={styles.cardDiff} style={{ color: diffInfo.color }}>
                      {diffInfo.label}
                    </span>
                  </div>
                  <h3 className={styles.cardTitle}>{mode.name}</h3>
                  <p className={styles.cardDesc}>{mode.description}</p>
                  <div className={styles.cardMeta}>
                    <span>{mode.duration}min</span>
                    <span>{mode.objectives.length} objetivos</span>
                  </div>
                  {completed && (
                    <div className={styles.completedBadge}>✓ Concluído</div>
                  )}
                  {!unlocked && (
                    <div className={styles.lockedOverlay}>
                      🔒 Nível {mode.unlockRequirement?.value} necessário
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.modal}
              onClick={() => setSelectedMode(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label={selectedMode.name}
              >
                <h2>{selectedMode.name}</h2>
                <p>{selectedMode.description}</p>
                
                <div className={styles.objectivesList}>
                  <h3>Objetivos</h3>
                  {selectedMode.objectives.map((obj) => (
                    <div key={obj.id} className={styles.objective}>
                      <span className={obj.optional ? styles.optional : styles.required}>
                        {obj.optional ? '○' : '●'}
                      </span>
                      <span>{obj.description}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.rewardsList}>
                  <h3>Recompensas</h3>
                  {selectedMode.rewards.map((reward, i) => (
                    <span key={i} className={styles.rewardTag}>
                      {reward.type === 'xp' && `+${reward.value} XP`}
                      {reward.type === 'currency' && `+${reward.value} Credits`}
                      {reward.type === 'mastery' && `+${reward.value} Mastery`}
                    </span>
                  ))}
                </div>

                <div className={styles.modalActions}>
                  <button
                    onClick={() => setSelectedMode(null)}
                    className={styles.cancelBtn}
                  >
                    Fechar
                  </button>
                  <Link
                    href={`/game?mode=training&level=${selectedMode.id}`}
                    className={styles.startBtn}
                    onClick={() => setSelectedMode(null)}
                  >
                    INICIAR TREINO
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
