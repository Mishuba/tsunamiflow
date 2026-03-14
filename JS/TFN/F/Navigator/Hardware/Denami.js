// TfHardware.js

import { TfUserAgentData } from "./TfUserAgentData.js";
import { TfBattery } from "./TfBattery.js";
import { TfBluetooth } from "./TfBluetooth.js";
import { TfGeolocation } from "./TfGeolocation.js";
import { TfHID } from "./TfHID.js";
import { TfSerial } from "./TfSerial.js";
import { TfUSB } from "./TfUSB.js";
import { TfVibration } from "./TfVibration.js";

export class TfHardware {
    constructor() {

        // Device / platform identity
        this.userAgent = new TfUserAgentData();

        // Power
        this.battery = new TfBattery();

        // Wireless / proximity hardware
        this.bluetooth = new TfBluetooth();

        // Location hardware
        this.geolocation = new TfGeolocation();

        // Human interface devices
        this.hid = new TfHID();

        // Serial ports
        this.serial = new TfSerial();

        // USB devices
        this.usb = new TfUSB();

        // Haptic feedback
        this.vibration = new TfVibration();

        this.ready = {
            userAgent: this.userAgent.isSupported(),
            battery: this.battery.supported,
            bluetooth: this.bluetooth.supported,
            geolocation: this.geolocation.supported,
            hid: this.hid.supported,
            serial: this.serial.supported,
            usb: this.usb.supported,
            vibration: this.vibration.supported
        };
    }

    getCapabilities() {
        return this.ready;
    }

    async getDeviceProfile() {
        const uaInfo = this.userAgent.getFullInfo();
        const highEntropy = await this.userAgent.getHighEntropyValues();

        const batteryLevel = await this.battery.getLevel();
        const charging = await this.battery.isCharging();

        return {
            userAgent: uaInfo,
            hardwareHints: highEntropy,
            battery: {
                level: batteryLevel,
                charging: charging
            },
            capabilities: this.ready
        };
    }

    isReady() {
        return this.ready;
    }
}