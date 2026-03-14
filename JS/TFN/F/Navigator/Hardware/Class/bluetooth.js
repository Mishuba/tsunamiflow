export class TfBluetooth {
    constructor() {
        this.supported = !!navigator.bluetooth;
        this.device = null;
    }

    async requestDevice(options = { acceptAllDevices: true }) {
        if (!this.supported) return null;
        try {
            this.device = await navigator.bluetooth.requestDevice(options);
            return this.device;
        } catch (err) {
            console.error("Bluetooth request failed:", err);
            return null;
        }
    }

    connectGATT() {
        if (!this.device) return null;
        return this.device.gatt.connect();
    }
}