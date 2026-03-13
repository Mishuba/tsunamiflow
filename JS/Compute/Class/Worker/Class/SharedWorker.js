export class TfSharedWorker {
    constructor(scriptURL) {
        if (!window.SharedWorker) {
            console.warn("Shared Workers are not supported in this browser");
            this.sharedWorker = null;
            return;
        }

        this.scriptURL = scriptURL;
        this.sharedWorker = null;
        this.port = null;
        this.listeners = {};
    }

    start() {
        if (!this.scriptURL) return;
        this.sharedWorker = new SharedWorker(this.scriptURL);
        this.port = this.sharedWorker.port;

        this.port.onmessage = (event) => this.emit("message", event.data);
        this.port.start(); // start the port explicitly
        console.log("Shared Worker started");
    }

    postMessage(data) {
        if (!this.port) return;
        this.port.postMessage(data);
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }

    close() {
        if (!this.port) return;
        this.port.close();
        this.sharedWorker = null;
        this.port = null;
        console.log("Shared Worker closed");
    }
}