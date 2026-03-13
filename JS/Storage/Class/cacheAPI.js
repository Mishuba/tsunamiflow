export class TfCacheAPI {
    constructor({
        cacheName = "tsunami-cache",
        autoOpen = true,
        onReady = null
    } = {}) {

        this.cacheName = cacheName;
        this.cache = null;
        this.onReady = onReady;

        if (autoOpen) {
            this.open();
        }
    }

    async open() {
        if (this.cache) return this.cache;

        try {
            this.cache = await caches.open(this.cacheName);

            if (this.onReady) {
                this.onReady(this.cache);
            }

            return this.cache;

        } catch (err) {
            console.error("TfCacheAPI open failed:", err);
            throw err;
        }
    }

    async put(request, response) {
        if (!this.cache) await this.open();

        const req = request instanceof Request ? request : new Request(request);

        const res = response instanceof Response
            ? response
            : new Response(response);

        await this.cache.put(req, res.clone());

        return true;
    }

    async match(request) {
        if (!this.cache) await this.open();

        const req = request instanceof Request ? request : new Request(request);

        const res = await this.cache.match(req);

        return res || null;
    }

    async delete(request) {
        if (!this.cache) await this.open();

        const req = request instanceof Request ? request : new Request(request);

        return await this.cache.delete(req);
    }

    async add(url) {
        if (!this.cache) await this.open();

        return await this.cache.add(url);
    }

    async addAll(urls = []) {
        if (!this.cache) await this.open();

        return await this.cache.addAll(urls);
    }

    async keys() {
        if (!this.cache) await this.open();

        return await this.cache.keys();
    }

    async clear() {
        if (!this.cache) return false;

        const keys = await this.cache.keys();

        await Promise.all(
            keys.map(req => this.cache.delete(req))
        );

        return true;
    }

    async destroy() {
        await caches.delete(this.cacheName);
        this.cache = null;
    }

    toJson() {
        return {
            cacheName: this.cacheName,
            active: !!this.cache
        };
    }
}