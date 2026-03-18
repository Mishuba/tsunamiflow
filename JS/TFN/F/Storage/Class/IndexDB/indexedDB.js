/*Local database internal
1.) supports indexes
2.) supports transactions
3.) stores objects
4.) stores blobs / array buffers
5.) sound clips 
6.) short videos
7.) gifs 
8.) waveform data
9.) Midi recordings
10.) game saves
11.) track metadata
12.) audio recordings 
13.) wvetform cache 
14.) midi 
15.) video segments
16.) ai analysis data 
17.)
18.)
19.)
20.)
21.)
22.)
23.)
24.)
25.)
26.)
27.)
28.)
29.)
30.)
*/
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