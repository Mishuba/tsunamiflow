export class TfSendBeacon {
    constructor() {
        this.listeners = {};
    }

    sendBeacon(url, data) {
        const blob = data instanceof Blob ? data : new Blob([JSON.stringify(data)], { type: "application/json" });
        const success = navigator.sendBeacon(url, blob);
        this.emit(success ? "success" : "error", { url, data });
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