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
            video,
            audio,
            ...constraints
        };

        this.onReady = onReady;
    }

    async start() {
        this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);

        this.videoTrack = this.stream.getVideoTracks()[0] || null;
        this.audioTrack = this.stream.getAudioTracks()[0] || null;

        if (this.onReady) this.onReady(this.stream);
        return this.stream;
    }

    stop() {
        if (!this.stream) return;

        this.stream.getTracks().forEach(t => t.stop());
        this.stream = null;
        this.videoTrack = null;
        this.audioTrack = null;
    }

    attach(videoElement) {
        if (!this.stream) throw new Error("Webcam not started");
        videoElement.srcObject = this.stream;
    }

    replaceTrack(newTrack) {
        if (!this.stream) return;
        const senderTrack = this.stream.getVideoTracks()[0];
        if (senderTrack) senderTrack.stop();
        this.stream.removeTrack(senderTrack);
        this.stream.addTrack(newTrack);
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