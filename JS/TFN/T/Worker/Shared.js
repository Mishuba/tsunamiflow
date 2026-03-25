export class SharedWorker extends F {
    scriptURL = "";
    sharedWorker = null;
    port = null;
    listeners = {};
    constructor(options = {}) {
        if (!window.SharedWorker) {
            console.warn("Shared Workers are not supported in this browser");
            this.sharedWorker = null;
            return;
        } else {
            if (options.scriptURL) this.scriptURL = options.scriptURL;
        }
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

    close() {
        if (!this.port) return;
        this.port.close();
        this.sharedWorker = null;
        this.port = null;
        console.log("Shared Worker closed");
    }
}