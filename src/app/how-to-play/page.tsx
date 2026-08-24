'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  controls?: { desktop: string; mobile: string };
  tips?: string[];
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'objective',
    title: 'Objetivo',
    description: 'Destrua o inimigo antes que ele destrua você. Cada jogador tem HP (pontos de vida). Quando chega a 0, é KO.',
    icon: '🎯',
    tips: ['Use o terreno a seu favor para se proteger.', 'Posicione-se em alturas elevadas para ganhar vantagem.'],
  },
  {
    id: 'movement',
    title: 'Movimento',
    description: 'Mova seu personagem para esquivar e posicionar estrategicamente.',
    icon: '🚶',
    controls: { desktop: 'A/D ou ←/→', mobile: 'Botões ◀ ▶' },
  },
  {
    id: 'aim',
    title: 'Mira',
    description: 'Ajuste o ângulo do canhão para mirar. Ângulos maiores atiram mais alto e mais longe.',
    icon: '📐',
    controls: { desktop: 'W/S ou ↑/↓', mobile: 'Botões ▲ ▼' },
  },
  {
    id: 'power',
    title: 'Potência',
    description: 'Segure o botão de disparo para carregar a potência. Solte para atirar.',
    icon: '💪',
    controls: { desktop: 'Espaço (segurar/soltar)', mobile: 'Botão 🎯 (touch hold)' },
    tips: ['A barra mostra a potência atual.', '80% costuma ser ideal para a maioria dos tiros.'],
  },
  {
    id: 'wind',
    title: 'Vento',
    description: 'O vento afeta a trajetória do projétil. Observe a direção e intensidade antes de atirar.',
    icon: '🌬️',
    tips: ['Vento à direita empurra o tiro para a direita.', 'Vento forte pode desviar completamente seu tiro.'],
  },
  {
    id: 'special',
    title: 'Habilidade Especial',
    description: 'Cada personagem possui uma habilidade única com cooldown. Use no momento certo.',
    icon: '⭐',
    controls: { desktop: 'Shift', mobile: 'Botão ⭐' },
    tips: ['Habilidades têm cooldown — não spam.', 'Cada personagem tem uma habilidade diferente.'],
  },
  {
    id: 'projectiles',
    title: 'Projéteis',
    description: 'Diferentes tipos de projéteis possuem comportamentos únicos. Escolha o certo para cada situação.',
    icon: '💣',
    tips: [
      'Bomba Pesada: mais dano, mais lenta.',
      'Ricochete: quica em paredes.',
      'Incendiário: cria zona de fogo.',
      'Congelante: reduz mobilidade.',
    ],
  },
  {
    id: 'tactical',
    title: 'Itens Táticos',
    description: 'Itens consumíveis que podem virar o jogo. Use com moderação.',
    icon: '🧪',
    tips: [
      'Poção de Vida: restaura HP.',
      'Escudo: absorve dano temporariamente.',
      'Amplificador: aumenta dano do próximo tiro.',
    ],
  },
  {
    id: 'terrain',
    title: 'Terreno',
    description: 'Explosões criam crateras que afetam colisões e posicionamento.',
    icon: '🏔️',
    tips: ['Crateras podem servir de cobertura.', 'Cuidado: personagens podem cair se o terreno for destruído.'],
  },
  {
    id: 'campaign',
    title: 'Campanha',
    description: 'Complete 30 fases em 6 regiões para recuperar os Núcleos Astrais. Cada região termina com um Boss.',
    icon: '🗺️',
    tips: ['Derrote boss para desbloquear próxima região.', 'Ganhe credits para melhorar na Oficina.'],
  },
];

export default function HowToPlayPage() {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Carregando tutorial...</p>
        </div>
      </div>
    );
  }

  const step = TUTORIAL_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>COMO JOGAR</h1>
        <span className={styles.progress}>{currentStep + 1}/{TUTORIAL_STEPS.length}</span>
      </header>

      <main className={styles.main}>
        <div className={styles.stepDots}>
          {TUTORIAL_STEPS.map((s, i) => (
            <button
              key={s.id}
              className={`${styles.dot} ${i === currentStep ? styles.dotActive : ''} ${i < currentStep ? styles.dotDone : ''}`}
              onClick={() => setCurrentStep(i)}
              aria-label={`Passo ${i + 1}: ${s.title}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className={styles.stepContent}
          >
            <div className={styles.stepIcon}>{step.icon}</div>
            <h2 className={styles.stepTitle}>{step.title}</h2>
            <p className={styles.stepDesc}>{step.description}</p>

            {step.controls && (
              <div className={styles.controlsBox}>
                <div className={styles.controlRow}>
                  <span className={styles.controlLabel}>Desktop</span>
                  <span className={styles.controlValue}>{step.controls.desktop}</span>
                </div>
                <div className={styles.controlRow}>
                  <span className={styles.controlLabel}>Mobile</span>
                  <span className={styles.controlValue}>{step.controls.mobile}</span>
                </div>
              </div>
            )}

            {step.tips && (
              <div className={styles.tipsBox}>
                <h3>Dicas</h3>
                <ul>
                  {step.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className={styles.navButtons}>
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={isFirst}
            className={styles.navBtn}
          >
            ← Anterior
          </button>
          {!isLast ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className={`${styles.navBtn} ${styles.navBtnPrimary}`}
            >
              Próximo →
            </button>
          ) : (
            <Link href="/training" className={`${styles.navBtn} ${styles.navBtnPrimary}`}>
              TREINAR →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
