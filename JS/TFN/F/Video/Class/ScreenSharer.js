export class ScreenShare {

    constructor({ audio = true, onReady = null } = {}) {

        this.stream = null;
        this.videoTrack = null;
        this.audioTrack = null;

        this.audio = audio;
        this.onReady = onReady;
    }

    async start() {

        if (this.stream) return this.stream;

        this.stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: this.audio
        });

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

}