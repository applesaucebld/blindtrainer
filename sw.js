const CACHE_NAME = "blindtrainer_cache_3";
var urlsToCache = [
    '.',
    'css/footer.css',
    'css/global.css',
    'css/help.css',
    'css/main-footer.css',
    'css/maingrid.css',
    'css/presets.css',
    'css/sets.css',
    'css/settings.css',
    'css/support.css',
    'css/sync.css',
    'css/tops-main.css',
    'css/tops-pt.css',
    'css/tops-side.css',
    'css/training.css',
    'images/icon_cloud.png',
    'images/icon_corners.png',
    'images/icon_donate.png',
    'images/icon_edges.png',
    'images/icon_flips.png',
    'images/icon_home.png',
    'images/icon_logo_2_light.png',
    'images/icon_logo_2.png',
    'images/icon_ltct.png',
    'images/icon_midges.png',
    'images/icon_parity.png',
    'images/icon_pluscenters.png',
    'images/icon_presets.png',
    'images/icon_settings.png',
    'images/icon_slow.png',
    'images/icon_statistics.png',
    'images/icon_twists.png',
    'images/icon_wings.png',
    'images/icon_words.png',
    'images/icon_xcenters.png',
    'images/logo_scs.png',
    'script.js',
    '404.html',
    'corners.html',
    'edges.html',
    'flips.html',
    'help.html',
    'index.html',
    'ltct.html',
    'midges.html',
    'parity.html',
    'pluscenters.html',
    'twists.html',
    'wings.html',
    'words.html',
    'xcenters.html'
];

self.addEventListener('install', function (event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName != CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});