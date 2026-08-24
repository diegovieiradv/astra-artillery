# Astra Artillery

> **Jogo web original de artilharia 2D em turnos — v0.2.0**

[![Status](https://img.shields.io/badge/status-v0.2.0-green)]()
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Phaser](https://img.shields.io/badge/Phaser-3.88-orange)](https://phaser.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/tests-246%20passing-brightgreen)]()
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

---

## Sobre

**Astra Artillery** é um jogo web original de artilharia em turnos, inspirado no gênero clássico popularizado por jogos como *DDTank*, *Worms* e *Gunbound*.

> **Importante**: Este é um projeto **original**. Não utiliza assets, código, personagens, nomes ou qualquer propriedade intelectual de jogos existentes.

### Premissa

O mundo de **Astra** era protegido por cristais de energia chamados **Núcleos Astrais**. Após **A Grande Ruptura**, os cristais se espalharam por diferentes regiões. Criaturas e facções disputam essa energia. Uma equipe de jovens aventureiros parte para recuperar os Núcleos antes que uma organização rival os use para controlar as ilhas flutuantes.

---

## Gameplay

- **Combate por turnos**: Calcule ângulo, potência e vento
- **8 personagens únicos**: Kai, Luna, Bolt, Nova, Zephyr, Igneous, Glacis, Aeris — cada um com stats e habilidades únicas
- **24 fases + 6 boss fights** across 6 regiões temáticas
- **IA determinística** com 3 níveis de dificuldade
- **Física arcade**: Trajetória parabólica com vento dinâmico
- **Habilidades especiais** por personagem com cooldowns
- **Sistema de terreno** destrutível com deformação dinâmica
- **Sistema de save**: export/import/backup com validação
- **i18n**: Português (BR), English, Español
- **PWA**: instalação offline com update automático

### Controles

| Ação | Desktop | Mobile |
|------|---------|--------|
| Mover | `A` / `D` ou `←` / `→` | Botões ◀ ▶ |
| Mirar | `W` / `S` ou `↑` / `↓` | Botões ▲ ▼ |
| Carregar/Disparar | `Espaço` (segurar/soltar) | Botão 🎯 (touch hold) |
| Habilidade | `Shift` | Botão ⭐ |
| Pausar | `ESC` / `P` | Botão ⏸ |

Gamepad também é suportado via Gamepad API (d-pad, face buttons, start).

---

## Arquitetura

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home/Splash
│   ├── story/page.tsx     # Introdução narrativa
│   ├── characters/page.tsx # Seleção de personagem
│   ├── map/page.tsx       # Seleção de fase
│   ├── game/page.tsx      # Batalha (Phaser)
│   ├── arsenal/page.tsx   # Arsenal de projéteis
│   ├── training/page.tsx  # Modo treino
│   ├── missions/page.tsx  # Missões semanais
│   ├── profile/page.tsx   # Perfil do jogador
│   ├── settings/page.tsx  # Configurações completas
│   └── about/page.tsx     # Créditos
├── components/
│   ├── ui/                # PageTransition, ReduceMotion, UpdateBanner
│   ├── game/              # HUD, PauseOverlay, ErrorBoundary, mobile controls
│   ├── loading/           # GameLoader, LoadingScreen, NavigationLoader
│   └── nav/               # NavMenu responsivo
├── game/                  # Núcleo Phaser (isolado do React)
│   ├── config/            # Configurações do jogo
│   ├── scenes/            # Boot, Preload, Battle, UI
│   ├── entities/          # Character, Projectile, Terrain
│   ├── systems/           # Turn, Wind, Damage, AI, Camera, Pause, Weather,
│   │                      #   Terrain, Impact, ScreenFlash, Feedback, Rewards
│   ├── physics/           # Ballistics
│   ├── characters/        # Registry de personagens
│   └── ai/                # CPU Player
├── stores/                # Zustand (gameStore ~2200 linhas)
├── hooks/                 # usePhaserGame, useGameControls, useI18n, useSWUpdate
├── i18n/                  # 3 locales, 200+ keys
├── types/                 # TypeScript definitions
└── utils/                 # audio, fullscreen, gamepad, graphicsQuality, storage, math
```

### Separação de Responsabilidades

| Camada | Responsabilidade |
|--------|------------------|
| **Next.js** | Páginas, menus, layout, SEO, UI fora do combate |
| **Phaser** | Game loop, sprites, física, trajetória, colisões, partículas, terreno |
| **Zustand** | Configurações, progresso, personagem selecionado, estado compartilhado |
| **React** | Bridge para Phaser, controles mobile, HUD overlay, menus |

---

## Stack Tecnológica

- **Next.js 15** (App Router, Server Components)
- **React 18** + **TypeScript 5**
- **Phaser 3.88** (Game Engine 2D)
- **Zustand 5** (Estado global)
- **Tailwind CSS 3.4** (Estilização)
- **Vitest 2** (Testes unitários — 246 testes)
- **Playwright 1.47** (Testes E2E)
- **ESLint 9** + **Prettier 3** (Qualidade de código)
- **Vercel** (Deploy)

---

## Instalação e Execução

### Pré-requisitos

- Node.js 20+
- npm 10+

### Setup

```bash
# Clonar repositório
git clone <url-do-repo>
cd astra-artillery

# Instalar dependências
npm install

# Instalar browsers do Playwright
npx playwright install chromium

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start
```

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run format       # Prettier write
npm run format:check # Prettier check
npm run test         # Vitest (unitários)
npm run test:watch   # Vitest watch mode
npm run test:ui      # Vitest UI
npm run test:coverage # Cobertura de testes
npm run test:e2e     # Playwright E2E
npm run test:e2e:ui  # Playwright UI
```

---

## Testes

### Unitários (Vitest)

```bash
npm run test
```

246 testes cobrindo:
- Utilitários matemáticos (`clamp`, `lerp`, `distance`, etc.)
- Física balística (`calculateTrajectory`, `calculateDamage`, vento)
- Lógica de personagens e habilidades
- Dados de recompensas, missões, achievements, Astra Cores
- Validação de save/load

### End-to-End (Playwright)

```bash
npm run test:e2e
```

Fluxos testados:
- Home → Iniciar → Seleção personagem → Mapa → Jogo
- Configurações (toggles, sliders)
- Sobre (créditos, tecnologias)

---

## Build e Deploy

### Vercel (Recomendado)

1. Conecte o repositório ao Vercel
2. Configure variáveis de ambiente (se houver)
3. Deploy automático a cada push na `main`

```bash
# Verificações locais antes do deploy
npm run lint
npm run typecheck
npm run test
npm run build
```

### Variáveis de Ambiente

```env
# .env.local (não commitado)
NEXT_PUBLIC_GAME_VERSION=0.2.0
```

---

## Funcionalidades Premium (v0.2.0)

| Feature | Status |
|---------|--------|
| Pausa multi-source (ESC/gamepad/touch) | ✅ |
| Crossfade de música entre cenas | ✅ |
| Fullscreen toggle (cross-browser) | ✅ |
| Gamepad support (Gamepad API) | ✅ |
| i18n 3 idiomas (PT/EN/ES) | ✅ |
| Graphics quality (auto/low/medium/high) | ✅ |
| Save validation + auto-backup | ✅ |
| ErrorBoundary global no layout | ✅ |
| Accessibility enforcer (high contrast, large text, reduce motion) | ✅ |
| PWA update banner | ✅ |
| CHANGELOG.md + LICENSE (MIT) | ✅ |

---

## Roadmap

### MVP (v0.1.0) ✅
- [x] Setup do projeto (Next.js + Phaser + Tooling)
- [x] Identidade visual (logo, favicon, brand)
- [x] Loading screen e transições
- [x] História introdutória
- [x] 4 personagens com stats e habilidades
- [x] Seleção de personagem responsiva
- [x] Phaser bootstrap (Boot, Preload, Battle, UI scenes)
- [x] 3 arenas estáticas
- [x] Sistema de turnos com vento dinâmico
- [x] Input unificado (teclado + touch)
- [x] Balística arcade + projétil
- [x] Colisão, dano, HP, KO
- [x] Habilidades especiais
- [x] CPU AI (3 dificuldades)
- [x] Progressão LocalStorage
- [x] Áudio (música/SFX toggles)
- [x] Mobile (landscape hint, touch areas 44px+)
- [x] Acessibilidade (reduce motion, focus visible, ARIA)
- [x] Testes unitários + E2E
- [x] Build Vercel ready

### Expansão (v0.2.0) ✅
- [x] 4 novos personagens (Zephyr, Igneous, Glacis, Aeris)
- [x] 21 novas fases + 6 boss fights
- [x] 6 regiões temáticas
- [x] Terreno destrutível
- [x] Arsenal de projéteis
- [x] Missões semanais
- [x] Modo treino
- [x] Perfil do jogador
- [x] Sistema de conquistas
- [x] Astra Cores (habilidades passivas)
- [x] New Game+

### Premium (v0.2.0 polish) ✅
- [x] Pausa multi-source
- [x] Crossfade de áudio
- [x] Fullscreen toggle
- [x] Gamepad support
- [x] i18n 3 idiomas
- [x] Graphics quality settings
- [x] Save validation + backup
- [x] ErrorBoundary global
- [x] Accessibility enforcement
- [x] PWA update mechanism

### Futuro
- [ ] Multiplayer online (PvP, matchmaking)
- [ ] Mais fases e capítulos
- [ ] Leaderboards e rankings
- [ ] Clãs/Guildas
- [ ] Replay system

---

## Licença

MIT License — ver [LICENSE](LICENSE).

**Todos os direitos reservados à equipe Astra Artillery.**

- ✅ Código original
- ✅ Assets SVG originais
- ✅ Game design original
- ✅ Narrativa original
- ❌ Nenhum asset de terceiros (DDTank, Worms, etc.)

---

## Créditos

| Função | Autor |
|--------|-------|
| Game Design | Original |
| Programação | TypeScript, React, Next.js, Phaser 3 |
| Arte & UI | SVG Original, CSS/Tailwind |
| Música & SFX | Placeholders (substituir por originais) |
| QA & Testes | Vitest (246) + Playwright |

---

*Desenvolvido com ❤️ usando tecnologias web modernas*
