import * as Phaser from 'phaser';

export type SoundCategory = 'explosion' | 'hit' | 'ui' | 'ambient' | 'voice' | 'music';

export interface SoundVariation {
  key: string;
  weight?: number;
  pitchRange?: [number, number];
  volumeRange?: [number, number];
}

export interface SoundPoolConfig {
  category: SoundCategory;
  sounds: SoundVariation[];
  defaultVolume?: number;
  defaultPitch?: number;
  cooldown?: number;
  maxConcurrent?: number;
}

export interface PlayOptions {
  volume?: number;
  pitch?: number;
  delay?: number;
  loop?: boolean;
  fadeIn?: number;
  fadeOut?: number;
}

const SOUND_POOLS: Record<SoundCategory, SoundPoolConfig> = {
  explosion: {
    category: 'explosion',
    sounds: [
      { key: 'sfx_explosion_1', weight: 1 },
      { key: 'sfx_explosion_2', weight: 1 },
      { key: 'sfx_explosion_3', weight: 0.8 },
      { key: 'sfx_explosion_4', weight: 0.6 },
    ],
    defaultVolume: 0.6,
    defaultPitch: 1,
    cooldown: 50,
    maxConcurrent: 4,
  },
  hit: {
    category: 'hit',
    sounds: [
      { key: 'sfx_hit_1', weight: 1 },
      { key: 'sfx_hit_2', weight: 1 },
      { key: 'sfx_hit_3', weight: 0.9 },
      { key: 'sfx_critical', weight: 0.3 },
    ],
    defaultVolume: 0.5,
    defaultPitch: 1,
    cooldown: 30,
    maxConcurrent: 3,
  },
  ui: {
    category: 'ui',
    sounds: [
      { key: 'sfx_click', weight: 1 },
      { key: 'sfx_hover', weight: 1 },
      { key: 'sfx_select', weight: 1 },
      { key: 'sfx_back', weight: 1 },
    ],
    defaultVolume: 0.4,
    defaultPitch: 1,
    cooldown: 100,
    maxConcurrent: 2,
  },
  ambient: {
    category: 'ambient',
    sounds: [
      { key: 'sfx_wind', weight: 1 },
      { key: 'sfx_birds', weight: 0.5 },
    ],
    defaultVolume: 0.3,
    defaultPitch: 1,
    cooldown: 0,
    maxConcurrent: 1,
  },
  voice: {
    category: 'voice',
    sounds: [
      { key: 'sfx_victory', weight: 1 },
      { key: 'sfx_defeat', weight: 1 },
    ],
    defaultVolume: 0.7,
    defaultPitch: 1,
    cooldown: 0,
    maxConcurrent: 1,
  },
  music: {
    category: 'music',
    sounds: [
      { key: 'music_battle', weight: 1 },
      { key: 'music_menu', weight: 1 },
      { key: 'music_victory', weight: 1 },
    ],
    defaultVolume: 0.5,
    defaultPitch: 1,
    cooldown: 0,
    maxConcurrent: 1,
  },
};

class SoundPool {
  private scene: Phaser.Scene;
  private config: SoundPoolConfig;
  private lastPlayTime = 0;
  private activeCount = 0;
  private lastSoundKey = '';

  constructor(scene: Phaser.Scene, config: SoundPoolConfig) {
    this.scene = scene;
    this.config = config;
  }

  canPlay(): boolean {
    const now = this.scene.time.now;
    if (now - this.lastPlayTime < (this.config.cooldown || 0)) {
      return false;
    }
    if (this.activeCount >= (this.config.maxConcurrent || Infinity)) {
      return false;
    }
    return true;
  }

  getWeightedRandom(): SoundVariation {
    const sounds = this.config.sounds;
    const totalWeight = sounds.reduce((sum, s) => sum + (s.weight || 1), 0);
    let random = Math.random() * totalWeight;

    for (const sound of sounds) {
      random -= sound.weight || 1;
      if (random <= 0) {
        if (sound.key === this.lastSoundKey && sounds.length > 1) {
          return this.getWeightedRandom();
        }
        return sound;
      }
    }

    return sounds[0];
  }

