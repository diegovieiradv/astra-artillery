import { describe, it, expect } from 'vitest';
import {
  WEATHER_CONFIGS,
  WEATHER_LIST,
  getRandomWeather,
  getWeatherConfig,
  WeatherType,
} from '@/game/data/weather';

describe('Weather System', () => {
  describe('WEATHER_CONFIGS', () => {
    it('should have 7 weather types', () => {
      expect(Object.keys(WEATHER_CONFIGS).length).toBe(7);
    });

    it('should include all weather types', () => {
      const types: WeatherType[] = ['clear', 'windy', 'rain', 'storm', 'fog', 'sandstorm', 'snow'];
      for (const type of types) {
        expect(WEATHER_CONFIGS[type]).toBeDefined();
      }
    });

    it('every config should have required fields', () => {
      for (const [id, config] of Object.entries(WEATHER_CONFIGS)) {
        expect(config.id).toBe(id);
        expect(config.name).toBeTruthy();
        expect(config.description).toBeTruthy();
        expect(config.icon).toBeTruthy();
        expect(config.windModifier).toBeGreaterThan(0);
        expect(config.visibilityModifier).toBeGreaterThan(0);
        expect(config.damageModifier).toBeGreaterThan(0);
      }
    });
  });

  describe('WEATHER_LIST', () => {
    it('should have 7 items', () => {
      expect(WEATHER_LIST.length).toBe(7);
    });
  });

  describe('getRandomWeather', () => {
    it('should return a valid weather type', () => {
      const weather = getRandomWeather();
      expect(WEATHER_CONFIGS[weather]).toBeDefined();
    });

    it('should sometimes return clear (most common)', () => {
      const results = new Set<string>();
      for (let i = 0; i < 100; i++) {
        results.add(getRandomWeather());
      }
      expect(results.has('clear')).toBe(true);
    });
  });

  describe('getWeatherConfig', () => {
    it('should return correct config for each type', () => {
      const clear = getWeatherConfig('clear');
      expect(clear.id).toBe('clear');
      expect(clear.name).toBe('Limpo');
    });

    it('should default to clear for unknown type', () => {
      const config = getWeatherConfig('unknown' as WeatherType);
      expect(config.id).toBe('clear');
    });
  });
});
