/* service-worker.js
   Offline-first PWA cache strategy
   Backend + realtime always network-only
*/

const VERSION = "v1.3";
const CACHE_NAME = `tf-cache-${VERSION}`;
const OFFLINE_URL = "/Offline/offline.html";

/* ---------------- PRECACHE ASSETS ---------------- */
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

/* ---------------- INSTALL ---------------- */
self.addEventListener("install", (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);

        const results = await Promise.allSettled(
            PRECACHE_URLS.map(async (url) => {
                try {
                    const res = await fetch(new Request(url, { cache: "reload" }));

                    if (!res || !res.ok) return;

                    // only cache basic same-origin GET resources
                    const isSameOrigin = new URL(res.url).origin === location.origin;
                    if (!isSameOrigin) return;

                    await cache.put(url, res.clone());
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
            keys.map((key) => {
                if (key.startsWith("tf-cache-") && key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            })
        );

        await self.clients.claim();
    })());
});

/* ---------------- FETCH HELPERS ---------------- */
function isNetworkOnly(url) {
    return (
        url.hostname.includes("world.tsunamiflow.club") ||
        url.pathname.startsWith("/api/") ||
        url.pathname.startsWith("/webhook/") ||
        url.pathname.startsWith("/ws/") ||
        url.protocol === "ws:" ||
        url.protocol === "wss:"
    );
}

function isDynamic(url) {
    return (
        url.search.length > 0 ||
        url.pathname.includes("token") ||
        url.pathname.includes("session") ||
        url.pathname.includes("auth") ||
        url.pathname.includes("signed") ||
        url.pathname.includes("nonce")
    );
}

/* ---------------- FETCH ---------------- */
self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    /* RANGE (media streaming) */
    if (request.headers.get("range")) {
        event.respondWith(fetch(request));
        return;
    }

    /* NETWORK ONLY */
    if (isNetworkOnly(url)) {
        event.respondWith(fetch(request));
        return;
    }

    /* DYNAMIC (never cache) */
    if (isDynamic(url)) {
        event.respondWith(fetch(request));
        return;
    }

    /* NAVIGATION */
    if (request.mode === "navigate") {
        event.respondWith((async () => {
            try {
                const fresh = await fetch(request);

                const cache = await caches.open(CACHE_NAME);
                cache.put(request, fresh.clone());

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

    /* STATIC / ASSETS */
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);

        const fetchPromise = fetch(request)
            .then(async (res) => {
                if (!(res instanceof Response)) return res;

                const isValid =
                    res.ok &&
                    res.status === 200 &&
                    res.type !== "opaque";

                const cacheControl = res.headers.get("Cache-Control");

                const canCache =
                    isValid &&
                    (!cacheControl || !cacheControl.includes("no-store"));

                if (canCache) {
                    try {
                        await cache.put(request, res.clone());
                    } catch {}
                }

                return res;
            })
            .catch(() => null);

        if (cached) {
            event.waitUntil(fetchPromise);
            return cached;
        }

        const fresh = await fetchPromise;

        return fresh || (await caches.match(OFFLINE_URL));
    })());
});