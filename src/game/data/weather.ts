export type WeatherType = 'clear' | 'windy' | 'rain' | 'storm' | 'fog' | 'sandstorm' | 'snow';

export interface WeatherConfig {
  id: WeatherType;
  name: string;
  description: string;
  icon: string;
  windModifier: number;
  visibilityModifier: number;
  damageModifier: number;
  particleType: 'none' | 'rain' | 'snow' | 'dust' | 'leaves';
  color: string;
}

export const WEATHER_CONFIGS: Record<WeatherType, WeatherConfig> = {
  clear: {
    id: 'clear',
    name: 'Limpo',
    description: 'Sem efeitos especiais.',
    icon: '☀️',
    windModifier: 1.0,
    visibilityModifier: 1.0,
    damageModifier: 1.0,
    particleType: 'none',
    color: '#fbbf24',
  },
  windy: {
    id: 'windy',
    name: 'Ventoso',
    description: 'Vento forte afeta trajetorias.',
    icon: '🌬️',
    windModifier: 1.8,
    visibilityModifier: 0.9,
    damageModifier: 1.0,
    particleType: 'leaves',
    color: '#60a5fa',
  },
  rain: {
    id: 'rain',
    name: 'Chuvoso',
    description: 'Reduz visibilidade e velocidade.',
    icon: '🌧️',
    windModifier: 1.2,
    visibilityModifier: 0.7,
    damageModifier: 0.9,
    particleType: 'rain',
    color: '#64748b',
  },
  storm: {
    id: 'storm',
    name: 'Tempestade',
    description: 'Vento muito forte, visibilidade baixa.',
    icon: '⛈️',
    windModifier: 2.5,
    visibilityModifier: 0.5,
    damageModifier: 0.8,
    particleType: 'rain',
    color: '#7c3aed',
  },
  fog: {
    id: 'fog',
    name: 'Nevoeiro',
    description: 'Visibilidade muito reduzida.',
    icon: '🌫️',
    windModifier: 0.8,
    visibilityModifier: 0.4,
    damageModifier: 1.0,
    particleType: 'none',
    color: '#94a3b8',
  },
  sandstorm: {
    id: 'sandstorm',
    name: 'Tempestade de Areia',
    description: 'Reduz visibilidade e causa dano periodico.',
    icon: '🏜️',
    windModifier: 1.5,
    visibilityModifier: 0.6,
    damageModifier: 1.1,
    particleType: 'dust',
    color: '#d97706',
  },
  snow: {
    id: 'snow',
    name: 'Neve',
    description: 'Reduz mobilidade e velocidade.',
    icon: '❄️',
    windModifier: 1.0,
    visibilityModifier: 0.8,
    damageModifier: 0.85,
    particleType: 'snow',
    color: '#e2e8f0',
  },
};

export const WEATHER_LIST = Object.values(WEATHER_CONFIGS);

export function getRandomWeather(): WeatherType {
  const types = Object.keys(WEATHER_CONFIGS) as WeatherType[];
  const weights = [30, 20, 15, 10, 10, 10, 5];
  const total = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  for (let i = 0; i < types.length; i++) {
    random -= weights[i];
    if (random <= 0) return types[i];
  }
  return 'clear';
}

export function getWeatherConfig(type: WeatherType): WeatherConfig {
  return WEATHER_CONFIGS[type] || WEATHER_CONFIGS.clear;
}
