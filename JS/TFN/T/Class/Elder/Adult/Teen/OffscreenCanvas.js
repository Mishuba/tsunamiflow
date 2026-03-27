export class Flo extends Fl {
    offscreencanvas = new OffscreenCanvas(width, height);
    offscreenctx = null;
    isoffscreenReady = false;
    constructor(options = {}) {
        super(options);
        if (options.worker) {
            this.worker = options.worker;
        }
    }
    initOffscreen() {
        if (!this.offscreencanvas) return;

        try {
            this.offscreenctx = this.offscreencanvas.getContext(this.contextType);
            if (!this.offscreenctx) throw new Error(`${this.contextType} context not supported`);
            this.isoffscreenReady = true;
            console.log(`OffscreenCanvas initialized with ${this.contextType} context`);
        } catch (err) {
            console.error("OffscreenCanvas init failed:", err);
            this.offscreenctx = null;
        }
    }

    resizeoffscreen(width, height) {
        if (!this.isoffscreenReady) return;
        this.offscreencanvas.width = width;
        this.offscreencanvas.height = height;
    }

    clearoffscreen(color = "#000000") {
        if (!this.isoffscreenReady) return;
        if (this.contextType === "2d") {
            this.offscreenctx.fillStyle = color;
            this.offscreenctx.fillRect(0, 0, this.offscreencanvas.width, this.offscreencanvas.height);
        } else {
            console.warn("Clear method not implemented for non-2d context");
        }
    }

    getoffscreenContext() {
        return this.offscreenctx;
    }

    transferoffscreenToImageBitmap() {
        if (!this.isoffscreenReady) return null;
        return this.offscreencanvas.transferToImageBitmap();
    }
}