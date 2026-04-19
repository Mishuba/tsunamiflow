import { T } from "./foundation/T.js";
export class TsharedWorker extends T {
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
    constructor(options = {}) {
        if (options.role) this.wsRole = options.role;
        if (options.key) this.wsKey = options.key;
        if (options.baseUrl) this.baseUrl = options.baseUrl;
    }
    /*
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    */
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
}