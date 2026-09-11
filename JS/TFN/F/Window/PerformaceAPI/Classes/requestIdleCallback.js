export class TfRequestIdle {
    constructor() {
        this.callbacks = [];
        this.idleCallbackSupported = 'requestIdleCallback' in window;
    }

    request(callback, options = {}) {
        if (this.idleCallbackSupported) {
            return requestIdleCallback(callback, options);
        } else {
            // Fallback: run after 50ms if idle callback not supported
            const start = Date.now();
            return setTimeout(() => {
                callback({
                    didTimeout: false,
                    timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
                });
            }, 1);
        }
    }

    cancel(id) {
        if (this.idleCallbackSupported) cancelIdleCallback(id);
        else clearTimeout(id);
    }
}