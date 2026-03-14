// TsunamiNavigator.js

import { TfHardware } from "./TfHardware.js";
import { AdvanceTsunami } from "./AdvanceTsunami.js";

export class TsunamiNavigator {

    constructor() {

        /* ----------------------------
           Core Hardware APIs
        -----------------------------*/
        this.hardware = new TfHardware();

        /* ----------------------------
           Advanced Compute / AI
        -----------------------------*/
        this.advanced = new AdvanceTsunami();

        /* ----------------------------
           Unified capability map
        -----------------------------*/
        this.capabilities = {
            ...this.hardware.getCapabilities(),
            ...this.advanced.getCapabilities()
        };
    }

    /* ============================
       DEVICE PROFILE
    ============================ */

    async getDeviceProfile() {
        const hardwareProfile = await this.hardware.getDeviceProfile();

        return {
            ...hardwareProfile,
            advanced: this.advanced.getCapabilities()
        };
    }

    /* ============================
       COMPUTE PRESSURE
    ============================ */

    async monitorCPU(targets = ["cpu"]) {
        await this.advanced.monitorCompute(targets);
    }

    onCPUUpdate(callback) {
        this.advanced.onComputeUpdate(callback);
    }

    stopCPUMonitor() {
        this.advanced.stopComputeMonitor();
    }

    /* ============================
       VIDEO ENCODING
    ============================ */

    initVideoEncoder(config) {
        this.advanced.initVideoEncoder(config);
    }

    encodeFrame(frame) {
        this.advanced.encodeFrame(frame);
    }

    flushEncoder() {
        return this.advanced.flushEncoder();
    }

    closeEncoder() {
        this.advanced.closeEncoder();
    }

    /* ============================
       WEBNN
    ============================ */

    async initAI() {
        await this.advanced.initWebNN();
    }

    async compileAIModel(model) {
        return await this.advanced.compileModel(model);
    }

    async runAIModel(model, inputs) {
        return await this.advanced.runModel(model, inputs);
    }

    /* ============================
       MACHINE LEARNING
    ============================ */

    createMLModel(type, layers) {
        this.advanced.createMLModel(type, layers);
    }

    async trainML(xs, ys, epochs = 10, batchSize = 32) {
        await this.advanced.trainModel(xs, ys, epochs, batchSize);
    }

    async predictML(input) {
        return await this.advanced.predict(input);
    }

    /* ============================
       SYSTEM STATUS
    ============================ */

    getCapabilities() {
        return this.capabilities;
    }

    isSupported(api) {
        return !!this.capabilities[api];
    }

}