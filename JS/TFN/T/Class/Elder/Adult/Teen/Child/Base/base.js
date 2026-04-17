export class base {
    Arraybuffer = null;
    ArraybyteLength = 0;
    Arrayview = null;
    ArrayonReady = null;
    blob = null;
    blobtype = "application/octet-stream"; // default MIME type
    blobonReady = null;
    blobobjectURL = null;
    ArrayonReady = onReady;
    dbName = dbName;
    dbversion = 1;
    dbstores = [];
    db = null;
constructor(options = {}) {

}

    async tycadome(id, type, action, meta, state, mode, payload) {
        return {
            "id": id, //options.id
            "type": type, //command
            "action": action, // video.start
            "meta": meta,
            "timestamp": Math.floor(Date.now() / 1000),
            "state": state,
            "mode": mode, //"async"
            "payload": payload // {}
        };;
    }
    // Load an existing ArrayBuffer or TypedArray
    async load(input) {
        try {
            if (input instanceof ArrayBuffer) {
                this.Arraybuffer = input;
            } else if (ArrayBuffer.isView(input)) { // TypedArray or DataView
                this.Arraybuffer = input.buffer;
            } else {
                throw new Error("Input must be an ArrayBuffer or TypedArray");
            }

            this.ArraybyteLength = this.Arraybuffer.byteLength;
            this.Arrayview = new DataView(this.Arraybuffer);

            if (this.ArrayonReady) this.ArrayonReady(this.Arraybuffer);
            return this.Arraybuffer;
        } catch (err) {
            console.error("TfArrayBuffer load failed:", err);
            throw err;
        }
    }

    // Get a slice of the buffer
    slice(start = 0, end = this.ArraybyteLength) {
        if (!this.Arraybuffer) throw new Error("Buffer not loaded");
        return this.Arraybuffer.slice(start, end);
    }

    // Convert to a Blob
    toBlob(type = "application/octet-stream") {
        if (!this.Arraybuffer) throw new Error("Buffer not loaded");
        return new Blob([this.Arraybuffer], { type });
    }

    // Replace buffer with a new one
    replace(newBuffer) {
        if (!newBuffer) return;

        if (!(newBuffer instanceof ArrayBuffer)) {
            throw new Error("Replacement must be an ArrayBuffer");
        }

        this.Arraybuffer = newBuffer;
        this.ArraybyteLength = newBuffer.byteLength;
                  this.Arrayview = new DataView(this.Arraybuffer);
    }

    // Convert info to JSON
    toJson() {
        return {
            bufferExists: !!this.Arraybuffer,
            byteLength: this.ArraybyteLength
        };
    }

    // Clear buffer from memory
    clear() {
        this.Arraybuffer = null;
        this.ArraybyteLength = 0;
        this.Arrayview = null;
    }
    // Load blob from an existing Blob or ArrayBuffer
    async loadblob(blobOrBuffer) {
        try {
            if (blobOrBuffer instanceof Blob) {
                this.blob = blobOrBuffer;
            } else if (blobOrBuffer instanceof ArrayBuffer) {
                this.blob = new Blob([blobOrBuffer], { type: this.blobtype });
            } else {
                throw new Error("Input must be a Blob or ArrayBuffer");
            }

            this.blobobjectURL = URL.createObjectURL(this.blob);

            if (this.blobonReady) this.blobonReady(this.blob);
            return this.blob;
        } catch (err) {
            console.error("TfBlob load failed:", err);
            throw err;
        }
    }

    // Attach blob to an element (audio, video, img)
    attachblob(element) {
        if (!this.blob) throw new Error("Blob not loaded");

        if (element.tagName === "AUDIO" || element.tagName === "VIDEO" || element.tagName === "IMG") {
            if (element.src !== this.blobobjectURL) {
                element.src = this.blobobjectURL;
            }
            if (element.tagName !== "IMG" && element.paused) {
                element.play().catch(() => { });
            }
        } else {
            console.warn("Element is not audio, video, or img. Cannot attach blob.");
        }
    }

    // Replace existing blob with a new one
    replaceblob(newBlob, newType = null) {
        if (!newBlob) return;

        // Revoke previous object URL
        if (this.blobobjectURL) URL.revokeObjectURL(this.blobobjectURL);

        this.blob = newBlob;
        if (newType) this.blobtype = newType;

        this.blobobjectURL = URL.createObjectURL(this.blob);
    }

    // Convert blob info to JSON
    blobtoJson() {
        return {
            blobExists: !!this.blob,
            type: this.blobtype,
            size: this.blob ? this.blob.size : 0,
            objectURL: this.blobobjectURL
        };
    }

    // Release memory
    revokeblob() {
        if (this.blobobjectURL) {
            URL.revokeObjectURL(this.blobobjectURL);
            this.blobobjectURL = null;
        }
        this.blob = null;
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
}