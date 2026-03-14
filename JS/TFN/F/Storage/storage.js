export class TFStorageHub {
    constructor({
        cookies = null,
        session = null,
        local = null,
        indexedDB = null,
        cacheAPI = null
    } = {}) {
        this.cookies = cookies;       // your NamiCookies class instance
        this.session = session;       // your SessionStorage class instance
        this.local = local;           // your LocalStorage class instance
        this.indexedDB = indexedDB;   // your IndexDB class instance
        this.cacheAPI = cacheAPI;     // your CacheAPI class instance
    }

    async set(key, value, layer = "local", options = {}) {
        switch(layer) {
            case "cookie": 
                if(!this.cookies) throw new Error("Cookie storage not initialized");
                return this.cookies.set(key, value, options.days);
            case "session": 
                if(!this.session) throw new Error("SessionStorage not initialized");
                return this.session.set(key, value);
            case "local": 
                if(!this.local) throw new Error("LocalStorage not initialized");
                return this.local.set(key, value);
            case "indexedDB": 
                if(!this.indexedDB) throw new Error("IndexedDB not initialized");
                return this.indexedDB.set(key, value);
            case "cache": 
                if(!this.cacheAPI) throw new Error("Cache API not initialized");
                return this.cacheAPI.set(key, value);
            default: 
                throw new Error("Unknown storage layer: " + layer);
        }
    }

    async get(key, layer = "local") {
        switch(layer) {
            case "cookie": 
                if(!this.cookies) throw new Error("Cookie storage not initialized");
                return this.cookies.get(key);
            case "session": 
                if(!this.session) throw new Error("SessionStorage not initialized");
                return this.session.get(key);
            case "local": 
                if(!this.local) throw new Error("LocalStorage not initialized");
                return this.local.get(key);
            case "indexedDB": 
                if(!this.indexedDB) throw new Error("IndexedDB not initialized");
                return this.indexedDB.get(key);
            case "cache": 
                if(!this.cacheAPI) throw new Error("Cache API not initialized");
                return this.cacheAPI.get(key);
            default: 
                throw new Error("Unknown storage layer: " + layer);
        }
    }

    async remove(key, layer = "local") {
        switch(layer) {
            case "cookie": 
                if(!this.cookies) throw new Error("Cookie storage not initialized");
                return this.cookies.remove(key);
            case "session": 
                if(!this.session) throw new Error("SessionStorage not initialized");
                return this.session.remove(key);
            case "local": 
                if(!this.local) throw new Error("LocalStorage not initialized");
                return this.local.remove(key);
            case "indexedDB": 
                if(!this.indexedDB) throw new Error("IndexedDB not initialized");
                return this.indexedDB.remove(key);
            case "cache": 
                if(!this.cacheAPI) throw new Error("Cache API not initialized");
                return this.cacheAPI.remove(key);
            default: 
                throw new Error("Unknown storage layer: " + layer);
        }
    }

    async exists(key, layer = "local") {
        switch(layer) {
            case "cookie": 
                if(!this.cookies) throw new Error("Cookie storage not initialized");
                return this.cookies.exists(key);
            case "session": 
                if(!this.session) throw new Error("SessionStorage not initialized");
                return this.session.exists(key);
            case "local": 
                if(!this.local) throw new Error("LocalStorage not initialized");
                return this.local.exists(key);
            case "indexedDB": 
                if(!this.indexedDB) throw new Error("IndexedDB not initialized");
                return this.indexedDB.exists(key);
            case "cache": 
                if(!this.cacheAPI) throw new Error("Cache API not initialized");
                return this.cacheAPI.exists(key);
            default: 
                throw new Error("Unknown storage layer: " + layer);
        }
    }
}