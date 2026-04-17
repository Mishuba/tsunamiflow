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
    async request(method, url, data = null, headers = {}, transport = "fetch") {
    switch (transport.toLowerCase()) {

        /* =========================================
           FETCH (Recommended Default)
        ========================================= */
        case "fetch":
            try {
                const options = {
                    method,
                    headers: { ...headers }
                };

                // Only attach body if needed
                if (
                    data !== null &&
                    method.toUpperCase() !== "GET" &&
                    method.toUpperCase() !== "HEAD"
                ) {
                    if (
                        typeof data === "object" &&
                        !(data instanceof FormData) &&
                        !(data instanceof Blob) &&
                        !(data instanceof URLSearchParams)
                    ) {
                        options.body = JSON.stringify(data);

                        if (!options.headers["Content-Type"]) {
                            options.headers["Content-Type"] = "application/json";
                        }
                    } else {
                        options.body = data;
                    }
                }

                const response = await fetch(url, options);

                if (!response.ok) {
                    this.emit("error", {
                        type: "fetch",
                        status: response.status,
                        statusText: response.statusText,
                        url
                    });

                    throw new Error(response.statusText);
                }

                const contentType = response.headers.get("content-type") || "";

                let result;

                if (contentType.includes("application/json")) {
                    result = await response.json();
                } else if (
                    contentType.includes("audio") ||
                    contentType.includes("video") ||
                    contentType.includes("application/octet-stream")
                ) {
                    result = await response.arrayBuffer();
                } else {
                    result = await response.text();
                }

                this.emit("success", {
                    type: "fetch",
                    url,
                    data: result
                });

                return result;

            } catch (error) {
                this.emit("error", {
                    type: "fetch",
                    url,
                    error: error.message
                });

                console.error("Fetch Error:", error);
                return null;
            }

        /* =========================================
           XMLHTTPREQUEST
        ========================================= */
        case "xml":
        case "xhr":
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.open(method, url, true);

                for (const [key, value] of Object.entries(headers)) {
                    xhr.setRequestHeader(key, value);
                }

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            this.emit("success", {
                                type: "xhr",
                                url,
                                data: xhr.responseText
                            });

                            resolve(xhr.responseText);
                        } else {
                            this.emit("error", {
                                type: "xhr",
                                status: xhr.status,
                                statusText: xhr.statusText,
                                url
                            });

                            reject(xhr.statusText);
                        }
                    }
                };

                xhr.onerror = () => {
                    this.emit("error", {
                        type: "xhr",
                        url,
                        error: "Network Error"
                    });

                    console.error("XHR Network Error");
                    reject("Network Error");
                };

                if (
                    data &&
                    typeof data === "object" &&
                    !(data instanceof FormData)
                ) {
                    xhr.send(JSON.stringify(data));
                } else {
                    xhr.send(data);
                }
            });

        /* =========================================
           SEND BEACON
        ========================================= */
        case "beacon":
            return await this.SendBeacon(url, data);

        /* =========================================
           DEFAULT
        ========================================= */
        default:
            this.emit("error", {
                type: "transport",
                error: `Unknown transport: ${transport}`
            });

            console.error(`Unknown transport type: ${transport}`);
            return null;
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