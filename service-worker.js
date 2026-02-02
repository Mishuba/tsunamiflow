const CACHE_NAME = "tf-cache-v3";
const OFFLINE_URL = "/offline.php";

const PRECACHE = [
    "/",
    "/index.html",
    "/manifest.json",
    "/icons/72Logo.png",
    "/icons/96Logo.png",
    "/icons/128Logo.png",
    "/icons/192Logo.png",
    "/icons/512Logo.png",
    "/JS/tfMain.js",
    "/JS/Arrays.js",
    "/JS/Classes.js",
    "/JS/Functions.js",
    "/JS/News.js",
    "/JS/NewsTransformWorker.js",
    "/JS/Objects.js",
    "/JS/Variables.js",
    "/JS/Words.js",
    "/MyStyle/tfMain.css",
    OFFLINE_URL
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    const url = new URL(event.request.url);

    // 🚫 Never touch backend
    if (url.hostname === "world.tsunamiflow.club") {
        return event.respondWith(fetch(event.request));
    }

    // 🚫 Never cache non-GET (POST, PUT, etc.)
    if (event.request.method !== "GET") {
        return event.respondWith(fetch(event.request));
    }

    // Page navigation
    if (event.request.mode === "navigate") {
        return event.respondWith(
            fetch(event.request).catch(() => caches.match(OFFLINE_URL))
        );
    }

    // Static assets
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request).catch(() =>
                caches.match(OFFLINE_URL)
            );
        })
    );
});