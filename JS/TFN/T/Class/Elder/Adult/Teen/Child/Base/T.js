import { TsDom } from "./test.js";

export class TsDomCanvas extends TsDom { //dom n window
    lang = "en-US";
    worker = null;
    sharedWorker = null;
    SessionStorage = window.sessionStorage;
    LocalStorage = window.localStorage;
    maxBeaconSize = 64 * 1024;
    constructor(options = {}) {
        super(options);
        if (options.lang) this.lang = options.lang;
    }

    find(elem, frame = null) {
        if (frame !== null) {
            return frame.contentDocument.getElementById(elem);
        } else {
            return document.getElementById(elem);
        }
    }
    log(msg) {
        let logBox = this.find("TfLogBox");
        if (!logBox) return;

        logBox.innerText += msg + "\n";
        logBox.scrollTop = logBox.scrollHeight;
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
    startWebworkers() {
        if (this.worker) return;

        this.worker = new Worker("./WebWorker.js");

        this.receiveWebworkerMessage(); // 🔥 central handler

        console.log("Web Worker started");
    }
    receiveWebworkerMessage() {
        if (!this.worker) return;

        this.worker.onmessage = (event) => {
            const msg = event.data;

            if (!msg || typeof msg !== "object") {
                this.emit("worker_raw", msg);
                return;
            }

            // 🔥 Handle errors first
            if (event.data.error) {
                this.emit("worker_error", event.data.error);
                return;
            }

            // 🔥 Route by type
            switch (event.data.type) {
                case "log":
                    console.log("Worker:", event.data.message);
                    break;

                case "result":
                    this.emit("worker_result", { id: event.data.id, payload: event.data.payload });
                    break;

                case "ws_message":
                    // Forward from SharedWorker (if worker passes it)
                    this.emit("ws_message", event.data);
                    break;

                default:
                    this.emit(event.data.type, event.data);
            }
        };

        this.worker.onerror = (err) => {
            this.emit("worker_error", err);
        };
    }
    terminateWebworker() {
        if (!this.worker) return;
        this.worker.terminate();
        this.worker = null;
        console.log("Web Worker terminated");
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
    on(id, eventName, preventDefault = false, iframe = null) {
        let el = this.find(id, iframe);
        if (!el) return;

        const isForm = el instanceof HTMLFormElement;
        const isSubmitButton =
            (el instanceof HTMLButtonElement && el.type === "submit") ||
            (el instanceof HTMLInputElement &&
                ["submit", "image"].includes(el.type));

        const supportsPointer = "PointerEvent" in window;
        const supportsTouch = "ontouchstart" in window;

        const runHandler = (event) => {
            if (isForm || isSubmitButton || preventDefault) {
                event.preventDefault();
                event.stopPropagation();
            }

            this.emit(eventName, {
                event,
                element: el,
                type: event.type
            });
        };

        // ===== POINTER (Primary) =====          
        if (supportsPointer) {
            const eventType = isForm ? "submit" : "pointerup";

            el.addEventListener(eventType, runHandler);

            this._storeDomListener(id, el, runHandler, eventType);
            return;
        }

        // ===== TOUCH (Fallback) =====          
        if (supportsTouch) {
            const start = (e) => {
                this._touchStart = e;
            };

            const end = (e) => {
                runHandler(e);
            };

            el.addEventListener("touchstart", start, { passive: false });
            el.addEventListener("touchend", end, { passive: false });

            this._storeDomListener(id, el, start, "touchstart");
            this._storeDomListener(id, el, end, "touchend");
            return;
        }

        // ===== CLICK (Fallback) =====          
        const clickType = isForm ? "submit" : "click";

        el.addEventListener(clickType, runHandler);

        this._storeDomListener(id, el, runHandler, clickType);
    }
    off(id) {
        const entries = this.domListeners.get(id);
        if (!entries) return;

        entries.forEach(({ el, handler, eventType }) => {
            el.removeEventListener(eventType, handler);
        });

        this.domListeners.delete(id);
    }
    onClipboard(id, eventName, type = "copy", preventDefault = false, iframe = null) {
        let el = this.find(id, iframe);
        if (!el) return;

        const validEvents = ["copy", "cut", "paste"];
        if (!validEvents.includes(type)) {
            console.warn(`Invalid clipboard event: ${type}`);
            return;
        }

        const handler = (event) => {
            if (preventDefault) {
                event.preventDefault();
            }

            this.emit(eventName, {
                event,
                element: el,
                type,
                clipboardData: event.clipboardData
            });
        };

        el.addEventListener(type, handler);

        this._storeDomListener(id, el, handler, type);
    }
}          