// TsunamiFlowClubPerformance.js
import { TfPerformance } from './TfPerformance.js';
import { TfPerformanceObserver } from './TfPerformanceObserver.js';
import { TfRequestIdle } from './TfRequestIdle.js';

export class TsunamiFlowClubPerformance {
    constructor({ observerCallback = null } = {}) {
        // Core performance API
        this.performance = new TfPerformance();

        // Observer for performance events
        this.observer = new TfPerformanceObserver(observerCallback);

        // Idle callback scheduler
        this.idle = new TfRequestIdle();

        // Ready state
        this.ready = {
            performance: this.performance.supported,
            observer: this.observer.supported,
            idleCallback: this.idle.idleCallbackSupported
        };
    }

    // ===== Performance API =====
    now() {
        return this.performance.now();
    }

    mark(name) {
        this.performance.mark(name);
    }

    measure(name, startMark = undefined, endMark = undefined) {
        return this.performance.measure(name, startMark, endMark);
    }

    getEntries() {
        return this.performance.getEntries();
    }

    clearMarks(name) {
        this.performance.clearMarks(name);
    }

    clearMeasures(name) {
        this.performance.clearMeasures(name);
    }

    // ===== Performance Observer API =====
    observe(entryTypes = ["mark", "measure", "resource"]) {
        this.observer.observe(entryTypes);
    }

    disconnectObserver() {
        this.observer.disconnect();
    }

    // ===== Idle Callback API =====
    requestIdle(callback, options = {}) {
        return this.idle.request(callback, options);
    }

    cancelIdle(id) {
        this.idle.cancel(id);
    }

    // ===== Utility =====
    isReady() {
        return this.ready;
    }
}