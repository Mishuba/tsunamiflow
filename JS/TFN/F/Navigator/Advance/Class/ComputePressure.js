export class TfComputePressure {
    constructor() {
        this.supported = 'computePressure' in navigator;
        this.status = null;
        this.listeners = {};
        if (!this.supported) console.warn("Compute Pressure API not supported");
    }

    async monitor(targets = ['cpu']) {
        if (!this.supported) return;
        try {
            this.pressureObserver = await navigator.computePressure.monitor(
                { sources: targets },
                (status) => {
                    this.status = status;
                    this.emit('update', status);
                }
            );
        } catch (err) {
            console.error("ComputePressure monitor failed:", err);
        }
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }

    disconnect() {
        if (this.pressureObserver) {
            this.pressureObserver.disconnect();
            this.pressureObserver = null;
        }
    }
}