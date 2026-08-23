'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>SOBRE</h1>
      </header>

      <main className={styles.main}>
        <section className={styles.section} aria-labelledby="game-heading">
          <h2 id="game-heading" className={styles.sectionTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polygon points="6 3 20 12 6 21 6 3" />
              <path d="M22 12C22 12 18 12 15 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sobre o Jogo
          </h2>
          
          <div className={styles.content}>
            <p>
              <strong>Astra Artillery</strong> é um jogo web original de artilharia 2D em turnos, 
              desenvolvido como projeto independente. O jogador controla um aventureiro em arenas 
              laterais e deve calcular ângulo, potência e vento para derrotar o oponente.
            </p>
            <p>
              O jogo possui modo campanha com história original, 4 personagens jogáveis com 
              habilidades únicas, sistema de física arcade para trajetórias balísticas, 
              inteligência artificial para batalhas solo e suporte completo para desktop e mobile.
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="credits-heading">
          <h2 id="credits-heading" className={styles.sectionTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Créditos
          </h2>
          
          <dl className={styles.creditsList}>
            <div>
              <dt>Desenvolvimento</dt>
              <dd>Equipe Astra Artillery</dd>
            </div>
            <div>
              <dt>Game Design</dt>
              <dd>Original</dd>
            </div>
            <div>
              <dt>Programação</dt>
              <dd>TypeScript, React, Next.js, Phaser 3</dd>
            </div>
            <div>
              <dt>Arte & Design</dt>
              <dd>SVG Original, CSS</dd>
            </div>
            <div>
              <dt>Música & SFX</dt>
              <dd>Placeholders (substituir por assets originais)</dd>
            </div>
          </dl>
        </section>

        <section className={styles.section} aria-labelledby="tech-heading">
          <h2 id="tech-heading" className={styles.sectionTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M6 3v14M14 3v14" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tecnologias
          </h2>
          
          <ul className={styles.techList}>
            <li><strong>Next.js 15</strong> — App Router, Server Components</li>
            <li><strong>React 18</strong> — UI, Hooks, Estado</li>
            <li><strong>TypeScript 5</strong> — Tipagem estática</li>
            <li><strong>Phaser 3.88</strong> — Game Engine 2D</li>
            <li><strong>Zustand 5</strong> — Gerenciamento de estado</li>
            <li><strong>Tailwind CSS 3.4</strong> — Estilização utilitária</li>
            <li><strong>Vitest 2</strong> — Testes unitários</li>
            <li><strong>Playwright 1.47</strong> — Testes E2E</li>
            <li><strong>Vercel</strong> — Deploy e hospedagem</li>
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="license-heading">
          <h2 id="license-heading" className={styles.sectionTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Licença & Direitos
          </h2>
          
          <div className={styles.content}>
            <p>
              <strong>Astra Artillery</strong> é um jogo original. Todos os assets visuais, sonoros, 
              código e design foram criados especificamente para este projeto.
            </p>
            <p>
              <strong>Não utiliza</strong> assets, código, personagens, nomes ou qualquer 
              propriedade intelectual de jogos existentes como DDTank ou similares.
            </p>
            <p>
              O nome "Astra Artillery" é um título provisório (<em>working title</em>) e não 
              representa uma marca registrada.
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="version-heading">
          <h2 id="version-heading" className={styles.sectionTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Versão
          </h2>
          
          <p className={styles.version}>v0.1.0-alpha — Desenvolvimento ativo</p>
        </section>
      </main>
    </div>
  );
}