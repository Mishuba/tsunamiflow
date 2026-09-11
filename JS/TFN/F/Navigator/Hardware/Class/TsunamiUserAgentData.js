export class TfUserAgentData {
    constructor() {
        this.uaData = navigator.userAgentData || null;
        this.supported = !!this.uaData;
    }

    isSupported() {
        return this.supported;
    }

    getBrands() {
        if (!this.supported) return [];
        return this.uaData.brands || [];
    }

    getMobile() {
        if (!this.supported) return null;
        return this.uaData.mobile;
    }

    getPlatform() {
        if (!this.supported) return null;
        return this.uaData.platform;
    }

    async getHighEntropyValues(hints = [
        "architecture",
        "bitness",
        "model",
        "platformVersion",
        "uaFullVersion"
    ]) {
        if (!this.supported) return null;

        try {
            return await this.uaData.getHighEntropyValues(hints);
        } catch (err) {
            console.error("Failed to retrieve high entropy UA values:", err);
            return null;
        }
    }

    getLegacyUserAgent() {
        return navigator.userAgent || null;
    }

    getFullInfo() {
        return {
            supported: this.supported,
            brands: this.getBrands(),
            mobile: this.getMobile(),
            platform: this.getPlatform(),
            legacyUA: this.getLegacyUserAgent()
        };
    }
}