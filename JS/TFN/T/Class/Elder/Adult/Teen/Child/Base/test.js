import { T } from "./foundation/base.js";
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


}