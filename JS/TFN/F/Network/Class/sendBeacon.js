export class TfSendBeacon {
    constructor({ maxSize = 64 * 1024 } = {}) {
        this.listeners = {};
        this.maxSize = maxSize;
    }

    SendBeacon(url, data) {
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
        if (size > this.maxSize) {
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

    #getSize(payload) {
        if (typeof payload === "string") {
            return new TextEncoder().encode(payload).length;
        }
        if (payload instanceof Blob) {
            return payload.size;
        }
        return 0; // fallback (FormData/URLSearchParams not easily measurable)
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(fn => fn(data));
    }

    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }
}