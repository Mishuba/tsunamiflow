export class na extend Tsu {
this.uaData = navigator.userAgentData || null;
this.LegacyUaData = navigator.userAgent || null;

    TsunamiLocation = !!navigator.geolocation;

constructor(options = {}) {
      super(options);
      
        
    }

    getBrands() {
        if (!(!!this.uaData) {
             return [];
        } else {
        return this.uaData.brands || [];
        }
    }

    getMobile() {
        if (!(!!this.uaData) {
             return null;
        } else {
              return this.uaData.mobile;
        }
    }

    getPlatform() {
        if (!(!!this.uaData) {
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
        if (!(!!this.uaData) {
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
            supported: this.supported,
            brands: this.getBrands(),
            mobile: this.getMobile(),
            platform: this.getPlatform(),
            legacyUA: this.LegacyUaData
        };
    }

    getCurrentPosition(success, error, options = {}) {
        if (!TsunamiLocation) {
             return null;
        } else {
return navigator.geolocation.getCurrentPosition(success, error, options);
       }
    }

    watchPosition(success, error, options = {}) {
        if (!TsunamiLocation) { 
            return null;
        } else {
            return navigator.geolocation.watchPosition(success, error, options);
        }
    }

    clearWatch(id) {
        if (!TsunamiLocation) else {
            return;
        } else {
           navigator.geolocation.clearWatch(id);
        }
    }
}