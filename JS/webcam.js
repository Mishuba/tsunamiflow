export class TfWebcam {
    constructor({
        video = true,
        audio = true,
        constraints = {},
        onReady = null
    } = {}) {
        this.stream = null;
        this.videoTrack = null;
        this.audioTrack = null;

        this.constraints = {
            audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  },
  video: true,
        };

        this.onReady = onReady;
    }

    async start() {
        if (this.stream) return this.stream;

        try {
            this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);

            this.videoTrack = this.stream.getVideoTracks()[0] || null;
            this.audioTrack = this.stream.getAudioTracks()[0] || null;

            if (this.onReady) this.onReady(this.stream);
            return this.stream;
        } catch (err) {
            console.error("TfWebcam start failed:", err);
            throw err;
        }
    }

    stop() {
        if (!this.stream) return;

        this.stream.getTracks().forEach(track => {
            track.stop();
        });

        this.stream = null;
        this.videoTrack = null;
        this.audioTrack = null;
    }

    attach(videoElement) {
        if (!this.stream) throw new Error("Webcam not started");

        if (videoElement.srcObject !== this.stream) {
            videoElement.srcObject = this.stream;
        }

        // Avoid autoplay race conditions
        if (videoElement.paused) {
            videoElement.play().catch(() => {});
        }
    }

    replaceTrack(newTrack) {
        if (!this.stream || !newTrack) return;

        const kind = newTrack.kind; // "video" or "audio"
        const oldTrack =
            kind === "video"
                ? this.stream.getVideoTracks()[0]
                : this.stream.getAudioTracks()[0];

        if (oldTrack) {
            this.stream.removeTrack(oldTrack);
            oldTrack.stop();
        }

        this.stream.addTrack(newTrack);

        if (kind === "video") this.videoTrack = newTrack;
        if (kind === "audio") this.audioTrack = newTrack;
    }

    toJson() {
        return {
            active: !!this.stream,
            video: !!this.videoTrack,
            audio: !!this.audioTrack,
            constraints: this.constraints
        };
    }
}