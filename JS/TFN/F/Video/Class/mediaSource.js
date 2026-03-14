export class TfMediaSource {
    constructor() {

        this.supported = "MediaSource" in window;
        this.mediaSource = null;
        this.sourceBuffer = null;
        this.videoElement = null;
        this.objectUrl = null;

        this.queue = [];
        this.listeners = {};

        if (!this.supported) {
            console.warn("MediaSource API not supported");
            return;
        }

        this.mediaSource = new MediaSource();

        this.mediaSource.addEventListener("sourceopen", () => this.emit("sourceopen"));
        this.mediaSource.addEventListener("sourceended", () => this.emit("sourceended"));
        this.mediaSource.addEventListener("sourceclose", () => this.emit("sourceclose"));
    }

    attach(videoElement) {
        if (!this.supported || !videoElement) return;

        this.videoElement = videoElement;

        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
        }

        this.objectUrl = URL.createObjectURL(this.mediaSource);
        videoElement.src = this.objectUrl;

        console.log("MediaSource attached to video element");
    }

    createSourceBuffer(mimeType) {

        if (!this.mediaSource || this.mediaSource.readyState !== "open") {
            console.warn("MediaSource not ready to add SourceBuffer");
            return;
        }

        try {

            if (!MediaSource.isTypeSupported(mimeType)) {
                console.warn("Mime type not supported:", mimeType);
                return;
            }

            this.sourceBuffer = this.mediaSource.addSourceBuffer(mimeType);

            this.sourceBuffer.addEventListener("updateend", () => {
                this._processQueue();
            });

            console.log("SourceBuffer created:", mimeType);

            return this.sourceBuffer;

        } catch (err) {
            console.error("Failed to create SourceBuffer:", err);
        }
    }

    appendBuffer(data) {

        if (!this.sourceBuffer) {
            console.warn("SourceBuffer not initialized");
            return;
        }

        if (this.sourceBuffer.updating || this.queue.length) {
            this.queue.push(data);
            return;
        }

        try {
            this.sourceBuffer.appendBuffer(data);
        } catch (err) {
            console.error("AppendBuffer failed:", err);
        }
    }

    _processQueue() {

        if (!this.queue.length) return;
        if (this.sourceBuffer.updating) return;

        const data = this.queue.shift();

        try {
            this.sourceBuffer.appendBuffer(data);
        } catch (err) {
            console.error("Queue append failed:", err);
        }
    }

    endStream() {
        if (this.mediaSource && this.mediaSource.readyState === "open") {
            this.mediaSource.endOfStream();
        }
    }

    destroy() {

        if (this.videoElement) {
            this.videoElement.removeAttribute("src");
            this.videoElement.load();
        }

        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
        }

        this.queue = [];
        this.sourceBuffer = null;
        this.mediaSource = null;
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data = null) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }

    toJson() {
        return {
            supported: this.supported,
            readyState: this.mediaSource ? this.mediaSource.readyState : null,
            queueSize: this.queue.length
        };
    }
}