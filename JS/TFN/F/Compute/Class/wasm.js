export class TfWasm {
    constructor() {
        this.instance = null;
        this.module = null;
        this.memory = null;
        this.exports = null;
this.wasmReady = false;
        this.memory = null;
        this.processPtr = null;

        this.port.onmessage = async (e) => {
            if (e.data.type === "init_wasm") {
                const { wasmBinary } = e.data;

                const wasm = await WebAssembly.instantiate(wasmBinary, {});
                this.exports = wasm.instance.exports;

                this.memory = this.exports.memory;
                this.processPtr = this.exports.process;

                this.wasmReady = true;
            }
        };
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
process(inputs, outputs) {
        const input = inputs[0];
        const output = outputs[0];

        if (!input.length) return true;

        for (let ch = 0; ch < input.length; ch++) {
            const inputChannel = input[ch];
            const outputChannel = output[ch];

            if (this.wasmReady) {
                // Allocate memory in WASM
                const ptr = this.exports.alloc(inputChannel.length);

                const mem = new Float32Array(this.memory.buffer, ptr, inputChannel.length);
                mem.set(inputChannel);

                // 🔥 PROCESS IN WASM
                this.processPtr(ptr, inputChannel.length);

                outputChannel.set(mem);

                this.exports.free(ptr);
            } else {
                // fallback (pass-through)
                outputChannel.set(inputChannel);
            }
        }

        return true;
    }
}