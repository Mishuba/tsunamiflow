export class Tsu {
    lang = "en-US";
    listeners = {};
    domListeners = new Map();
    WorldSocket = new TfWebsocket("wss://world.tsunamiflow.club/ws"); 
    ws = null;
    wsRole = "viewer";
    baseUrl = "wss://world.tsunamiflow.club/ws";
    wsKey = null || "anything";
    TfWebSocket = null;
    connectedws = false;
    reconnectws = true;
    wsreconnectDelay = 2000; 
    constructor(options = {}) {
        if (options.lang) {
            this.lang = options.lang;
        }
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

    emit(event, data) {
        (this.listeners[event] || []).forEach((fn) => {
            try {
                fn(data);
            } catch (error) {
                console.error(`Error occurred while emitting event "${event}":`, error);
            }
        });
    }
    requestXml(method, url, data = null, headers = {}) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value);
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    this.emit("success", xhr.responseText);
                } else {
                    this.emit("error", xhr.statusText);
                }
            }
        };

        xhr.send(data);
        return xhr;
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
        //const { el, runHandler } = entry;

        el.removeEventListener("pointerup", runHandler);
        el.removeEventListener("click", runHandler);
        el.removeEventListener("submit", runHandler);

        this.domListeners.delete(id);
    }

    connectws() {
        if (!this.wsKey) {
            console.warn("WebSocket requires a stream key");
        }

        const url = `${this.baseUrl}?role=${this.wsRole}&key=${this.wsKey}`;

        this.ws = new WebSocket(url);
        this.ws.binaryType = "arraybuffer";

        this.ws.onopen = () => {
            this.connectedws = true;
            this.emit("open");
            console.log("🟢 WebSocket connected");
        };

        this.ws.onmessage = (event) => {
            // Server mostly doesn't send messages yet, but handle anyway
            if (typeof event.data === "string") {
                try {
                    const data = JSON.parse(event.data);
                    this.emit("message", data);
                } catch {
                    this.emit("message_raw", event.data);
                }
            } else {
                this.emit("binary", event.data);
            }
        };

        this.ws.onclose = () => {
            this.connectedws = false;
            this.emit("close");
            console.log("🔴 WebSocket disconnected");

            if (this.reconnectws) {
                setTimeout(() => this.connectws(), this.wsreconnectDelay);
            }
        };

        this.ws.onerror = (err) => {
            this.emit("error", err);
            console.error("💥 WebSocket error:", err);
        };
    }

    disconnectws() {
        this.reconnectws = false;
        if (this.ws) this.ws.close();
    }

    /* ========================= */
    /* ===== CONTROL ========= */
    /* ========================= */

    startwsStream() {
        this.sendwsJSON({ type: "start_stream" });
    }

    stopwsStream() {
        this.sendwsJSON({ type: "stop_stream" });
    }

    sendBinaryws(data) {
        if (!this.connectedws) return;
        this.ws.send(data); // ArrayBuffer / Blob
    }
    sendwsJSON(obj) {
        if (!this.connectedws) return;
        this.ws.send(JSON.stringify(obj));
    }
}