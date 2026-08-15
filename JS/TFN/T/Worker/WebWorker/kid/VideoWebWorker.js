
let backgroundVideo;
let Tfhex;
let rgb;
let chromaKeyColorWebcam = { r: 0, g: 255, b: 0 };
let frameSkipCount = 2;
let frameCounter = 0;

/*
let renderFrame =
    typeof self.requestAnimationFrame === "function"
        ? self.requestAnimationFrame.bind(self)
        : (callback) => setTimeout(callback, 16);

let cancelFrame =
    typeof self.cancelAnimationFrame === "function"
        ? self.cancelAnimationFrame.bind(self)
        : clearTimeout.bind(self);
function UseVideo(w, h) {
    this.initOffscreen();
    if (this.backgroundVideo) this.offscreenctx.drawImage(this.backgroundVideo, 0, 0, w, h);
}
function webcam(frameData) {
    this.frameCounter++;
    if (this.frameCounter % this.frameSkipCount !== 0) {
        return frameData;
    }

    const chromaData = frameData.data;
    const key = this.chromaKeyColorWebcam;

    for (let i = 0; i < chromaData.length; i += 4) {
        const r = chromaData[i];
        const g = chromaData[i + 1];
        const b = chromaData[i + 2];

        const diff =
            Math.abs(r - key.r) +
            Math.abs(g - key.g) +
            Math.abs(b - key.b);

        if (diff < 120) {
            chromaData[i + 3] = 0; // true transparency
        }
    }

    return frameData;
}
async function drawingFrame(vidCanv, TfWebcam) {
    this.initOffscreen();
    this.resizeoffscreen(vidCanv.width, vidCanv.height);

    this.offscreenctx.clearRect(0, 0, vidCanv.width, vidCanv.height);

    // Draw background
    if (this.backgroundVideo) {
        this.UseVideo(vidCanv.width, vidCanv.height);
        if (this.backgroundImg) this.UseImage(vidCanv, true); // corner logo
    } else if (this.backgroundImg) {
        this.UseImage(vidCanv, true);
    }

    // Draw to offscreen for chroma key
    this.offscreenctx.drawImage(TfWebcam, 0, 0, vidCanv.width, vidCanv.height);

    if (this.useChromaKey) {
        const frame = this.offscreenctx.getImageData(0, 0, vidCanv.width, vidCanv.height);
        const processed = this.webcam(frame);
        this.offscreenctx.putImageData(processed, 0, 0);
    }

    // Composite webcam over background
    return this.offscreenctx;
}

function setChromaHex(hex) {
    this.rgb = parseInt(hex.slice(1), 16);
    this.chromaKeyColorWebcam.r = (this.rgb >> 16) & 255;
    this.chromaKeyColorWebcam.g = (this.rgb >> 8) & 255;
    this.chromaKeyColorWebcam.b = this.rgb & 255;
}

function ColorPickerChromaKey(chroma) {
    this.Tfhex = chroma.value;
    this.setChromaHex(this.Tfhex);
    this.useChromaKey = true;
}

function disableChromaKey() {
    this.frameCounter = 0;
    this.useChromaKey = false;
}
*/