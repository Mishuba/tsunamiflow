import { TsunamiFlowSight } from "./Teen/Sight.js";

export class TsunamiFlowImage extends TsunamiFlowSight {
  constructor(options = {}) {
    super(options);
  }
  /* ----------------------------
     DRAW TO CANVAS
  -----------------------------*/
  drawToCanvas() {
    if (!this.canvasctx || !this.imageElement) return;

    this.resizeCanvas(
      this.imageElement.naturalWidth,
      this.imageElement.naturalHeight
    );

    this.canvasctx.drawImage(this.imageElement, 0, 0);

    this.emit("drawn");
  }

  /* ----------------------------
     GET PIXELS
  -----------------------------*/
  getPixels() {
    if (!this.canvasctx) return;

    this.imageData = this.canvasctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    return this.imageData;
  }

  /* ----------------------------
     MODIFY PIXELS
  -----------------------------*/
  setPixels(imageData) {
    if (!this.canvasctx) return;

    this.canvasctx.putImageData(imageData, 0, 0);
    this.emit("pixelsUpdated");
  }

  /* ----------------------------
     BASIC FILTERS
  -----------------------------*/
  grayscale() {
    const img = this.getPixels();
    if (!img) return;

    for (let i = 0; i < img.data.length; i += 4) {
      const avg =
        (img.data[i] +
          img.data[i + 1] +
          img.data[i + 2]) / 3;

      img.data[i] = avg;
      img.data[i + 1] = avg;
      img.data[i + 2] = avg;
    }

    this.setPixels(img);
  }

  invert() {
    const img = this.getPixels();
    if (!img) return;

    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = 255 - img.data[i];
      img.data[i + 1] = 255 - img.data[i + 1];
      img.data[i + 2] = 255 - img.data[i + 2];
    }

    this.setPixels(img);
  }
}
