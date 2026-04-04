class TfSoundsProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

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

registerProcessor("TfSoundsProcessor", TfSoundsProcessor);