export class T {
    listeners = {};
    lang = "en-US";
    domListeners = new Map();
    worker = null;
    sharedWorker = null;
    maxBeaconSize = 64 * 1024;
    constructor(options = {}) {
        if (options.lang) this.lang = options.lang;
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
    AddEventListener(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }
    removeEventListener(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(fn => fn !== callback);
    }
async tycadome(id, type, action, source, target, timestamp, status, priority, mode, payload) {
   let tycadome = {
    "id": id, //options.id
    "type": type, //command
    "action": action, // video.start
    "source": source, // web
    "target": target, //"device:web-001"
    "timestamp": timestamp, //1710000000
    "status": status, //"pending"
    "priority": priority, //high
    "mode": mode, //"async"
    "payload": payload // {}
 };
   return JSON.stringify(tyacdome);
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
    startSharedWorker() {
        if (this.sharedWorker) return;

        this.sharedWorker = new SharedWorker("/SharedWorker.js");

        this.sharedWorker.port.start();

        this.receiveSharedWorkerMessage(); // 🔥 central handler

        // connect once (first tab effectively controls it)
        this.sharedWorker.port.postMessage({ type: "connect" });

        // send data
        this.sharedWorker.port.postMessage({
            type: "send",
            data: { action: "hello" }
        });
    }
    receiveSharedWorkerMessage() {
        this.sharedWorker.port.onmessage = (event) => {
            const msg = event.data;

            switch (msg.type) {
                case "ws_message":
                    console.log("From WS:", msg.data);
                    break;
            };
        }
    }
    sendToSharedWorker(type, data = null) {
        if (!this.sharedWorker) return;

        this.sharedWorker.port.postMessage({
            type,
            data
        });
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

            const { type, data, id, error } = msg;

            // 🔥 Handle errors first
            if (error) {
                this.emit("worker_error", { id, error });
                return;
            }

            // 🔥 Route by type
            switch (type) {
                case "log":
                    console.log("Worker:", data);
                    break;

                case "result":
                    this.emit("worker_result", { id, data });
                    break;

                case "ws_message":
                    // Forward from SharedWorker (if worker passes it)
                    this.emit("ws_message", data);
                    break;

                default:
                    this.emit(type, data);
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