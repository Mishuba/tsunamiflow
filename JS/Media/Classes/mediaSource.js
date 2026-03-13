export class TfMediaSource {
    constructor() {
        if (!window.MediaSource) {
            console.warn("MediaSource API not supported");
            this.supported = false;
            this.mediaSource = null;
            return;
        }
        this.supported = true;
        this.mediaSource = new MediaSource();
        this.sourceBuffer = null;
        this.listeners = {};
    }

    attach(videoElement) {
        if (!this.supported || !videoElement) return;
        videoElement.src = URL.createObjectURL(this.mediaSource);
        console.log("MediaSource attached to video element");

        this.mediaSource.addEventListener("sourceopen", () => this.emit("sourceopen"));
        this.mediaSource.addEventListener("sourceended", () => this.emit("sourceended"));
        this.mediaSource.addEventListener("sourceclose", () => this.emit("sourceclose"));
    }

    createSourceBuffer(mimeType) {
        if (!this.mediaSource || !this.mediaSource.readyState === "open") {
            console.warn("MediaSource not ready to add SourceBuffer");
            return;
        }
        try {
            this.sourceBuffer = this.mediaSource.addSourceBuffer(mimeType);
            console.log("SourceBuffer created with type:", mimeType);
            return this.sourceBuffer;
        } catch (err) {
            console.error("Failed to create SourceBuffer:", err);
        }
    }

    appendBuffer(data) {
        if (!this.sourceBuffer || this.sourceBuffer.updating) {
            console.warn("SourceBuffer not ready");
            return;
        }
        try {
            this.sourceBuffer.appendBuffer(data);
        } catch (err) {
            console.error("Failed to append buffer:", err);
        }
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }
}