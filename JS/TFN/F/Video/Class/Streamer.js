export class TfMediaStream {
    constructor() {
        this.canvas = null;
        this.audioContext = null;
        this.sourceNode = null;

        this.videoStream = null;
        this.audioStream = null;
        this.stream = null;

        this.listeners = {};
    }

    /* ----------------------------
       Start the MediaStream
    ----------------------------*/
    start({ canvas, audioContext = null, sourceNode = null, fps = 30 }) {
        if (!canvas) throw new Error("Canvas is required to create MediaStream");

        this.canvas = canvas;
        this.audioContext = audioContext;
        this.sourceNode = sourceNode;

        // Capture video from canvas
        this.videoStream = canvas.captureStream(fps);
        const tracks = [...this.videoStream.getVideoTracks()];

        // Capture audio from AudioContext if provided
        if (audioContext && sourceNode) {
            const dest = audioContext.createMediaStreamDestination();
            sourceNode.connect(dest);
            this.audioStream = dest.stream;
            tracks.push(...this.audioStream.getAudioTracks());
        }

        // Combine video + audio
        this.stream = new MediaStream(tracks);

        this.emit("start", this.stream);

        return this.stream;
    }

    /* ----------------------------
       Stop all tracks
    ----------------------------*/
    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        this.videoStream = null;
        this.audioStream = null;
        this.stream = null;

        this.emit("stop");
    }

    /* ----------------------------
       Replace canvas dynamically
    ----------------------------*/
    replaceCanvas(newCanvas, fps = 30) {
        if (!newCanvas) throw new Error("New canvas is required");
        this.canvas = newCanvas;
        if (this.stream) this.stop();
        return this.start({ canvas: newCanvas, audioContext: this.audioContext, sourceNode: this.sourceNode, fps });
    }

    /* ----------------------------
       Event System
    ----------------------------*/
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(cb => cb(data));
    }

    /* ----------------------------
       Utility: Get stream safely
    ----------------------------*/
    getStream() {
        return this.stream;
    }

    getVideoTracks() {
        return this.videoStream ? this.videoStream.getVideoTracks() : [];
    }

    getAudioTracks() {
        return this.audioStream ? this.audioStream.getAudioTracks() : [];
    }
}