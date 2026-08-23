export type Locale = 'pt-BR' | 'en-US' | 'es-ES';

export interface TranslationKeys {
  common: {
    play: string;
    settings: string;
    back: string;
    continue: string;
    cancel: string;
    confirm: string;
    loading: string;
    error: string;
    success: string;
  };
  menu: {
    title: string;
    newGame: string;
    continueGame: string;
    settings: string;
    characters: string;
    workshop: string;
    profile: string;
  };
  battle: {
    start: string;
    victory: string;
    defeat: string;
    turn: string;
    health: string;
    attack: string;
    defense: string;
  };
  settings: {
    music: string;
    sfx: string;
    graphics: string;
    language: string;
    accessibility: string;
  };
}

const translations: Record<Locale, TranslationKeys> = {
  'pt-BR': {
    common: {
      play: 'Jogar',
      settings: 'Configurações',
      back: 'Voltar',
      continue: 'Continuar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
    },
    menu: {
      title: 'Astra Artillery',
      newGame: 'Novo Jogo',
      continueGame: 'Continuar Jogo',
      settings: 'Configurações',
      characters: 'Personagens',
      workshop: 'Oficina',
      profile: 'Perfil',
    },
    battle: {
      start: 'Iniciar Batalha',
      victory: 'Vitória!',
      defeat: 'Derrota',
      turn: 'Turno',
      health: 'Vida',
      attack: 'Ataque',
      defense: 'Defesa',
    },
    settings: {
      music: 'Música',
      sfx: 'Efeitos Sonoros',
      graphics: 'Gráficos',
      language: 'Idioma',
      accessibility: 'Acessibilidade',
    },
  },
  'en-US': {
    common: {
      play: 'Play',
      settings: 'Settings',
      back: 'Back',
      continue: 'Continue',
      cancel: 'Cancel',
      confirm: 'Confirm',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    menu: {
      title: 'Astra Artillery',
      newGame: 'New Game',
      continueGame: 'Continue Game',
      settings: 'Settings',
      characters: 'Characters',
      workshop: 'Workshop',
      profile: 'Profile',
    },
    battle: {
      start: 'Start Battle',
      victory: 'Victory!',
      defeat: 'Defeat',
      turn: 'Turn',
      health: 'Health',
      attack: 'Attack',
      defense: 'Defense',
    },
    settings: {
      music: 'Music',
      sfx: 'Sound Effects',
      graphics: 'Graphics',
      language: 'Language',
      accessibility: 'Accessibility',
    },
  },
  'es-ES': {
    common: {
      play: 'Jugar',
      settings: 'Ajustes',
      back: 'Volver',
      continue: 'Continuar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
    },
    menu: {
      title: 'Astra Artillery',
      newGame: 'Nuevo Juego',
      continueGame: 'Continuar Juego',
      settings: 'Ajustes',
      characters: 'Personajes',
      workshop: 'Taller',
      profile: 'Perfil',
    },
    battle: {
      start: 'Iniciar Batalla',
      victory: '¡Victoria!',
      defeat: 'Derrota',
      turn: 'Turno',
      health: 'Salud',
      attack: 'Ataque',
      defense: 'Defensa',
    },
    settings: {
      music: 'Música',
      sfx: 'Efectos de Sonido',
      graphics: 'Gráficos',
      language: 'Idioma',
      accessibility: 'Accesibilidad',
    },
  },
};

const STORAGE_KEY = 'astra_locale';

export class I18n {
  private locale: Locale = 'pt-BR';
  private callbacks: Array<(locale: Locale) => void> = [];
  
  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (stored === 'pt-BR' || stored === 'en-US' || stored === 'es-ES')) {
        this.locale = stored;
      } else {
        const browserLang = navigator.language;
        if (browserLang.startsWith('en')) {
          this.locale = 'en-US';
        } else if (browserLang.startsWith('es')) {
          this.locale = 'es-ES';
        } else {
          this.locale = 'pt-BR';
        }
      }
    }
  }
  
  getLocale(): Locale {
    return this.locale;
  }
  
  setLocale(locale: Locale): void {
    this.locale = locale;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, locale);
    }
    this.notifyCallbacks();
  }
  
  t(key: string): string {
    const keys = key.split('.');
    let value: any = translations[this.locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  }
  
  getTranslations(): TranslationKeys {
    return translations[this.locale];
  }
  
  getAvailableLocales(): Locale[] {
    return ['pt-BR', 'en-US', 'es-ES'];
  }
  
  getLocaleName(locale: Locale): string {
    const names: Record<Locale, string> = {
      'pt-BR': 'Português (Brasil)',
      'en-US': 'English',
      'es-ES': 'Español',
    };
    return names[locale];
  }
  
  onChange(callback: (locale: Locale) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const idx = this.callbacks.indexOf(callback);
      if (idx > -1) this.callbacks.splice(idx, 1);
    };
  }
  
  private notifyCallbacks(): void {
    this.callbacks.forEach(cb => cb(this.locale));
  }
  
  destroy(): void {
    this.callbacks = [];
  }
}

let instance: I18n | null = null;

export function getI18n(): I18n {
  if (!instance) {
    instance = new I18n();
  }
  return instance;
}

export default I18n;
