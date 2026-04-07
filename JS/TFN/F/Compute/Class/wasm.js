export class TfWasm {
    constructor() {
        this.instance = null;
        this.module = null;
        this.memory = null;
        this.exports = null;
    }

    async compile(bufferSource) {
        try {
            this.module = await WebAssembly.compile(bufferSource);
            console.log("WASM module compiled");
        } catch (err) {
            console.error("WASM compile failed:", err);
        }
    }

    async instantiate(imports = {}) {
        if (!this.module) return;
        try {
            const result = await WebAssembly.instantiate(this.module, imports);
            this.instance = result.instance;
            this.exports = this.instance.exports;
            if (this.exports.memory) this.memory = this.exports.memory;
            console.log("WASM module instantiated");
        } catch (err) {
            console.error("WASM instantiation failed:", err);
        }
    }

    call(funcName, ...args) {
        if (!this.exports || !this.exports[funcName]) {
            console.warn(`Function ${funcName} does not exist in WASM exports`);
            return;
        }
        return this.exports[funcName](...args);
    }

    getMemory() {
        return this.memory;
    }

}