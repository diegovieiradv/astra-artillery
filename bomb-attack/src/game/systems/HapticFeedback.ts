export type HapticPattern = 
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'error'
  | 'warning'
  | 'impact'
  | 'selection'
  | 'notification'
  | 'combo'
  | 'critical'
  | 'explosion'
  | 'victory'
  | 'defeat';

export interface HapticConfig {
  duration: number;
  pattern?: number[];
  intensity?: number;
}

const HAPTIC_CONFIGS: Record<HapticPattern, HapticConfig> = {
  light: {
    duration: 10,
  },
  medium: {
    duration: 20,
  },
  heavy: {
    duration: 40,
  },
  success: {
    duration: 30,
    pattern: [10, 50, 20],
  },
  error: {
    duration: 50,
    pattern: [30, 30, 30, 30, 30],
  },
  warning: {
    duration: 40,
    pattern: [20, 40, 20],
  },
  impact: {
    duration: 25,
  },
  selection: {
    duration: 5,
  },
  notification: {
    duration: 30,
    pattern: [10, 30, 10],
  },
  combo: {
    duration: 40,
    pattern: [15, 20, 15, 20, 15],
  },
  critical: {
    duration: 60,
    pattern: [20, 15, 20, 15, 20, 15, 20],
  },
  explosion: {
    duration: 80,
    pattern: [40, 20, 60, 10, 40],
  },
  victory: {
    duration: 100,
    pattern: [20, 30, 20, 30, 20, 30, 20, 30, 20],
  },
  defeat: {
    duration: 150,
    pattern: [50, 30, 50, 30, 50],
  },
};

export class HapticFeedback {
  private enabled = true;
  private intensity = 1;
  
  constructor() {
    this.enabled = this.isSupported();
  }
  
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }
  
  isEnabled(): boolean {
    return this.enabled && this.isSupported();
  }
  
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
  
  setIntensity(intensity: number): void {
    this.intensity = Math.max(0, Math.min(1, intensity));
  }
  
  vibrate(pattern: HapticPattern): void {
    if (!this.isEnabled()) return;
    
    const config = HAPTIC_CONFIGS[pattern];
    
    try {
      if (config.pattern) {
        const adjustedPattern = config.pattern.map((p) => 
          Math.round(p * this.intensity)
        );
        navigator.vibrate(adjustedPattern);
      } else {
        navigator.vibrate(Math.round(config.duration * this.intensity));
      }
    } catch (e) {
      console.warn('Haptic feedback failed:', e);
    }
  }
  
  vibrateCustom(pattern: number[]): void {
    if (!this.isEnabled()) return;
    
    try {
      const adjustedPattern = pattern.map((p) => 
        Math.round(p * this.intensity)
      );
      navigator.vibrate(adjustedPattern);
    } catch (e) {
      console.warn('Haptic feedback failed:', e);
    }
  }
  
  light(): void {
    this.vibrate('light');
  }
  
  medium(): void {
    this.vibrate('medium');
  }
  
  heavy(): void {
    this.vibrate('heavy');
  }
  
  success(): void {
    this.vibrate('success');
  }
  
  error(): void {
    this.vibrate('error');
  }
  
  warning(): void {
    this.vibrate('warning');
  }
  
  impact(): void {
    this.vibrate('impact');
  }
  
  selection(): void {
    this.vibrate('selection');
  }
  
  notification(): void {
    this.vibrate('notification');
  }
  
  combo(): void {
    this.vibrate('combo');
  }
  
  critical(): void {
    this.vibrate('critical');
  }
  
  explosion(): void {
    this.vibrate('explosion');
  }
  
  victory(): void {
    this.vibrate('victory');
  }
  
  defeat(): void {
    this.vibrate('defeat');
  }
  
  cancel(): void {
    if (!this.isSupported()) return;
    
    try {
      navigator.vibrate(0);
    } catch (e) {
      console.warn('Haptic cancel failed:', e);
    }
  }
}

let instance: HapticFeedback | null = null;

export function getHapticFeedback(): HapticFeedback {
  if (!instance) {
    instance = new HapticFeedback();
  }
  return instance;
}

export function setHapticEnabled(enabled: boolean): void {
  getHapticFeedback().setEnabled(enabled);
}

export function setHapticIntensity(intensity: number): void {
  getHapticFeedback().setIntensity(intensity);
}

export default HapticFeedback;
