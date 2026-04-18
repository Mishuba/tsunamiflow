/* service-worker.js
   Offline-first PWA cache strategy
   Frontend stays usable offline.
   Backend / realtime services always stay network-only.
*/

const VERSION = "v5";
const CACHE_NAME = `tf-cache-${VERSION}`;
const OFFLINE_URL = "/offline.html";

/*
    Only cache frontend assets here.
    Do NOT include dynamic API endpoints, websocket routes,
    RTMP routes, webhook endpoints, etc.
*/
const PRECACHE_URLS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/favicon.ico",
    "/offline.html",

    // Core CSS / JS
    "/CSS/style.css",
    "/JS/tfMain.js",

    // Add more stable assets here if needed
    // "/images/logo.png",
];

/*
|--------------------------------------------------------------------------
| INSTALL
|--------------------------------------------------------------------------
| Pre-cache critical frontend files
*/
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            for (const url of PRECACHE_URLS) {
                try {
                    await cache.add(new Request(url, { cache: "reload" }));
                } catch (error) {
                    console.warn("[SW] Failed to precache:", url, error);
                }
            }

            await self.skipWaiting();
        })()
    );
});

/*
|--------------------------------------------------------------------------
| ACTIVATE
|--------------------------------------------------------------------------
| Remove old cache versions
*/
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();

            await Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );

            await self.clients.claim();
        })()
    );
});

/*
|--------------------------------------------------------------------------
| FETCH
|--------------------------------------------------------------------------
|
| Strategy:
|
| 1. Backend / API / WebSocket / external stream servers:
|    NETWORK ONLY
|
| 2. Page navigation:
|    NETWORK FIRST → offline fallback
|
| 3. Static assets (css/js/images/fonts):
|    CACHE FIRST → update in background
|
*/
self.addEventListener("fetch", (event) => {
    const request = event.request;

    // Ignore non-GET requests
    if (request.method !== "GET") return;

    const url = new URL(request.url);

    /*
    ----------------------------------------------------------------------
    NEVER CACHE THESE
    ----------------------------------------------------------------------
    */
    const networkOnly =
        url.hostname.includes("world.tsunamiflow.club") || // backend server
        url.pathname.startsWith("/api/") ||
        url.pathname.startsWith("/webhook/") ||
        url.pathname.startsWith("/ws/") ||
        url.protocol === "ws:" ||
        url.protocol === "wss:";

    if (networkOnly) {
        event.respondWith(fetch(request));
        return;
    }

    /*
    ----------------------------------------------------------------------
    PAGE NAVIGATION
    NETWORK FIRST
    ----------------------------------------------------------------------
    */
    if (request.mode === "navigate") {
        event.respondWith(
            (async () => {
                try {
                    const fresh = await fetch(request);

                    const cache = await caches.open(CACHE_NAME);
                    cache.put(request, fresh.clone());

                    return fresh;
                } catch (error) {
                    const cached = await caches.match(request);
                    return cached || caches.match(OFFLINE_URL);
                }
            })()
        );

        return;
    }

    /*
    ----------------------------------------------------------------------
    STATIC ASSETS
    CACHE FIRST + BACKGROUND UPDATE
    ----------------------------------------------------------------------
    */
    event.respondWith(
        (async () => {
            const cached = await caches.match(request);

            const networkFetch = fetch(request)
                .then(async (response) => {
                    /*
                        Only cache valid same-origin responses
                    */
                    if (
                        response &&
                        response.status === 200 &&
                        response.type === "basic"
                    ) {
                        const cache = await caches.open(CACHE_NAME);
                        cache.put(request, response.clone());
                    }

                    return response;
                })
                .catch(() => null);

            // Serve cache immediately if available
            if (cached) {
                event.waitUntil(networkFetch);
                return cached;
            }

            // Otherwise try network
            const fresh = await networkFetch;

            // Final fallback
            return fresh || caches.match(OFFLINE_URL);
        })()
    );
});