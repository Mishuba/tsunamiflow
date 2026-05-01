/* service-worker.js
   Offline-first PWA cache strategy
   Backend + realtime always network-only
*/

const VERSION = "v1.4.1";
const CACHE_NAME = `tf-cache-${VERSION}`;
const OFFLINE_URL = "/Offline/offline.html";

/* ---------------- PRECACHE ---------------- */
const PRECACHE_URLS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/favicon.ico",
    OFFLINE_URL,
    "/install/index.html",

    "/MyStyle/tfMain.css",
    "/JS/tfMain.js",
    "/JS/TFN/maxwell.js",

    "/JS/TFN/T/Worker/Shared.js",
    "/JS/TFN/T/Worker/WebWorker/TaskWebWorker.js",
    "/JS/TFN/T/Worker/WebWorker/kid/AiWebWorker.js",
    "/JS/TFN/T/Worker/WebWorker/kid/GameInputWebWorker.js",
    "/JS/TFN/T/Worker/WebWorker/kid/GameWorldWebWorker.js",
    "/JS/TFN/T/Worker/WebWorker/kid/MediaWebWorker.js",

    "/JS/TFN/T/Class/weather.js",
    "/JS/TFN/T/Class/Tycadome.js",
    "/JS/TFN/T/Class/LiveVidController.js",
    "/JS/TFN/T/Class/DjController.js",

    "/JS/TFN/T/Class/Elder/news.js",
    "/JS/TFN/T/Class/Elder/Img.js",
    "/JS/TFN/T/Class/Elder/videoRecorder.js",
    "/JS/TFN/T/Class/Elder/SignUpLoginOutf.js",
    "/JS/TFN/T/Class/Elder/TfRadio.js",

    "/JS/TFN/T/Class/Elder/Adult/words.js",
    "/JS/TFN/T/Class/Elder/Adult/Video.js",
    "/JS/TFN/T/Class/Elder/Adult/Money.js",
    "/JS/TFN/T/Class/Elder/Adult/Image.js",
    "/JS/TFN/T/Class/Elder/Adult/Audio.js",

    "/JS/TFN/T/Class/Elder/Adult/Teen/T.js",
    "/JS/TFN/T/Class/Elder/Adult/Teen/tfnation.js",
    "/JS/TFN/T/Class/Elder/Adult/Teen/Child/OffscreenCanvas.js",
    "/JS/TFN/T/Class/Elder/Adult/Teen/Child/N.js",
    "/JS/TFN/T/Class/Elder/Adult/Teen/Child/Base/F.js",
    "/JS/TFN/T/Class/Elder/Adult/Teen/Child/Base/test.js",
    "/JS/TFN/T/Class/Elder/Adult/Teen/Child/Base/foundation/base.js",
    "/JS/TFN/T/Class/Elder/Adult/Teen/Child/Base/foundation/W.js",

    "/icons/72Logo.png",
    "/icons/96Logo.png",
    "/icons/128Logo.png",
    "/icons/192Logo.png",
    "/icons/512Logo.png",

    "/Pictures/Logo/Tsunami Flow Logo.png",
    "/Pictures/Logo/Untitled-1.jpg",

    "/Pictures/Social_Media/Facebook.jpg",
    "/Pictures/Social_Media/Instagram.jpg",
    "/Pictures/Social_Media/Patreon.jpg",
    "/Pictures/Social_Media/Twitch.jpg",
    "/Pictures/Social_Media/Twitter.jpg",
    "/Pictures/Social_Media/Youtube.jpg",

    "/Pictures/Games/Sprites/Stickman/Sheets/standingNwalking2400.png",

    "/Iframe/Pages/Community.html",
    "/Iframe/Pages/Competitions.html",
    "/Iframe/Pages/homepage.html",
    "/Iframe/Pages/news.html",
    "/Iframe/Pages/roster.html",
    "/Iframe/Pages/TFnetwork.html",
];

/* ---------------- UTIL ---------------- */
const isNetworkOnly = (url) =>
    url.hostname.includes("world.tsunamiflow.club") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/webhook/") ||
    url.pathname.startsWith("/ws/") ||
    url.protocol.startsWith("ws");

const isDynamic = (url) =>
    url.search.length > 0 ||
    /token|session|auth|signed|nonce/i.test(url.pathname);

/* normalize cache key (critical fix) */
const cacheKey = (request) => {
    const url = new URL(request.url);
    url.search = ""; // prevents cache explosion from query strings
    return url.toString();
};

/* ---------------- INSTALL ---------------- */
self.addEventListener("install", (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);

        const results = await Promise.allSettled(
            PRECACHE_URLS.map(async (path) => {
                const req = new Request(path, { cache: "reload" });

                try {
                    const res = await fetch(req);

                    if (!res || !res.ok) return;

                    const url = new URL(res.url);

                    if (url.origin !== self.location.origin) return;

                    await cache.put(path, res.clone());
                } catch {}
            })
        );

        await self.skipWaiting();
    })());
});

/* ---------------- ACTIVATE ---------------- */
self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();

        await Promise.all(
            keys.map((key) =>
                key.startsWith("tf-cache-") && key !== CACHE_NAME
                    ? caches.delete(key)
                    : null
            )
        );

        await self.clients.claim();
    })());
});

/* ---------------- FETCH ---------------- */
self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    if (request.headers.get("range")) {
        event.respondWith(fetch(request));
        return;
    }

    if (isNetworkOnly(url) || isDynamic(url)) {
        event.respondWith(fetch(request));
        return;
    }

    /* NAVIGATION: network-first, fallback offline */
    if (request.mode === "navigate") {
        event.respondWith((async () => {
            try {
                const fresh = await fetch(request);

                const cache = await caches.open(CACHE_NAME);

                // avoid poisoning cache with error pages
                if (fresh.ok && fresh.type === "basic") {
                    cache.put(request, fresh.clone());
                }

                return fresh;
            } catch {
                return (
                    (await caches.match(request)) ||
                    (await caches.match(OFFLINE_URL))
                );
            }
        })());

        return;
    }

    /* STATIC: stale-while-revalidate (optimized core) */
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const key = cacheKey(request);

        const cached = await cache.match(key);

        const network = fetch(request)
            .then(async (res) => {
                if (!res || !res.ok) return res;

                const cacheControl = res.headers.get("Cache-Control");

                const canCache =
                    !cacheControl?.includes("no-store") &&
                    res.type !== "opaque";

                if (canCache) {
                    try {
                        await cache.put(key, res.clone());
                    } catch {}
                }

                return res;
            })
            .catch(() => null);

        if (cached) {
            event.waitUntil(network);
            return cached;
        }

        const fresh = await network;

        return fresh || (await caches.match(OFFLINE_URL));
    })());
});