export class TfSerial {
    constructor() {
        this.supported = !!navigator.serial;
        this.port = null;
    }

    async requestPort(filters = []) {
        if (!this.supported) return null;
        try {
            this.port = await navigator.serial.requestPort({ filters });
            return this.port;
        } catch (err) {
            console.error("Serial request failed:", err);
            return null;
        }
    }

    async open(options = { baudRate: 9600 }) {
        if (!this.port) return;
        try {
            await this.port.open(options);
        } catch (err) {
            console.error("Serial open failed:", err);
        }
    }

    async close() {
        if (!this.port) return;
        try {
            await this.port.close();
        } catch (err) {
            console.error("Serial close failed:", err);
        }
    }
}