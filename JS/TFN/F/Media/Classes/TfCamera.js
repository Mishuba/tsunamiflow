export class TfCamera {

    constructor({ constraints = {}, onReady = null } = {}) {

        this.stream = null;
        this.videoTrack = null;

        this.constraints = {
            video: {
                frameRate: { min: 15, ideal: 30, max: 60 },
                width: 600,
                height: 480,
                resizeMode: "crop-and-scale",
                ...constraints
            }
        };

        this.onReady = onReady;
    }

    async start() {

        if (this.stream) return this.stream;

        this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);

        this.videoTrack = this.stream.getVideoTracks()[0] || null;

        if (this.onReady) this.onReady(this.stream);

        return this.stream;
    }

    stop() {

        if (!this.stream) return;

        this.stream.getTracks().forEach(t => t.stop());

        this.stream = null;
        this.videoTrack = null;
    }

    attach(videoElement) {

        if (!this.stream) throw new Error("Camera not started");

        if (videoElement.srcObject !== this.stream)
            videoElement.srcObject = this.stream;

        if (videoElement.paused)
            videoElement.play().catch(()=>{});
    }

}