import { describe, it, expect } from 'vitest';
import { clamp, lerp, degToRad, radToDeg, distance, angleBetween, pointInCircle, rectsIntersect, circleRectCollision } from '@/types/physics';

describe('Math Utils', () => {
  describe('clamp', () => {
    it('returns value within bounds', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });
    it('clamps below minimum', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });
    it('clamps above maximum', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('lerp', () => {
    it('interpolates correctly', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
    });
  });

  describe('degToRad / radToDeg', () => {
    it('converts degrees to radians', () => {
      expect(degToRad(180)).toBeCloseTo(Math.PI);
      expect(degToRad(90)).toBeCloseTo(Math.PI / 2);
    });
    it('converts radians to degrees', () => {
      expect(radToDeg(Math.PI)).toBeCloseTo(180);
      expect(radToDeg(Math.PI / 2)).toBeCloseTo(90);
    });
    it('roundtrip is identity', () => {
      expect(radToDeg(degToRad(45))).toBeCloseTo(45);
    });
  });

  describe('distance', () => {
    it('calculates euclidean distance', () => {
      expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
      expect(distance({ x: 1, y: 1 }, { x: 1, y: 1 })).toBe(0);
    });
  });

  describe('angleBetween', () => {
    it('returns correct angle', () => {
      expect(angleBetween({ x: 0, y: 0 }, { x: 1, y: 0 })).toBe(0);
      expect(angleBetween({ x: 0, y: 0 }, { x: 0, y: 1 })).toBeCloseTo(Math.PI / 2);
      expect(angleBetween({ x: 0, y: 0 }, { x: -1, y: 0 })).toBeCloseTo(Math.PI);
    });
  });

  describe('pointInCircle', () => {
    it('detects point inside circle', () => {
      expect(pointInCircle({ x: 0, y: 0 }, { x: 0, y: 0, radius: 10 })).toBe(true);
      expect(pointInCircle({ x: 5, y: 0 }, { x: 0, y: 0, radius: 10 })).toBe(true);
    });
    it('detects point outside circle', () => {
      expect(pointInCircle({ x: 15, y: 0 }, { x: 0, y: 0, radius: 10 })).toBe(false);
    });
    it('detects point on edge', () => {
      expect(pointInCircle({ x: 10, y: 0 }, { x: 0, y: 0, radius: 10 })).toBe(true);
    });
  });

  describe('rectsIntersect', () => {
    it('detects intersecting rectangles', () => {
      expect(rectsIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
    });
    it('detects non-intersecting rectangles', () => {
      expect(rectsIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 20, width: 10, height: 10 })).toBe(false);
    });
    it('detects touching edges', () => {
      expect(rectsIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 })).toBe(false);
    });
  });

  describe('circleRectCollision', () => {
    it('detects circle inside rect', () => {
      expect(circleRectCollision({ x: 5, y: 5, radius: 2 }, { x: 0, y: 0, width: 10, height: 10 })).toBe(true);
    });
    it('detects circle overlapping rect edge', () => {
      expect(circleRectCollision({ x: 12, y: 5, radius: 3 }, { x: 10, y: 0, width: 10, height: 10 })).toBe(true);
    });
    it('detects no collision', () => {
      expect(circleRectCollision({ x: 20, y: 20, radius: 2 }, { x: 0, y: 0, width: 10, height: 10 })).toBe(false);
    });
  });
});