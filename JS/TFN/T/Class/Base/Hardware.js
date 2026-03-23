export class Na extends TsuNa {
    uaData = navigator.userAgentData || null;
    LegacyUaData = navigator.userAgent || null;
    BatterySupported = !!navigator.getBattery;
    battery = null;
    TsunamiLocation = !!navigator.geolocation;
    VibrateSupported = !!navigator.vibrate;
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
}