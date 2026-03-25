export class ServiceWorker extends W {
    cacheName = null;
    cache = null;
    CacheonReady = null;
    CacheautoOpen = true;
    sw = null;
    scriptURL = scriptURL;
    registration = null;
    listeners = {};
    constructor(options = {}) {
        if (!("serviceWorker" in navigator)) {
            console.warn("Service Workers are not supported in this browser");
            this.sw = null;
            return;
        }
    }
    install(event) {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(cache => cache.addAll(PRECACHE))
                .then(() => self.skipWaiting())
        );
    }
    activate(event) {
        event.waitUntil(
            caches.keys().then(keys =>
                Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))
            )
        );
        self.clients.claim();
    }
    fetch(event) {
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
    }
    async register() {
        if (!this.scriptURL) return;
        try {
            this.registration = await navigator.serviceWorker.register(this.scriptURL);
            console.log("Service Worker registered:", this.registration);

            navigator.serviceWorker.addEventListener("message", (event) => {
                this.emit("message", event.data);
            });
        } catch (err) {
            console.error("Service Worker registration failed:", err);
        }
    }

    postMessage(message) {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(message);
        } else {
            console.warn("No active Service Worker controller found");
        }
    }
    async unregister() {
        if (!this.registration) return;
        try {
            await this.registration.unregister();
            console.log("Service Worker unregistered");
            this.registration = null;
        } catch (err) {
            console.error("Failed to unregister Service Worker:", err);
        }
    }
}

const CACHE_NAME = "tf-cache-v3";

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
    "/offline.html"
];