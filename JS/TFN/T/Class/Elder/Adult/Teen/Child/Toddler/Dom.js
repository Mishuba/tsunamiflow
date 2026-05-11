export class Dom {
    listeners = {};
    domListeners = new Map();
    uaData = navigator.userAgentData || null;
    LegacyUaData = navigator.userAgent || null;
    constructor() {

    }
    log(msg) {
        let logBox = this.find("TfLogBox");
        if (!logBox) return;

        logBox.innerText += msg + "\n";
        logBox.scrollTop = logBox.scrollHeight;
    }
    find(elem, frame = null) {
        if (frame !== null) {
            return frame.contentDocument.getElementById(elem);
        } else {
            return document.getElementById(elem);
        }
    }
    on(id, eventName, callback = null, preventDefault = false, iframe = null) {
        const el = this.find(id, iframe);

        if (!el) {
            console.warn(`Element not found: ${id}`);
            return;
        }

        const isForm =
            el instanceof HTMLFormElement;

        const isSubmitButton =
            (el instanceof HTMLButtonElement && el.type === "submit") ||
            (el instanceof HTMLInputElement &&
                ["submit", "image"].includes(el.type));

        const supportsPointer = "PointerEvent" in window;
        const supportsTouch = "ontouchstart" in window;

        const runHandler = (event) => {
            console.log("handler readyj");
            if (isForm || isSubmitButton || preventDefault) {
                event.preventDefault();
            }

            const payload = {
                event,
                element: el,
                type: event.type
            };

            // direct callback if provided
            if (typeof callback === "function") {
                callback(payload);
            }

            // also emit internal event if eventName exists
            if (eventName) {
                this.emit(eventName, payload);
            }
        };

        // POINTER
        if (supportsPointer) {
            const eventType = isForm ? "submit" : "click";

            console.log("elementf " + el);
            console.log("eventf tfyjpe" + eventType);
            el.addEventListener(eventType, runHandler);
            this._storeDomListener(id, el, runHandler, eventType);
            return;
        }

        // TOUCH fallback
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

        // CLICK fallback
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
    getBrands() {
        if (!(!!this.uaData)) {
            return [];
        } else {
            return this.uaData.brands || [];
        }
    }

    getMobile() {
        if (!(!!this.uaData)) {
            return null;
        } else {
            return this.uaData.mobile;
        }
    }

    getPlatform() {
        if (!(!!this.uaData)) {
            return null;
        } else {
            return this.uaData.platform;
        }
    }

    async getHighEntropyValues(hints = [
        "architecture",
        "bitness",
        "model",
        "platformVersion",
        "uaFullVersion"
    ]) {
        if (!(!!this.uaData)) {
            return null;
        } else {
            try {
                return await this.uaData.getHighEntropyValues(hints);
            } catch (err) {
                console.error("Failed to retrieve high entropy UA values:", err);
                return null;
            }
        }
    }
    getFullInfo() {
        return {
            supported: !!this.uaData,
            brands: this.getBrands(),
            mobile: this.getMobile(),
            platform: this.getPlatform(),
            legacyUA: this.LegacyUaData
        };
    }
}