export class TsunamiFlowVideo extends Tsu {
    videoElement = null;
    remoteVideoElement = null;
    VideoProcessor = null;
    VideoReader = null;
    autoplay = true;
    muted = false;
    controls = false;
    onReady = null;
    streamVideo = null;
    supportedVideomediaSource = "MediaSource" in window;
    VideomediaSource = new MediaSource();
    VideomediaSourceBuffer = null;
    VideoobjectUrl = null;
    queueVideo = [];
    constructor(option = {}) {
        if (!this.supportedVideomediaSource) {
            console.warn("MediaSource API not supported");
            this.VideomediaSource = null;
        }
        if (option.videoElement) {
            this.videoElement = option.videoElement;
        } else if (this.find("TsunamiFlowVideoStuff", true)) {
            this.videoElement = this.find("TsunamiFlowVideoStuff", true);
        } else {
            this.videoElement = document.createElement("video");
        }
        this.videoElement.autoplay = autoplay;
        this.videoElement.muted = muted;
        this.videoElement.controls = controls;
        this.VideomediaSource = new MediaSource();
        this.VideomediaSource.addEventListener("sourceopen", () => this.emit("sourceopen"));
        this.VideomediaSource.addEventListener("sourceended", () => this.emit("sourceended"));
        this.VideomediaSource.addEventListener("sourceclose", () => this.emit("sourceclose"));
        if (option.canvas) {
            this.canvas = option.canvas;
        } else if (this.find("TFcanvas", true)) {
            this.canvas = this.find("TFcanvas", true);
        } else {
            this.canvas = document.createElement("video");
        }
    }
    attachVideoStream(stream) {
        if (!stream) throw new Error("No MediaStream provided");

        this.streamVideo = stream;
        this.videoElement.srcObject = stream;

        // Ensure playback starts
        this.videoElement.play().catch(() => { });

        this.emit("streamAttached", stream);
        if (this.onReady) this.onReady(stream);
    }
    detachVideoStream() {
        if (this.videoElement.srcObject) {
            this.videoElement.srcObject.getTracks().forEach(track => track.stop());
            this.videoElement.srcObject = null;
        }
        this.streamVideo = null;
        this.emit("streamDetached");
    }
    replaceVideoStream(newStream) {
        this.detachVideoStream();
        this.attachVideoStream(newStream);
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
    VideoNetworkState(element) {
        if (element === null) {
            return;
        }
        // ---- NETWORK STATE ----
        switch (element.networkState) {
            case element.NETWORK_EMPTY:
                console.log("Video network: EMPTY (no source)");
                break;
            case element.NETWORK_IDLE:
                console.log("Video network: IDLE");
                break;
            case element.NETWORK_LOADING:
                console.log("Video network: LOADING");
                break;
            case element.NETWORK_NO_SOURCE:
                console.warn("Video network: NO SOURCE");
                break;
        }
        // ---- READY STATE ----
        switch (element.readyState) {
            case element.HAVE_NOTHING:
                console.log("Video readyState: HAVE_NOTHING");
                break;
            case element.HAVE_METADATA:
                console.log("Video readyState: HAVE_METADATA");
                break;
            case element.HAVE_CURRENT_DATA:
                console.log("Video readyState: HAVE_CURRENT_DATA");
                break;
            case element.HAVE_FUTURE_DATA:
                console.log("Video readyState: HAVE_FUTURE_DATA");
                break;
            case element.HAVE_ENOUGH_DATA:
                console.log("Video readyState: HAVE_ENOUGH_DATA");
                break;
        }
        // ---- PLAYBACK STATE ----
        if (element.ended) {
            console.log("Video playback ended normally");
            return;
        }
        if (element.paused) {
            if (element.currentTime === 0) {
                console.log("Video not started yet");
            } else {
                console.log(`Video paused at ${element.currentTime.toFixed(2)}s`);
            }
            return;
        }
        console.log("Video is playing");
    }
    VideoState(context) {
        if (!context) {
            console.warn("AudioContext missing");
            return;
        }

        if (context.state === "suspended" && !element.paused) {
            context.resume();
            console.log("AudioContext resumed for video");
        }

        if (context.state === "running" && element.paused && element.currentTime === 0) {
            console.log("Video idle, AudioContext left running");
        }
    }
}