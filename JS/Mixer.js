export class TfAudioMixer {
    constructor(audioContext) {
        this.ctx = audioContext;
        this.destination = this.ctx.createMediaStreamDestination();

        this.gains = {
            mic: this.ctx.createGain(),
            music: this.ctx.createGain(),
            fx: this.ctx.createGain()
        };

        this.sources = {};
    }

    async attachMic() {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const micSource = this.ctx.createMediaStreamSource(micStream);
        micSource.connect(this.gains.mic).connect(this.destination);
        this.sources.mic = micSource;
        return micStream;
    }

    attachMusic(mediaElement) {
        const source = this.ctx.createMediaElementSource(mediaElement);
        source.connect(this.gains.music).connect(this.destination);
        source.connect(this.ctx.destination); // local monitoring
        this.sources.music = source;
    }

    attachFx(audioElement) {
        const source = this.ctx.createMediaElementSource(audioElement);
        source.connect(this.gains.fx).connect(this.destination);
        source.connect(this.ctx.destination);
        return source;
    }

    setVolume(type, value) {
        if (this.gains[type]) {
            this.gains[type].gain.value = value;
        }
    }

    getStream() {
        return this.destination.stream;
    }

    reset() {
        Object.values(this.sources).forEach(src => src.disconnect());
        this.sources = {};
    }
}