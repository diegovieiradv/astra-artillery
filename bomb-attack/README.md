# Astra Artillery

> **Jogo web original de artilharia 2D em turnos**

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)]()
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Phaser](https://img.shields.io/badge/Phaser-3.88-orange)](https://phaser.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

---

## 📖 Sobre

**Astra Artillery** é um jogo web original de artilharia em turnos, inspirado no gênero clássico popularizado por jogos como *DDTank*, *Worms* e *Gunbound*. 

> **Importante**: Este é um projeto **original**. Não utiliza assets, código, personagens, nomes ou qualquer propriedade intelectual de jogos existentes.

### Premissa

O mundo de **Astra** era protegido por cristais de energia chamados **Núcleos Astrais**. Após **A Grande Ruptura**, os cristais se espalharam por diferentes regiões. Criaturas e facções disputam essa energia. Uma equipe de jovens aventureiros parte para recuperar os Núcleos antes que uma organização rival os use para controlar as ilhas flutuantes.

---

## 🎮 Gameplay

- **Combate por turnos**: Calcule ângulo, potência e vento
- **4 personagens únicos**: Kai (equilibrado), Luna (precisão), Bolt (potência), Nova (suporte)
- **3 fases + chefe** no Capítulo 1
- **IA determinística** com 3 níveis de dificuldade
- **Física arcade**: Trajetória parabólica com vento dinâmico
- **Habilidades especiais** por personagem
- **Progressão local** via LocalStorage

### Controles

| Ação | Desktop | Mobile |
|------|---------|--------|
| Mover | `A` / `D` ou `←` / `→` | Botões ◀ ▶ |
| Mirar | `W` / `S` ou `↑` / `↓` | Botões ▲ ▼ |
| Carregar/Disparar | `Espaço` (segurar/soltar) | Botão 🎯 (touch hold) |
| Habilidade | `Shift` | Botão ⭐ |

---

## 🏗️ Arquitetura

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home/Splash
│   ├── story/page.tsx     # Introdução narrativa
│   ├── characters/page.tsx # Seleção de personagem
│   ├── map/page.tsx       # Seleção de fase
│   ├── game/page.tsx      # Batalha (Phaser)
│   ├── settings/page.tsx  # Configurações
│   └── about/page.tsx     # Créditos
├── components/
│   ├── ui/                # Componentes genéricos
│   ├── game/              # HUD, controles mobile
│   └── loading/           # GameLoader
├── game/                  # Núcleo Phaser (isolado)
│   ├── config/            # Configurações do jogo
│   ├── scenes/            # Boot, Preload, Battle, UI
│   ├── entities/          # Character, Projectile, Terrain
│   ├── systems/           # Turn, Wind, Damage, AI
│   ├── physics/           # Ballistics
│   ├── characters/        # Registry de personagens
│   └── ai/                # CPU Player
├── stores/                # Zustand (gameStore, battleStore)
├── hooks/                 # usePhaserGame, useGameControls
├── types/                 # TypeScript definitions
├── utils/                 # Helpers
└── data/                  # Story, levels
```

### Separação de Responsabilidades

| Camada | Responsabilidade |
|--------|------------------|
| **Next.js** | Páginas, menus, layout, SEO, UI fora do combate |
| **Phaser** | Game loop, sprites, física, trajetória, colisões, partículas |
| **Zustand** | Configurações, progresso, personagem selecionado, estado compartilhado |
| **React** | Bridge para Phaser, controles mobile, HUD overlay |

---

## 🛠️ Stack Tecnológica

- **Next.js 15** (App Router, Server Components)
- **React 18** + **TypeScript 5**
- **Phaser 3.88** (Game Engine 2D)
- **Zustand 5** (Estado global)
- **Tailwind CSS 3.4** (Estilização)
- **Vitest 2** (Testes unitários)
- **Playwright 1.47** (Testes E2E)
- **ESLint 9** + **Prettier 3** (Qualidade de código)
- **Vercel** (Deploy)

---

## 🚀 Instalação e Execução

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

## 🧪 Testes

### Unitários (Vitest)

```bash
npm run test
```

Cobrem:
- Utilitários matemáticos (`clamp`, `lerp`, `distance`, etc.)
- Física balística (`calculateTrajectory`, `calculateDamage`, vento)
- Lógica de personagens e habilidades

### End-to-End (Playwright)

```bash
npm run test:e2e
```

Fluxos testados:
- Home → Iniciar → Seleção personagem → Mapa → Jogo
- Configurações (toggles, sliders)
- Sobre (créditos, tecnologias)

---

## 📦 Build e Deploy

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
NEXT_PUBLIC_GAME_VERSION=0.1.0
```

---

## 🗺️ Roadmap

### MVP (Atual)
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

### Pós-MVP
- [ ] PWA (manifest, service worker, instalação)
- [ ] Terreno destrutível
- [ ] Multiplayer online (PvP, matchmaking)
- [ ] Mais personagens e habilidades
- [ ] Mais fases e capítulos
- [ ] Sistema de equipamentos/itens
- [ ] Leaderboards e rankings
- [ ] Clãs/Guildas
- [ ] Replay system
- [ ] Customização visual

---

## 📄 Licença

Projeto original desenvolvido para fins educacionais e de portfólio.

**Todos os direitos reservados à equipe Astra Artillery.**

- ✅ Código original
- ✅ Assets SVG originais
- ✅ Game design original
- ✅ Narrativa original
- ❌ Nenhum asset de terceiros (DDTank, Worms, etc.)

---

## 👥 Créditos

| Função | Autor |
|--------|-------|
| Game Design | Original |
| Programação | TypeScript, React, Next.js, Phaser 3 |
| Arte & UI | SVG Original, CSS/Tailwind |
| Música & SFX | Placeholders (substituir por originais) |
| QA & Testes | Vitest + Playwright |

---

## 🔗 Links Úteis

- [Phaser 3 Docs](https://phaser.io/phaser3)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Zustand Docs](https://zustand.docs.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

---

*Desenvolvido com ❤️ usando tecnologias web modernas*