  play(options: PlayOptions = {}): void {
    if (!this.canPlay()) return;

    const variation = this.getWeightedRandom();
    const volume = options.volume ?? this.config.defaultVolume ?? 0.5;
    const pitch = options.pitch ?? this.config.defaultPitch ?? 1;

    const pitchRange = variation.pitchRange || [0.9, 1.1];
    const volumeRange = variation.volumeRange || [0.8, 1.2];

    const finalPitch = pitch * (pitchRange[0] + Math.random() * (pitchRange[1] - pitchRange[0]));
    const finalVolume = volume * (volumeRange[0] + Math.random() * (volumeRange[1] - volumeRange[0]));

    try {
      this.scene.sound.play(variation.key, {
        volume: Math.min(1, Math.max(0, finalVolume)),
        rate: finalPitch,
        delay: options.delay || 0,
        loop: options.loop || false,
      });

      this.lastPlayTime = this.scene.time.now;
      this.lastSoundKey = variation.key;
      this.activeCount++;

      const duration = this.scene.cache.audio.get(variation.key)?.duration || 1000;
      this.scene.time.delayedCall(duration * 1000, () => {
        this.activeCount = Math.max(0, this.activeCount - 1);
      });
    } catch (e) {
      console.warn(`Failed to play sound ${variation.key}:`, e);
    }
  }
}

export class SoundVariations {
  private scene: Phaser.Scene;
  private pools: Map<SoundCategory, SoundPool> = new Map();
  private globalVolume = 1;
  private globalMuted = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initializePools();
  }

  private initializePools(): void {
    Object.entries(SOUND_POOLS).forEach(([category, config]) => {
      this.pools.set(category as SoundCategory, new SoundPool(this.scene, config));
    });
  }

  play(category: SoundCategory, options: PlayOptions = {}): void {
    if (this.globalMuted) return;

    const pool = this.pools.get(category);
    if (pool) {
      pool.play({
        ...options,
        volume: (options.volume ?? 1) * this.globalVolume,
      });
    }
  }

  playExplosion(intensity: 'light' | 'medium' | 'heavy' = 'medium'): void {
    const volumeMultiplier = intensity === 'light' ? 0.5 : intensity === 'heavy' ? 1.5 : 1;
    const pitchMultiplier = intensity === 'light' ? 1.2 : intensity === 'heavy' ? 0.8 : 1;

    this.play('explosion', {
      volume: volumeMultiplier,
      pitch: pitchMultiplier,
    });
  }

  playHit(isCritical: boolean = false): void {
    this.play('hit', {
      pitch: isCritical ? 0.8 : 1,
      volume: isCritical ? 1.2 : 1,
    });
  }

  playUI(action: 'click' | 'hover' | 'select' | 'back' = 'click'): void {
    const pitchMap = {
      click: 1,
      hover: 1.1,
      select: 0.9,
      back: 0.8,
    };

    this.play('ui', {
      pitch: pitchMap[action],
    });
  }

  playVictory(): void {
    const pool = this.pools.get('voice');
    if (pool) {
      pool.play({ volume: 0.7 });
    }
  }

  playDefeat(): void {
    const pool = this.pools.get('voice');
    if (pool) {
      pool.play({ volume: 0.7 });
    }
  }

  setGlobalVolume(volume: number): void {
    this.globalVolume = Math.min(1, Math.max(0, volume));
  }

  setGlobalMuted(muted: boolean): void {
    this.globalMuted = muted;
  }

  isGlobalMuted(): boolean {
    return this.globalMuted;
  }

  getGlobalVolume(): number {
    return this.globalVolume;
  }

  stopAll(): void {
    this.scene.sound.stopAll();
  }

  destroy(): void {
    this.pools.clear();
  }
}

let instance: SoundVariations | null = null;

export function getSoundVariations(scene: Phaser.Scene): SoundVariations {
  if (!instance) {
    instance = new SoundVariations(scene);
  }
  return instance;
}

export function resetSoundVariations(): void {
  instance = null;
}

export default SoundVariations;
