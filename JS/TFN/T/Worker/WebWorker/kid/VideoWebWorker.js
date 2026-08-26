
class vidWorker {
    useBackground;
    backgroundVideo;
    Tfhex;
    rgb;
    chromaKeyColorWebcam = { r: 0, g: 255, b: 0 };
    frameSkipCount = 2;
    frameCounter = 0;
    constructor(options = {}) {

    }
    initRadioOffscreen(canvas, canvastype) {
        if (this.offscreencanvas !== null) {
            return;
        } else {
            try {
                this.offscreencanvas = canvas;
                this.canvasctx = this.offscreencanvas.getContext(canvastype);
                if (!this.canvasctx) throw new Error(`${canvastype} context not supported`);
                this.isoffscreenReady = true;
                console.log(`OffscreenCanvas initialized with ${canvastype} context`);
            } catch (err) {
                console.error("OffscreenCanvas init failed:", err);
                this.canvasctx = null;
            }
        }
    }
    scheduleVisualizerFrame(callback) {
        // Try requestAnimationFrame first
        try {
            if (typeof requestAnimationFrame === "function") {
                this.visualizerUsingTimeout = false;
                return requestAnimationFrame(callback);
            }
        } catch (error) {
            if (error.name === "NotSupportedError") {
                console.warn("❌ requestAnimationFrame not supported, falling back to setTimeout");
            } else {
                console.error("Error in requestAnimationFrame:", error);
            }
        }

        // Fall back to setTimeout
        try {
            this.visualizerUsingTimeout = true;
            return setTimeout(callback, 16);
        } catch (error) {
            if (error.name === "NotSupportedError") {
                console.warn("❌ setTimeout not supported");
            } else {
                console.error("Error in setTimeout:", error);
            }
        }

        console.error("❌ No viable scheduling method available");
        return null;
    }
    cancelVisualizerFrame(id) {
        if (id === null) {
            return;
        }

        if (this.visualizerUsingTimeout) {
            clearTimeout(id);
        } else {
            cancelAnimationFrame(id);
        }
    }
    stopVisualizerLoop() {
        visualizerRunning = false;

        if (visualizerFrame !== null) {
            this.cancelVisualizerFrame(visualizerFrame);
            visualizerFrame = null;
        }
    }

    webcam(frameData, col) {
        /*
        this.frameCounter++;
        if (this.frameCounter % this.frameSkipCount !== 0) {
            return frameData;
        }
*/
        const key = col;

        for (let i = 0; i < frameData.length; i += 4) {
            const r = frameData[i];
            const g = frameData[i + 1];
            const b = frameData[i + 2];

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
    async Video2d(video, color = this.chromaKeyColorWebcam) {
        while (true) {
            this.WorkerReader = await video.read();
            this.WorkerRame = this.WorkerReader.value;
            this.WorkerRameDone = this.WorkerReader.done;

            if (this.WorkerRameDone && this.useBackground === false) {
                break;
            } else {
                if (this.useBackground) {
                    drawImage(this.backgroundVideo, 0, 0, this.canvas.width, this.canvas.height);
                }

                this.currentRame = this.canvasctx.drawImage(this.WorkerRame, 0, 0, this.canvas.width, this.canvas.height);

                if (this.useChromaKey) {
                    const frame = this.offscreenctx.getImageData(0, 0, vidCanv.width, vidCanv.height);
                    const processed = this.webcam(frame.data, color);
                    this.offscreenctx.putImageData(processed, 0, 0);
                }


                this.WorkerRame.close();
            }
        }
    }
    _handleEncodedVideoChunk(chunk, metadata) {

        console.log(
            "Encoded chunk:",
            chunk.type,
            chunk.timestamp,
            chunk.byteLength
        );

        console.log(
            "Metadata:",
            metadata
        );

        this.VideoEncodedChunks.push({
            chunk,
            metadata
        });
    }
    async createVideoEncoder({
        width,
        height,
        codec = "vp8",
        bitrate = 2_000_000,
        framerate = 30
    } = {}) {

        if (typeof VideoEncoder === "undefined") {
            throw new Error(
                "WebCodecs VideoEncoder is not supported"
            );
        }

        if (!width || !height) {
            throw new TypeError(
                "VideoEncoder requires width and height"
            );
        }

        const config = {
            codec,
            width,
            height,
            bitrate,
            framerate,
            latencyMode: "realtime"
        };

        const support =
            await VideoEncoder.isConfigSupported(config);

        if (!support.supported) {
            throw new Error(
                `Unsupported VideoEncoder config: ${codec}`
            );
        }

        this.VideoEncoderConfig = support.config;

        this.VideoEncoder = new VideoEncoder({
            output: (chunk, metadata) => {
                this._handleEncodedVideoChunk(
                    chunk,
                    metadata
                );
            },

            error: (error) => {
                console.error(
                    "VideoEncoder error:",
                    error
                );
            }
        });

        this.VideoEncoder.configure(
            this.VideoEncoderConfig
        );

        this.VideoEncoding = true;

        console.log(
            "VideoEncoder configured:",
            this.VideoEncoderConfig
        );

        return this.VideoEncoder;
    }
    GoLive() {

    }
}

/////////////////////////////////////////////////////
const videoWorker = new vidWorker();

self.onmessage = async (event) => {
    switch (event.data.type) {
        case "canvas":
            switch (event.data.action) {
                case "":
                    videoWorker.initRadioOffscreen(event.data.payload.canvas, "2d");
                    break;
            }
            break;

        case "video":
            switch (event.data.action) {
                case "video.processor":
                    switch (event.data.payload.ctx) {
                        case "webgl":

                            break;

                        case "webgl2":

                            break;
                        default:
                            videoWorker.Video2d(event.data.payload.video)
                            break;
                    }
                    break;
                case "video.chroma.key":
                    videoWorker.useChromaKey = event.data.payload.useChroma;
                    videoWorker.chromaKeyColorWebcam = event.data.payload.chromaColor;
                    //videoWorker.canvasctx = event.data.payload.ctx;
                    break;
                case "video.background":
                    videoWorker.useBackground = event.data.payload.useBackground;
                    videoWorker.backgroundVideo = event.data.payload.background;
                    break;
            }
            break;
        default:
            console.warn(`unknown event data type sent to worker: ${event}`);
            break;
    }
}
/*

*/




/*
function UseVideo(w, h) {
    this.initOffscreen();
    if (this.backgroundVideo) this.offscreenctx.drawImage(this.backgroundVideo, 0, 0, w, h);
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