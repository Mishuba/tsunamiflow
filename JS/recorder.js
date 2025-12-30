export class TfRecorder {
    constructor({
        fps = 30,
        mimeType = 'video/webm; codecs=vp8,opus',
        videoBitrate = 4_000_000,
        chunkMs = 1000
    } = {}) {
        this.fps = fps;
        this.mimeType = mimeType;
        this.videoBitrate = videoBitrate;
        this.chunkMs = chunkMs;

        this.stream = null;
        this.recorder = null;
        this.audioDest = null;
        this.recording = false;
    }
useExternalAudioStream(audioStream) {
    this.externalAudioStream = audioStream;
}
buildStream({ canvas }) {
    const stream = canvas.captureStream(this.fps);

    if (this.externalAudioStream) {
        this.externalAudioStream
            .getAudioTracks()
            .forEach(track => stream.addTrack(track));
    }

    this.stream = stream;
    return stream;
}
    start({
        canvas,
        audioContext = null,
        analyser = null,
    }) {
        if (this.recording) return;

        if (!this.stream) {
            this.buildStream({ canvas, audioContext, analyser });
        }

        this.recorder = new MediaRecorder(this.stream, {
            mimeType: this.mimeType,
            videoBitsPerSecond: this.videoBitrate
        });

        this.recorder.ondataavailable = (e) => {
            if (!e.data || e.data.size === 0) return;
            
        };

        this.recorder.start(this.chunkMs);
        this.recording = true;
    }

    stop() {
        if (!this.recording) return;

        this.recorder.stop();
        this.recorder = null;
        this.recording = false;
    }

    reset() {
        this.stop();
        this.stream = null;
        this.audioDest = null;
    }
}