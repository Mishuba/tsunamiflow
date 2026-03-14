export class TfComputeEngine {
    constructor({ atomicsSize = 1024, sharedBufferSize = 1024 } = {}) {
        // Initialize Atomics API
        this.atomics = window.TfAtomics ? new TfAtomics() : null;
        if (this.atomics) this.atomics.create(atomicsSize);

        // Initialize SharedArrayBuffer API
        this.sharedBuffer = window.TfSharedArrayBuffer ? new TfSharedArrayBuffer(sharedBufferSize) : null;

        // Initialize WASM API
        this.wasm = window.TfWasm ? new TfWasm() : null;

        this.ready = {
            atomics: !!this.atomics && this.atomics.supported,
            sharedBuffer: !!this.sharedBuffer,
            wasm: !!this.wasm
        };
    }

    // ===== Atomics API =====
    atomicsLoad(index = 0) {
        return this.atomics ? this.atomics.load(index) : null;
    }

    atomicsStore(index = 0, value = 0) {
        if (this.atomics) this.atomics.store(index, value);
    }

    atomicsAdd(index = 0, value = 0) {
        return this.atomics ? this.atomics.add(index, value) : null;
    }

    atomicsSub(index = 0, value = 0) {
        return this.atomics ? this.atomics.sub(index, value) : null;
    }

    atomicsWait(index = 0, value = 0, timeout = Infinity) {
        return this.atomics ? this.atomics.wait(index, value, timeout) : null;
    }

    atomicsNotify(index = 0, count = 1) {
        return this.atomics ? this.atomics.notify(index, count) : null;
    }

    // ===== SharedArrayBuffer API =====
    sharedWrite(index = 0, value = 0) {
        if (this.sharedBuffer) this.sharedBuffer.write(index, value);
    }

    sharedRead(index = 0) {
        return this.sharedBuffer ? this.sharedBuffer.read(index) : null;
    }

    sharedFill(value = 0) {
        if (this.sharedBuffer) this.sharedBuffer.fill(value);
    }

    sharedSlice(start = 0, end = null) {
        if (!this.sharedBuffer) return null;
        return this.sharedBuffer.slice(start, end || this.sharedBuffer.view.length);
    }

    getSharedBuffer() {
        return this.sharedBuffer ? this.sharedBuffer.getBuffer() : null;
    }

    // ===== WASM API =====
    async wasmCompile(bufferSource) {
        if (!this.wasm) return;
        await this.wasm.compile(bufferSource);
    }

    async wasmInstantiate(imports = {}) {
        if (!this.wasm) return;
        await this.wasm.instantiate(imports);
    }

    wasmCall(funcName, ...args) {
        return this.wasm ? this.wasm.call(funcName, ...args) : null;
    }

    getWasmMemory() {
        return this.wasm ? this.wasm.getMemory() : null;
    }

    // ===== Utility =====
    isReady() {
        return this.ready;
    }
}