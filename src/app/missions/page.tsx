'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { MISSIONS, MISSION_CATEGORIES, MissionConfig, MissionProgress } from '@/game/data/missions';
import styles from './page.module.css';

export default function MissionsPage() {
  const {
    playerLevel,
    missions,
    completedMissions,
    getMissionProgress,
    claimMissionReward,
  } = useGameStore();

  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMission, setSelectedMission] = useState<MissionConfig | null>(null);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Carregando missões...</p>
        </div>
      </div>
    );
  }

  const categories = ['all', ...new Set(MISSIONS.map(m => m.category))];

  const isUnlocked = (mission: MissionConfig) => {
    if (!mission.unlockRequirement) return true;
    if (mission.unlockRequirement.type === 'level') {
      return playerLevel >= (mission.unlockRequirement.value as number);
    }
    return true;
  };

  const getProgress = (mission: MissionConfig): MissionProgress | undefined => {
    return missions[mission.id];
  };

  const isClaimable = (mission: MissionConfig) => {
    const progress = getProgress(mission);
    return progress && progress.completed && !progress.claimed;
  };

  const filteredMissions = selectedCategory === 'all'
    ? MISSIONS
    : MISSIONS.filter(m => m.category === selectedCategory);

  const totalCompleted = completedMissions.length;
  const totalMissions = MISSIONS.length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>MISSÕES</h1>
        <div className={styles.stats}>
          <span>{totalCompleted}/{totalMissions}</span>
        </div>
      </header>

      <main className={styles.main}>
        <nav className={styles.tabs} role="tablist">
          {categories.map((cat) => {
            const info = cat === 'all'
              ? { label: 'Todas', icon: '📋', color: '#94a3b8' }
              : MISSION_CATEGORIES[cat as keyof typeof MISSION_CATEGORIES];
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

        <div className={styles.list}>
          <AnimatePresence mode="wait">
            {filteredMissions.map((mission) => {
              const unlocked = isUnlocked(mission);
              const progress = getProgress(mission);
              const claimable = isClaimable(mission);
              const completed = progress?.completed || false;
              const catInfo = MISSION_CATEGORIES[mission.category];

              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className={`${styles.card} ${!unlocked ? styles.locked : ''} ${completed ? styles.completed : ''} ${claimable ? styles.claimable : ''}`}
                  onClick={() => unlocked && setSelectedMission(mission)}
                  role="button"
                  tabIndex={unlocked ? 0 : -1}
                  aria-disabled={!unlocked}
                >
                  <div className={styles.cardLeft}>
                    <span className={styles.cardIcon}>{catInfo.icon}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{mission.name}</h3>
                      {completed && !progress?.claimed && (
                        <span className={styles.claimableBadge}>Reivindicar</span>
                      )}
                      {progress?.claimed && (
                        <span className={styles.claimedBadge}>✓</span>
                      )}
                    </div>
                    <p className={styles.cardDesc}>{mission.description}</p>
                    <div className={styles.cardRewards}>
                      {mission.rewards.map((reward, i) => (
                        <span key={i} className={styles.rewardTag}>
                          {reward.type === 'currency' && `+${reward.quantity} Credits`}
                          {reward.type === 'xp' && `+${reward.quantity} XP`}
                          {reward.type === 'lore' && 'Lore'}
                          {reward.type === 'cosmetic' && 'Cosmético'}
                          {reward.type === 'skin' && 'Skin'}
                          {reward.type === 'title' && 'Título'}
                        </span>
                      ))}
                    </div>
                  </div>
                  {!unlocked && (
                    <div className={styles.lockedLabel}>
                      🔒 Nível {mission.unlockRequirement?.value}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedMission && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.modal}
              onClick={() => setSelectedMission(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label={selectedMission.name}
              >
                <h2>{selectedMission.name}</h2>
                <p>{selectedMission.description}</p>

                <div className={styles.objectivesList}>
                  <h3>Objetivos</h3>
                  {selectedMission.objectives.map((obj, i) => {
                    const progress = getProgress(selectedMission);
                    const current = progress?.currentProgress?.[obj.type] || 0;
                    const target = Number(obj.count || obj.target || 1);
                    return (
                      <div key={i} className={styles.objective}>
                        <span className={styles.objectiveIcon}>
                          {current >= target ? '✅' : '⬜'}
                        </span>
                        <span>{obj.type.replace(/_/g, ' ')}</span>
                        <span className={styles.objectiveProgress}>
                          {Math.min(current, target)}/{target}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.rewardsList}>
                  <h3>Recompensas</h3>
                  {selectedMission.rewards.map((reward, i) => (
                    <span key={i} className={styles.rewardTag}>
                      {reward.type === 'currency' && `+${reward.quantity} Credits`}
                      {reward.type === 'xp' && `+${reward.quantity} XP`}
                      {reward.type === 'lore' && 'Lore'}
                      {reward.type === 'cosmetic' && 'Cosmético'}
                      {reward.type === 'skin' && 'Skin'}
                      {reward.type === 'title' && 'Título'}
                    </span>
                  ))}
                </div>

                <div className={styles.modalActions}>
                  <button
                    onClick={() => setSelectedMission(null)}
                    className={styles.cancelBtn}
                  >
                    Fechar
                  </button>
                  {isClaimable(selectedMission) && (
                    <button
                      onClick={() => {
                        claimMissionReward(selectedMission.id);
                        setSelectedMission(null);
                      }}
                      className={styles.claimBtn}
                    >
                      REIVINDICAR
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
