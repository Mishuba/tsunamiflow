export class Flow extends Tsunami {
  canvas = null;
  contextTypecanvas = "2d";
  canvasctx = null;
  iscanvasReady = false;
  offscreencanvas = new OffscreenCanvas(width, height);
  offscreenctx = null;
  isoffscreenReady = false;
  constructor(options = {}) {
    super(options);
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