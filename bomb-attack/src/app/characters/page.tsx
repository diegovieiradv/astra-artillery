'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllCharacters, CHARACTER_ROLES } from '@/game/characters/registry';
import { useGameStore, useBattleStore } from '@/stores/gameStore';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  selected: { scale: 1.02, boxShadow: '0 0 0 2px #4ade80, 0 12px 40px rgba(74, 222, 128, 0.2)' },
  hover: { y: -8, boxShadow: '0 20px 40px rgba(74, 222, 128, 0.15)' },
  tap: { scale: 0.98 },
};

const statVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function CharactersPage() {
  const router = useRouter();
  const { selectedCharacterId, selectCharacter } = useGameStore();
  const { setBattleConfig } = useBattleStore();
  const characters = getAllCharacters();
  const [selectedId, setSelectedId] = useState<string | null>(selectedCharacterId);
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (selectedCharacterId) setSelectedId(selectedCharacterId);
  }, [selectedCharacterId]);

  useEffect(() => {
    if (selectedId) {
      selectCharacter(selectedId);
    }
  }, [selectedId, selectCharacter]);

  const handleSelect = (characterId: string) => {
    setSelectedId(characterId);
  };

  const handleConfirm = () => {
    if (!selectedId) return;
    const char = characters.find(c => c.id === selectedId);
    if (!char) return;
    
    setAnimating(true);
    setTimeout(() => {
      setBattleConfig({
        playerCharacter: char,
        cpuCharacter: getAllCharacters().find(c => c.id === 'luna')!,
        levelId: 'arena_1',
        difficulty: 'normal',
      });
      router.push('/map');
    }, 300);
  };

  if (!mounted) {
    return (
      <div className={styles.page}>
        <div className={styles.loading} aria-live="polite">
          <div className={styles.spinner} />
          <p>Carregando personagens...</p>
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
          <span>Voltar</span>
        </Link>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          ESCOLHA SEU AVENTUREIRO
        </motion.h1>
        <div style={{ width: 80 }} />
      </header>

      <main className={styles.main}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={selectedId || 'grid'}
            className={styles.grid}
            role="list"
            aria-label="Personagens disponíveis"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
          >
            {characters.map((char, index) => (
              <motion.article
                key={char.id}
                className={`${styles.card} ${selectedId === char.id ? styles.selected : ''}`}
                role="listitem"
                onClick={() => handleSelect(char.id)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(char.id); } }}
                aria-selected={selectedId === char.id}
                aria-label={`${char.name}, ${CHARACTER_ROLES[char.role].label}`}
                variants={cardVariants}
                initial="hidden"
                animate={selectedId === char.id ? 'selected' : 'visible'}
                whileHover={selectedId !== char.id ? 'hover' : undefined}
                whileTap="tap"
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className={styles.avatarWrapper}>
                  <motion.div
                    className={styles.avatar}
                    style={{ background: `linear-gradient(135deg, ${getRoleColor(char.role)}33, ${getRoleColor(char.role)}11)` }}
                    initial={{ scale: 0.8, rotate: -5 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                  >
                    <svg viewBox="0 0 64 64" fill="none" stroke={getRoleColor(char.role)} strokeWidth="2" aria-hidden="true">
                      <circle cx="32" cy="32" r="28"/>
                      <path d="M32 12v16M32 28a12 12 0 1 0 0 24 12 12 0 0 0 0-24z" strokeLinecap="round"/>
                    </svg>
                  </motion.div>
                  <motion.span
                    className={`${styles.roleBadge} ${styles[`role-${char.role}`]}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {CHARACTER_ROLES[char.role].label}
                  </motion.span>
                </div>
                
                <motion.h2
                  className={styles.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {char.name}
                </motion.h2>
                <motion.p
                  className={styles.description}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.1 }}
                >
                  {char.description}
                </motion.p>
                
                <motion.div
                  className={styles.stats}
                  aria-label="Atributos"
                  initial="hidden"
                  animate="visible"
                  variants={statVariants}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {[
                    { label: 'Vida', value: Math.round(char.stats.health * 100), max: 120 },
                    { label: 'Ataque', value: Math.round(char.stats.attack * 100), max: 130 },
                    { label: 'Defesa', value: Math.round(char.stats.defense * 100), max: 120 },
                    { label: 'Mobilidade', value: Math.round(char.stats.mobility * 100), max: 110 },
                  ].map((stat, statIndex) => (
                    <motion.div key={stat.label} className={styles.stat} variants={statVariants} transition={{ delay: statIndex * 0.05 }}>
                      <div className={styles.statLabel}>
                        <span>{stat.label}</span>
                        <span>{stat.value}</span>
                      </div>
                      <div className={styles.statBar}>
                        <motion.div 
                          className={`${styles.statFill} ${styles[`fill-${char.role}`]}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                          transition={{ duration: 0.6, delay: 0.5 + statIndex * 0.05, ease: 'easeOut' }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className={styles.ability}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <h3 className={styles.abilityTitle}>Habilidade Especial</h3>
                  <div className={styles.abilityInfo}>
                    <span className={styles.abilityName}>{char.specialAbility.name}</span>
                    <span className={styles.abilityCooldown}>{char.specialAbility.cooldown} turnos</span>
                  </div>
                  <p className={styles.abilityDesc}>{char.specialAbility.description}</p>
                </motion.div>

                <AnimatePresence>
                  {selectedId === char.id && (
                    <motion.div
                      className={styles.selectedIndicator}
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 45 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className={styles.footer}>
        <motion.button
          className={`${styles.confirmBtn} ${selectedId ? '' : styles.disabled}`}
          onClick={handleConfirm}
          disabled={!selectedId}
          aria-disabled={!selectedId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: selectedId ? 1 : 0.5, y: 0 }}
          whileHover={selectedId ? { scale: 1.02 } : undefined}
          whileTap={selectedId ? { scale: 0.98 } : undefined}
          transition={{ duration: 0.2 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          CONFIRMAR
        </motion.button>
        <motion.p
          className={styles.hint}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {selectedId ? 'Pronto para a batalha!' : 'Selecione um personagem para continuar'}
        </motion.p>
      </footer>
    </div>
  );
}

function getRoleColor(role: string): string {
  return CHARACTER_ROLES[role as keyof typeof CHARACTER_ROLES]?.color || '#4ade80';
}