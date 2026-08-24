'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getAllCharacters, CHARACTER_ROLES } from '@/game/characters/registry';
import { useBattleStore } from '@/stores/gameStore';
import styles from './page.module.css';

const WIND_OPTIONS = [
  { label: 'Sem vento', value: 0 },
  { label: 'Leve', value: 0.3 },
  { label: 'Moderado', value: 0.6 },
  { label: 'Forte', value: 0.9 },
  { label: 'Extremo', value: 1.0 },
];

const DIFFICULTY_OPTIONS = ['easy', 'normal', 'hard'] as const;
const PROJECTILE_OPTIONS = ['normal', 'piercing', 'bouncing', 'cluster'] as const;

export default function SandboxPage() {
  const router = useRouter();
  const { setBattleConfig } = useBattleStore();
  const characters = getAllCharacters();

  const [playerId, setPlayerId] = useState('kai');
  const [enemyId, setEnemyId] = useState('luna');
  const [windSpeed, setWindSpeed] = useState(0.3);
  const [windDirection, setWindDirection] = useState(1);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [projectile, setProjectile] = useState<string>('normal');
  const [showTrajectory, setShowTrajectory] = useState(true);

  const handleStart = () => {
    const player = characters.find(c => c.id === playerId)!;
    const enemy = characters.find(c => c.id === enemyId)!;
    setBattleConfig({
      playerCharacter: player,
      cpuCharacter: enemy,
      levelId: 'arena_1',
      difficulty,
    });
    router.push('/game?sandbox=1');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>SANDBOX</h1>
        <div style={{ width: 40 }} />
      </header>

      <main className={styles.main}>
        <div className={styles.configGrid}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Seu Personagem</h2>
            <div className={styles.charSelect}>
              {characters.map((c) => (
                <button
                  key={c.id}
                  className={`${styles.charBtn} ${playerId === c.id ? styles.charBtnActive : ''}`}
                  onClick={() => setPlayerId(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Inimigo</h2>
            <div className={styles.charSelect}>
              {characters.map((c) => (
                <button
                  key={c.id}
                  className={`${styles.charBtn} ${enemyId === c.id ? styles.charBtnActive : ''}`}
                  onClick={() => setEnemyId(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Vento</h2>
            <div className={styles.optionRow}>
              {WIND_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`${styles.optBtn} ${Math.abs(windSpeed - opt.value) < 0.05 ? styles.optBtnActive : ''}`}
                  onClick={() => setWindSpeed(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className={styles.optionRow}>
              <button
                className={`${styles.dirBtn} ${windDirection === -1 ? styles.dirBtnActive : ''}`}
                onClick={() => setWindDirection(-1)}
              >
                ← Esquerda
              </button>
              <button
                className={`${styles.dirBtn} ${windDirection === 1 ? styles.dirBtnActive : ''}`}
                onClick={() => setWindDirection(1)}
              >
                Direita →
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Dificuldade</h2>
            <div className={styles.optionRow}>
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d}
                  className={`${styles.optBtn} ${difficulty === d ? styles.optBtnActive : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d === 'easy' ? 'Fácil' : d === 'normal' ? 'Normal' : 'Difícil'}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Projétil</h2>
            <div className={styles.optionRow}>
              {PROJECTILE_OPTIONS.map((p) => (
                <button
                  key={p}
                  className={`${styles.optBtn} ${projectile === p ? styles.optBtnActive : ''}`}
                  onClick={() => setProjectile(p)}
                >
                  {p === 'normal' ? 'Normal' : p === 'piercing' ? 'Perfurante' : p === 'bouncing' ? 'Saltitante' : 'Explosivo'}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Opções</h2>
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={showTrajectory}
                onChange={(e) => setShowTrajectory(e.target.checked)}
              />
              <span>Mostrar preview de trajetória</span>
            </label>
          </section>
        </div>

        <motion.button
          className={styles.startBtn}
          onClick={handleStart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          INICIAR SANDBOX
        </motion.button>
      </main>
    </div>
  );
}
