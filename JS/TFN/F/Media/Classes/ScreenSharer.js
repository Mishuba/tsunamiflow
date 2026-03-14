export class ScreenShare {
    constructor({ videoElement = null, includeAudio = false } = {}) {
        this.videoElement = videoElement; // <video> element preview
        this.stream = null;                // MediaStream of screen share
        this.includeAudio = includeAudio;
        this.listeners = {};
        this.id = `screenshare-${Date.now()}`;
    }

    /* ----------------------------
       Start Screen Sharing
    -----------------------------*/
    async start(constraints = { video: { cursor: "always" }, audio: this.includeAudio }) {
        if (this.stream) return this.stream;

        if (!navigator.mediaDevices?.getDisplayMedia) {
            const err = new Error("Screen sharing not supported in this browser.");
            console.error(err);
            this.emit("error", err);
            throw err;
        }

        try {
            this.stream = await navigator.mediaDevices.getDisplayMedia(constraints);

            if (this.videoElement) {
                this.videoElement.srcObject = this.stream;
                this.videoElement.play().catch(() => { });
            }

            // Handle user stopping screen share from browser UI
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
       Stop Screen Sharing
    -----------------------------*/
    stop() {
        if (!this.stream) return;

        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;

        if (this.videoElement) this.videoElement.srcObject = null;

        this.emit("stopped");
    }

    /* ----------------------------
       Get Current Stream
    -----------------------------*/
    getStream() {
        return this.stream;
    }

    /* ----------------------------
       Event System
    -----------------------------*/
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
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
            tracks: this.stream?.getTracks().length || 0,
            id: this.id
        };
    }
}