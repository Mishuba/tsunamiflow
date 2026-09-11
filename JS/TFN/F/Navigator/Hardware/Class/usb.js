export class TfUSB {
    constructor() {
        this.supported = !!navigator.usb;
        this.device = null;
    }

    async requestDevice(filters = []) {
        if (!this.supported) return null;
        try {
            this.device = await navigator.usb.requestDevice({ filters });
            return this.device;
        } catch (err) {
            console.error("USB request failed:", err);
            return null;
        }
    }

    async open() {
        if (!this.device) return;
        try {
            await this.device.open();
        } catch (err) {
            console.error("USB open failed:", err);
        }
    }

    async close() {
        if (!this.device) return;
        try {
            await this.device.close();
        } catch (err) {
            console.error("USB close failed:", err);
        }
    }
}