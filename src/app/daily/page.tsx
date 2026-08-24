'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getDailyChallenge, type DailyChallenge } from '@/game/data/ranking';
import { useGameStore, useBattleStore } from '@/stores/gameStore';
import { getAllCharacters } from '@/game/characters/registry';
import styles from './page.module.css';

export default function DailyChallengePage() {
  const router = useRouter();
  const { selectCharacter, selectedCharacterId } = useGameStore();
  const { setBattleConfig } = useBattleStore();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const daily = getDailyChallenge();
    setChallenge(daily);
    const stored = localStorage.getItem(`daily-completed-${daily.date}`);
    if (stored) setCompleted(true);
  }, []);

  const handleStart = () => {
    if (!challenge) return;
    const characters = getAllCharacters();
    const player = characters.find(c => c.id === (selectedCharacterId || 'kai'))!;
    selectCharacter(player.id);
    setBattleConfig({
      playerCharacter: player,
      cpuCharacter: characters.find(c => c.id === 'luna')!,
      levelId: challenge.levelId,
      difficulty: 'normal',
    });
    router.push('/game?daily=1');
  };

  if (!mounted || !challenge) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}><div className={styles.spinner} /></div>
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
        <h1 className={styles.title}>DESAFIO DIARIO</h1>
        <div style={{ width: 40 }} />
      </header>

      <main className={styles.main}>
        <motion.div
          className={styles.challengeCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.dateBadge}>{challenge.date}</div>
          <h2 className={styles.challengeName}>{challenge.title}</h2>
          <p className={styles.challengeDesc}>{challenge.description}</p>

          <div className={styles.challengeInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Fase</span>
              <span className={styles.infoValue}>{challenge.levelId.replace('arena_', 'Arena ')}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Modificador</span>
              <span className={styles.infoValue}>
                {challenge.modifierType === 'wind' && `Vento ${(challenge.modifierValue * 100).toFixed(0)}%`}
                {challenge.modifierType === 'hp' && `HP minimo ${challenge.modifierValue}%`}
                {challenge.modifierType === 'turns' && `Max ${challenge.modifierValue} turnos`}
                {challenge.modifierType === 'accuracy' && `Precisao ${challenge.modifierValue}%+`}
                {challenge.modifierType === 'projectile' && 'Projeteis normais apenas'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Estrelas</span>
              <span className={styles.infoValue}>{'⭐'.repeat(challenge.targetStars)}</span>
            </div>
          </div>

          {completed ? (
            <div className={styles.completedBadge}>
              <span>✅ Desafio Completo!</span>
            </div>
          ) : (
            <motion.button
              className={styles.startBtn}
              onClick={handleStart}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              INICIAR DESAFIO
            </motion.button>
          )}
        </motion.div>

        <div className={styles.legend}>
          <h3 className={styles.legendTitle}>Como funciona</h3>
          <p className={styles.legendText}>
            O desafio diario gera um desafio unico baseado na data. Todos os jogadores
            recebem o mesmo desafio no mesmo dia. Complete para ganhar estrelas extras!
          </p>
        </div>
      </main>
    </div>
  );
}
