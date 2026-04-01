export class N extends T {
    constructor(options = {}) {
        this.supported = !!navigator.permissions;
        this.custom = options.custom || {};

        /* ========================= */
        /* ===== PERMISSIONS ======= */
        /* ========================= */

        this.permissions = {
            geolocation: this._wrapPermission("geolocation"),
            notifications: this._wrapPermission("notifications"),
            clipboard: this._wrapPermission("clipboard-read"),
            camera: this._wrapPermission("camera"),
            microphone: this._wrapPermission("microphone")
        };

        /* ========================= */
        /* ===== CAPABILITIES ====== */
        /* ========================= */

        this.capabilities = {
            battery: this._battery(),
            vibration: this._vibration(),
            serial: this._serial(),
            hid: this._hid(),
            usb: this._usb(),
            bluetooth: this._bluetooth()
        };

        if (!this.supported) {
            console.warn("Permissions API not fully supported.");
        }
    }

    /* ========================= */
    /* ===== PERMISSION WRAP === */
    /* ========================= */

    _wrapPermission(name) {
        return {
            async query() {
                if (!navigator.permissions) return "unsupported";
                try {
                    const res = await navigator.permissions.query({ name });
                    return res.state;
                } catch {
                    return "unsupported";
                }
            }
        };
    }

    async query(name) {
        if (this.permissions[name]) {
            return await this.permissions[name].query();
        }
        return "unsupported";
    }

    /* ========================= */
    /* ===== CAMERA / MIC ====== */
    /* ========================= */

    async requestMedia(constraints = {}) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            return { status: "granted", stream };
        } catch (err) {
            return { status: "denied", error: err };
        }
    }

    async requestCamera() {
        return this.requestMedia({ video: true });
    }

    async requestMicrophone() {
        return this.requestMedia({ audio: true });
    }

    /* ========================= */
    /* ===== CAPABILITIES ====== */
    /* ========================= */

    _battery() {
        return {
            supported: !!navigator.getBattery,
            async get() {
                if (!navigator.getBattery) return null;
                return await navigator.getBattery();
            }
        };
    }

    _vibration() {
        return {
            supported: !!navigator.vibrate,
            vibrate(pattern = 200) {
                return navigator.vibrate ? navigator.vibrate(pattern) : false;
            },
            stop() {
                return navigator.vibrate ? navigator.vibrate(0) : false;
            }
        };
    }

    _serial() {
        return {
            supported: !!navigator.serial,
            port: null,

            async request(filters = []) {
                if (!navigator.serial) return null;
                try {
                    this.port = await navigator.serial.requestPort({ filters });
                    return this.port;
                } catch (err) {
                    return null;
                }
            },

            async open(options = { baudRate: 9600 }) {
                if (!this.port) return;
                await this.port.open(options);
            },

            async close() {
                if (!this.port) return;
                await this.port.close();
            }
        };
    }

    _hid() {
        return {
            supported: !!navigator.hid,
            devices: [],

            async request(filters = []) {
                try {
                    this.devices = await navigator.hid.requestDevice({ filters });
                    return this.devices;
                } catch {
                    return [];
                }
            },

            async get() {
                this.devices = await navigator.hid.getDevices();
                return this.devices;
            }
        };
    }

    _usb() {
        return {
            supported: !!navigator.usb,
            device: null,

            async request(filters = []) {
                try {
                    this.device = await navigator.usb.requestDevice({ filters });
                    return this.device;
                } catch {
                    return null;
                }
            },

            async open() {
                if (!this.device) return;
                await this.device.open();
            },

            async close() {
                if (!this.device) return;
                await this.device.close();
            }
        };
    }

    _bluetooth() {
        return {
            supported: !!navigator.bluetooth,
            device: null,

            async request(options = { acceptAllDevices: true }) {
                try {
                    this.device = await navigator.bluetooth.requestDevice(options);
                    return this.device;
                } catch {
                    return null;
                }
            },

            async connect() {
                if (!this.device) return null;
                return await this.device.gatt.connect();
            }
        };
    }
}