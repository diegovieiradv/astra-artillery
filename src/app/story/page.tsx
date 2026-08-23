'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

const STORY_SLIDES = [
  {
    title: 'O MUNDO DE ASTRA',
    text: 'Era uma vez um mundo chamado Astra, onde ilhas flutuavam serenamente no céu, sustentadas pela energia de cristais antigos conhecidos como Núcleos Astrais.',
    image: '🌌',
  },
  {
    title: 'A GRANDE RUPTURA',
    text: 'Até que um dia, um evento cataclísmico abalou as fundações do mundo. Os Núcleos Astrais se estilhaçaram e seus fragmentos caíram por todas as regiões de Astra.',
    image: '💥',
  },
  {
    title: 'A DISPUTA PELO PODER',
    text: 'Criaturas de todas as espécies e facções rivais começaram a caçar os fragmentos. Quem possuísse mais Núcleos controlaria as ilhas e o destino de Astra.',
    image: '⚔️',
  },
  {
    title: 'UMA EQUIPE DE AVENTUREIROS',
    text: 'Um grupo de jovens corajosos decidiu se unir. Cada um com habilidades únicas, partiram em uma jornada para recuperar os Núcleos antes que caíssem em mãos erradas.',
    image: '👥',
  },
  {
    title: 'SUA JORNADA COMEÇA',
    text: 'Escolha seu aventureiro, domine a arte da artilharia e lute turno a turno para restaurar o equilíbrio de Astra. O destino das ilhas flutuantes está em suas mãos!',
    image: '🎯',
  },
];

const slideVariants = {
  initial: { opacity: 0, x: 50, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -50, scale: 0.95 },
};

const imageVariants = {
  initial: { opacity: 0, scale: 0.8, rotate: -5 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 1.2, rotate: 5 },
};

export default function StoryPage() {
  const router = useRouter();
  const { setTutorialCompleted } = useGameStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  useEffect(() => { setMounted(true); }, []);

  const nextSlide = () => {
    if (currentSlide < STORY_SLIDES.length - 1) {
      setDirection('next');
      setCurrentSlide(s => s + 1);
    } else {
      setTutorialCompleted(true);
      router.push('/characters');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection('prev');
      setCurrentSlide(s => s - 1);
    }
  };

  const skipStory = () => {
    setTutorialCompleted(true);
    router.push('/characters');
  };

  if (!mounted) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}><div className={styles.spinner} /></div>
      </div>
    );
  }

  const slide = STORY_SLIDES[currentSlide];
  const isLast = currentSlide === STORY_SLIDES.length - 1;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.progress}>
          {currentSlide + 1} / {STORY_SLIDES.length}
        </span>
        <button className={styles.skipBtn} onClick={skipStory} aria-label="Pular história">
          Pular
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.slideContainer}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              className={styles.slide}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeOut' }}
              custom={direction}
            >
              <motion.div
                className={styles.image}
                variants={imageVariants}
                aria-hidden="true"
              >
                {slide.image}
              </motion.div>
              <motion.h1 className={styles.title} variants={slideVariants}>
                {slide.title}
              </motion.h1>
              <motion.p className={styles.text} variants={slideVariants}>
                {slide.text}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.nav} role="navigation" aria-label="Navegação da história">
          <button
            className={styles.navBtn}
            onClick={prevSlide}
            disabled={currentSlide === 0}
            aria-disabled={currentSlide === 0}
            aria-label="Slide anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className={styles.dots} role="tablist" aria-label="Slides">
            {STORY_SLIDES.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === currentSlide ? styles.active : ''}`}
                onClick={() => {
                  setDirection(i > currentSlide ? 'next' : 'prev');
                  setCurrentSlide(i);
                }}
                role="tab"
                aria-selected={i === currentSlide}
                aria-label={`Ir para slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            className={styles.navBtn}
            onClick={nextSlide}
            aria-label={isLast ? 'Começar jogo' : 'Próximo slide'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </main>

      <footer className={styles.footer}>
        <Link href="/" className={styles.backLink}>Voltar ao menu</Link>
      </footer>
    </div>
  );
}