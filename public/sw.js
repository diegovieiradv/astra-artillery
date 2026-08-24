const CACHE_NAME = 'astra-artillery-v2';
const STATIC_ASSETS = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/maps/arena_1_bg.svg',
  '/maps/arena_2_bg.svg',
  '/maps/arena_3_bg.svg',
  '/maps/arena_4_bg.svg',
  '/maps/arena_5_bg.svg',
  '/maps/arena_6_bg.svg',
  '/maps/arena_7_bg.svg',
  '/maps/arena_8_bg.svg',
  '/maps/arena_9_bg.svg',
  '/maps/arena_10_bg.svg',
  '/maps/arena_11_bg.svg',
  '/maps/arena_12_bg.svg',
  '/maps/arena_13_bg.svg',
  '/maps/arena_14_bg.svg',
  '/maps/arena_15_bg.svg',
  '/maps/arena_16_bg.svg',
  '/maps/arena_17_bg.svg',
  '/maps/arena_18_bg.svg',
  '/maps/arena_19_bg.svg',
  '/maps/arena_20_bg.svg',
  '/maps/arena_21_bg.svg',
  '/maps/arena_22_bg.svg',
  '/maps/arena_23_bg.svg',
  '/maps/arena_24_bg.svg',
  '/maps/boss_1_bg.svg',
  '/maps/boss_2_bg.svg',
  '/maps/boss_3_bg.svg',
  '/maps/boss_4_bg.svg',
  '/maps/boss_5_bg.svg',
  '/maps/boss_6_bg.svg',
  '/maps/world_sky.svg',
  '/maps/world_mountains.svg',
  '/maps/world_trees.svg',
  '/maps/world_crystals.svg',
  '/characters/kai.svg',
  '/characters/luna.svg',
  '/characters/bolt.svg',
  '/characters/nova.svg',
  '/characters/zephyr.svg',
  '/characters/igneous.svg',
  '/characters/glacis.svg',
  '/characters/aeris.svg',
  '/characters/avatar_kai.svg',
  '/characters/avatar_luna.svg',
  '/characters/avatar_bolt.svg',
  '/characters/avatar_nova.svg',
  '/characters/avatar_zephyr.svg',
  '/characters/avatar_igneous.svg',
  '/characters/avatar_glacis.svg',
  '/characters/avatar_aeris.svg',
  '/effects/projectile.svg',
  '/effects/explosion.svg',
  '/effects/smoke.svg',
  '/effects/spark.svg',
  '/effects/star.svg',
  '/effects/leaf.svg',
  '/ui/node_locked.svg',
  '/ui/node_available.svg',
  '/ui/node_completed.svg',
  '/ui/node_perfect.svg',
  '/ui/node_boss.svg',
  '/ui/node_boss_completed.svg',
  '/ui/node_boss_perfect.svg',
  '/ui/panel.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/');
          });
        })
    );
    return;
  }

  if (STATIC_ASSETS.some(asset => url.pathname === asset || url.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
