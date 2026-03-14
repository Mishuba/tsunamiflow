export class TfPerformance {
    constructor() {
        if (!window.performance) {
            console.warn("Performance API not supported");
            this.supported = false;
            return;
        }
        this.supported = true;
    }

    now() {
        return this.supported ? performance.now() : null;
    }

    mark(name) {
        if (!this.supported) return;
        performance.mark(name);
    }

    measure(name, startMark = undefined, endMark = undefined) {
        if (!this.supported) return null;
        try {
            performance.measure(name, startMark, endMark);
            return performance.getEntriesByName(name);
        } catch (err) {
            console.error("Performance measure error:", err);
            return null;
        }
    }

    getEntries() {
        return this.supported ? performance.getEntries() : [];
    }

    clearMarks(name) {
        if (!this.supported) return;
        performance.clearMarks(name);
    }

    clearMeasures(name) {
        if (!this.supported) return;
        performance.clearMeasures(name);
    }
}