import { TsunamiFlowImage } from "./Adult/Image.js";

export class TsunamiFlowImageEngine extends TsunamiFlowImage {
  _imageBound = false;
  _processing = false;
  
  width = 0;
  height = 0;
  
  imageState = "idle"; // idle | loading | ready | processing
  
  filters = [];
  transform = {
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    translateX: 0,
    translateY: 0
  };
  
  constructor(options = {}) {
    super(options);
    
    this.imageElement.loading = "eager";
    this.imageElement.decoding = "async";
  }
  
  /* -----------------------------
     LOAD + LIFECYCLE
  ------------------------------*/
  async load(src) {
    this.imageState = "loading";
    this.emit("loadstart");
    
    await this.loadImage(src);
    
    this.width = this.imageElement.naturalWidth;
    this.height = this.imageElement.naturalHeight;
    
    this.emit("loadedmetadata", {
      width: this.width,
      height: this.height
    });
    
    await this.createBitmap();
    
    this.emit("decoded", this.bitmap);
    
    this.draw();
    
    this.imageState = "ready";
    this.emit("ready", this.imageElement);
  }
  
  /* -----------------------------
     DRAW PIPELINE
  ------------------------------*/
  draw() {
    if (!this.canvasctx || !this.imageElement) return;
    
    this._processing = true;
    
    this.resizeCanvas(this.width, this.height);
    this.clearCanvas();
    
    this.canvasctx.save();
    
    // APPLY TRANSFORMS
    this.canvasctx.translate(
      this.transform.translateX,
      this.transform.translateY
    );
    
    this.canvasctx.scale(
      this.transform.scaleX,
      this.transform.scaleY
    );
    
    if (this.transform.rotate !== 0) {
      this.canvasctx.rotate(
        (this.transform.rotate * Math.PI) / 180
      );
    }
    
    // DRAW BASE
    this.canvasctx.drawImage(this.imageElement, 0, 0);
    
    this.canvasctx.restore();
    
    // APPLY FILTER PIPELINE
    this.applyFilters();
    
    this._processing = false;
    
    this.emit("render");
  }
  
  /* -----------------------------
     FILTER PIPELINE
  ------------------------------*/
  addFilter(fn) {
    this.filters.push(fn);
    return this;
  }
  
  clearFilters() {
    this.filters = [];
  }
  
  applyFilters() {
    if (!this.filters.length) return;
    
    let img = this.getPixels();
    if (!img) return;
    
    for (const filter of this.filters) {
      img = filter(img) || img;
    }
    
    this.setPixels(img);
  }
  
  /* -----------------------------
     BUILT-IN FILTERS
  ------------------------------*/
  useGrayscale() {
    return this.addFilter((img) => {
      for (let i = 0; i < img.data.length; i += 4) {
        const avg =
          (img.data[i] +
            img.data[i + 1] +
            img.data[i + 2]) / 3;
        
        img.data[i] = avg;
        img.data[i + 1] = avg;
        img.data[i + 2] = avg;
      }
      return img;
    });
  }
  
  useInvert() {
    return this.addFilter((img) => {
      for (let i = 0; i < img.data.length; i += 4) {
        img.data[i] = 255 - img.data[i];
        img.data[i + 1] = 255 - img.data[i + 1];
        img.data[i + 2] = 255 - img.data[i + 2];
      }
      return img;
    });
  }
  
  /* -----------------------------
     TRANSFORMS
  ------------------------------*/
  scale(x = 1, y = 1) {
    this.transform.scaleX = x;
    this.transform.scaleY = y;
    this.draw();
  }
  
  rotate(deg = 0) {
    this.transform.rotate = deg;
    this.draw();
  }
  
  translate(x = 0, y = 0) {
    this.transform.translateX = x;
    this.transform.translateY = y;
    this.draw();
  }
  
  resetTransform() {
    this.transform = {
      scaleX: 1,
      scaleY: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0
    };
    this.draw();
  }
  
  /* -----------------------------
     FRAME LOOP (FOR GAMES / FX)
  ------------------------------*/
  startRenderLoop() {
    if (this._loopRunning) return;
    
    this._loopRunning = true;
    
    const loop = () => {
      if (!this._loopRunning) return;
      
      this.draw();
      
      this.emit("frame");
      
      requestAnimationFrame(loop);
    };
    
    loop();
  }
  
  stopRenderLoop() {
    this._loopRunning = false;
  }
  
  /* -----------------------------
     EVENTS (LIKE AUDIO)
  ------------------------------*/
  ImageEventListeners() {
    if (this._imageBound) return;
    this._imageBound = true;
    
    const el = this.imageElement;
    
    el.addEventListener("load", () => {
      this.emit("load");
    });
    
    el.addEventListener("error", (e) => {
      this.emit("error", e);
    });
    
    el.addEventListener("abort", () => {
      this.emit("abort");
    });
  }
  
  /* -----------------------------
     STREAM / VIDEO BRIDGE
  ------------------------------*/
  drawVideoFrame(videoElement) {
    if (!videoElement || !this.canvasctx) return;
    
    this.resizeCanvas(
      videoElement.videoWidth,
      videoElement.videoHeight
    );
    
    this.canvasctx.drawImage(videoElement, 0, 0);
    
    this.emit("frameFromVideo");
  }
  
  /* -----------------------------
     EXPORT SYSTEM
  ------------------------------*/
  async exportImage(type = "image/png") {
    const blob = await this.toBlob(type);
    
    this.emit("export", blob);
    
    return blob;
  }
  
  download(filename = "image.png") {
    this.exportImage().then((blob) => {
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      
      URL.revokeObjectURL(url);
    });
  }
  
  /* -----------------------------
     CLEANUP
  ------------------------------*/
  destroyEngine() {
    this.stopRenderLoop();
    this.clearFilters();
    this.destroy();
    
    this.imageState = "idle";
    
    this.emit("destroyed");
  }
}