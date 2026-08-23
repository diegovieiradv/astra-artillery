export interface TestDevice {
  id: string;
  name: string;
  width: number;
  height: number;
  pixelRatio: number;
  isPortrait: boolean;
  category: 'high-end' | 'mid-range' | 'low-end';
}

export interface TouchConfig {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  minimumSwipeDistance: number;
  touchFeedback: 'none' | 'light' | 'heavy';
}

export interface ViewportConfig {
  width: number;
  height: number;
  scale: number;
  orientation: 'portrait' | 'landscape';
  safeArea: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface MobileState {
  currentDevice: TestDevice;
  touchEnabled: boolean;
  viewport: ViewportConfig;
  lastOrientationChange: number;
  sessionStart: number;
}

export const TEST_DEVICES: TestDevice[] = [
  {
    id: 'pixel_7_pro',
    name: 'Google Pixel 7 Pro',
    width: 932,
    height: 430,
    pixelRatio: 3.0,
    isPortrait: true,
    category: 'high-end',
  },
  {
    id: 'iphone_13_mini',
    name: 'iPhone 13 mini',
    width: 844,
    height: 390,
    pixelRatio: 3.0,
    isPortrait: true,
    category: 'mid-range',
  },
  {
    id: 'galaxy_a52',
    name: 'Samsung Galaxy A52',
    width: 800,
    height: 360,
    pixelRatio: 2.0,
    isPortrait: true,
    category: 'mid-range',
  },
];

export const DEFAULT_VIEWPORT: ViewportConfig = {
  width: 800,
  height: 360,
  scale: 1.0,
  orientation: 'portrait',
  safeArea: {
    top: 40,
    bottom: 40,
    left: 30,
    right: 30,
  },
};

export const DEFAULT_MOBILE_STATE: MobileState = {
  currentDevice: TEST_DEVICES[2],
  touchEnabled: true,
  viewport: { ...DEFAULT_VIEWPORT },
  lastOrientationChange: Date.now(),
  sessionStart: Date.now(),
};

export function createDefaultMobileState(): MobileState {
  return JSON.parse(JSON.stringify(DEFAULT_MOBILE_STATE));
}

export function getDeviceByWidth(width: number, height: number): TestDevice {
  // Find the closest matching device
  for (const device of TEST_DEVICES) {
    if (device.width === width && device.height === height) {
      return device;
    }
  }
  // Return the smallest (lowest category) as fallback
  return TEST_DEVICES[TEST_DEVICES.length - 1];
}

export function isTabletDevice(device: TestDevice): boolean {
  return device.category === 'high-end' && device.width > 800;
}

export function getOptimalScale(device: TestDevice, gameWidth: number, gameHeight: number): number {
  const widthRatio = device.width / gameWidth;
  const heightRatio = device.height / gameHeight;
  return Math.min(widthRatio, heightRatio);
}

export const TOUCH_SENSITIVITIES = {
  low: { minimumSwipeDistance: 20, sensitivity: 0.5 },
  medium: { minimumSwipeDistance: 15, sensitivity: 1.0 },
  high: { minimumSwipeDistance: 10, sensitivity: 1.5 },
};

export function getTouchConfig(sensitivity: 'low' | 'medium' | 'high'): TouchConfig {
  return {
    enabled: true,
    sensitivity,
    minimumSwipeDistance: TOUCH_SENSITIVITIES[sensitivity].minimumSwipeDistance,
    touchFeedback: 'light',
  };
}