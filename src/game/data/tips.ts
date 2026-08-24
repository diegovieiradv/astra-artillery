export interface ContextualTip {
  id: string;
  trigger: 'miss_streak' | 'low_hp' | 'first_battle' | 'new_weapon' | 'wind_high' | 'long_battle';
  title: string;
  message: string;
  icon: string;
}

const TIPS: ContextualTip[] = [
  {
    id: 'miss_streak_1',
    trigger: 'miss_streak',
    title: 'Mira mais alto',
    message: 'Voce errou 3 vezes seguidas. Tente aumentar o angulo em 5-10 graus para compensar.',
    icon: '🎯',
  },
  {
    id: 'miss_streak_2',
    trigger: 'miss_streak',
    title: 'Ajuste o vento',
    message: 'O vento pode estar afetando seus tiros. Observe as bandeirolas e ajuste a potencia.',
    icon: '💨',
  },
  {
    id: 'low_hp_1',
    trigger: 'low_hp',
    title: 'HP baixo!',
    message: 'Voce esta com pouco HP. Posicione-se em terreno elevado para ter vantagem.',
    icon: '❤️',
  },
  {
    id: 'first_battle_1',
    trigger: 'first_battle',
    title: 'Bem-vindo!',
    message: 'Ajuste angulo e potencia, depois clique em FIRE. O vento afeta o projétil!',
    icon: '🎮',
  },
  {
    id: 'new_weapon_1',
    trigger: 'new_weapon',
    title: 'Nova arma!',
    message: 'Cada arma tem comportamento diferente. Teste no Sandbox antes de usar em batalha!',
    icon: '🔫',
  },
  {
    id: 'wind_high_1',
    trigger: 'wind_high',
    title: 'Vento forte!',
    message: 'Com vento alto, reduza a potencia e aumente o angulo para manter controle.',
    icon: '🌪️',
  },
  {
    id: 'long_battle_1',
    trigger: 'long_battle',
    title: 'Batalha longa',
    message: 'Tente prever o movimento do inimigo. Ataques em arco sao mais dificeis de esquivar.',
    icon: '⏱️',
  },
];

const STORAGE_KEY = 'astra-artillery-tips-dismissed';
const MISS_STREAK_KEY = 'astra-artillery-miss-streak';

function getDismissedTips(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

function dismissTip(id: string): void {
  const dismissed = getDismissedTips();
  dismissed.add(id);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissed])); } catch {}
}

export function getMissStreak(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return parseInt(localStorage.getItem(MISS_STREAK_KEY) || '0', 10);
  } catch { return 0; }
}

export function incrementMissStreak(): number {
  const streak = getMissStreak() + 1;
  try { localStorage.setItem(MISS_STREAK_KEY, String(streak)); } catch {}
  return streak;
}

export function resetMissStreak(): void {
  try { localStorage.setItem(MISS_STREAK_KEY, '0'); } catch {}
}

export function getContextualTip(context: {
  missStreak?: number;
  hpPercent?: number;
  isFirstBattle?: boolean;
  hasNewWeapon?: boolean;
  windSpeed?: number;
  battleTurns?: number;
}): ContextualTip | null {
  const dismissed = getDismissedTips();
  const available = TIPS.filter(t => !dismissed.has(t.id));

  if (context.missStreak !== undefined && context.missStreak >= 3) {
    const tip = available.find(t => t.trigger === 'miss_streak');
    if (tip) return tip;
  }
  if (context.hpPercent !== undefined && context.hpPercent <= 25) {
    const tip = available.find(t => t.trigger === 'low_hp');
    if (tip) return tip;
  }
  if (context.isFirstBattle) {
    const tip = available.find(t => t.trigger === 'first_battle');
    if (tip) return tip;
  }
  if (context.hasNewWeapon) {
    const tip = available.find(t => t.trigger === 'new_weapon');
    if (tip) return tip;
  }
  if (context.windSpeed !== undefined && context.windSpeed >= 0.7) {
    const tip = available.find(t => t.trigger === 'wind_high');
    if (tip) return tip;
  }
  if (context.battleTurns !== undefined && context.battleTurns >= 10) {
    const tip = available.find(t => t.trigger === 'long_battle');
    if (tip) return tip;
  }

  return null;
}

export function dismissContextualTip(tipId: string): void {
  dismissTip(tipId);
}

export function resetAllTips(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MISS_STREAK_KEY);
  } catch {}
}
