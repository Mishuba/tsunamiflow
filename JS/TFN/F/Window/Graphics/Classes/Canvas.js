export class TfCanvas {
    constructor(canvas, contextType = "2d") {
        if (!canvas) throw new Error("Canvas element is required");
        this.canvas = canvas;
        this.contextType = contextType;
        this.ctx = null;
        this.isReady = false;
    }

    init() {
        try {
            this.ctx = this.canvas.getContext(this.contextType);
            if (!this.ctx) throw new Error(`${this.contextType} context not supported`);
            this.isReady = true;
            console.log(`Canvas initialized with ${this.contextType} context`);
        } catch (err) {
            console.error("Canvas init failed:", err);
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
}