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
startSharedWorker () {
if (this.sharedWorker) return;

    this.sharedWorker = new SharedWorker("/SharedWorker.js");

this.sharedWorker.port.start();

this.sharedWorker.port.onmessage = (event) => {
    const msg = event.data;

    switch (msg.type) {
        case "ws_message":
            console.log("From WS:", msg.data);
            break;
    };
// connect once (first tab effectively controls it)
this.SharedWorker.port.postMessage({ type: "connect" });

// send data
this.SharedWorker.port.postMessage({
    type: "send",
    data: { action: "hello" }
});
}
sendToSharedWorker(type, data = null) {
    if (!this.sharedWorker) return;

    this.sharedWorker.port.postMessage({
        type,
        data
    });
}b
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
    SendBeacon(url, data) {
        if (!("sendBeacon" in navigator)) {
            // skip straight to fetch
        } else {
            let payload = data;

            // Normalize payload
            if (
                !(data instanceof Blob) &&
                !(data instanceof FormData) &&
                !(data instanceof URLSearchParams) &&
                typeof data !== "string"
            ) {
                payload = JSON.stringify(data);
            }

            // Size check
            const size = this.#getSize(payload);
            if (size > this.maxBeaconSize) {
                this.emit("error", { url, data, reason: "Payload too large" });
                return false;
            }

            const accepted = navigator.sendBeacon(url, payload);

            this.emit(accepted ? "queued" : "rejected", {
                url,
                data,
                size
            });

            return accepted;
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

        this.worker.onmessage = (event) => this.emit("message", event.data);
        this.worker.onerror = (err) => this.emit("error", err);
        console.log("Web Worker started");
    }

    postWebworkerMessage(type, data) {
        if (!this.worker) return;
        this.worker.postMessage(type, data);
    }
    receiveWebworkerMessage() {

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