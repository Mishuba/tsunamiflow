import { T } from "./Base/foundation/base.js";

export class Ts extends T {
    uaData = navigator.userAgentData || null;
    LegacyUaData = navigator.userAgent || null;
    sharedWorker = null;
    sharedWorkerPort = null;
    constructor(options = {}) {
        super(options);
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
LocalStoragekey(name) {
    return `${this.namespace}:${name}`;
}

setLocalStorage(name, value) {
    try {

        const data = JSON.stringify(value);

        this.LocalStorage.setItem(
            this.LocalStoragekey(name),
            data
        );

        return true;

    } catch (err) {

        console.error("TfLocalStorage set failed:", err);
        return false;

    }
}

getLocalStorage(name) {

    const value = this.LocalStorage.getItem(
        this.LocalStoragekey(name)
    );

    if (value === null) return null;

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }

}

removeLocalStorage(name) {

    this.LocalStorage.removeItem(
        this.LocalStoragekey(name)
    );

}

LocalStoragehas(name) {

    return this.LocalStorage.getItem(
        this.LocalStoragekey(name)
    ) !== null;

}

LocalStoragekeys() {

    const list = [];

    for (let i = 0; i < this.LocalStorage.length; i++) {

        const k = this.LocalStorage.key(i);

        if (k.startsWith(this.namespace + ":")) {
            list.push(k.replace(this.namespace + ":", ""));
        }

    }

    return list;
}

clearLocalStorage() {

    const keys = this.LocalStoragekeys();

    keys.forEach(k => {
        this.removeLocalStorage(k);
    });

}

LocalStoragesize() {

    let bytes = 0;

    for (let i = 0; i < this.LocalStorage.length; i++) {

        const key = this.LocalStorage.key(i);

        if (key.startsWith(this.namespace + ":")) {

            const value = this.LocalStorage.getItem(key);

            bytes += key.length + value.length;

        }

    }

    return bytes;
}

Sessionkey(name) {
    return `${this.namespace}:${name}`;
}

setSession(name, value) {

    try {

        const data = JSON.stringify(value);

        this.SessionStorage.setItem(
            this.Sessionkey(name),
            data
        );

        return true;

    } catch (err) {

        console.error("TfSessionStorage set failed:", err);
        return false;

    }

}

getSession(name) {

    const value = this.SessionStorage.getItem(
        this.Sessionkey(name)
    );

    if (value === null) return null;

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }

}

removeSession(name) {

    this.SessionStorage.removeItem(
        this.Sessionkey(name)
    );

}

Sessionhas(name) {

    return this.SessionStorage.getItem(
        this.Sessionkey(name)
    ) !== null;

}

Sessionkeys() {

    const list = [];

    for (let i = 0; i < this.SessionStorage.length; i++) {

        const key = this.SessionStorage.Sessionkey(i);

        if (key.startsWith(this.namespace + ":")) {

            list.push(
                key.replace(this.namespace + ":", "")
            );

        }

    }

    return list;

}

clearSession() {

    const keys = this.Sessionkeys();

    keys.forEach(k => {
        this.removeSession(k);
    });

}

Sessionsize() {

    let bytes = 0;

    for (let i = 0; i < this.SessionStorage.length; i++) {

        const key = this.SessionStorage.key(i);

        if (key.startsWith(this.namespace + ":")) {

            const value = this.SessionStorage.getItem(key);

            bytes += key.length + value.length;

        }

    }

    return bytes;

}
cookiekey(name) {
    return `${this.namespace}:${name}`;
}

parsecookie() {

    const jar = {};

    if (!document.cookie) return jar;

    document.cookie.split(";").forEach(cookie => {

        const parts = cookie.split("=");

        const key = parts.shift().trim();
        const value = parts.join("=");

        jar[key] = decodeURIComponent(value);

    });

    return jar;

}

setcookie(name, value, {
    days = 7,
    path = "/",
    secure = false,
    sameSite = "Lax"
} = {}) {

    if (!this.cookieenabled) return false;

    const key = this.key(name);

    const expires = new Date(
        Date.now() + days * 86400000
    ).toUTCString();

    const data = encodeURIComponent(
        JSON.stringify(value)
    );

    let cookie = `${key}=${data}; expires=${expires}; path=${path}; SameSite=${sameSite}`;

    if (secure) cookie += "; Secure";

    document.cookie = cookie;

    this.cookies[key] = data;

    return true;

}

getcookie(name) {

    if (!this.cookieenabled) return null;

    const key = this.cookiekey(name);

    const value = this.parse()[key];

    if (!value) return null;

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }

}

cookiehas(name) {

    const key = this.cookiekey(name);

    return key in this.parsecookie();

}

removecookie(name, path = "/") {

    const key = this.cookiekey(name);

    document.cookie =
        `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;

    delete this.cookies[key];

}

cookiekeys() {

    const parsed = this.parsecookie();

    return Object.keys(parsed)
        .filter(k => k.startsWith(this.namespace + ":"))
        .map(k => k.replace(this.namespace + ":", ""));

}

clearcookie() {

    this.cookiekeys().forEach(k => {
        this.remove(k);
    });
}
}

export class TsDom extends Ts {
    namespace = "tf";
    cookieenabled = navigator.cookieEnabled;
    cookies = this.cookieenabled ? this.parsecookie() : {};
    SessionStorage = window.sessionStorage;
    LocalStorage = window.localStorage;
    constructor(options = {}) {
        super(options);
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
}