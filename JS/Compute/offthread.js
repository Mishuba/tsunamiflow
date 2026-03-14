export class TfOffThreadCompute {
    constructor({
        atomicsSize = 1024,
        sharedBufferSize = 1024,
        webWorkerScript = null,
        serviceWorkerScript = null,
        sharedWorkerScript = null
    } = {}) {
        // Import your existing classes
        this.compute = window.TfComputeEngine ? new TfComputeEngine({ atomicsSize, sharedBufferSize }) : null;
        this.workers = window.TfWorkerManager ? new TfWorkerManager({ webWorkerScript, serviceWorkerScript, sharedWorkerScript }) : null;

        this.listeners = {};

        // Automatically forward worker messages to this class
        if (this.workers) {
            if (this.workers.webWorker) {
                this.workers.startWebWorker();
                this.workers.webWorker.on("message", (data) => this.emit("webWorkerMessage", data));
                this.workers.webWorker.on("error", (err) => this.emit("webWorkerError", err));
            }
            if (this.workers.serviceWorker) {
                this.workers.registerServiceWorker();
                this.workers.serviceWorker.on("message", (data) => this.emit("serviceWorkerMessage", data));
            }
            if (this.workers.sharedWorker) {
                this.workers.startSharedWorker();
                this.workers.sharedWorker.on("message", (data) => this.emit("sharedWorkerMessage", data));
            }
        }
    }

    // ===== Atomics Methods =====
    atomicsLoad(index = 0) {
        return this.compute ? this.compute.atomicsLoad(index) : null;
    }
    atomicsStore(index = 0, value = 0) {
        if (this.compute) this.compute.atomicsStore(index, value);
    }
    atomicsAdd(index = 0, value = 0) {
        return this.compute ? this.compute.atomicsAdd(index, value) : null;
    }
    atomicsSub(index = 0, value = 0) {
        return this.compute ? this.compute.atomicsSub(index, value) : null;
    }
    atomicsWait(index = 0, value = 0, timeout = Infinity) {
        return this.compute ? this.compute.atomicsWait(index, value, timeout) : null;
    }
    atomicsNotify(index = 0, count = 1) {
        return this.compute ? this.compute.atomicsNotify(index, count) : null;
    }

    // ===== SharedArrayBuffer Methods =====
    sharedWrite(index = 0, value = 0) {
        if (this.compute) this.compute.sharedWrite(index, value);
    }
    sharedRead(index = 0) {
        return this.compute ? this.compute.sharedRead(index) : null;
    }
    sharedFill(value = 0) {
        if (this.compute) this.compute.sharedFill(value);
    }
    sharedSlice(start = 0, end = null) {
        return this.compute ? this.compute.sharedSlice(start, end) : null;
    }
    getSharedBuffer() {
        return this.compute ? this.compute.getSharedBuffer() : null;
    }

    // ===== WASM Methods =====
    async wasmCompile(bufferSource) {
        if (this.compute) await this.compute.wasmCompile(bufferSource);
    }
    async wasmInstantiate(imports = {}) {
        if (this.compute) await this.compute.wasmInstantiate(imports);
    }
    wasmCall(funcName, ...args) {
        return this.compute ? this.compute.wasmCall(funcName, ...args) : null;
    }
    getWasmMemory() {
        return this.compute ? this.compute.getWasmMemory() : null;
    }

    // ===== Worker Message Methods =====
    postWebWorker(data) {
        if (this.workers) this.workers.postWebWorker(data);
    }
    postServiceWorker(data) {
        if (this.workers) this.workers.postServiceWorker(data);
    }
    postSharedWorker(data) {
        if (this.workers) this.workers.postSharedWorker(data);
    }

    terminateWebWorker() {
        if (this.workers) this.workers.terminateWebWorker();
    }
    unregisterServiceWorker() {
        if (this.workers) this.workers.unregisterServiceWorker();
    }
    closeSharedWorker() {
        if (this.workers) this.workers.closeSharedWorker();
    }

    // ===== Unified Event Handling =====
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }

    // ===== Utility =====
    isReady() {
        return {
            compute: !!this.compute,
            workers: !!this.workers,
            atomics: this.compute ? this.compute.ready.atomics : false,
            sharedBuffer: this.compute ? this.compute.ready.sharedBuffer : false,
            wasm: this.compute ? this.compute.ready.wasm : false
        };
    }
}