// TsunamiWindow.js
import { TfGraphics } from './TfGraphics.js';
import { TsunamiFlowClubPerformance } from './TsunamiFlowClubPerformance.js';

export class TsunamiWindow {
    /**
     * @param {HTMLCanvasElement} canvas - The canvas element to use for rendering
     * @param {object} performanceOptions - Options for TsunamiFlowClubPerformance ({ observerCallback })
     */
    constructor(canvas, performanceOptions = {}) {
        if (!canvas) throw new Error("Canvas element is required");

        // Initialize graphics manager
        this.graphics = new TfGraphics(canvas);

        // Initialize performance manager
        this.performance = new TsunamiFlowClubPerformance(performanceOptions);

        this.ready = {
            graphics: true,
            performance: this.performance.isReady()
        };
    }

    // ===== Graphics API =====
    async initGraphics(backend) {
        const engine = await this.graphics.init(backend);
        return engine;
    }

    async initBestGraphics() {
        const engine = await this.graphics.initBest();
        return engine;
    }

    getActiveGraphics() {
        return this.graphics.getActiveBackend();
    }

    getGraphicsBackend(backend) {
        return this.graphics.getBackend(backend);
    }

    // ===== Performance API =====
    perfNow() {
        return this.performance.now();
    }

    perfMark(name) {
        this.performance.mark(name);
    }

    perfMeasure(name, startMark, endMark) {
        return this.performance.measure(name, startMark, endMark);
    }

    perfEntries() {
        return this.performance.getEntries();
    }

    clearPerfMarks(name) {
        this.performance.clearMarks(name);
    }

    clearPerfMeasures(name) {
        this.performance.clearMeasures(name);
    }

    observePerf(entryTypes = ["mark", "measure", "resource"]) {
        this.performance.observe(entryTypes);
    }

    disconnectPerfObserver() {
        this.performance.disconnectObserver();
    }

    requestIdle(callback, options = {}) {
        return this.performance.requestIdle(callback, options);
    }

    cancelIdle(id) {
        this.performance.cancelIdle(id);
    }

    isReady() {
        return this.ready;
    }
}