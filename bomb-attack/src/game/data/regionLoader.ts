export interface RegionConfig {
  id: string;
  name: string;
  description: string;
  assets: RegionAsset[];
  priority: 'low' | 'medium' | 'high';
  estimatedSize: number;
}

export interface RegionAsset {
  id: string;
  type: 'sprite' | 'audio' | 'tilemap' | 'animation' | 'particle';
  path: string;
  size: number;
}

export interface RegionLoaderState {
  loadedRegions: string[];
  loadingRegions: string[];
  currentRegion: string | null;
  preloadRegions: string[];
  stats: RegionLoaderStats;
}

export interface RegionLoaderStats {
  totalLoaded: number;
  totalSize: number;
  loadTimes: Record<string, number>;
  errors: string[];
}

export const DEFAULT_REGION_LOADER_STATE: RegionLoaderState = {
  loadedRegions: [],
  loadingRegions: [],
  currentRegion: null,
  preloadRegions: [],
  stats: {
    totalLoaded: 0,
    totalSize: 0,
    loadTimes: {},
    errors: [],
  },
};

export function createDefaultRegionLoaderState(): RegionLoaderState {
  return JSON.parse(JSON.stringify(DEFAULT_REGION_LOADER_STATE));
}

export const REGIONS: RegionConfig[] = [
  {
    id: 'desert',
    name: 'Deserto',
    description: 'Regiao desertica com areia e cactos.',
    priority: 'high',
    estimatedSize: 2048,
    assets: [
      { id: 'desert_bg', type: 'sprite', path: '/assets/regions/desert/background.png', size: 512 },
      { id: 'desert_tiles', type: 'tilemap', path: '/assets/regions/desert/tileset.json', size: 256 },
      { id: 'desert_wind', type: 'audio', path: '/assets/regions/desert/wind.mp3', size: 128 },
      { id: 'desert_sandstorm', type: 'particle', path: '/assets/regions/desert/sandstorm.json', size: 64 },
      { id: 'desert_cactus', type: 'sprite', path: '/assets/regions/desert/cactus.png', size: 32 },
    ],
  },
  {
    id: 'snow',
    name: 'Neve',
    description: 'Regiao glacial com montanhas nevadas.',
    priority: 'high',
    estimatedSize: 2048,
    assets: [
      { id: 'snow_bg', type: 'sprite', path: '/assets/regions/snow/background.png', size: 512 },
      { id: 'snow_tiles', type: 'tilemap', path: '/assets/regions/snow/tileset.json', size: 256 },
      { id: 'snow_wind', type: 'audio', path: '/assets/regions/snow/blizzard.mp3', size: 128 },
      { id: 'snow_particle', type: 'particle', path: '/assets/regions/snow/snowflakes.json', size: 64 },
      { id: 'snow_igloo', type: 'sprite', path: '/assets/regions/snow/igloo.png', size: 32 },
    ],
  },
  {
    id: 'jungle',
    name: 'Selva',
    description: 'Floresta tropical densa e perigosa.',
    priority: 'medium',
    estimatedSize: 2048,
    assets: [
      { id: 'jungle_bg', type: 'sprite', path: '/assets/regions/jungle/background.png', size: 512 },
      { id: 'jungle_tiles', type: 'tilemap', path: '/assets/regions/jungle/tileset.json', size: 256 },
      { id: 'jungle_ambient', type: 'audio', path: '/assets/regions/jungle/ambient.mp3', size: 128 },
      { id: 'jungle_rain', type: 'particle', path: '/assets/regions/jungle/rain.json', size: 64 },
      { id: 'jungle_tree', type: 'sprite', path: '/assets/regions/jungle/tree.png', size: 32 },
    ],
  },
  {
    id: 'city',
    name: 'Cidade',
    description: 'Cidade moderna com prédios altos.',
    priority: 'medium',
    estimatedSize: 2048,
    assets: [
      { id: 'city_bg', type: 'sprite', path: '/assets/regions/city/background.png', size: 512 },
      { id: 'city_tiles', type: 'tilemap', path: '/assets/regions/city/tileset.json', size: 256 },
      { id: 'city_traffic', type: 'audio', path: '/assets/regions/city/traffic.mp3', size: 128 },
      { id: 'city_cars', type: 'particle', path: '/assets/regions/city/cars.json', size: 64 },
      { id: 'city_building', type: 'sprite', path: '/assets/regions/city/building.png', size: 32 },
    ],
  },
  {
    id: 'space',
    name: 'Espaco',
    description: 'Estacao orbital com vista do universo.',
    priority: 'low',
    estimatedSize: 2048,
    assets: [
      { id: 'space_bg', type: 'sprite', path: '/assets/regions/space/background.png', size: 512 },
      { id: 'space_tiles', type: 'tilemap', path: '/assets/regions/space/tileset.json', size: 256 },
      { id: 'space_ambient', type: 'audio', path: '/assets/regions/space/ambient.mp3', size: 128 },
      { id: 'space_stars', type: 'particle', path: '/assets/regions/space/stars.json', size: 64 },
      { id: 'space_station', type: 'sprite', path: '/assets/regions/space/station.png', size: 32 },
    ],
  },
  {
    id: 'lava',
    name: 'Vulcao',
    description: 'Regiao vulcanica com lava e fogo.',
    priority: 'high',
    estimatedSize: 2048,
    assets: [
      { id: 'lava_bg', type: 'sprite', path: '/assets/regions/lava/background.png', size: 512 },
      { id: 'lava_tiles', type: 'tilemap', path: '/assets/regions/lava/tileset.json', size: 256 },
      { id: 'lava_rumble', type: 'audio', path: '/assets/regions/lava/rumble.mp3', size: 128 },
      { id: 'lava_embers', type: 'particle', path: '/assets/regions/lava/embers.json', size: 64 },
      { id: 'lava_rock', type: 'sprite', path: '/assets/regions/lava/rock.png', size: 32 },
    ],
  },
];

export function getRegionConfig(id: string): RegionConfig | undefined {
  return REGIONS.find(region => region.id === id);
}

export function getRegions(): RegionConfig[] {
  return [...REGIONS];
}

export function getRegionsByPriority(priority: 'low' | 'medium' | 'high'): RegionConfig[] {
  return REGIONS.filter(region => region.priority === priority);
}

export function isRegionLoaded(state: RegionLoaderState, regionId: string): boolean {
  return state.loadedRegions.includes(regionId);
}

export function isRegionLoading(state: RegionLoaderState, regionId: string): boolean {
  return state.loadingRegions.includes(regionId);
}

export function canLoadRegion(state: RegionLoaderState, regionId: string): boolean {
  return !isRegionLoaded(state, regionId) && !isRegionLoading(state, regionId);
}

export function estimateLoadTime(region: RegionConfig): number {
  const baseTime = 1000;
  const sizeFactor = region.estimatedSize / 1024;
  return Math.round(baseTime * sizeFactor);
}

export function getPreloadRecommendation(currentRegion: string): string[] {
  const regionConnections: Record<string, string[]> = {
    desert: ['snow', 'lava'],
    snow: ['desert', 'jungle'],
    jungle: ['snow', 'city'],
    city: ['jungle', 'space'],
    space: ['city', 'lava'],
    lava: ['space', 'desert'],
  };
  return regionConnections[currentRegion] || [];
}
