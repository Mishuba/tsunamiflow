export class TfWorkerManager {
    constructor({ webWorkerScript = null, serviceWorkerScript = null, sharedWorkerScript = null } = {}) {
        // Initialize the worker classes, or leave them null if not supported
        this.webWorker = webWorkerScript ? new TfWebWorker(webWorkerScript) : null;
        this.serviceWorker = serviceWorkerScript ? new TfServiceWorker(serviceWorkerScript) : null;
        this.sharedWorker = sharedWorkerScript ? new TfSharedWorker(sharedWorkerScript) : null;

        this.listeners = {};
    }

    // ===== Start or register workers =====
    startWebWorker() {
        if (!this.webWorker) return;
        this.webWorker.start();
        this.webWorker.on("message", (data) => this.emit("webWorkerMessage", data));
        this.webWorker.on("error", (err) => this.emit("webWorkerError", err));
    }

    registerServiceWorker() {
        if (!this.serviceWorker) return;
        this.serviceWorker.register();
        this.serviceWorker.on("message", (data) => this.emit("serviceWorkerMessage", data));
    }

    startSharedWorker() {
        if (!this.sharedWorker) return;
        this.sharedWorker.start();
        this.sharedWorker.on("message", (data) => this.emit("sharedWorkerMessage", data));
    }

    // ===== Post messages =====
    postWebWorker(data) {
        if (!this.webWorker) return;
        this.webWorker.postMessage(data);
    }

    postServiceWorker(data) {
        if (!this.serviceWorker) return;
        this.serviceWorker.postMessage(data);
    }

    postSharedWorker(data) {
        if (!this.sharedWorker) return;
        this.sharedWorker.postMessage(data);
    }

    // ===== Terminate/close/unregister =====
    terminateWebWorker() {
        if (!this.webWorker) return;
        this.webWorker.terminate();
        this.webWorker = null;
    }

    unregisterServiceWorker() {
        if (!this.serviceWorker) return;
        this.serviceWorker.unregister();
        this.serviceWorker = null;
    }

    closeSharedWorker() {
        if (!this.sharedWorker) return;
        this.sharedWorker.close();
        this.sharedWorker = null;
    }

    // ===== Unified event handling =====
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }
}