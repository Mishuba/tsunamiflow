import { TsDomCanvas } from "./Child/Canvas.js";

export class TsunamiFlowSight extends TsDomCanvas {
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

        if (!this.iscanvasReady) this.initCanvas("bitmaprenderer");
    }

    /* ----------------------------
       LOAD IMAGE (URL / BLOB / BUFFER)
    -----------------------------*/
    async loadImage(input) {
        try {
            await this.loadblob(input);
            this.imageElement.src = this.blobobjectURL;

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
