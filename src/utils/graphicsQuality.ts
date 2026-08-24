import { GameState } from '@/stores/gameStore';

export type GraphicsQuality = GameState['settings']['graphicsQuality'];

export interface QualityProfile {
  particles: boolean;
  screenShake: boolean;
  screenFlash: boolean;
  reduceMotion: boolean;
}

const QUALITY_PROFILES: Record<Exclude<GraphicsQuality, 'auto'>, QualityProfile> = {
  low: {
    particles: false,
    screenShake: false,
    screenFlash: false,
    reduceMotion: true,
  },
  medium: {
    particles: true,
    screenShake: false,
    screenFlash: true,
    reduceMotion: false,
  },
  high: {
    particles: true,
    screenShake: true,
    screenFlash: true,
    reduceMotion: false,
  },
};

function detectDeviceQuality(): 'low' | 'medium' | 'high' {
  if (typeof navigator === 'undefined') return 'medium';

  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  if (cores <= 2 || (memory !== undefined && memory <= 2)) return 'low';
  if (cores >= 8 && (memory === undefined || memory >= 8)) return 'high';
  return 'medium';
}

export function resolveQuality(quality: GraphicsQuality): QualityProfile {
  const resolved = quality === 'auto' ? detectDeviceQuality() : quality;
  return QUALITY_PROFILES[resolved];
}

export function getQualityLabel(quality: GraphicsQuality): string {
  if (quality === 'auto') return 'Auto';
  const labels: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };
  return labels[quality] || quality;
}

export const QUALITY_OPTIONS: GraphicsQuality[] = ['auto', 'low', 'medium', 'high'];
