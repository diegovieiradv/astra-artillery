'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getAllCharacters } from '@/game/characters/registry';
import { useBattleStore } from '@/stores/gameStore';
import { seededRandom } from '@/utils/seeds';
import styles from './page.module.css';

type BracketSize = 4 | 8;
type TournamentState = 'setup' | 'bracket' | 'match' | 'finished';

interface TournamentMatch {
  id: string;
  round: number;
  player1Id: string;
  player2Id: string;
  winnerId?: string;
}

function generateBracket(characters: string[], size: BracketSize): TournamentMatch[] {
  const selected = characters.slice(0, size);
  const matches: TournamentMatch[] = [];
  const rng = seededRandom(Date.now());
  for (let i = 0; i < selected.length; i += 2) {
    matches.push({
      id: `r0-${i / 2}`,
      round: 0,
      player1Id: selected[i],
      player2Id: selected[i + 1] || selected[0],
      winnerId: undefined,
    });
  }
  return matches;
}

export default function TournamentPage() {
  const router = useRouter();
  const { setBattleConfig } = useBattleStore();
  const characters = getAllCharacters();
  const [bracketSize, setBracketSize] = useState<BracketSize>(4);
  const [state, setState] = useState<TournamentState>('setup');
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [champion, setChampion] = useState<string | null>(null);

  const handleStart = () => {
    const charIds = characters.map(c => c.id);
    const bracket = generateBracket(charIds, bracketSize);
    setMatches(bracket);
    setCurrentMatchIndex(0);
    setState('bracket');
  };

  const handleStartMatch = (match: TournamentMatch) => {
    const player = characters.find(c => c.id === match.player1Id)!;
    const enemy = characters.find(c => c.id === match.player2Id)!;
    setBattleConfig({
      playerCharacter: player,
      cpuCharacter: enemy,
      levelId: 'arena_1',
      difficulty: 'normal',
    });
    router.push('/game?tournament=1');
  };

  const handleMatchResult = (matchId: string, winnerId: string) => {
    const updated = matches.map(m =>
      m.id === matchId ? { ...m, winnerId } : m
    );
    setMatches(updated);

    const currentMatch = updated.find(m => m.id === matchId);
    if (!currentMatch) return;

    const roundMatches = updated.filter(m => m.round === currentMatch.round);
    const allDecided = roundMatches.every(m => m.winnerId);
    if (!allDecided) return;

    const currentRound = currentMatch.round;
    const nextRound = currentRound + 1;
    const winners = roundMatches.map(m => m.winnerId!);
    if (winners.length === 1) {
      setChampion(winners[0]);
      setState('finished');
      return;
    }
    const nextMatches: TournamentMatch[] = [];
    for (let i = 0; i < winners.length; i += 2) {
      nextMatches.push({
        id: `r${nextRound}-${i / 2}`,
        round: nextRound,
        player1Id: winners[i],
        player2Id: winners[i + 1] || winners[0],
      });
    }
    setMatches([...updated, ...nextMatches]);
    const nextIndex = updated.length;
    setCurrentMatchIndex(nextIndex);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>TORNEIO LOCAL</h1>
        <div style={{ width: 40 }} />
      </header>

      <main className={styles.main}>
        {state === 'setup' && (
          <motion.div
            className={styles.setupCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className={styles.cardTitle}>CONFIGURAR TORNEIO</h2>
            <div className={styles.sizeSelect}>
              <button
                className={`${styles.sizeBtn} ${bracketSize === 4 ? styles.sizeBtnActive : ''}`}
                onClick={() => setBracketSize(4)}
              >
                4 Jogadores
              </button>
              <button
                className={`${styles.sizeBtn} ${bracketSize === 8 ? styles.sizeBtnActive : ''}`}
                onClick={() => setBracketSize(8)}
              >
                8 Jogadores
              </button>
            </div>
            <p className={styles.setupInfo}>
              Jogadores: {characters.slice(0, bracketSize).map(c => c.name).join(', ')}
            </p>
            <motion.button
              className={styles.startBtn}
              onClick={handleStart}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              INICIAR TORNEIO
            </motion.button>
          </motion.div>
        )}

        {state === 'bracket' && (
          <div className={styles.bracketSection}>
            <h2 className={styles.cardTitle}>CHAVE</h2>
            <div className={styles.bracket}>
              {matches.map((match) => {
                const p1 = characters.find(c => c.id === match.player1Id);
                const p2 = characters.find(c => c.id === match.player2Id);
                const isActive = !match.winnerId && match.id === matches[currentMatchIndex]?.id;
                return (
                  <div
                    key={match.id}
                    className={`${styles.matchCard} ${isActive ? styles.matchActive : ''} ${match.winnerId ? styles.matchDone : ''}`}
                  >
                    <div className={styles.matchRound}>R{match.round + 1}</div>
                    <div className={styles.matchPlayers}>
                      <div className={`${styles.matchPlayer} ${match.winnerId === match.player1Id ? styles.matchWinner : ''}`}>
                        {p1?.name || match.player1Id}
                      </div>
                      <span className={styles.vs}>VS</span>
                      <div className={`${styles.matchPlayer} ${match.winnerId === match.player2Id ? styles.matchWinner : ''}`}>
                        {p2?.name || match.player2Id}
                      </div>
                    </div>
                    {isActive && (
                      <button
                        className={styles.playBtn}
                        onClick={() => handleStartMatch(match)}
                      >
                        JOGAR
                      </button>
                    )}
                    {match.winnerId && (
                      <div className={styles.matchResult}>
                        Vencedor: {characters.find(c => c.id === match.winnerId)?.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {state === 'finished' && champion && (
          <motion.div
            className={styles.trophyCard}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <div className={styles.trophyIcon}>🏆</div>
            <h2 className={styles.championName}>
              {characters.find(c => c.id === champion)?.name}
            </h2>
            <p className={styles.championTitle}>CAMPEAO DO TORNEIO!</p>
            <motion.button
              className={styles.startBtn}
              onClick={() => { setState('setup'); setChampion(null); setMatches([]); }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              NOVO TORNEIO
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
