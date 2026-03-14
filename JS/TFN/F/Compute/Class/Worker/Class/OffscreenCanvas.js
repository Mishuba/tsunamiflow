export class TfOffscreenCanvas {
    constructor(width = 300, height = 150, contextType = "2d") {
        if (!("OffscreenCanvas" in window)) {
            console.warn("OffscreenCanvas not supported");
            this.canvas = null;
            this.ctx = null;
            this.isReady = false;
            return;
        }

        this.canvas = new OffscreenCanvas(width, height);
        this.contextType = contextType;
        this.ctx = null;
        this.isReady = false;
    }

    init() {
        if (!this.canvas) return;

        try {
            this.ctx = this.canvas.getContext(this.contextType);
            if (!this.ctx) throw new Error(`${this.contextType} context not supported`);
            this.isReady = true;
            console.log(`OffscreenCanvas initialized with ${this.contextType} context`);
        } catch (err) {
            console.error("OffscreenCanvas init failed:", err);
            this.ctx = null;
        }
    }

    resize(width, height) {
        if (!this.isReady) return;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    clear(color = "#000000") {
        if (!this.isReady) return;
        if (this.contextType === "2d") {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            console.warn("Clear method not implemented for non-2d context");
        }
    }

    getContext() {
        return this.ctx;
    }

    transferToImageBitmap() {
        if (!this.isReady) return null;
        return this.canvas.transferToImageBitmap();
    }
}