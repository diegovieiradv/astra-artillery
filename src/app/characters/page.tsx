'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, useBattleStore } from '@/stores/gameStore';
import { getAllCharacters } from '@/game/characters/registry';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

const CHARACTER_ORDER = ['kai', 'luna', 'torn', 'zephyr', 'pyra', 'bolt', 'mira', 'rook', 'nova', 'drax'] as const;

export default function CharactersPage() {
  const router = useRouter();
  const { selectedCharacterId, selectCharacter } = useGameStore();
  const { setBattleConfig } = useBattleStore();
  const characters = getAllCharacters();
  const [selectedId, setSelectedId] = useState<string>(selectedCharacterId || 'kai');

  useEffect(() => {
    if (selectedCharacterId) {
      setSelectedId(selectedCharacterId);
    } else {
      setSelectedId('kai');
      selectCharacter('kai');
    }
  }, [selectedCharacterId, selectCharacter]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedId) return;
    const selectedChar = characters.find((c) => c.id === selectedId);
    const cpuCharacter = characters.find((c) => c.id !== selectedId) || characters[1];

    if (!selectedChar || !cpuCharacter) return;

    selectCharacter(selectedId);
    setBattleConfig({
      playerCharacter: selectedChar,
      cpuCharacter,
      levelId: 'arena_1',
      difficulty: 'normal',
    });
    router.push('/map');
  }, [selectedId, selectCharacter, characters, setBattleConfig, router]);

  return (
    <div className={styles.page}>
      {/* Layer 1: Background */}
      <div className={styles.backgroundLayer}>
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedId}
            src={`/images/character-select/backgrounds/fundo-personagem-${selectedId}.png`}
            alt=""
            className={styles.backgroundImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>
      </div>

      {/* Back button */}
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

      {/* Layer 2: Cards — individually positioned over background art */}
      <div className={styles.cardsOverlay} role="listbox" aria-label="Selecionar personagem">
        {CHARACTER_ORDER.map((id) => (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            className={`${styles.card} ${styles[`card${id.charAt(0).toUpperCase() + id.slice(1)}`]} ${selectedId === id ? styles.cardSelected : ''}`}
            role="option"
            aria-selected={selectedId === id}
            aria-label={`Personagem ${id}`}
          >
            <img
              src={`/images/character-select/cards/personagem-${id}.png`}
              alt={id}
              draggable={false}
            />
          </button>
        ))}
      </div>

      {/* Layer 3: Confirm button */}
      <div className={styles.confirmOverlay}>
        <button
          onClick={handleConfirm}
          disabled={!selectedId}
          className={styles.confirmBtn}
          aria-label="Confirmar herói"
        >
          <img
            src="/images/character-select/ui/botao-selecao-personagem.png"
            alt="Confirmar herói"
            draggable={false}
          />
        </button>
      </div>
    </div>
  );
}
