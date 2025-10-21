const CACHE_NAME = "tf-cache-v1";
const OFFLINE_URL = "/offline.html"; //change to php please
const PRECACHE = [
    "/",
    "/index.php",
    "maniest.json",
    "icons/72Logo.png",
    "icons/96Logo.png",
    "icons/128Logo.png",
    "icons/192Logo.png",
    "icons/512Logo.png",
    "JS/tfMain.js",
    "JS/Arrays.js",
    "JS/Classes.js",
    "JS/Objects.js",
    "JS/Variables.js",
    "JS/Words.js",
    "MyStyle/tfMain.css",
    OFFLINE_URL
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(caches.keys().then(keys => Promise.all(
        keys.map(k => (k !== CACHE_NAME) ? caches.delete(k) : null)
    ))
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    const req = event.request;

    if (req.mode === "navigate") {
        event.respondWith(
            fetch(req).then(res => {
                return res;
            }).catch(() => caches.match(OFFLINE_URL))
        );
        return;
    }

    event.respondWith(caches.match(req).then(cached => {
        if (cached) return cached:
        return fetch(req).then(response => {
            //optionally cache resource

            return response;
        }).catch(() => {
            //i an image requested, return a placeholder optional
            return caches.match(OFFLINE_URL);
        });
    })
    );
});
