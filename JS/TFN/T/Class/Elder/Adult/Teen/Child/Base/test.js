export class test {

constructor(options ={}) {

}
startSharedWorker() {
    if (this.sharedWorker) return;

    this.sharedWorker = new SharedWorker("/SharedWorker.js");

    this.port = this.sharedWorker.port;

    this.port.start();

    this.receiveSharedWorkerMessage();

    this.sendToSharedWorker("register", {
        name: this.workerName || "media"
    });
}

receiveSharedWorkerMessage() {
    this.port.onmessage = (event) => {
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
    if (!this.port) return;

    this.port.postMessage({
        type,
        data,
        meta
    });
}
}