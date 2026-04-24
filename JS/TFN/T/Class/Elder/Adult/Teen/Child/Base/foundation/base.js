export class T {
    listeners = {};
    domListeners = new Map();
    sharedListeners = new Map();
    workerListeners = new Map();
    Arraybuffer = null;
    ArraybyteLength = 0;
    Arrayview = null;
    ArrayonReady = null;
    blob = null;
    blobtype = "application/octet-stream";
    blobobjectURL = null;
    blobonReady = null;
    dbName = "default";
    dbversion = 1;
    dbstores = [];
    db = null;
    maxBeaconSize = 64 * 1024;
    constructor(options = {}) {

    }
    tycadome(id, type, action, meta, state, mode, payload) {
        let tf = {
            "id": id, //options.id
            "type": type, //command
            "action": action, // video.start
            "meta": meta, // {}
            "timestamp": Math.floor(Date.now() / 1000),
            "state": state,
            "mode": mode, //"async"
            "payload": payload // {}
        };
        return tf;
    }
    AddEventListener(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }
    on(event, fn) {
        this.AddEventListener(event, fn);
    }
    removeEventListener(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(fn => fn !== callback);
    }
    _storeDomListener(id, el, handler, eventType) {
        if (!this.domListeners.has(id)) {
            this.domListeners.set(id, []);
        }

        this.domListeners.get(id).push({
            el,
            handler,
            eventType
        });
    }
    emit(event, data) {
        (this.listeners[event] || []).forEach((fn) => {
            try {
                fn(data);
            } catch (error) {
                console.error(`Error occurred while emitting event "${event}":`, error);
            }
        });
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
    async SendBeacon(url, data) {
        let payload = data;

        if (
            !(data instanceof Blob) &&
            !(data instanceof FormData) &&
            !(data instanceof URLSearchParams) &&
            typeof data !== "string"
        ) {
            payload = JSON.stringify(data);
        }

        const size = this.#getSize(payload);

        if (size > this.maxBeaconSize) {
            this.emit("error", { url, data, reason: "Payload too large" });
            return false;
        }

        if ("sendBeacon" in navigator) {
            const accepted = navigator.sendBeacon(url, payload);

            this.emit(accepted ? "queued" : "rejected", { url, data, size });

            return accepted;
        }

        // 🔥 REAL fallback
        try {
            await fetch(url, {
                method: "POST",
                body: payload,
                keepalive: true,
                headers: { "Content-Type": "application/json" }
            });

            this.emit("queued", { url, data, size, fallback: true });
            return true;
        } catch (err) {
            this.emit("error", err);
            return false;
        }
    }
    #getSize(payload) {
        if (typeof payload === "string") {
            return new TextEncoder().encode(payload).length;
        }
        if (payload instanceof Blob) {
            return payload.size;
        }
        return 0; // fallback (FormData/URLSearchParams not easily measurable)
    }
    async requestWorld(method, url, data = null, headers = {}, transport = "fetch") {
        switch (transport.toLowerCase()) {

            /* =========================================
               FETCH (Recommended Default)
            ========================================= */
            case "fetch":
                try {
                    const options = {
                        method,
                        headers: { ...headers }
                    };

                    // Only attach body if needed
                    if (
                        data !== null &&
                        method.toUpperCase() !== "GET" &&
                        method.toUpperCase() !== "HEAD"
                    ) {
                        if (
                            typeof data === "object" &&
                            !(data instanceof FormData) &&
                            !(data instanceof Blob) &&
                            !(data instanceof URLSearchParams)
                        ) {
                            options.body = JSON.stringify(data);

                            if (!options.headers["Content-Type"]) {
                                options.headers["Content-Type"] = "application/json";
                            }
                        } else {
                            options.body = data;
                        }
                    }

                    const response = await fetch(url, options);

                    if (!response.ok) {
                        this.emit("error", {
                            type: "fetch",
                            status: response.status,
                            statusText: response.statusText,
                            url
                        });

                        throw new Error(response.statusText);
                    }

                    const contentType = response.headers.get("content-type") || "";

                    let result;

                    if (contentType.includes("application/json")) {
                        result = await response.json();
                    } else if (
                        contentType.includes("audio") ||
                        contentType.includes("video") ||
                        contentType.includes("application/octet-stream")
                    ) {
                        result = await response.arrayBuffer();
                    } else {
                        result = await response.text();
                    }

                    this.emit("success", {
                        type: "fetch",
                        url,
                        data: result
                    });

                    return result;

                } catch (error) {
                    this.emit("error", {
                        type: "fetch",
                        url,
                        error: error.message
                    });

                    console.error("Fetch Error:", error);
                    return null;
                }

            /* =========================================
               XMLHTTPREQUEST
            ========================================= */
            case "xml":
            case "xhr":
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();

                    xhr.open(method, url, true);

                    for (const [key, value] of Object.entries(headers)) {
                        xhr.setRequestHeader(key, value);
                    }

                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4) {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                this.emit("success", {
                                    type: "xhr",
                                    url,
                                    data: xhr.responseText
                                });

                                resolve(xhr.responseText);
                            } else {
                                this.emit("error", {
                                    type: "xhr",
                                    status: xhr.status,
                                    statusText: xhr.statusText,
                                    url
                                });

                                reject(xhr.statusText);
                            }
                        }
                    };

                    xhr.onerror = () => {
                        this.emit("error", {
                            type: "xhr",
                            url,
                            error: "Network Error"
                        });

                        console.error("XHR Network Error");
                        reject("Network Error");
                    };

                    if (
                        data &&
                        typeof data === "object" &&
                        !(data instanceof FormData)
                    ) {
                        xhr.send(JSON.stringify(data));
                    } else {
                        xhr.send(data);
                    }
                });

            /* =========================================
               SEND BEACON
            ========================================= */
            case "beacon":
                return await this.SendBeacon(url, data);

            /* =========================================
               DEFAULT
            ========================================= */
            case "arraybuffer":
            case "binary":
            case "audio":
                try {
                    const response = await fetch(url, {
                        method,
                        headers
                    });

                    if (!response.ok) {
                        this.emit("error", {
                            type: "binary",
                            status: response.status,
                            url
                        });
                        return null;
                    }

                    const buffer = await response.arrayBuffer();

                    this.emit("success", {
                        type: "binary",
                        url,
                        data: buffer
                    });

                    return buffer;

                } catch (err) {
                    this.emit("error", {
                        type: "binary",
                        url,
                        error: err.message
                    });

                    return null;
                }
            default:
                this.emit("error", {
                    type: "transport",
                    error: `Unknown transport: ${transport}`
                });

                console.error(`Unknown transport type: ${transport}`);
                return null;
        }
    }
}