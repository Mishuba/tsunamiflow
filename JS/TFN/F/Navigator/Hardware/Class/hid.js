export class TfHID {
    constructor() {
        this.supported = !!navigator.hid;
        this.devices = [];
    }

    async requestDevice(filters = []) {
        if (!this.supported) return null;
        try {
            this.devices = await navigator.hid.requestDevice({ filters });
            return this.devices;
        } catch (err) {
            console.error("HID request failed:", err);
            return null;
        }
    }

    async getDevices() {
        if (!this.supported) return [];
        try {
            this.devices = await navigator.hid.getDevices();
            return this.devices;
        } catch (err) {
            console.error("HID getDevices failed:", err);
            return [];
        }
    }
}