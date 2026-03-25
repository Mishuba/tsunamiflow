export class T {
    listeners = {};
    lang = "en-US";
    domListeners = new Map();
    worker = null;
    workerscriptURL = scriptURL;
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
    addEventListener(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }
    removeEventListener(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(fn => fn !== callback);
    }
    startworkers() {
        if (!this.workerscriptURL) return;
        this.worker = new Worker(this.workerscriptURL);

        this.worker.onmessage = (event) => this.emit("message", event.data);
        this.worker.onerror = (err) => this.emit("error", err);
        console.log("Web Worker started");
    }

    postworkerMessage(data) {
        if (!this.worker) return;
        this.worker.postMessage(data);
    }
    receiveworkerMessage() {

    }
    terminateworker() {
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

    // Detect best interaction type
    const supportsPointer = "PointerEvent" in window;
    const supportsTouch = "ontouchstart" in window;

    const handler = (event) => {
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

        el.addEventListener(eventType, handler);

        this._storeDomListener(id, el, handler, eventType);
        return;
    }

    // ===== TOUCH (Fallback) =====
    if (supportsTouch) {
        const start = (e) => {
            this._touchStart = e;
        };

        const end = (e) => {
            handler(e);
        };

        el.addEventListener("touchstart", start, { passive: false });
        el.addEventListener("touchend", end, { passive: false });

        this._storeDomListener(id, el, start, "touchstart");
        this._storeDomListener(id, el, end, "touchend");
        return;
    }

    // ===== CLICK (Legacy fallback) =====
    const clickType = isForm ? "submit" : "click";
    el.addEventListener(clickType, handler);

    this._storeDomListener(id, el, handler, clickType);
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
            clipboardData: event.clipboardData
        });
    };

    el.addEventListener(type, handler);

    this._storeDomListener(id, el, handler, type);
}
}