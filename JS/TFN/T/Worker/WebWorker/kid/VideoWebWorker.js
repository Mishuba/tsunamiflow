
class vidWorker {
    useBackground = null;
    backgroundVideo = null;
    useChromaKey = null;
    Tfhex;
    rgb;
    offscreencanvas = null;
    canvasctx = null;
    isoffscreenReady = false;

    chromaKeyColorWebcam = { r: 0, g: 255, b: 0 };
    frameSkipCount = 2;
    frameCounter = 0;
    hasSentHeader = false;
    vencoder;
    aencoder;
    VideoEncodedChunks = [];

    vseqheadersent = false;
    aseqheadersent = false;
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
                frameData[i + 3] = 0; // true transparency
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
                    drawImage(this.backgroundVideo, 0, 0, this.offscreencanvas.width, this.offscreencanvas.height);
                }

                //this.currentRame =
                this.canvasctx.drawImage(this.WorkerRame, 0, 0, this.offscreencanvas.width, this.offscreencanvas.height);

                if (this.useChromaKey) {
                    const frame = this.canvasctx.getImageData(
                        0,
                        0,
                        this.offscreencanvas.width,
                        this.offscreencanvas.height
                    );

                    this.webcam(frame.data, color);

                    this.canvasctx.putImageData(
                        frame,
                        0,
                        0
                    );

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
    getlvheader() {
        return new Uint8Array([
            0x46, 0x4C, 0x56,
            0x01,
            0x05,
            0x00, 0x00, 0x00, 0x09,
            0x00, 0x00, 0x00, 0x00
        ]).buffer
    }
    wrapInLvTag(type, payload, timestampMs) {
        const payloadSize = payload.byteLength;
        const totalSize = 11 + payloadSize + 4;
        const tag = new Uint8Array(totalSize);

        tag[0] = type;
        tag[1] = (payloadSize >> 16) & 0xFF;
        tag[2] = (payloadSize >> 8) & 0xFF;
        tag[3] = payloadSize & 0xFF;
        tag[4] = (timestampMs >> 16) & 0xFF;
        tag[5] = (timestampMs >> 8) & 0xFF;
        tag[6] = timestampMs & 0xFF;
        tag[7] = (timestampMs >> 24) & 0xFF;
        tag[8] = 0;
        tag[9] = 0;
        tag[10] = 0;
        tag.set(payload, 11);

        const tagSize = 11 + payloadSize;
        const offset = 11 + payloadSize;
        tag[offset] = (tagSize >> 24) & 0xFF;
        tag[offset + 1] = (tagSize >> 16) & 0xFF;
        tag[offset + 2] = (tagSize >> 8) & 0xFF;
        tag[offset + 3] = tagSize & 0xFF;
        return tag.buffer;
    }
    createAudioSeqHeaderTag(decoderConfig) {
        const description = new Uint8Array(decoderConfig.description);
        const payloadSize = 2 + description.byteLength;

        const payload = new Uint8Array(payloadSize);
        payload[0] = 0xAF;
        payload[1] = 0x00;
        payload.set(description, 2);

        return this.wrapInLvTag(0x08, payload, 0);
    }
    createAudioTag(chunk) {
        const chunkData = new Uint8Array(chunk.byteLength);
        chunk.copyTo(chunkData);

        const payload = new Uint8Array(2 + chunkData.byteLength);
        payload[0] = 0xAF;
        payload[1] = 0x01;
        payload.set(chunkData, 2);

        const timestamp = Math.floor(chunk.timestamp / 1000);
        return this.wrapInLvTag(0x08, payload, timestamp);
    }
    createVideoSeqHeaderTag(decoderConfig) {
        const description = new Uint8Array(decoderConfig.description);
        const payloadSize = 5 + description.byteLength;

        const payload = new Uint8Array(payloadSize);
        payload[0] = 0x17;
        payload[1] = 0x00;
        payload[2] = 0x00;
        payload[3] = 0x00;
        payload[4] = 0x00;
        payload.set(description, 5);

        return this.wrapInLvTag(0x09, payload, 0);
    }
    createVideoTag(chunk) {
        const chunkData = new Uint8Array(chunk.byteLength);
        chunk.copyTo(chunkData);
        const isKeyRame = chunk.type === "key";
        const RameType = isKeyRame ? 0x17 : 0x27;

        const payload = new Uint8Array(5 + chunkData.byteLength);
        payload[0] = RameType;
        payload[1] = 0x01;
        payload[2] = 0x00;
        payload[3] = 0x00;
        payload[4] = 0x00;
        payload.set(chunkData, 5);

        const timestamp = Math.floor(chunk.timestamp / 1000);
        return this.wrapInLvTag(0x09, payload, timestamp);
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
                case "load.video.canvas":
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
        case "audio.worklet":
            switch (event.data.action) {
                case "audio.visual.data":
                    //do audio encoder things.

                    break;
            }
            break;
        default:
            console.warn(`unknown event data type sent to worker: ${event}`);
            break;
    }
}