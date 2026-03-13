export class TfWebWorker {
    constructor(scriptURL) {
        if (!window.Worker) {
            console.warn("Web Workers are not supported in this browser");
            this.worker = null;
            return;
        }

        this.scriptURL = scriptURL;
        this.worker = null;
        this.listeners = {};
    }

    start() {
        if (!this.scriptURL) return;
        this.worker = new Worker(this.scriptURL);

        this.worker.onmessage = (event) => this.emit("message", event.data);
        this.worker.onerror = (err) => this.emit("error", err);
        console.log("Web Worker started");
    }

    postMessage(data) {
        if (!this.worker) return;
        this.worker.postMessage(data);
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }

    terminate() {
        if (!this.worker) return;
        this.worker.terminate();
        this.worker = null;
        console.log("Web Worker terminated");
    }
}