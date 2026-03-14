export class TfPerformanceObserver {
    constructor(callback) {
        if (!window.PerformanceObserver) {
            console.warn("PerformanceObserver API not supported");
            this.supported = false;
            return;
        }
        this.supported = true;
        this.callback = callback || function() {};
        this.observer = null;
    }

    observe(entryTypes = ["mark", "measure", "resource"]) {
        if (!this.supported) return;
        try {
            this.observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => this.callback(entry));
            });
            this.observer.observe({ entryTypes });
        } catch (err) {
            console.error("PerformanceObserver observe failed:", err);
        }
    }

    disconnect() {
        if (!this.observer) return;
        this.observer.disconnect();
    }
}