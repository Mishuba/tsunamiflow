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
        this.streamkey = null;
        this.chunks = []; // store chunks locally if needed
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

    start({ canvas }) {
        if (this.recording) return;

        if (!this.stream) {
            this.buildStream({ canvas });
        }

        this.recorder = new MediaRecorder(this.stream, {
            mimeType: this.mimeType,
            videoBitsPerSecond: this.videoBitrate
        });

        // Collect chunks locally
        this.recorder.ondataavailable = (e) => {
            if (!e.data || e.data.size === 0) return;
            this.chunks.push(e.data);
        };

       // this.recorder.start(this.chunkMs);
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
        this.chunks = [];
    }

    // Optional: get the recorded Blob
    getBlob() {
        if (!this.chunks.length) return null;
        return new Blob(this.chunks, { type: this.mimeType });
    }

    // Optional: download recorded video
    download(filename = 'recording.webm') {
        const blob = this.getBlob();
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}