export class TfMicrophone {

    constructor({ constraints = {}, onReady = null } = {}) {

        this.stream = null;
        this.audioTrack = null;

        this.constraints = {
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                ...constraints
            }
        };

        this.onReady = onReady;
    }

    async start() {

        if (this.stream) return this.stream;

        this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);

        this.audioTrack = this.stream.getAudioTracks()[0] || null;

        if (this.onReady) this.onReady(this.stream);

        return this.stream;
    }

    stop() {

        if (!this.stream) return;

        this.stream.getTracks().forEach(t => t.stop());

        this.stream = null;
        this.audioTrack = null;
    }

}