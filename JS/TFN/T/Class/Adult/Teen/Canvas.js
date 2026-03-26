export class Tsu extends Ts {
  canvas = null;
  contextTypecanvas = "2d";
  canvasctx = null;
  iscanvasReady = false;
  constructor(options = {}) {
    super(options);
    if (options.worker) {
      this.worker = options.worker;
    }
  }
  initCanvas() {
    try {
      this.canvasctx = this.canvas.getContext(this.contextTypecanvas);
      if (!this.canvasctx) throw new Error(`${this.contextTypecanvas} context not supported`);
      this.iscanvasReady = true;
      console.log(`Canvas initialized with ${this.contextTypecanvas} context`);
    } catch (err) {
      console.error("Canvas init failed:", err);
      this.canvasctx = null;
    }
  }

  resizeCanvas(width, height) {
    if (!this.iscanvasReady) return;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clearCanvas(color = "#000000") {
    if (!this.iscanvasReady) return;
    if (this.contextTypecanvas === "2d") {
      this.canvasctx.fillStyle = color;
      this.canvasctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      console.warn("Clear method not implemented for non-2d context");
    }
  }

  getCanvasContext() {
    return this.canvasctx;
  }
}