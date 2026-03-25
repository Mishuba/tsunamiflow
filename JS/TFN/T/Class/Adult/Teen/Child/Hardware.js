export class Na extends T {
    uaData = navigator.userAgentData || null;
    LegacyUaData = navigator.userAgent || null;
    BatterySupported = !!navigator.getBattery;
    battery = null;
    TsunamiLocation = !!navigator.geolocation;
    VibrateSupported = !!navigator.vibrate;
    tfserial = !!navigator.serial;
    serialport = null;
    supportedhid = !!navigator.hid;
    hiddevices = [];
    supportedusb = !!navigator.usb;
    usb = null;
    supportedbluetooth = !!navigator.bluetooth;
    bluetoothdevice = null;
    constructor(options = {}) {
        super(options);
        if (this.BatterySupported) {
            navigator.getBattery().then(bat => this.battery = bat);
        } else {
            console.warn("Battery API not supported");
        }

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

    getCurrentPosition(success, error, options = {}) {
        if (!this.TsunamiLocation) {
            return null;
        } else {
            return navigator.geolocation.getCurrentPosition(success, error, options);
        }
    }

    watchPosition(success, error, options = {}) {
        if (!this.TsunamiLocation) {
            return null;
        } else {
            return navigator.geolocation.watchPosition(success, error, options);
        }
    }

    clearWatch(id) {
        if (!this.TsunamiLocation) {
            return;
        } else {
            navigator.geolocation.clearWatch(id);
        }
    }

    vibrate(pattern = 200) {
        if (!this.VibrateSupported) {
            return;
        } else {
            return navigator.vibrate(pattern);
        }
    }

    cancel() {
        if (!this.VibrateSupported) {
            return;
        } else {
            navigator.vibrate(0);
        }
    }
    async requestserialPort(filters = []) {
        if (!this.tfserial) return null;
        try {
            this.serialport = await navigator.serial.requestPort({ filters });
            return this.serialport;
        } catch (err) {
            console.error("Serial request failed:", err);
            return null;
        }
    }

    async openserial(options = { baudRate: 9600 }) {
        if (!this.port) return;
        try {
            await this.serialport.open(options);
        } catch (err) {
            console.error("Serial open failed:", err);
        }
    }

    async closeserial() {
        if (!this.serialport) return;
        try {
            await this.port.close();
        } catch (err) {
            console.error("Serial close failed:", err);
        }
    }
    async requesthidDevice(filters = []) {
        if (!this.supportedhid) return null;
        try {
            this.hiddevices = await navigator.hid.requestDevice({ filters });
            return this.devices;
        } catch (err) {
            console.error("HID request failed:", err);
            return null;
        }
    }

    async gethidDevices() {
        if (!this.supportedhid) return [];
        try {
            this.hiddevices = await navigator.hid.getDevices();
            return this.hiddevices;
        } catch (err) {
            console.error("HID getDevices failed:", err);
            return [];
        }
    }
    async requestusbDevice(filters = []) {
        if (!this.supportedusb) return null;
        try {
            this.usb = await navigator.usb.requestDevice({ filters });
            return this.usb;
        } catch (err) {
            console.error("USB request failed:", err);
            return null;
        }
    }

    async openusb() {
        if (!this.usb) return;
        try {
            await this.usb.open();
        } catch (err) {
            console.error("USB open failed:", err);
        }
    }

    async closeusb() {
        if (!this.usb) return;
        try {
            await this.usb.close();
        } catch (err) {
            console.error("USB close failed:", err);
        }
    }
    async requestbluetoothDevice(options = { acceptAllDevices: true }) {
        if (!this.supported) return null;
        try {
            this.bluetoothdevice = await navigator.bluetooth.requestDevice(options);
            return this.bluetoothdevice;
        } catch (err) {
            console.error("Bluetooth request failed:", err);
            return null;
        }
    }

    connectGATTbluetooth() {
        if (!this.bluetoothdevice) return null;
        return this.bluetoothdevice.gatt.connect();
    }
}