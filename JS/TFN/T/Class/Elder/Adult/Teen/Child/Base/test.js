import { T } from "./foundation/T.js";
export class Ts extends T {
    uaData = navigator.userAgentData || null;
    LegacyUaData = navigator.userAgent || null;
    sharedWorker = null;
    sharedWorkerPort = null;
    constructor(options = {}) {

    }
    getBrands() {
        if (!(!!this.uaData)) {
            return [];
        } else {
            return this.uaData.brands || [];
        }
    }

    getMobile() {
        if (!(!!this.uaData)) {
            return null;
        } else {
            return this.uaData.mobile;
        }
    }

    getPlatform() {
        if (!(!!this.uaData)) {
            return null;
        } else {
            return this.uaData.platform;
        }
    }

    async getHighEntropyValues(hints = [
        "architecture",
        "bitness",
        "model",
        "platformVersion",
        "uaFullVersion"
    ]) {
        if (!(!!this.uaData)) {
            return null;
        } else {
            try {
                return await this.uaData.getHighEntropyValues(hints);
            } catch (err) {
                console.error("Failed to retrieve high entropy UA values:", err);
                return null;
            }
        }
    }

    getFullInfo() {
        return {
            supported: !!this.uaData,
            brands: this.getBrands(),
            mobile: this.getMobile(),
            platform: this.getPlatform(),
            legacyUA: this.LegacyUaData
        };
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