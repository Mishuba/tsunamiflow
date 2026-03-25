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

        let eventType = isForm ? "submit" : (window.PointerEvent ? "pointerup" : "click")
        const runHandler = (event) => {
            if (isForm || isSubmitButton || preventDefault) {
                event.preventDefault();
                event.stopPropagation();
            }
            this.emit(eventName, {
                event,
                element: el
            });
        };

        // Desktop click / form submit
        if (window.PointerEvent) {
            el.addEventListener(isForm ? "submit" : "pointerup", runHandler);
        } else {
            el.addEventListener(isForm ? "submit" : "click", runHandler);
        }
        if (!this.domListeners.has(id)) {
            this.domListeners.set(id, []);
        } else {
            console.warn(`Listener with id "${id}" already exists. `);
        }
        this.domListeners.get(id).push({ el, runHandler, eventType });
    }
    off(id) {
        const entries = this.domListeners.get(id);
        if (!entries) return;

        entries.forEach(({ el, runHandler, eventType }) => {
            el.removeEventListener(eventType, runHandler);
        });

        this.domListeners.delete(id);
    }
}