export class TfBattery {
    constructor() {
        this.supported = !!navigator.getBattery;
        this.battery = null;
        if (this.supported) {
            navigator.getBattery().then(bat => this.battery = bat);
        } else {
            console.warn("Battery API not supported");
        }
    }

    async getLevel() {
        if (!this.supported || !this.battery) return null;
        return this.battery.level;
    }

    async isCharging() {
        if (!this.supported || !this.battery) return null;
        return this.battery.charging;
    }

    onChange(event, callback) {
        if (!this.supported || !this.battery) return;
        if (event === "level") this.battery.addEventListener("levelchange", () => callback(this.battery.level));
        if (event === "charging") this.battery.addEventListener("chargingchange", () => callback(this.battery.charging));
    }
}