export class TfFetch {
    constructor() {
        this.listeners = {};
    }

    async request(url, options = {}) {
        try {
            const res = await fetch(url, options);
            const data = await res.json().catch(() => res.text());
            this.emit("success", data);
            return data;
        } catch (err) {
            console.error("Fetch error:", err);
            this.emit("error", err);
            return null;
        }
    }

    emit(event, data) {
        const listeners = this.listeners[event] || [];
        listeners.forEach(fn => fn(data));
    }

    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }
}