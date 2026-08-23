export interface Vector2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

export function distance(a: Vector2, b: Vector2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function angleBetween(from: Vector2, to: Vector2): number {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

export function pointInCircle(point: Vector2, circle: Circle): boolean {
  const dx = point.x - circle.x;
  const dy = point.y - circle.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

export function rectsIntersect(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

export function circleRectCollision(circle: Circle, rect: Rect): boolean {
  const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
  const closestY = clamp(circle.y, rect.y, rect.y + rect.height);
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}