startSharedWorker() {
    if (this.sharedWorker) return;

    this.sharedWorker = new SharedWorker("/SharedWorker.js");

    this.port = this.sharedWorker.port;

    this.port.start();

    this.receiveSharedWorkerMessage();

    // optional: identify this worker
    this.sendToSharedWorker("register", {
        name: this.workerName || "media"
    });
}


receiveSharedWorkerMessage() {
    this.port.onmessage = (event) => {
        const msg = event.data;

        switch (msg.type) {
            case "ws_message":
                console.log("From WS:", msg.data);
                break;

            case "radio.play":
                this.handleRadio(msg.data);
                break;

            case "game.state":
                this.handleGameState(msg.data);
                break;
        }
    };
}


sendToSharedWorker(type, data = null, meta = {}) {
    if (!this.port) return;

    this.port.postMessage({
        type,
        data,
        meta: {
            worker: this.workerName || "unknown",
            timestamp: Date.now(),
            ...meta
        }
    });
}
