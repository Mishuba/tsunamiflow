export class TfBlob {
    constructor({
        blob = null,
        type = "application/octet-stream", // default MIME type
        onReady = null
    } = {}) {
        this.blob = blob;          // the actual Blob object
        this.type = type;          // MIME type
        this.objectURL = null;     // URL.createObjectURL reference
        this.onReady = onReady;    // callback when blob is ready
    }

    // Load blob from an existing Blob or ArrayBuffer
    async load(blobOrBuffer) {
        try {
            if (blobOrBuffer instanceof Blob) {
                this.blob = blobOrBuffer;
            } else if (blobOrBuffer instanceof ArrayBuffer) {
                this.blob = new Blob([blobOrBuffer], { type: this.type });
            } else {
                throw new Error("Input must be a Blob or ArrayBuffer");
            }

            this.objectURL = URL.createObjectURL(this.blob);

            if (this.onReady) this.onReady(this.blob);
            return this.blob;
        } catch (err) {
            console.error("TfBlob load failed:", err);
            throw err;
        }
    }

    // Attach blob to an element (audio, video, img)
    attach(element) {
        if (!this.blob) throw new Error("Blob not loaded");

        if (element.tagName === "AUDIO" || element.tagName === "VIDEO" || element.tagName === "IMG") {
            if (element.src !== this.objectURL) {
                element.src = this.objectURL;
            }
            if (element.tagName !== "IMG" && element.paused) {
                element.play().catch(() => {});
            }
        } else {
            console.warn("Element is not audio, video, or img. Cannot attach blob.");
        }
    }

    // Replace existing blob with a new one
    replace(newBlob, newType = null) {
        if (!newBlob) return;

        // Revoke previous object URL
        if (this.objectURL) URL.revokeObjectURL(this.objectURL);

        this.blob = newBlob;
        if (newType) this.type = newType;

        this.objectURL = URL.createObjectURL(this.blob);
    }

    // Convert blob info to JSON
    toJson() {
        return {
            blobExists: !!this.blob,
            type: this.type,
            size: this.blob ? this.blob.size : 0,
            objectURL: this.objectURL
        };
    }

    // Release memory
    revoke() {
        if (this.objectURL) {
            URL.revokeObjectURL(this.objectURL);
            this.objectURL = null;
        }
        this.blob = null;
    }
}