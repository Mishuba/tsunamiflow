const CACHE_NAME = "tf-cache-v4";
const OFFLINE_URL = "/offline.html";

const PRECACHE = [
    "/",
    "/index.html",
    "/manifest.json",
    OFFLINE_URL
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            for (const asset of PRECACHE) {
                try {
                    await cache.add(asset);
                } catch (err) {
                    console.warn("Cache failed:", asset);
                }
            }
            await self.skipWaiting();
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key =>
                    key !== CACHE_NAME
                        ? caches.delete(key)
                        : null
                )
            )
        )
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {
    const req = event.request;
    const url = new URL(req.url);

    if (
        req.method !== "GET" ||
        url.hostname.includes("world.tsunamiflow.club") ||
        url.pathname.startsWith("/api/")
    ) {
        return event.respondWith(fetch(req));
    }

    if (req.mode === "navigate") {
        return event.respondWith(
            fetch(req).catch(() => caches.match(OFFLINE_URL))
        );
    }

    event.respondWith(
        caches.match(req).then(async cached => {
            const fetchPromise = fetch(req)
                .then(networkRes => {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(req, networkRes.clone());
                    });
                    return networkRes;
                })
                .catch(() => cached || caches.match(OFFLINE_URL));

            return cached || fetchPromise;
        })
    );
});