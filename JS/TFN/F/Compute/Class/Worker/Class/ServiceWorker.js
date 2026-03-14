export class TfServiceWorker {
    constructor(scriptURL) {
        if (!("serviceWorker" in navigator)) {
            console.warn("Service Workers are not supported in this browser");
            this.sw = null;
            return;
        }

        this.scriptURL = scriptURL;
        this.registration = null;
        this.listeners = {};
    }

    async register() {
        if (!this.scriptURL) return;
        try {
            this.registration = await navigator.serviceWorker.register(this.scriptURL);
            console.log("Service Worker registered:", this.registration);

            navigator.serviceWorker.addEventListener("message", (event) => {
                this.emit("message", event.data);
            });
        } catch (err) {
            console.error("Service Worker registration failed:", err);
        }
    }

    postMessage(message) {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(message);
        } else {
            console.warn("No active Service Worker controller found");
        }
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }

    async unregister() {
        if (!this.registration) return;
        try {
            await this.registration.unregister();
            console.log("Service Worker unregistered");
            this.registration = null;
        } catch (err) {
            console.error("Failed to unregister Service Worker:", err);
        }
    }
}