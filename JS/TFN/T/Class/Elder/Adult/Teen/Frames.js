import { TsDomCanvas } from "./Child/Canvas.js";
export class TsunamiFlowFrames extends TsDomCanvas {
    queueVideo = [];
    webcamvideoTrack = null;
    webcamaudioTrack = null;
    webcamconstraints = {
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
        },
        video: {
            frameRate: {
                min: 15,
                ideal: 30,
                max: 60
            },
            width: 600,
            height: 480,
            resizeMode: "crop-and-scale"
            //aspectRatio:
            //facingMode: 
            //zoom:
            //torch:
            //focusMode:
        }
    };
    webcamstream = null;
    webcamonReady = null;
    VideoProcessor = null;
    VideoReader = null;
    VideomediaSource = null;
    VideomediaSourceBuffer = null;
    VideoFrameCount = 0;
    VideoKeyFrameInterval = 60;
    VideoEncoder = null;
    VideoEncoderConfig = null;
    VideoEncodedChunks = [];
    VideoEncoding = false;
    VideoobjectUrl = null;
    VideoReading = false;
    supportedVideomediaSource = "MediaSource" in window;
    constructor(options = {}) {
        super(options);
    }
    VideoWebCodecs(track, worker) {
        if (this.VideoReading) {
            console.warn("VideoWebCodecs is already running");
            return;
        }

        if (!track || track.kind !== "video") {
            throw new TypeError(
                "VideoWebCodecs requires a video MediaStreamTrack"
            );
        }

        this.VideoProcessor = new MediaStreamTrackProcessor({
            track
        });

        this.VideoReader =
            this.VideoProcessor.readable;

        worker.postMessage(this.tycadome(
            "guest-video",
            "video",
            "video.processor",
            {
                worker: "video",

            },
            {
                status: "working",
                priority: "",

            },
            "async",
            {
                video: this.VideoReader,
                message: "sending video rame",
                error: "none",
                ctx: "2d"
            },
            [this.VideoReader]
        ), [this.VideoReader]);
    }

    async startwebcam(worker) {
        if (this.webcamstream) return this.webcamstream;

        try {
            this.webcamstream = await navigator.mediaDevices.getUserMedia(this.webcamconstraints);

            this.webcamvideoTrack = this.webcamstream.getVideoTracks()[0] || null;
            this.webcamaudioTrack = this.webcamstream.getAudioTracks()[0] || null;

            this.VideoWebCodecs(this.webcamvideoTrack, worker);
            if (this.webcamonReady) {
                this.webcamonReady = true
            };

        } catch (err) {
            console.error("TfWebcam start failed:", err);
            throw err;
        }
    }
    stopwebcam() {
        if (!this.webcamstream) return;

        this.webcamstream.getTracks().forEach(track => {
            track.stop();
        });

        this.webcamstream = null;
        this.webcamvideoTrack = null;
        this.webcamaudioTrack = null;
    }
    setChromaHex(hex) {
        this.rgb = parseInt(hex.slice(1), 16);
        this.chromaKeyColorWebcam.r = (this.rgb >> 16) & 255;
        this.chromaKeyColorWebcam.g = (this.rgb >> 8) & 255;
        this.chromaKeyColorWebcam.b = this.rgb & 255;
    }
    ColorPickerChromaKey(chroma) {
        this.Tfhex = chroma.value;
        this.setChromaHex(this.Tfhex);
    }
    //////////////////////////////////////////////////////////////////////////
    attachVideoMediaSource(element) {
        if (!this.VideomediaSource || element) return;

        if (this.VideoobjectUrl) {
            URL.revokeObjectURL(this.VideoobjectUrl);
        }

        this.VideoobjectUrl = URL.createObjectURL(this.VideomediaSource);
        element.src = this.VideoobjectUrl;

        console.log("MediaSource attached to video element");
    }
    createVideomediaSourceBuffer(mimeType) {

        if (!this.VideomediaSource || this.VideomediaSource.readyState !== "open") {
            console.warn("MediaSource not ready to add SourceBuffer");
            return;
        }

        try {

            if (!MediaSource.isTypeSupported(mimeType)) {
                console.warn("Mime type not supported:", mimeType);
                return;
            }

            this.VideomediaSourceBuffer = this.VideomediaSource.addSourceBuffer(mimeType);

            this.VideomediaSourceBuffer.addEventListener("updateend", () => {
                this._processVideomediaSourceQueue();
            });

            console.log("SourceBuffer created:", mimeType);

            return this.VideomediaSourceBuffer;

        } catch (err) {
            console.error("Failed to create SourceBuffer:", err);
        }
    }
    appendVideomediaSourceBuffer(data) {

        if (!this.VideomediaSourceBuffer) {
            console.warn("SourceBuffer not initialized");
            return;
        }

        if (this.VideomediaSourceBuffer.updating || this.queueVideo.length) {
            this.queueVideo.push(data);
            return;
        }

        try {
            this.VideomediaSourceBuffer.appendBuffer(data);
        } catch (err) {
            console.error("AppendBuffer failed:", err);
        }
    }
    _processVideomediaSourceQueue() {
        if (!this.VideomediaSourceBuffer) return;
        if (this.VideomediaSourceBuffer.updating) return;
        if (!this.queueVideo.length) return;

        const data = this.queueVideo.shift();

        try {
            this.VideomediaSourceBuffer.appendBuffer(data);
        } catch (err) {
            console.error("Queue append failed:", err);

            // Put it back if the append failed.
            this.queueVideo.unshift(data);
        }
    }
    endVideomediaSourceStream() {
        if (this.VideomediaSource && this.VideomediaSource.readyState === "open") {
            this.VideomediaSource.endOfStream();
        }
    }
    async stopVideoWebCodecs() {

        this.VideoReading = false;

        if (this.VideoReader) {
            try {
                await this.VideoReader.cancel();
            } catch (error) {
                console.warn(
                    "Failed to cancel VideoReader:",
                    error
                );
            }

            try {
                this.VideoReader.releaseLock();
            } catch { }
        }

        this.VideoReader = null;
        this.VideoProcessor = null;
    }
}