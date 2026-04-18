import { TsDomCanvas } from "../Teen/T.js";

export class TsunamiFlowImage extends TsDomCanvas {
  imageElement = null;
  bitmap = null; // ImageBitmap (fast decode)
  imageData = null; // Canvas pixel data
  objectURL = null;

  decoderSupported = "ImageDecoder" in window;
  ImageDecoderInstance = null;

  onReady = null;

  constructor(options = {}) {
    super(options);

    // ===== IMAGE ELEMENT =====
    if (options.imageElement) {
      this.imageElement = options.imageElement;
    } else if (this.find("TsunamiFlowImage", true)) {
      this.imageElement = this.find("TsunamiFlowImage", true);
    } else {
      this.imageElement = document.createElement("img");
    }

    this.imageElement.crossOrigin = "anonymous";

    // ===== CANVAS =====
    if (options.canvas) {
      this.canvas = options.canvas;
    } else if (!this.canvas) {
      this.canvas = document.createElement("canvas");
    }

    this.initCanvas();
  }

  /* ----------------------------
     LOAD IMAGE (URL / BLOB / BUFFER)
  -----------------------------*/
  async loadImage(input) {
    try {
      let blob;

      if (typeof input === "string") {
        // URL
        const res = await fetch(input);
        blob = await res.blob();
      } else if (input instanceof Blob) {
        blob = input;
      } else if (input instanceof ArrayBuffer) {
        blob = new Blob([input]);
      } else {
        throw new Error("Unsupported image input");
      }

      // Clean previous URL
      if (this.objectURL) URL.revokeObjectURL(this.objectURL);

      this.objectURL = URL.createObjectURL(blob);
      this.imageElement.src = this.objectURL;

      await this.imageElement.decode();

      this.emit("loaded", this.imageElement);

      if (this.onReady) this.onReady(this.imageElement);

      return this.imageElement;
    } catch (err) {
      console.error("Image load failed:", err);
      this.emit("error", err);
    }
  }

  /* ----------------------------
     FAST DECODE (ImageBitmap)
  -----------------------------*/
  async createBitmap() {
    if (!this.imageElement) return;

    this.bitmap = await createImageBitmap(this.imageElement);

    this.emit("bitmap", this.bitmap);

    return this.bitmap;
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

  /* ----------------------------
     EXPORT
  -----------------------------*/
  toBlob(type = "image/png", quality = 0.92) {
    return new Promise((resolve) => {
      this.canvas.toBlob(resolve, type, quality);
    });
  }

  toDataURL(type = "image/png", quality = 0.92) {
    return this.canvas.toDataURL(type, quality);
  }

  /* ----------------------------
     IMAGE DECODER (ADVANCED)
  -----------------------------*/
  async decodeWithWebCodecs(blob) {
    if (!this.decoderSupported) {
      console.warn("ImageDecoder not supported");
      return;
    }

    this.ImageDecoderInstance = new ImageDecoder({
      data: blob,
      type: blob.type
    });

    const { image } = await this.ImageDecoderInstance.decode();

    this.bitmap = image;

    this.emit("decoded", image);

    return image;
  }

  /* ----------------------------
     ATTACH TO DOM
  -----------------------------*/
  attachTo(element) {
    if (!this.imageElement) return;

    if (element instanceof HTMLImageElement) {
      element.src = this.imageElement.src;
    } else {
      element.appendChild(this.imageElement);
    }
  }

  /* ----------------------------
     CLEANUP
  -----------------------------*/
  destroy() {
    if (this.objectURL) {
      URL.revokeObjectURL(this.objectURL);
      this.objectURL = null;
    }

    this.bitmap = null;
    this.imageData = null;

    this.emit("destroyed");
  }
}
