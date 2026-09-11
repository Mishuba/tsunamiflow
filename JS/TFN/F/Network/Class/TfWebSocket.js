export class TfWebsocket {
    constructor(url, options = {}) {
        this.baseUrl = url;
        this.role = options.role || "viewer";
        this.key = options.key || null;

        this.ws = null;
        this.connected = false;

        this.listeners = {};
        this.reconnect = options.reconnect ?? true;
        this.reconnectDelay = options.reconnectDelay || 2000;
    }

    /* ========================= */
    /* ===== CONNECTION ======== */
    /* ========================= */

    connect() {
        if (!this.key) {
            console.warn("WebSocket requires a stream key");
        }

        const url = `${this.baseUrl}?role=${this.role}&key=${this.key}`;

        this.ws = new WebSocket(url);
        this.ws.binaryType = "arraybuffer";

        this.ws.onopen = () => {
            this.connected = true;
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
            this.connected = false;
            this.emit("close");
            console.log("🔴 WebSocket disconnected");

            if (this.reconnect) {
                setTimeout(() => this.connect(), this.reconnectDelay);
            }
        };

        this.ws.onerror = (err) => {
            this.emit("error", err);
            console.error("💥 WebSocket error:", err);
        };
    }

    disconnect() {
        this.reconnect = false;
        if (this.ws) this.ws.close();
    }

    /* ========================= */
    /* ===== CONTROL ========= */
    /* ========================= */

    startStream() {
        this.sendJSON({ type: "start_stream" });
    }

    stopStream() {
        this.sendJSON({ type: "stop_stream" });
    }

    /* ========================= */
    /* ===== DATA SEND ======== */
    /* ========================= */

    sendJSON(obj) {
        if (!this.connected) return;
        this.ws.send(JSON.stringify(obj));
    }

    sendBinary(data) {
        if (!this.connected) return;
        this.ws.send(data); // ArrayBuffer / Blob
    }

    /* ========================= */
    /* ===== EVENTS =========== */
    /* ========================= */

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data = null) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(fn => fn(data));
    }
}