export class TfScreenShare {
    constructor({ videoElement = null, includeAudio = false } = {}) {
        this.videoElement = videoElement; // <video> element for preview
        this.stream = null;
        this.listeners = {};
        this.includeAudio = includeAudio;
    }

    /* ----------------------------
       Start Screen Share
    -----------------------------*/
    async start() {
        if (this.stream) return this.stream;

        if (!navigator.mediaDevices?.getDisplayMedia) {
            const err = new Error("Screen sharing is not supported in this browser.");
            console.error(err);
            this.emit("error", err);
            throw err;
        }

        try {
            this.stream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: "always" },
                audio: this.includeAudio
            });

            if (this.videoElement) {
                this.videoElement.srcObject = this.stream;
                this.videoElement.play().catch(() => {});
            }

            // Detect when user stops sharing via browser UI
            this.stream.getVideoTracks()[0]?.addEventListener("ended", () => this.stop());

            this.emit("started", this.stream);
            return this.stream;
        } catch (err) {
            console.error("TfScreenShare start failed:", err);
            this.emit("error", err);
            throw err;
        }
    }

    /* ----------------------------
       Stop Screen Share
    -----------------------------*/
    stop() {
        if (!this.stream) return;

        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;

        if (this.videoElement) this.videoElement.srcObject = null;

        this.emit("stopped");
    }

    /* ----------------------------
       Get Stream
    -----------------------------*/
    getStream() {
        return this.stream;
    }

    /* ----------------------------
       Events
    -----------------------------*/
    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(fn => fn(data));
    }

    /* ----------------------------
       Quick JSON Status
    -----------------------------*/
    toJson() {
        return {
            active: !!this.stream,
            tracks: this.stream?.getTracks().length || 0
        };
    }
}