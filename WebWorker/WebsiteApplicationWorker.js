self.addEventListener("install", (e) => {
    console.log("Service Worker Installed");
    e.waitUntil(
        caches.open("pwa-cache").then((cache) => {
            return cache.addAll([
                "/",
                "/index.php",
                "/Arrays.php",
                "/Community.php",
                "/config.php",
                "/functions.php",
                "/homepage.php",
                "/news.php",
                "/Objects.php",
                "/roster.php",
                "/server.php",
                "TFnetwork.php",
                "/MyStyle/tfMain.css",
                "/JS/Arrays.js",
                "/JS/Classes.js",
                "/Js/default.js",
                "/JS/Functions.js",
                "/JS/NewsTicker.js",
                "/JS/NesTransformWorker.js",
                "/JS/Objects.js",
                "/JS/script.js",
                "/JS/tfMain.js",
                "/JS/Variables.js",
                "/JS/Words.js",
                "/JS/WWnewsTicker.js",
                "/Pictures/Logo/'Tsunami Flow Logo.png'",
                "/Pictures/Logo/Untitled-1.jpg",
                "/Music/",
                "/JSon/manifest.json",
                "/stripestuff/",
                "/TcookiesF/",
                "/TDFB/",
                "/Tphp/",
                "/WebVTT/",
                "/StorageBucket/",
                "/Community/"
            ]);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});

self.addEventListener('periodicsync', (event) => {
    if (event.tag === "background-fetch") {
        event.waitUntil(fetch('/ping-server-endpoint'));
    }
});