export class F {
    listeners = {};
    domListeners = new Map();
    // WorldSocket = new TfWebsocket("wss://world.tsunamiflow.club/ws"); 
    ws = null;
    wsRole = "viewer";
    baseUrl = "wss://world.tsunamiflow.club/ws";
    wsKey = null;
    TfWebSocket = null;
    connectedws = false;
    reconnectws = true;
    wsreconnectDelay = 2000;
    wsReconnectAttempts = 0;
    uaData = navigator.userAgentData || null;
    LegacyUaData = navigator.userAgent || null;

    constructor(options = {}) {
        if (options.role) this.wsRole = options.role;
        if (options.key) this.wsKey = options.key;
        if (options.baseUrl) this.baseUrl = options.baseUrl;
    }
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
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
setMessageHandler(fn) {
    this._broadcast = fn;
}
    startHeartbeat() {
        if (this.heartbeat) return; // prevent duplicates

        this.heartbeat = setInterval(() => {
            this.sendwsJSON({ type: "ping" });
        }, 5000);
    }

    stopHeartbeat() {
        if (this.heartbeat) {
            clearInterval(this.heartbeat);
            this.heartbeat = null;
        }
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

    connectws() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.warn("WS already connected");
            return;
        }

        if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
            console.warn("WS already connecting");
            return;
        }

        if (!this.wsKey) {
            console.warn("WebSocket requires a stream key");
        }

        const url = `${this.baseUrl}?role=${this.wsRole}&key=${this.wsKey}`;

        this.ws = new WebSocket(url);
        this.ws.binaryType = "arraybuffer";

        this.ws.onopen = () => {
            this.connectedws = true;
            this.emit("ws_open");
            this.startHeartbeat();

            if (this.wsRole === "streamer") {
                this.startwsStream();
            }
            console.log("🟢 WebSocket connected");
        };

        this.ws.onmessage = (event) => {
            if (typeof event.data === "string") {
                try {
                    this.emit("ws_message", JSON.parse(event.data));
                } catch {
                    this.emit("ws_raw", event.data);
                }
            } else {
                this.emit("ws_binary", event.data);
            }
this.emit("ws_message", payload);

    // 🔥 broadcast to all tabs
    if (this._broadcast) {
        this._broadcast(payload);
        };
}
        this.ws.onclose = () => {
            this.connectedws = false;
            this.emit("ws_close");
            this.stopHeartbeat();
            console.log("🔴 WebSocket disconnected");

            if (this.reconnectws) {
                setTimeout(() => this.connectws(), this.wsreconnectDelay);
            }
        };

        this.ws.onerror = (err) => {
            this.emit("ws_error", err);
            console.error("💥 WebSocket error:", err);
        };
    }
    disconnectws() {
        this.reconnectws = false;

        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.stopHeartbeat();
        }
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

    sendwsJSON(obj) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        this.ws.send(JSON.stringify(obj));
    }

    sendBinaryws(data) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        // Prevent buffer overload (1MB threshold)
        if (this.ws.bufferedAmount > 1_000_000) {
            console.warn("Dropping frame (buffer overflow)");
            return;
        }

        this.ws.send(data);
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