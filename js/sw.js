self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("fox-store").then(cache => cache.addAll([
            "/",
            "/index.html",
            "//cdn.jsdelivr.net/npm/mdui@1.0.2/dist/js/mdui.min.js",
            "//cdn.jsdelivr.net/npm/mdui@1.0.2/dist/css/mdui.min.css",
            "/cryptojs/crypto-js.js",
            "/js/getfilehash.js",
            "/icons/icon-512.png",
        ])),
    );
});

self.addEventListener("fetch", () => { });