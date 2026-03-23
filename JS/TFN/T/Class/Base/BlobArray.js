export class TsuNa extends Tsu {
    blob = null;
    blobtype = "application/octet-stream"; // default MIME type
    blobonReady = null;
    blobobjectURL = null;
    Arraybuffer = buffer;       // The actual ArrayBuffer
    ArraybyteLength = byteLength; // Length of the buffer in bytes
    Arrayview = null;           // Optional DataView for manipulation
    ArrayonReady = onReady;
    constructor(options = {}) {
        super(options);
        // Callback when buffer is loaded
    }

    // Load an existing ArrayBuffer or TypedArray
    async load(input) {
        try {
            if (input instanceof ArrayBuffer) {
                this.Arraybuffer = input;
            } else if (ArrayBuffer.isView(input)) { // TypedArray or DataView
                this.Arraybuffer = input.buffer;
            } else {
                throw new Error("Input must be an ArrayBuffer or TypedArray");
            }

            this.ArraybyteLength = this.Arraybuffer.byteLength;
            this.Arrayview = new DataView(this.Arraybuffer);

            if (this.ArrayonReady) this.ArrayonReady(this.Arraybuffer);
            return this.Arraybuffer;
        } catch (err) {
            console.error("TfArrayBuffer load failed:", err);
            throw err;
        }
    }

    // Get a slice of the buffer
    slice(start = 0, end = this.ArraybyteLength) {
        if (!this.Arraybuffer) throw new Error("Buffer not loaded");
        return this.Arraybuffer.slice(start, end);
    }

    // Convert to a Blob
    toBlob(type = "application/octet-stream") {
        if (!this.Arraybuffer) throw new Error("Buffer not loaded");
        return new Blob([this.Arraybuffer], { type });
    }

    // Replace buffer with a new one
    replace(newBuffer) {
        if (!newBuffer) return;

        if (!(newBuffer instanceof ArrayBuffer)) {
            throw new Error("Replacement must be an ArrayBuffer");
        }

        this.Arraybuffer = newBuffer;
        this.ArraybyteLength = newBuffer.byteLength;
        this.Arrayview = new DataView(this.buffer);
    }

    // Convert info to JSON
    toJson() {
        return {
            bufferExists: !!this.Arraybuffer,
            byteLength: this.ArraybyteLength
        };
    }

    // Clear buffer from memory
    clear() {
        this.Arraybuffer = null;
        this.ArraybyteLength = 0;
        this.Arrayview = null;
    }
    // Load blob from an existing Blob or ArrayBuffer
    async loadblob(blobOrBuffer) {
        try {
            if (blobOrBuffer instanceof Blob) {
                this.blob = blobOrBuffer;
            } else if (blobOrBuffer instanceof ArrayBuffer) {
                this.blob = new Blob([blobOrBuffer], { type: this.blobtype });
            } else {
                throw new Error("Input must be a Blob or ArrayBuffer");
            }

            this.blobobjectURL = URL.createObjectURL(this.blob);

            if (this.blobonReady) this.blobonReady(this.blob);
            return this.blob;
        } catch (err) {
            console.error("TfBlob load failed:", err);
            throw err;
        }
    }

    // Attach blob to an element (audio, video, img)
    attachblob(element) {
        if (!this.blob) throw new Error("Blob not loaded");

        if (element.tagName === "AUDIO" || element.tagName === "VIDEO" || element.tagName === "IMG") {
            if (element.src !== this.blobobjectURL) {
                element.src = this.blobobjectURL;
            }
            if (element.tagName !== "IMG" && element.paused) {
                element.play().catch(() => { });
            }
        } else {
            console.warn("Element is not audio, video, or img. Cannot attach blob.");
        }
    }

    // Replace existing blob with a new one
    replaceblob(newBlob, newType = null) {
        if (!newBlob) return;

        // Revoke previous object URL
        if (this.blobobjectURL) URL.revokeObjectURL(this.blobobjectURL);

        this.blob = newBlob;
        if (newType) this.blobtype = newType;

        this.blobobjectURL = URL.createObjectURL(this.blob);
    }

    // Convert blob info to JSON
    blobtoJson() {
        return {
            blobExists: !!this.blob,
            type: this.blobtype,
            size: this.blob ? this.blob.size : 0,
            objectURL: this.blobobjectURL
        };
    }

    // Release memory
    revokeblob() {
        if (this.blobobjectURL) {
            URL.revokeObjectURL(this.blobobjectURL);
            this.blobobjectURL = null;
        }
        this.blob = null;
    }
}