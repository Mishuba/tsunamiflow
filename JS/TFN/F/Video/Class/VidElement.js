export class TsunamiFlowVideo {
    constructor({
        videoElement = null,
        autoplay = true,
        muted = false,
        controls = false,
        onReady = null
    } = {}) {
        this.videoElement = videoElement || document.createElement("video");
        this.videoElement.autoplay = autoplay;
        this.videoElement.muted = muted;
        this.videoElement.controls = controls;

        this.stream = null;
        this.listeners = {};
        this.onReady = onReady;
    }

    /* ----------------------------
       Attach a MediaStream
    ----------------------------*/
    attachStream(stream) {
        if (!stream) throw new Error("No MediaStream provided");

        this.stream = stream;
        this.videoElement.srcObject = stream;

        // Ensure playback starts
        this.videoElement.play().catch(() => {});

        this.emit("streamAttached", stream);
        if (this.onReady) this.onReady(stream);
    }

    /* ----------------------------
       Detach the current stream
    ----------------------------*/
    detachStream() {
        if (this.videoElement.srcObject) {
            this.videoElement.srcObject.getTracks().forEach(track => track.stop());
            this.videoElement.srcObject = null;
        }
        this.stream = null;
        this.emit("streamDetached");
    }

    /* ----------------------------
       Replace stream dynamically
    ----------------------------*/
    replaceStream(newStream) {
        this.detachStream();
        this.attachStream(newStream);
    }

    /* ----------------------------
       Playback controls
    ----------------------------*/
    play() {
        this.videoElement.play().catch(() => {});
        this.emit("play");
    }

    pause() {
        this.videoElement.pause();
        this.emit("pause");
    }

    /* ----------------------------
       Event system
    ----------------------------*/
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(fn => fn(data));
    }

    /* ----------------------------
       Quick JSON Status
    ----------------------------*/
    toJson() {
        return {
            attached: !!this.stream,
            videoElementExists: !!this.videoElement,
            paused: this.videoElement.paused
        };
    }
}