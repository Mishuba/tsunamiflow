// AdvanceTsunami.js

import { TfComputePressure } from "./TfComputePressure.js";
import { TfVideoEncoder } from "./TfVideoEncoder.js";
import { TfWebNN } from "./TfWebNN.js";
import { TfML } from "./TfML.js";

export class AdvanceTsunami {
    constructor() {

        // CPU / system pressure monitoring
        this.computePressure = new TfComputePressure();

        // Hardware accelerated video encoding
        this.videoEncoder = new TfVideoEncoder();

        // Native neural network acceleration
        this.webnn = new TfWebNN();

        // TensorFlow.js machine learning
        this.ml = new TfML();

        this.ready = {
            computePressure: this.computePressure.supported,
            videoEncoder: this.videoEncoder.supported,
            webnn: this.webnn.supported,
            ml: this.ml.supported
        };
    }

    /* ----------------------------
       Compute Pressure
    -----------------------------*/

    async monitorCompute(targets = ["cpu"]) {
        if (!this.computePressure.supported) return;
        await this.computePressure.monitor(targets);
    }

    onComputeUpdate(callback) {
        this.computePressure.on("update", callback);
    }

    stopComputeMonitor() {
        this.computePressure.disconnect();
    }

    /* ----------------------------
       Video Encoding
    -----------------------------*/

    initVideoEncoder(config) {
        this.videoEncoder.init(config);
    }

    encodeFrame(frame) {
        this.videoEncoder.encode(frame);
    }

    flushEncoder() {
        return this.videoEncoder.flush();
    }

    closeEncoder() {
        this.videoEncoder.close();
    }

    /* ----------------------------
       WebNN
    -----------------------------*/

    async initWebNN() {
        await this.webnn.init();
    }

    async compileModel(model) {
        return await this.webnn.compile(model);
    }

    async runModel(model, inputs) {
        return await this.webnn.run(model, inputs);
    }

    /* ----------------------------
       Machine Learning
    -----------------------------*/

    createMLModel(type, layers) {
        this.ml.createModel(type, layers);
    }

    async trainModel(xs, ys, epochs = 10, batchSize = 32) {
        await this.ml.train(xs, ys, epochs, batchSize);
    }

    async predict(input) {
        return await this.ml.predict(input);
    }

    /* ----------------------------
       System Status
    -----------------------------*/

    getCapabilities() {
        return this.ready;
    }
}