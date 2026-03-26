export class Ne extends N {
    namespace = "tf";
    cookieenabled = navigator.cookieEnabled;
    cookies = this.cookieenabled ? this.parsecookie() : {};
    SessionStorage = window.sessionStorage;
    LocalStorage = window.localStorage;
    dbName = dbName;
    dbversion = 1;
    dbstores = [];
    db = null;

    constructor(options = {}) {
        super(options);
        /*
        if (CacheautoOpen) {
            this.Cacheopen();
        }
        */
    }

    async opendb() {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {

            const request = indexedDB.open(this.dbName, this.dbversion);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;

                this.dbstores.forEach(store => {

                    if (!db.objectStoreNames.contains(store.name)) {

                        const objStore = db.createObjectStore(
                            store.name,
                            {
                                keyPath: store.keyPath || "id",
                                autoIncrement: store.autoIncrement ?? true
                            }
                        );

                        if (store.indexes) {
                            store.indexes.forEach(idx => {
                                objStore.createIndex(
                                    idx.name,
                                    idx.keyPath,
                                    { unique: idx.unique || false }
                                );
                            });
                        }
                    }

                });
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };

            request.onerror = (e) => reject(e);
        });
    }

    storedb(name, mode = "readonly") {
        if (!this.db) throw new Error("Database not opened");

        return this.db
            .transaction(name, mode)
            .objectStore(name);
    }

    async putdb(storeName, data) {
        await this.opendb();

        return new Promise((resolve, reject) => {

            const req = this
                .store(storeName, "readwrite")
                .put(data);

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);

        });
    }

    async getdb(storeName, key) {
        await this.opendb();

        return new Promise((resolve, reject) => {

            const req = this
                .storedb(storeName)
                .get(key);

            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error);

        });
    }

    async getAlldb(storeName) {
        await this.opendb();

        return new Promise((resolve, reject) => {

            const req = this
                .storedb(storeName)
                .getAll();

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);

        });
    }

    async deletedb(storeName, key) {
        await this.opendb();

        return new Promise((resolve, reject) => {

            const req = this
                .storedb(storeName, "readwrite")
                .delete(key);

            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);

        });
    }

    async cleardb(storeName) {
        await this.opendb();

        return new Promise((resolve, reject) => {

            const req = this
                .storedb(storeName, "readwrite")
                .clear();

            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);

        });
    }

    async dbkeys(storeName) {
        await this.opendb();

        return new Promise((resolve, reject) => {

            const req = this
                .dbstore(storeName)
                .getAllKeys();

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);

        });
    }

    closedb() {
        if (!this.db) return;

        this.db.close();
        this.db = null;
    }

    destroydb() {
        this.closedb();
        return indexedDB.deleteDatabase(this.dbName);
    }



    LocalStoragekey(name) {
        return `${this.namespace}:${name}`;
    }

    setLocalStorage(name, value) {
        try {

            const data = JSON.stringify(value);

            this.LocalStorage.setItem(
                this.LocalStoragekey(name),
                data
            );

            return true;

        } catch (err) {

            console.error("TfLocalStorage set failed:", err);
            return false;

        }
    }

    getLocalStorage(name) {

        const value = this.LocalStorage.getItem(
            this.LocalStoragekey(name)
        );

        if (value === null) return null;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }

    }

    removeLocalStorage(name) {

        this.LocalStorage.removeItem(
            this.LocalStoragekey(name)
        );

    }

    LocalStoragehas(name) {

        return this.LocalStorage.getItem(
            this.LocalStoragekey(name)
        ) !== null;

    }

    LocalStoragekeys() {

        const list = [];

        for (let i = 0; i < this.LocalStorage.length; i++) {

            const k = this.LocalStorage.key(i);

            if (k.startsWith(this.namespace + ":")) {
                list.push(k.replace(this.namespace + ":", ""));
            }

        }

        return list;
    }

    clearLocalStorage() {

        const keys = this.LocalStoragekeys();

        keys.forEach(k => {
            this.removeLocalStorage(k);
        });

    }

    LocalStoragesize() {

        let bytes = 0;

        for (let i = 0; i < this.LocalStorage.length; i++) {

            const key = this.LocalStorage.key(i);

            if (key.startsWith(this.namespace + ":")) {

                const value = this.LocalStorage.getItem(key);

                bytes += key.length + value.length;

            }

        }

        return bytes;
    }

    Sessionkey(name) {
        return `${this.namespace}:${name}`;
    }

    setSession(name, value) {

        try {

            const data = JSON.stringify(value);

            this.SessionStorage.setItem(
                this.Sessionkey(name),
                data
            );

            return true;

        } catch (err) {

            console.error("TfSessionStorage set failed:", err);
            return false;

        }

    }

    getSession(name) {

        const value = this.SessionStorage.getItem(
            this.Sessionkey(name)
        );

        if (value === null) return null;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }

    }

    removeSession(name) {

        this.SessionStorage.removeItem(
            this.Sessionkey(name)
        );

    }

    Sessionhas(name) {

        return this.SessionStorage.getItem(
            this.Sessionkey(name)
        ) !== null;

    }

    Sessionkeys() {

        const list = [];

        for (let i = 0; i < this.SessionStorage.length; i++) {

            const key = this.SessionStorage.Sessionkey(i);

            if (key.startsWith(this.namespace + ":")) {

                list.push(
                    key.replace(this.namespace + ":", "")
                );

            }

        }

        return list;

    }

    clearSession() {

        const keys = this.Sessionkeys();

        keys.forEach(k => {
            this.removeSession(k);
        });

    }

    Sessionsize() {

        let bytes = 0;

        for (let i = 0; i < this.SessionStorage.length; i++) {

            const key = this.SessionStorage.key(i);

            if (key.startsWith(this.namespace + ":")) {

                const value = this.SessionStorage.getItem(key);

                bytes += key.length + value.length;

            }

        }

        return bytes;

    }
    cookiekey(name) {
        return `${this.namespace}:${name}`;
    }

    parsecookie() {

        const jar = {};

        if (!document.cookie) return jar;

        document.cookie.split(";").forEach(cookie => {

            const parts = cookie.split("=");

            const key = parts.shift().trim();
            const value = parts.join("=");

            jar[key] = decodeURIComponent(value);

        });

        return jar;

    }

    setcookie(name, value, {
        days = 7,
        path = "/",
        secure = false,
        sameSite = "Lax"
    } = {}) {

        if (!this.cookieenabled) return false;

        const key = this.key(name);

        const expires = new Date(
            Date.now() + days * 86400000
        ).toUTCString();

        const data = encodeURIComponent(
            JSON.stringify(value)
        );

        let cookie = `${key}=${data}; expires=${expires}; path=${path}; SameSite=${sameSite}`;

        if (secure) cookie += "; Secure";

        document.cookie = cookie;

        this.cookies[key] = data;

        return true;

    }

    getcookie(name) {

        if (!this.cookieenabled) return null;

        const key = this.cookiekey(name);

        const value = this.parse()[key];

        if (!value) return null;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }

    }

    cookiehas(name) {

        const key = this.cookiekey(name);

        return key in this.parsecookie();

    }

    removecookie(name, path = "/") {

        const key = this.cookiekey(name);

        document.cookie =
            `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;

        delete this.cookies[key];

    }

    cookiekeys() {

        const parsed = this.parsecookie();

        return Object.keys(parsed)
            .filter(k => k.startsWith(this.namespace + ":"))
            .map(k => k.replace(this.namespace + ":", ""));

    }

    clearcookie() {

        this.cookiekeys().forEach(k => {
            this.remove(k);
        });

    }
}