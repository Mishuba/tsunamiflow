export class TfArrayBuffer {
    constructor({
        buffer = null,
        byteLength = 0,
        onReady = null
    } = {}) {
        this.buffer = buffer;       // The actual ArrayBuffer
        this.byteLength = byteLength; // Length of the buffer in bytes
        this.view = null;           // Optional DataView for manipulation
        this.onReady = onReady;     // Callback when buffer is loaded
    }

    // Load an existing ArrayBuffer or TypedArray
    async load(input) {
        try {
            if (input instanceof ArrayBuffer) {
                this.buffer = input;
            } else if (ArrayBuffer.isView(input)) { // TypedArray or DataView
                this.buffer = input.buffer;
            } else {
                throw new Error("Input must be an ArrayBuffer or TypedArray");
            }

            this.byteLength = this.buffer.byteLength;
            this.view = new DataView(this.buffer);

            if (this.onReady) this.onReady(this.buffer);
            return this.buffer;
        } catch (err) {
            console.error("TfArrayBuffer load failed:", err);
            throw err;
        }
    }

    // Get a slice of the buffer
    slice(start = 0, end = this.byteLength) {
        if (!this.buffer) throw new Error("Buffer not loaded");
        return this.buffer.slice(start, end);
    }

    // Convert to a Blob
    toBlob(type = "application/octet-stream") {
        if (!this.buffer) throw new Error("Buffer not loaded");
        return new Blob([this.buffer], { type });
    }

    // Replace buffer with a new one
    replace(newBuffer) {
        if (!newBuffer) return;

        if (!(newBuffer instanceof ArrayBuffer)) {
            throw new Error("Replacement must be an ArrayBuffer");
        }

        this.buffer = newBuffer;
        this.byteLength = newBuffer.byteLength;
        this.view = new DataView(this.buffer);
    }

    // Convert info to JSON
    toJson() {
        return {
            bufferExists: !!this.buffer,
            byteLength: this.byteLength
        };
    }

    // Clear buffer from memory
    clear() {
        this.buffer = null;
        this.byteLength = 0;
        this.view = null;
    }
}