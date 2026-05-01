/* service-worker.js
   Offline-first PWA cache strategy
   Backend + realtime always network-only
*/

const VERSION = "v1.5";
const CACHE_APP_SHELL = `tf-app-shell-${VERSION}`;
const CACHE_ASSETS = `tf-assets-${VERSION}`;
const CACHE_DYNAMIC = `tf-dynamic-${VERSION}`;
const OFFLINE_URL = "/Offline/offline.html";

const MAX_ASSETS = 180;


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

/* ---------------- INDEXEDDB MANIFEST (lightweight registry) ---------------- */
const DB_NAME = "tf-pwa-db";
const STORE = "manifest";

let dbPromise;

function openDB() {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);

        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE)) {
                db.createObjectStore(STORE);
            }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });

    return dbPromise;
}

function normalizeNav(url) {
    if (url.pathname.endsWith("/")) {
        return url.pathname + "index.html";
    }
    if (!url.pathname.includes(".")) {
        return url.pathname + "/index.html";
    }
    return url.pathname;
}

function txDone(tx) {
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

function assetBucket(url) {
    if (url.pathname.endsWith(".js")) return "js";
    if (url.pathname.endsWith(".css")) return "css";
    if (url.pathname.match(/\.(png|jpg|jpeg|webp|gif)$/)) return "img";
    return "misc";
}

async function setManifest(key, value) {
    const db = await openDB();
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    return txDone(tx);
}

async function getManifest(key) {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).get(key);
        req.onsuccess = () => resolve(req.result || 0);
        req.onerror = () => resolve(0);
    });
}

/* ---------------- UTIL ---------------- */
const isNetworkOnly = (url) =>
    /world\.tsunamiflow\.club/i.test(url.hostname) ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/webhook/") ||
    url.pathname.startsWith("/ws/") ||
    url.protocol.startsWith("ws");

const isDynamic = (url) =>
    url.search.length > 0 ||
    /token|session|auth|signed|nonce/i.test(url.pathname);

const keyFromRequest = (req) => {
const fallbackKey = normalizeNav(new URL(req.url));

return (
    (await caches.match(req)) ||
    (await caches.match(fallbackKey)) ||
    (await caches.match("/index.html")) ||
    (await caches.match(OFFLINE_URL))
);

/* ---------------- LRU TRIM ---------------- */
async function trimCache(cache) {
    const keys = await cache.keys();

    if (keys.length <= MAX_ASSETS) return;

    const scored = await Promise.all(
        keys.map(async (req) => {
            const lastUsed = await getManifest(req.url);
            return { req, lastUsed };
        })
    );

    scored.sort((a, b) => a.lastUsed - b.lastUsed);

    const toDelete = scored.slice(0, keys.length - MAX_ASSETS);

    await Promise.all(
        toDelete.map((item) => cache.delete(item.req))
    );
}

/* ---------------- INSTALL ---------------- */
self.addEventListener("install", (event) => {
    event.waitUntil((async () => {
        const shellCache = await caches.open(CACHE_APP_SHELL);

        await Promise.allSettled(
            PRECACHE_URLS.map(async (url) => {
                try {
                    const res = await fetch(url, { cache: "reload" });
                    if (!res || !res.ok) return;

                    await shellCache.put(url, res.clone());
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
                const isOldCache =
                    key.startsWith("tf-app-shell-") ||
                    key.startsWith("tf-assets-") ||
                    key.startsWith("tf-dynamic-");

                const isCurrent =
                    key.includes(VERSION);

                if (isOldCache && !isCurrent) {
                    return caches.delete(key);
                }
            })
        );

        await self.clients.claim();
    })());
});

/* ---------------- FETCH ---------------- */
self.addEventListener("fetch", (event) => {
    const req = event.request;

    if (req.method !== "GET") return;

    const url = new URL(req.url);

    if (req.headers.get("range")) {
        event.respondWith(fetch(req));
        return;
    }

    if (isNetworkOnly(url) || isDynamic(url)) {
        event.respondWith(fetch(req));
        return;
    }

    /* ---------------- NAVIGATION (NETWORK-FIRST) ---------------- */
    if (req.mode === "navigate") {
        event.respondWith((async () => {
            try {
                const fresh = await fetch(req);
                return fresh;
            } catch {
                return (await caches.match(req)) ||
                       (await caches.match(OFFLINE_URL));
            }
        })());

        return;
    }

    /* ---------------- ASSETS (SWR + LRU + MULTI CACHE) ---------------- */
    event.respondWith((async () => {
        const key = keyFromRequest(req);

        const assetCache = await caches.open(CACHE_ASSETS);

        const cached = await assetCache.match(key);

        const network = fetch(req)
            .then(async (res) => {
                if (!res || !res.ok) return res;

                const cacheControl = res.headers.get("Cache-Control");

                const canCache =
                    res.type === "basic" &&
                    (!cacheControl || !cacheControl.includes("no-store"));

                if (canCache) {
                    await assetCache.put(key, res.clone());
                    await trimCache(assetCache);
                }

                await setManifest(key, Date.now());

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