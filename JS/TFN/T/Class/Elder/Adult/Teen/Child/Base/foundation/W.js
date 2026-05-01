import { T } from "./base.js";

export class W extends T {
    cacheName = null;
    cache = null;
    CacheonReady = null;
    CacheautoOpen = true;
    PRECACHE = [];
    listeners = {};
    domListeners = new Map();
    constructor(options = {}) {
        super();
    }
    async Cacheopen() {
        if (this.cache) return this.cache;

        try {
            this.cache = await caches.open(this.cacheName);

            if (this.CacheonReady) {
                this.CacheonReady(this.cache);
            }

            return this.cache;

        } catch (err) {
            console.error("TfCacheAPI open failed:", err);
            throw err;
        }
    }

    async putCache(request, response) {
        if (!this.cache) await this.Cacheopen();

        const req = request instanceof Request ? request : new Request(request);

        const res = response instanceof Response
            ? response
            : new Response(response);

        await this.cache.put(req, res.clone());

        return true;
    }

    async matchCache(request) {
        if (!this.cache) await this.Cacheopen();

        const req = request instanceof Request ? request : new Request(request);

        const res = await this.cache.match(req);

        return res || null;
    }

    async deleteCache(request) {
        if (!this.cache) await this.open();

        const req = request instanceof Request ? request : new Request(request);

        return await this.cache.delete(req);
    }

    async addCache(url) {
        if (!this.cache) await this.open();

        return await this.cache.add(url);
    }

    async addAllCache(urls = []) {
        if (!this.cache) await this.open();

        return await this.cache.addAll(urls);
    }

    async Cachekeys() {
        if (!this.cache) await this.open();

        return await this.cache.keys();
    }

async fetchWithCache(request, strategy = "cache-first") {
    const req = new Request(request);

    switch (strategy) {

        case "cache-first": {
            const cached = await this.matchCache(req);
            if (cached) return cached;

            const res = await fetch(req);
            await this.putCache(req, res.clone());
            return res;
        }

        case "network-first": {
            try {
                const res = await fetch(req);
                await this.putCache(req, res.clone());
                return res;
            } catch {
                return await this.matchCache(req);
            }
        }

        case "stale-while-revalidate": {
            const cached = await this.matchCache(req);

            const networkPromise = fetch(req).then(res => {
                this.putCache(req, res.clone());
                return res;
            });

            return cached || networkPromise;
        }
    }
}

    async clearCache() {
        if (!this.cache) return false;

        const keys = await this.cache.keys();

        await Promise.all(
            keys.map(req => this.cache.delete(req))
        );

        return true;
    }

    async destroyCache() {
        await caches.delete(this.cacheName);
        this.cache = null;
    }

}