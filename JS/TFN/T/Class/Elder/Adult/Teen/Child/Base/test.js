export class test {
sharedWorker = null;
sharedWorkerPort = null;
constructor(options ={}) {

}
startSharedWorker() {
    if (this.sharedWorker) return;

    this.sharedWorker = new SharedWorker("/SharedWorker.js");

    this.sharedWorkerPort = this.sharedWorker.port;

    this.sharedWorkerPort.start();

    this.receiveSharedWorkerMessage();

    this.sendToSharedWorker("register", {
        name: this.workerName || "media"
    });
}

receiveSharedWorkerMessage() {
    this.sharedWorkerPort.onmessage = (event) => {
        const msg = event.data;

        switch (msg.type) {
            case "ws_message":
                console.log("WS:", msg.data);
                break;

            case "radio.play":
                this.handleRadio(msg.data);
                break;
        }
    };
}

sendToSharedWorker(type, data = null, meta = {}) {
    if (!this.sharedWorkerPort) return;

    this.sharedWorkerPort.postMessage({
        type,
        data,
        meta
    });
}
}