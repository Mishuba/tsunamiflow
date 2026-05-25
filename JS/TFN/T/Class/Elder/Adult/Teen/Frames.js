import { TsDomCanvas } from "./Child/Canvas.js";

export class TsunamiFlowFrames extends TsDomCanvas {

    constructor(options = {}) {
        super(options);
    }
    VideoWebCodecs(stream) {
        let track;
        if (stream.getVideoTracks()[0]) {
            track = stream.getVideoTracks()[0];
        } else {
            track = stream;
        }
        this.VideoProcessor = new MediaStreamTrackProcessor({ track });
        this.VideoReader = this.VideoProcessor.readable.getReader();
    }
    attachVideoMediaSource() {
        if (!this.supportedVideomediaSource || !this.videoElement) return;

        if (this.VideoobjectUrl) {
            URL.revokeObjectURL(this.VideoobjectUrl);
        }

        this.VideoobjectUrl = URL.createObjectURL(this.mediaSource);
        this.videoElement.src = this.VideoobjectUrl;

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
                this._processQueue();
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

        if (!this.queueVideo.length) return;
        if (this.VideomediaSourceBuffer.updating) return;

        const data = this.queueVideo.shift();

        try {
            this.VideomediaSourceBuffer.appendBuffer(data);
        } catch (err) {
            console.error("Queue append failed:", err);
        }
    }
    endVideomediaSourceStream() {
        if (this.VideomediaSource && this.VideomediaSource.readyState === "open") {
            this.VideomediaSource.endOfStream();
        }
    }
    destroyVideomediaSource() {

        if (this.videoElement) {
            this.videoElement.removeAttribute("src");
            this.videoElement.load();
        }

        if (this.VideoobjectUrl) {
            URL.revokeObjectURL(this.VideoobjectUrl);
        }

        this.queueVideo = [];
        this.VideomediaSourceBuffer = null;
        this.VideomediaSource = null;
    }
}