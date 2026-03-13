export class TfIndexedDB {
    constructor({
        dbName = "tf-db",
        version = 1,
        stores = []
    } = {}) {

        this.dbName = dbName;
        this.version = version;
        this.stores = stores;
        this.db = null;
    }

    async open() {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {

            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;

                this.stores.forEach(store => {

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

    store(name, mode = "readonly") {
        if (!this.db) throw new Error("Database not opened");

        return this.db
            .transaction(name, mode)
            .objectStore(name);
    }

    async put(storeName, data) {
        await this.open();

        return new Promise((resolve, reject) => {

            const req = this
                .store(storeName, "readwrite")
                .put(data);

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);

        });
    }

    async get(storeName, key) {
        await this.open();

        return new Promise((resolve, reject) => {

            const req = this
                .store(storeName)
                .get(key);

            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error);

        });
    }

    async getAll(storeName) {
        await this.open();

        return new Promise((resolve, reject) => {

            const req = this
                .store(storeName)
                .getAll();

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);

        });
    }

    async delete(storeName, key) {
        await this.open();

        return new Promise((resolve, reject) => {

            const req = this
                .store(storeName, "readwrite")
                .delete(key);

            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);

        });
    }

    async clear(storeName) {
        await this.open();

        return new Promise((resolve, reject) => {

            const req = this
                .store(storeName, "readwrite")
                .clear();

            req.onsuccess = () => resolve(true);
            req.onerror = () => reject(req.error);

        });
    }

    async keys(storeName) {
        await this.open();

        return new Promise((resolve, reject) => {

            const req = this
                .store(storeName)
                .getAllKeys();

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);

        });
    }

    close() {
        if (!this.db) return;

        this.db.close();
        this.db = null;
    }

    destroy() {
        this.close();
        return indexedDB.deleteDatabase(this.dbName);
    }

    toJson() {
        return {
            name: this.dbName,
            version: this.version,
            active: !!this.db,
            stores: this.stores.map(s => s.name)
        };
    }
}