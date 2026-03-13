export class TfEventSource {
    constructor(url) {
        this.url = url;
        this.source = null;
        this.listeners = {};
    }

    connect() {
        if (!("EventSource" in window)) {
            console.error("EventSource not supported");
            return;
        }

        this.source = new EventSource(this.url);

        this.source.onopen = () => this.emit("open");
        this.source.onmessage = (e) => this.emit("message", e.data);
        this.source.onerror = (e) => this.emit("error", e);

        console.log("EventSource connected");
    }

    emit(event, data) {
        const listeners = this.listeners[event] || [];
        listeners.forEach(fn => fn(data));
    }

    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }

    close() {
        if (this.source) {
            this.source.close();
            this.source = null;
            this.emit("close");
        }
    }
}