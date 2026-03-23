export class na extend Tsu {
    TsunamiLocation = !!navigator.geolocation;

constructor(options = {}) {
      super(options);
      
    }

    getCurrentPosition(success, error, options = {}) {
        if (!this.supported) return null;
        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    watchPosition(success, error, options = {}) {
        if (!this.supported) return null;
        return navigator.geolocation.watchPosition(success, error, options);
    }

    clearWatch(id) {
        if (!this.supported) return;
        navigator.geolocation.clearWatch(id);
    }
}